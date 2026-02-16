#!/usr/bin/env bash

LOADED_ENV_FILES=()
CURL_RETRY_ARGS=(--retry 6 --retry-all-errors --retry-delay 2 --connect-timeout 20 --max-time 180)

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

load_default_env_files() {
  local script_dir="$1"

  load_env_file "$PWD/.env"
  load_env_file "$PWD/.env.local"
  load_env_file "$script_dir/.env"
  load_env_file "$script_dir/.env.local"
  load_env_file "$script_dir/../.env"
  load_env_file "$script_dir/../.env.local"

  if [[ -n "${N8N_ENV_FILE:-}" ]]; then
    load_env_file "$N8N_ENV_FILE"
  fi
}

print_loaded_env_files() {
  if [[ ${#LOADED_ENV_FILES[@]} -gt 0 ]]; then
    echo "Loaded env files:" >&2
    printf '  - %s\n' "${LOADED_ENV_FILES[@]}" >&2
  fi
}

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: $cmd is required." >&2
    return 1
  fi
}

api_call_retry() {
  curl --fail-with-body -sS "${CURL_RETRY_ARGS[@]}" "$@"
}

fetch_json() {
  local url="$1"
  local attempts="${2:-8}"
  local delay_seconds="${3:-2}"
  local response=""
  local i

  for ((i=1; i<=attempts; i++)); do
    response="$(curl -sS -H "X-N8N-API-KEY: $API_KEY" -H 'Cache-Control: no-cache' "$url" || true)"
    if jq -e . >/dev/null 2>&1 <<< "$response"; then
      printf '%s' "$response"
      return 0
    fi
    sleep "$delay_seconds"
  done

  return 1
}

extract_workflow_id() {
  local list_json="$1"
  local workflow_name="$2"

  echo "$list_json" | jq -r --arg name "$workflow_name" '
    if type == "array" then
      (.[] | select(.name == $name) | .id)
    elif has("data") then
      (.data[]? | select(.name == $name) | .id)
    else
      empty
    end
  ' | head -n1
}

extract_execution_id_for_workflow() {
  local list_json="$1"
  local workflow_id="$2"

  echo "$list_json" | jq -r --arg wf "$workflow_id" '
    if type == "array" then
      (.[] | select((.workflowId | tostring) == $wf) | .id)
    elif has("data") then
      (.data[]? | select((.workflowId | tostring) == $wf) | .id)
    else
      empty
    end
  ' | head -n1
}
