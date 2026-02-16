#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${N8N_BASE_URL:-https://n8n-service-uwaf.onrender.com}"
API_KEY="${N8N_API_KEY:-}"
WORKFLOW_FILE="${1:-n8n-workflows/stage-3-scoring.json}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOADED_ENV_FILES=()

load_env_file() {
  local env_file="$1"
  if [[ -f "$env_file" ]]; then
    while IFS= read -r line || [[ -n "$line" ]]; do
      [[ -z "${line//[[:space:]]/}" ]] && continue
      [[ "$line" =~ ^[[:space:]]*# ]] && continue
      if [[ "$line" =~ ^[[:space:]]*(export[[:space:]]+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
        local key="${BASH_REMATCH[2]}"
        local value="${BASH_REMATCH[3]}"
      else
        continue
      fi

      if [[ ${#value} -ge 2 ]]; then
        if [[ "${value:0:1}" == '"' && "${value: -1}" == '"' ]]; then
          value="${value:1:${#value}-2}"
        elif [[ "${value:0:1}" == "'" && "${value: -1}" == "'" ]]; then
          value="${value:1:${#value}-2}"
        fi
      fi

      export "$key=$value"
    done < "$env_file"
    LOADED_ENV_FILES+=("$env_file")
  fi
}

load_env_file "$PWD/.env"
load_env_file "$PWD/.env.local"
load_env_file "$SCRIPT_DIR/.env"
load_env_file "$SCRIPT_DIR/.env.local"
load_env_file "$SCRIPT_DIR/../.env"
load_env_file "$SCRIPT_DIR/../.env.local"
if [[ -n "${N8N_ENV_FILE:-}" ]]; then
  load_env_file "$N8N_ENV_FILE"
fi

API_KEY="${N8N_API_KEY:-$API_KEY}"
BASE_URL="${N8N_BASE_URL:-$BASE_URL}"
GSHEET_DOCUMENT_ID="${GSHEET_DOCUMENT_ID:-}"
GSHEET_SHEET_NAME="${GSHEET_SHEET_NAME:-}"
GSHEET_CREDENTIAL_ID="${GSHEET_CREDENTIAL_ID:-}"
GSHEET_CREDENTIAL_NAME="${GSHEET_CREDENTIAL_NAME:-}"
OPENAI_API_KEY="${OPENAI_API_KEY:-}"
OPENAI_MODEL="${OPENAI_MODEL:-gpt-4o-mini}"
OPENAI_API_URL="${OPENAI_API_URL:-https://api.openai.com/v1/chat/completions}"
LLM_AUTH_MODE="${LLM_AUTH_MODE:-bearer}"

if [[ -z "$API_KEY" ]]; then
  echo "Error: N8N_API_KEY is required." >&2
  if [[ ${#LOADED_ENV_FILES[@]} -gt 0 ]]; then
    echo "Loaded env files:" >&2
    printf '  - %s\n' "${LOADED_ENV_FILES[@]}" >&2
  fi
  exit 1
fi

if [[ -z "$GSHEET_DOCUMENT_ID" || -z "$GSHEET_SHEET_NAME" || -z "$GSHEET_CREDENTIAL_NAME" ]]; then
  echo "Error: GSHEET_DOCUMENT_ID, GSHEET_SHEET_NAME, and GSHEET_CREDENTIAL_NAME are required for Stage 3." >&2
  exit 1
fi

if [[ -z "$GSHEET_CREDENTIAL_ID" || "$GSHEET_CREDENTIAL_ID" == "..." || "$GSHEET_CREDENTIAL_ID" == "{" ]]; then
  echo "Error: GSHEET_CREDENTIAL_ID is required for Stage 3 API deploy." >&2
  exit 1
fi

if [[ "$GSHEET_CREDENTIAL_ID" == *"BEGIN PRIVATE KEY"* ]]; then
  echo "Error: GSHEET_CREDENTIAL_ID looks like a private key. Use n8n credential ID from URL .../credentials/<ID>." >&2
  exit 1
fi

if [[ "$LLM_AUTH_MODE" != "bearer" && "$LLM_AUTH_MODE" != "none" ]]; then
  echo "Error: LLM_AUTH_MODE must be 'bearer' or 'none'." >&2
  exit 1
fi

if [[ "$LLM_AUTH_MODE" == "bearer" && -z "$OPENAI_API_KEY" ]]; then
  cat >&2 <<'EOF'
Error: OPENAI_API_KEY is required for Stage 3 lead scoring when LLM_AUTH_MODE=bearer.

Set in n8n-workflows/.env:
  OPENAI_API_KEY=<your-openai-api-key>
Optional:
  OPENAI_MODEL=gpt-4o-mini
  OPENAI_API_URL=https://api.openai.com/v1/chat/completions
  LLM_AUTH_MODE=bearer
EOF
  exit 1
fi

if [[ ! -f "$WORKFLOW_FILE" ]]; then
  echo "Error: workflow file not found: $WORKFLOW_FILE" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required." >&2
  exit 1
fi

AUTH_HEADER=("X-N8N-API-KEY: $API_KEY")
JSON_HEADER=("Content-Type: application/json")
WORKFLOW_NAME="$(jq -r '.name' "$WORKFLOW_FILE")"

if [[ "$LLM_AUTH_MODE" == "none" ]]; then
  PAYLOAD="$({
    jq -c \
      --arg doc "$GSHEET_DOCUMENT_ID" \
      --arg sheet "$GSHEET_SHEET_NAME" \
      --arg gsheet_id "$GSHEET_CREDENTIAL_ID" \
      --arg gsheet_name "$GSHEET_CREDENTIAL_NAME" \
      --arg openai_model "$OPENAI_MODEL" \
      --arg openai_url "$OPENAI_API_URL" '
        .nodes |= map(
          if .name == "log lead to sheets" then
            .parameters.documentId.value = $doc
            | .parameters.sheetName.value = $sheet
            | .credentials.googleSheetsOAuth2Api.id = $gsheet_id
            | .credentials.googleSheetsOAuth2Api.name = $gsheet_name
          elif .name == "score lead with ai" then
            .parameters.url = $openai_url
            | .parameters.headerParameters.parameters |= map(select(.name != "Authorization"))
            | .parameters.jsonBody |= gsub("__OPENAI_MODEL__"; $openai_model)
          else
            .
          end
        )
        | {name, nodes, connections, settings: {executionOrder: (.settings.executionOrder // "v1")}}
      ' "$WORKFLOW_FILE"
  })"
else
  PAYLOAD="$({
    jq -c \
      --arg doc "$GSHEET_DOCUMENT_ID" \
      --arg sheet "$GSHEET_SHEET_NAME" \
      --arg gsheet_id "$GSHEET_CREDENTIAL_ID" \
      --arg gsheet_name "$GSHEET_CREDENTIAL_NAME" \
      --arg openai_key "$OPENAI_API_KEY" \
      --arg openai_model "$OPENAI_MODEL" \
      --arg openai_url "$OPENAI_API_URL" '
        .nodes |= map(
          if .name == "log lead to sheets" then
            .parameters.documentId.value = $doc
            | .parameters.sheetName.value = $sheet
            | .credentials.googleSheetsOAuth2Api.id = $gsheet_id
            | .credentials.googleSheetsOAuth2Api.name = $gsheet_name
          elif .name == "score lead with ai" then
            .parameters.url = $openai_url
            | .parameters.headerParameters.parameters |= map(
                if .name == "Authorization" then
                  .value = ("=Bearer " + $openai_key)
                else
                  .
                end
              )
            | .parameters.jsonBody |= gsub("__OPENAI_MODEL__"; $openai_model)
          else
            .
          end
        )
        | {name, nodes, connections, settings: {executionOrder: (.settings.executionOrder // "v1")}}
      ' "$WORKFLOW_FILE"
  })"
fi

echo "Checking API access at $BASE_URL ..."
LIST_RESPONSE="$({
  curl --fail-with-body -sS \
    -H "${AUTH_HEADER[0]}" \
    "$BASE_URL/api/v1/workflows"
})"

WORKFLOW_ID="$({
  echo "$LIST_RESPONSE" | jq -r --arg name "$WORKFLOW_NAME" '
    if type == "array" then
      (.[] | select(.name == $name) | .id)
    elif has("data") then
      (.data[]? | select(.name == $name) | .id)
    else
      empty
    end
  ' | head -n1
})"

if [[ -z "$WORKFLOW_ID" ]]; then
  echo "Workflow '$WORKFLOW_NAME' not found. Creating it ..."
  CREATE_RESPONSE="$({
    curl --fail-with-body -sS -X POST \
      -H "${AUTH_HEADER[0]}" \
      -H "${JSON_HEADER[0]}" \
      "$BASE_URL/api/v1/workflows" \
      -d "$PAYLOAD"
  })"
  WORKFLOW_ID="$(echo "$CREATE_RESPONSE" | jq -r '.data.id // .id // empty')"
  if [[ -z "$WORKFLOW_ID" ]]; then
    echo "Error: could not read new workflow id from create response." >&2
    exit 1
  fi
  echo "Created workflow id: $WORKFLOW_ID"
else
  echo "Updating workflow '$WORKFLOW_NAME' (id: $WORKFLOW_ID) ..."
  curl --fail-with-body -sS -X PUT \
    -H "${AUTH_HEADER[0]}" \
    -H "${JSON_HEADER[0]}" \
    "$BASE_URL/api/v1/workflows/$WORKFLOW_ID" \
    -d "$PAYLOAD" >/dev/null
fi

WORKFLOW_RESPONSE="$({
  curl --fail-with-body -sS \
    -H "${AUTH_HEADER[0]}" \
    "$BASE_URL/api/v1/workflows/$WORKFLOW_ID"
})"

VERSION_ID="$(echo "$WORKFLOW_RESPONSE" | jq -r '.data.versionId // .versionId // empty')"
if [[ -z "$VERSION_ID" ]]; then
  echo "Error: could not read versionId for workflow $WORKFLOW_ID." >&2
  exit 1
fi

echo "Activating workflow id $WORKFLOW_ID with version $VERSION_ID ..."
curl --fail-with-body -sS -X POST \
  -H "${AUTH_HEADER[0]}" \
  -H "${JSON_HEADER[0]}" \
  "$BASE_URL/api/v1/workflows/$WORKFLOW_ID/activate" \
  -d "{\"versionId\":\"$VERSION_ID\"}" >/dev/null

echo "Deployment complete."
echo "Workflow: $WORKFLOW_NAME"
echo "ID: $WORKFLOW_ID"
echo "Version: $VERSION_ID"
echo "Sheets Document ID: $GSHEET_DOCUMENT_ID"
echo "Sheets Tab Name: $GSHEET_SHEET_NAME"
echo "Sheets Credential ID: <set>"
echo "Sheets Credential Name: $GSHEET_CREDENTIAL_NAME"
if [[ "$LLM_AUTH_MODE" == "bearer" ]]; then
  echo "OpenAI API Key: <set>"
else
  echo "OpenAI API Key: <not required>"
fi
echo "LLM Auth Mode: $LLM_AUTH_MODE"
echo "OpenAI Model: $OPENAI_MODEL"
echo "OpenAI URL: $OPENAI_API_URL"
