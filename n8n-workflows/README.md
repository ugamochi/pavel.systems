# n8n Workflow Ops

## Files

- `stage-1-basic.json`: Stage 1 lead form workflow JSON.
- `stage-2-sheets.json`: Stage 2 workflow variant with Google Sheets logging branch.
- `deploy-stage-1.sh`: API-based deploy script (update/create + activate).
- `deploy-stage-2.sh`: Stage 2 deploy script with Google Sheets placeholders injected from env.
- `test-webhook.sh`: Webhook smoke test payload sender.

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
