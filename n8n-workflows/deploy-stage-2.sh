#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${N8N_BASE_URL:-https://n8n-service-uwaf.onrender.com}"
API_KEY="${N8N_API_KEY:-}"
WORKFLOW_FILE="${1:-n8n-workflows/stage-2-sheets.json}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOADED_ENV_FILES=()

load_env_file() {
  local env_file="$1"
  if [[ -f "$env_file" ]]; then
    while IFS= read -r line || [[ -n "$line" ]]; do
      # skip empty and comment lines
      [[ -z "${line//[[:space:]]/}" ]] && continue
      [[ "$line" =~ ^[[:space:]]*# ]] && continue
      # only parse strict KEY=value lines (optionally prefixed by export)
      if [[ "$line" =~ ^[[:space:]]*(export[[:space:]]+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
        local key="${BASH_REMATCH[2]}"
        local value="${BASH_REMATCH[3]}"
      else
        continue
      fi

      # remove surrounding matching quotes if present
      if [[ ${#value} -ge 2 ]]; then
        if [[ "${value:0:1}" == "\"" && "${value: -1}" == "\"" ]]; then
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

# Try common dotenv locations before failing.
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

if [[ -z "$API_KEY" ]]; then
  echo "Error: N8N_API_KEY is required." >&2
  if [[ ${#LOADED_ENV_FILES[@]} -gt 0 ]]; then
    echo "Loaded env files:" >&2
    printf '  - %s\n' "${LOADED_ENV_FILES[@]}" >&2
  fi
  echo "Set it with: export N8N_API_KEY='...'" >&2
  exit 1
fi

if [[ -z "$GSHEET_DOCUMENT_ID" || -z "$GSHEET_SHEET_NAME" || -z "$GSHEET_CREDENTIAL_NAME" ]]; then
  echo "Error: GSHEET_DOCUMENT_ID, GSHEET_SHEET_NAME, and GSHEET_CREDENTIAL_NAME are required for Stage 2." >&2
  echo "Set them in n8n-workflows/.env, for example:" >&2
  echo "  GSHEET_DOCUMENT_ID=1abcDEF..." >&2
  echo "  GSHEET_SHEET_NAME=Leads" >&2
  echo "  GSHEET_CREDENTIAL_NAME=Google Sheets account" >&2
  exit 1
fi

if [[ -z "$GSHEET_CREDENTIAL_ID" || "$GSHEET_CREDENTIAL_ID" == "..." || "$GSHEET_CREDENTIAL_ID" == "{" ]]; then
  cat >&2 <<'EOF'
Error: GSHEET_CREDENTIAL_ID is required for API deploy of Stage 2.

Why: n8n workflow API requires a credential ID in the node credentials object.
Without it, runs appear successful but the Google Sheets node returns:
  Found credential with no ID.

How to get it in n8n UI:
1) Open n8n -> Credentials
2) Click your Google Sheets credential
3) Copy the ID from URL .../credentials/<ID>
4) Set GSHEET_CREDENTIAL_ID=<ID> in n8n-workflows/.env
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
PAYLOAD="$(
  jq -c \
    --arg doc "$GSHEET_DOCUMENT_ID" \
    --arg sheet "$GSHEET_SHEET_NAME" \
    --arg cred_id "$GSHEET_CREDENTIAL_ID" \
    --arg cred_name "$GSHEET_CREDENTIAL_NAME" '
      .nodes |= map(
        if .name=="log lead to sheets" then
          .parameters.documentId.value = $doc
          | .parameters.sheetName.value = $sheet
          | .credentials.googleSheetsOAuth2Api.id = $cred_id
          | .credentials.googleSheetsOAuth2Api.name = $cred_name
        else
          .
        end
      )
      | {name, nodes, connections, settings: {executionOrder: (.settings.executionOrder // "v1")}}
    ' "$WORKFLOW_FILE"
)"

echo "Checking API access at $BASE_URL ..."
LIST_RESPONSE="$(
  curl --fail-with-body -sS \
    -H "${AUTH_HEADER[0]}" \
    "$BASE_URL/api/v1/workflows"
)"

WORKFLOW_ID="$(
  echo "$LIST_RESPONSE" | jq -r --arg name "$WORKFLOW_NAME" '
    if type == "array" then
      (.[] | select(.name == $name) | .id)
    elif has("data") then
      (.data[]? | select(.name == $name) | .id)
    else
      empty
    end
  ' | head -n1
)"

if [[ -z "$WORKFLOW_ID" ]]; then
  echo "Workflow '$WORKFLOW_NAME' not found. Creating it ..."
  CREATE_RESPONSE="$(
    curl --fail-with-body -sS -X POST \
      -H "${AUTH_HEADER[0]}" \
      -H "${JSON_HEADER[0]}" \
      "$BASE_URL/api/v1/workflows" \
      -d "$PAYLOAD"
  )"
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

WORKFLOW_RESPONSE="$(
  curl --fail-with-body -sS \
    -H "${AUTH_HEADER[0]}" \
    "$BASE_URL/api/v1/workflows/$WORKFLOW_ID"
)"

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
