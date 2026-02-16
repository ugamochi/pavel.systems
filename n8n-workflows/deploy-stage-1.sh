#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${N8N_BASE_URL:-https://n8n-service-uwaf.onrender.com}"
API_KEY="${N8N_API_KEY:-}"
WORKFLOW_FILE="${1:-n8n-workflows/stage-1-basic.json}"
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

if [[ -z "$API_KEY" ]]; then
  echo "Error: N8N_API_KEY is required." >&2
  print_loaded_env_files
  echo "Set it with: export N8N_API_KEY='...'" >&2
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
# n8n API v1 on this instance rejects some exported settings keys.
PAYLOAD="$(jq -c '{name, nodes, connections, settings: {executionOrder: (.settings.executionOrder // "v1")}}' "$WORKFLOW_FILE")"

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
    api_call_retry -X POST \
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
