# n8n Workflow Ops

## Files

- `stage-1-basic.json`: Stage 1 lead form workflow JSON.
- `stage-2-sheets.json`: Stage 2 workflow variant with Google Sheets logging branch.
- `stage-3-scoring.json`: Stage 3 workflow variant with AI scoring + Sheets logging.
- `stage-4-personalized.json`: Stage 4 workflow variant with personalized client responses driven by score/priority.
- `deploy-stage-1.sh`: API-based deploy script (update/create + activate).
- `deploy-stage-2.sh`: Stage 2 deploy script with Google Sheets placeholders injected from env.
- `deploy-stage-3.sh`: Stage 3 deploy script with Google Sheets + OpenAI placeholders injected from env.
- `deploy-stage-4.sh`: Stage 4 deploy script (same env as Stage 3) for personalized response workflow.
- `test-webhook.sh`: Webhook smoke test payload sender.
- `verify-stage-3.sh`: Reads latest execution and prints AI scoring + Sheets node status.
- `verify-stage-4.sh`: Reads latest execution and prints scoring + response strategy + client email + sheets status.
- `session-2026-02-16-stage3-provider-instructions.md`: Stage 3 hardening rules + provider switch playbook.

## Deploy to Render n8n (API)

The deploy script auto-loads these files if present:

- `.env`
- `.env.local`
- `n8n-workflows/.env`
- `n8n-workflows/.env.local`

You can start from:

```bash
cp n8n-workflows/.env.example n8n-workflows/.env
```

1. Create an API key in n8n: `Settings -> API -> Create API Key`.
2. Export the key:
   ```bash
   export N8N_API_KEY='your-key'
   ```
3. Optional if URL changes:
   ```bash
   export N8N_BASE_URL='https://n8n-service-uwaf.onrender.com'
   ```
4. Run deploy:
   ```bash
   bash n8n-workflows/deploy-stage-1.sh
   ```
5. Optional if your dotenv is elsewhere:
   ```bash
   N8N_ENV_FILE='/absolute/path/to/.env' bash n8n-workflows/deploy-stage-1.sh
   ```

The script will:

- find the workflow by name from `stage-1-basic.json`
- update it (or create if missing)
- use API-compatible workflow settings payload (`executionOrder` only)
- fetch its latest `versionId`
- activate that version so `/webhook/lead-form` runs the new changes

## Smoke test webhook

```bash
TEST_EMAIL='ugamochi.pavel@gmail.com' bash n8n-workflows/test-webhook.sh
```

Expected HTTP response:

```json
{"success": true, "message": "Thanks! We'll be in touch soon."}
```

Then verify in n8n executions:

- webhook output shape (`$json.body` vs `$json`)
- owner email fields are resolved (no literal `{{ ... }}`)
- lead confirmation email is delivered and personalized

## Stage 2 (Google Sheets)

1. Create/verify a Google Sheets credential in n8n named `Google Sheets account` (or set `GSHEET_CREDENTIAL_NAME`).
2. Fill these in `n8n-workflows/.env`:
   - `GSHEET_DOCUMENT_ID`
   - `GSHEET_SHEET_NAME`
   - `GSHEET_CREDENTIAL_ID` (required for API deploy)
   - `GSHEET_CREDENTIAL_NAME`
3. Get `GSHEET_CREDENTIAL_ID` from n8n UI:
   - Open `Credentials`
   - Click your Google Sheets credential
   - Copy ID from URL: `.../credentials/<ID>`
4. Deploy Stage 2:

```bash
bash n8n-workflows/deploy-stage-2.sh
```

Notes:

- Stage 2 adds `log lead to sheets` as a branch from `create fields`, keeping email flow intact.
- The sheets node is configured with `continueOnFail: true` and `alwaysOutputData: true` so email delivery is not blocked by sheets issues.
- If `GSHEET_CREDENTIAL_ID` is missing, deploy now fails fast to prevent false-positive deployments.
- In your target sheet, create headers matching workflow fields:
  - `timestamp`, `name`, `email`, `company`, `message`, `source`, `userAgent`, `referrer`

## Stage 3 (AI Lead Scoring)

1. Keep Stage 2 variables configured:
   - `GSHEET_DOCUMENT_ID`
   - `GSHEET_SHEET_NAME`
   - `GSHEET_CREDENTIAL_ID`
   - `GSHEET_CREDENTIAL_NAME`
2. Add OpenAI variables to `n8n-workflows/.env`:
   - `OPENAI_API_KEY` (required when `LLM_AUTH_MODE=bearer`)
   - `OPENROUTER_API_KEY` (optional; preferred for OpenRouter URL)
   - `OPENAI_MODEL` (optional, default `gpt-4o-mini`)
   - `OPENAI_API_URL` (optional, default `https://api.openai.com/v1/chat/completions`)
   - `LLM_AUTH_MODE` (optional, `bearer` or `none`, default `bearer`)
3. Deploy Stage 3:

```bash
bash n8n-workflows/deploy-stage-3.sh
```

4. Send test lead:

```bash
bash n8n-workflows/test-webhook.sh
```

5. Verify latest execution scoring outputs:

```bash
bash n8n-workflows/verify-stage-3.sh
```

Notes:

- Stage 3 adds nodes:
  - `score lead with ai` (HTTP request to OpenAI)
  - `create scored fields` (parses score/priority/reason and preserves lead fields)
- AI branch uses `continueOnFail` so mail flow still runs if scoring fails.
- `create scored fields` applies deterministic spam guardrails:
  - promo/spam signals force `leadPriority=cold`, `leadScore=5`
  - status is set to `ok_spam_override`
- If provider response is missing/invalid for non-spam leads, a rule fallback is applied:
  - status is set to `ok_fallback_rules`
  - fallback scoring uses intent keywords so fields are never blank
- Add these columns in your target sheet to store Stage 3 output:
  - `leadScore`, `leadPriority`, `leadScoreReason`, `spamFlag`, `spamSignals`, `aiScoringStatus`, `aiScoringError`

### Use Another API (OpenAI-compatible)

You can use any OpenAI-compatible endpoint (including open-source model providers).

Example config:

```dotenv
OPENAI_MODEL=your-provider-model-id
OPENAI_API_URL=https://your-provider.example.com/v1/chat/completions
OPENAI_API_KEY=your_provider_key
LLM_AUTH_MODE=bearer
```

OpenRouter free (cloud-hosted, no local model dependency):

```dotenv
OPENROUTER_API_KEY=sk-or-...
OPENAI_MODEL=openrouter/free
OPENAI_API_URL=https://openrouter.ai/api/v1/chat/completions
LLM_AUTH_MODE=bearer
```

Compatibility note:

- Some routed free models reject `system` messages with errors like `Developer instruction is not enabled ...`.
- `stage-3-scoring.json` now sends a single `user` instruction for better provider compatibility.

For providers that do not need bearer auth (for example a private Ollama endpoint):

```dotenv
OPENAI_MODEL=qwen2.5:7b
OPENAI_API_URL=http://your-ollama-host:11434/v1/chat/completions
OPENAI_API_KEY=
LLM_AUTH_MODE=none
```

Important:

- Your n8n server (Render) must be able to reach `OPENAI_API_URL`.
- `localhost` on your laptop is not reachable from Render.

## Stage 4 (Automated Personalized Responses)

Stage 4 builds on Stage 3 and adds adaptive reply copy for the client email.

1. Keep Stage 3 variables configured in `n8n-workflows/.env`.
2. Optional (recommended) Stage 4 link variables in `.env`:
   - `BOOKING_URL` (used for `hot` replies)
   - `CASE_STUDY_URL` (used for `warm` replies)
   - `COLD_GUIDE_URL` (used for `cold` replies)
3. Deploy Stage 4:

```bash
bash n8n-workflows/deploy-stage-4.sh
```

4. Send a test lead (or your own custom payload):

```bash
bash n8n-workflows/test-webhook.sh
```

5. Verify latest execution:

```bash
bash n8n-workflows/verify-stage-4.sh
```

Notes:

- Stage 4 adds `create response fields` node after scoring.
- Client email subject/body are now personalized from:
  - `responseStrategy` (`hot`, `warm`, `cold`, `spam`)
  - `responseSubject`
  - `responseOpening`
  - `responseCTA`
- `responseCTA` now includes env-driven links by segment:
  - `hot` => `BOOKING_URL`
  - `warm` => `CASE_STUDY_URL`
  - `cold` => `COLD_GUIDE_URL`
- Response metadata is appended and can be logged to Sheets if matching columns exist.
