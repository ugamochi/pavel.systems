#!/usr/bin/env bash
set -euo pipefail

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

BASE_URL="${N8N_BASE_URL:-https://n8n-service-uwaf.onrender.com}"
API_KEY="${N8N_API_KEY:-}"

if [[ -z "$API_KEY" ]]; then
  echo "Error: N8N_API_KEY is required." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required." >&2
  exit 1
fi

LATEST_ID=$(curl -sS -H "X-N8N-API-KEY: $API_KEY" -H 'Cache-Control: no-cache' "$BASE_URL/api/v1/executions?limit=1" | jq -r '.data[0].id // empty')
if [[ -z "$LATEST_ID" ]]; then
  echo "No executions found."
  exit 1
fi

EXEC_JSON=$(mktemp)
curl -sS -H "X-N8N-API-KEY: $API_KEY" "$BASE_URL/api/v1/executions/$LATEST_ID?includeData=true" > "$EXEC_JSON"

echo "Execution ID: $LATEST_ID"
jq -r '"Status: " + (.status|tostring), "Finished: " + (.finished|tostring), "Workflow ID: " + (.workflowId|tostring)' "$EXEC_JSON"

echo ""
echo "Score Node"
jq -r '
  .data.resultData.runData["score lead with ai"][0] as $r |
  "Execution status: " + (($r.executionStatus // "<missing>")|tostring),
  "Node error: " + (($r.error.message // $r.data.main[0][0].error.message // $r.data.main[0][0].json.error // "<none>")|tostring)
' "$EXEC_JSON"

echo ""
echo "Scored Fields"
jq -r '
  (.data.resultData.runData["create scored fields"][0].data.main[0][0].json // {}) as $j |
  "leadScore: " + (($j.leadScore // "<missing>")|tostring),
  "leadPriority: " + (($j.leadPriority // "<missing>")|tostring),
  "leadScoreReason: " + (($j.leadScoreReason // "<missing>")|tostring),
  "spamFlag: " + (($j.spamFlag // "<missing>")|tostring),
  "spamSignals: " + (($j.spamSignals // "<missing>")|tostring),
  "aiScoringStatus: " + (($j.aiScoringStatus // "<missing>")|tostring),
  "aiScoringError: " + (($j.aiScoringError // "<missing>")|tostring)
' "$EXEC_JSON"

echo ""
echo "Sheets Node"
jq -r '
  .data.resultData.runData["log lead to sheets"][0] as $r |
  "Execution status: " + (($r.executionStatus // "<missing>")|tostring),
  "Node error: " + (($r.error.message // $r.data.main[0][0].error.message // $r.data.main[0][0].json.error // "<none>")|tostring)
' "$EXEC_JSON"

rm -f "$EXEC_JSON"
