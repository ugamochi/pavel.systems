---
title: "Stage 3 Provider Instructions - 2026-02-16"
created: "2026-02-16"
updated: "2026-02-16"
tags: ["n8n", "stage-3", "llm", "openrouter", "ollama", "scoring", "operations"]
crossrefs: ["README", "stage-3-scoring.json", "deploy-stage-3.sh", "verify-stage-3.sh"]
status: active
---

# Stage 3 Provider Instructions (2026-02-16)

## Session Context

Project: `pavel.systems`  
Workflow: `emails from pavel.systems`  
Stage: 3 (AI lead scoring)

This file captures final operating rules discovered while hardening Stage 3 and switching providers.

## Confirmed Bugs and Fixes

1. Bad-lead messages with quotes/newlines broke request JSON.
   - Wrong: JSON body assembled as fragile templated JSON string with direct message interpolation.
   - Right: JSON body built as an expression object in `score lead with ai` so quotes/newlines are safe.

2. AI branch crashed on error objects.
   - Wrong: `aiScoringError` used raw `$json.error` object, causing invalid JSON in `create scored fields`.
   - Right: `aiScoringError` now extracts a safe string (`error` or `error.message`).

3. Duplicate LLM keys in `.env` created ambiguity.
   - Wrong: multiple `OPENAI_MODEL` / `OPENAI_API_URL` lines.
   - Right: keep one canonical value per key.

4. Local endpoint dependency caused external reachability issues.
   - Wrong assumption: Render-hosted n8n can reach laptop `localhost`.
   - Right: use a public/reachable endpoint (provider API or tunnel).

5. OpenRouter routed free models rejected developer/system instruction.
   - Wrong: split prompt into `system` + `user` messages for all providers.
   - Right: use a single `user` prompt payload for maximum compatibility.

6. Spam-like leads were incorrectly scored as hot.
   - Wrong: AI-only scoring with weak pattern checks.
   - Right: deterministic spam override + fallback rules in `create scored fields`.

## Provider Rules

### Rule 1: OpenAI-compatible endpoint only

Stage 3 HTTP node expects OpenAI-style chat endpoint:

```text
POST <provider>/v1/chat/completions
```

### Rule 2: Auth mode must match provider

- `LLM_AUTH_MODE=bearer` for hosted providers (OpenRouter, Groq, etc.).
- `LLM_AUTH_MODE=none` only for private no-auth endpoints (for example a private Ollama tunnel).

### Rule 3: OpenRouter key format

If `OPENAI_API_URL` contains `openrouter.ai`, use OpenRouter key (`sk-or-...`):

```dotenv
OPENROUTER_API_KEY=sk-or-...
OPENAI_MODEL=openrouter/free
OPENAI_API_URL=https://openrouter.ai/api/v1/chat/completions
LLM_AUTH_MODE=bearer
```

`deploy-stage-3.sh` now guards this explicitly.

## Recommended Config Profiles

### A. No local dependency (recommended default)

```dotenv
OPENROUTER_API_KEY=sk-or-...
OPENAI_MODEL=openrouter/free
OPENAI_API_URL=https://openrouter.ai/api/v1/chat/completions
LLM_AUTH_MODE=bearer
```

### B. Local Ollama via public tunnel (temporary/debug)

```dotenv
OPENAI_MODEL=qwen2.5-coder:7b
OPENAI_API_URL=https://<your-tunnel-domain>/v1/chat/completions
LLM_AUTH_MODE=none
```

Notes:
- Keep tunnel process alive.
- Tunnel URL changes require `.env` update + Stage 3 redeploy.

## Standard Validation Sequence

```bash
bash n8n-workflows/deploy-stage-3.sh
bash n8n-workflows/test-webhook.sh
bash n8n-workflows/verify-stage-3.sh
```

Pass criteria:

- Workflow execution status is `success`.
- `Score Node` has no `Node error`.
- `Scored Fields` include `leadScore`, `leadPriority`, `leadScoreReason`.
- `Sheets Node` execution status is `success`.

## Operational Gotchas

1. `429` may come from provider limits OR unstable tunnel service.
2. `continueOnFail` keeps workflow green while scoring fails; always inspect `verify-stage-3.sh`.
3. If score node errors but lead fields still populate, check `aiScoringStatus`:
   - `ok` = AI response parsed successfully
   - `ok_spam_override` = deterministic spam rules forced score/priority
   - `ok_fallback_rules` = non-spam fallback used when AI output was missing/invalid
4. If scores look unrealistic (spam marked hot), tighten spam signals in `create scored fields`.
