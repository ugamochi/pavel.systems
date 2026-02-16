#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${N8N_BASE_URL:-https://n8n-service-uwaf.onrender.com}"
API_KEY="${N8N_API_KEY:-}"
WORKFLOW_FILE="${1:-n8n-workflows/stage-3-scoring.json}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMON_LIB="$SCRIPT_DIR/lib/common.sh"
if [[ ! -f "$COMMON_LIB" ]]; then
  echo "Error: common library not found: $COMMON_LIB" >&2
  exit 1
fi
# shellcheck source=lib/common.sh
source "$COMMON_LIB"

load_default_env_files "$SCRIPT_DIR"

API_KEY="${N8N_API_KEY:-$API_KEY}"
BASE_URL="${N8N_BASE_URL:-$BASE_URL}"
GSHEET_DOCUMENT_ID="${GSHEET_DOCUMENT_ID:-}"
GSHEET_SHEET_NAME="${GSHEET_SHEET_NAME:-}"
GSHEET_CREDENTIAL_ID="${GSHEET_CREDENTIAL_ID:-}"
GSHEET_CREDENTIAL_NAME="${GSHEET_CREDENTIAL_NAME:-}"
OPENAI_API_KEY="${OPENAI_API_KEY:-}"
OPENROUTER_API_KEY="${OPENROUTER_API_KEY:-}"
OPENAI_MODEL="${OPENAI_MODEL:-gpt-4o-mini}"
OPENAI_API_URL="${OPENAI_API_URL:-https://api.openai.com/v1/chat/completions}"
LLM_AUTH_MODE="${LLM_AUTH_MODE:-bearer}"
LLM_API_KEY="${OPENAI_API_KEY:-}"

# If using OpenRouter, prefer OPENROUTER_API_KEY when provided.
if [[ "$OPENAI_API_URL" == *"openrouter.ai"* && -n "$OPENROUTER_API_KEY" ]]; then
  LLM_API_KEY="$OPENROUTER_API_KEY"
fi

if [[ -z "$API_KEY" ]]; then
  echo "Error: N8N_API_KEY is required." >&2
  print_loaded_env_files
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

if [[ "$LLM_AUTH_MODE" == "bearer" && -z "$LLM_API_KEY" ]]; then
  cat >&2 <<'EOF'
Error: API key is required for Stage 3 lead scoring when LLM_AUTH_MODE=bearer.

Set in n8n-workflows/.env:
  OPENAI_API_KEY=<your-openai-compatible-api-key>
Or for OpenRouter specifically:
  OPENROUTER_API_KEY=<your-openrouter-api-key>
Optional:
  OPENAI_MODEL=gpt-4o-mini
  OPENAI_API_URL=https://api.openai.com/v1/chat/completions
  LLM_AUTH_MODE=bearer
EOF
  exit 1
fi

if [[ "$LLM_AUTH_MODE" == "bearer" && "$OPENAI_API_URL" == *"openrouter.ai"* && -z "$OPENROUTER_API_KEY" && "$OPENAI_API_KEY" != sk-or-* ]]; then
  cat >&2 <<'EOF'
Error: OpenRouter URL detected but no OpenRouter key found.

Set one of:
  OPENROUTER_API_KEY=sk-or-...
or
  OPENAI_API_KEY=sk-or-...
EOF
  exit 1
fi

if [[ ! -f "$WORKFLOW_FILE" ]]; then
  echo "Error: workflow file not found: $WORKFLOW_FILE" >&2
  exit 1
fi

require_command jq

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
      --arg llm_key "$LLM_API_KEY" \
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
            | .parameters.headerParameters.parameters |= (
                map(
                  if .name == "Authorization" then
                    .value = ("=Bearer " + $llm_key)
                  else
                    .
                  end
                )
                | if any(.name == "Authorization") then
                    .
                  else
                    . + [{"name":"Authorization","value":("=Bearer " + $llm_key)}]
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
  api_call_retry \
    -H "${AUTH_HEADER[0]}" \
    "$BASE_URL/api/v1/workflows"
})"

WORKFLOW_ID="$(extract_workflow_id "$LIST_RESPONSE" "$WORKFLOW_NAME")"

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
  api_call_retry -X PUT \
    -H "${AUTH_HEADER[0]}" \
    -H "${JSON_HEADER[0]}" \
    "$BASE_URL/api/v1/workflows/$WORKFLOW_ID" \
    -d "$PAYLOAD" >/dev/null
fi

WORKFLOW_RESPONSE="$({
  api_call_retry \
    -H "${AUTH_HEADER[0]}" \
    "$BASE_URL/api/v1/workflows/$WORKFLOW_ID"
})"

VERSION_ID="$(echo "$WORKFLOW_RESPONSE" | jq -r '.data.versionId // .versionId // empty')"
if [[ -z "$VERSION_ID" ]]; then
  echo "Error: could not read versionId for workflow $WORKFLOW_ID." >&2
  exit 1
fi

echo "Activating workflow id $WORKFLOW_ID with version $VERSION_ID ..."
api_call_retry -X POST \
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
