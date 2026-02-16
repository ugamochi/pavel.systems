#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMON_LIB="$SCRIPT_DIR/lib/common.sh"
if [[ ! -f "$COMMON_LIB" ]]; then
  echo "Error: common library not found: $COMMON_LIB" >&2
  exit 1
fi
# shellcheck source=lib/common.sh
source "$COMMON_LIB"

load_default_env_files "$SCRIPT_DIR"

BASE_URL="${N8N_BASE_URL:-https://n8n-service-uwaf.onrender.com}"
API_KEY="${N8N_API_KEY:-}"
WORKFLOW_FILE="${N8N_WORKFLOW_FILE:-$SCRIPT_DIR/stage-3-scoring.json}"
WORKFLOW_NAME="${N8N_WORKFLOW_NAME:-}"

if [[ -z "$API_KEY" ]]; then
  echo "Error: N8N_API_KEY is required." >&2
  exit 1
fi

require_command jq

if [[ -z "$WORKFLOW_NAME" && -f "$WORKFLOW_FILE" ]]; then
  WORKFLOW_NAME="$(jq -r '.name // empty' "$WORKFLOW_FILE")"
fi
WORKFLOW_NAME="${WORKFLOW_NAME:-emails from pavel.systems}"

WF_LIST_JSON="$(fetch_json "$BASE_URL/api/v1/workflows" || true)"
WORKFLOW_ID="$(extract_workflow_id "$WF_LIST_JSON" "$WORKFLOW_NAME")"
if [[ -z "$WORKFLOW_ID" ]]; then
  echo "Error: workflow not found by name: $WORKFLOW_NAME" >&2
  exit 1
fi

LIST_JSON="$(fetch_json "$BASE_URL/api/v1/executions?limit=100" || true)"
LATEST_ID="$(extract_execution_id_for_workflow "$LIST_JSON" "$WORKFLOW_ID")"
if [[ -z "$LATEST_ID" ]]; then
  echo "No executions found for workflow '$WORKFLOW_NAME' (id: $WORKFLOW_ID)." >&2
  exit 1
fi

EXEC_JSON=$(mktemp)
if ! fetch_json "$BASE_URL/api/v1/executions/$LATEST_ID?includeData=true" > "$EXEC_JSON"; then
  echo "Error: could not fetch execution details." >&2
  rm -f "$EXEC_JSON"
  exit 1
fi

echo "Execution ID: $LATEST_ID"
echo "Workflow Name: $WORKFLOW_NAME"
jq -r '"Status: " + (.status|tostring), "Finished: " + (.finished|tostring), "Workflow ID: " + (.workflowId|tostring)' "$EXEC_JSON"

echo ""
echo "Score Node"
jq -r '
  (.data.resultData.runData["score lead with ai"][0] // null) as $r |
  "Execution status: " + ((if $r == null then "<skipped>" else ($r.executionStatus // "<missing>") end)|tostring),
  "Node error: " + ((if $r == null then "<none>" else ($r.error.message // $r.data.main[0][0].error.message // $r.data.main[0][0].json.error // "<none>") end)|tostring)
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
  (.data.resultData.runData["log lead to sheets"][0] // null) as $r |
  "Execution status: " + ((if $r == null then "<skipped>" else ($r.executionStatus // "<missing>") end)|tostring),
  "Node error: " + ((if $r == null then "<none>" else ($r.error.message // $r.data.main[0][0].error.message // $r.data.main[0][0].json.error // "<none>") end)|tostring)
' "$EXEC_JSON"

rm -f "$EXEC_JSON"
