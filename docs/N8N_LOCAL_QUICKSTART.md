# Connect Contact Form to n8n (Local)

Use this when running **n8n locally**. The full walkthrough is in [N8N_SETUP_STAGE1.md](N8N_SETUP_STAGE1.md); here’s the short version.

## 0. Start n8n with CORS allowed (required for form on localhost)

The form runs in the browser at e.g. `http://localhost:8000` and POSTs to `http://localhost:5678`. The browser will block that unless n8n allows the origin. Start n8n with:

```bash
N8N_CORS_ALLOW_ORIGIN=http://localhost:8000 n8n start
```

If you use another port for the site (e.g. 3000), use that instead: `N8N_CORS_ALLOW_ORIGIN=http://localhost:3000 n8n start`.  
Then open **http://localhost:5678**.

## 1. Open n8n

- Go to **http://localhost:5678**
- Create an owner account (email + password) if this is your first time

## 2. Gmail credential

- **Credentials** → **Add Credential** → **Gmail OAuth2**
- **Connect my account** → sign in with `ugamochi.pavel@gmail.com` → Allow
- **Test** → **Save** → name: `Gmail - pavel.systems`

## 3. Create the workflow

- **Workflows** → **Add workflow** → name: `Lead Form - Stage 1`
- Add nodes in order:

| Order | Node        | Main settings |
|-------|-------------|----------------|
| 1     | **Webhook** | HTTP Method: POST, Path: `lead-form`, Response Mode: “Respond Immediately”, Response Code: 200 |
| 2     | **Set**     | Map: name ← `{{ $json.body.name }}`, email ← `{{ $json.body.email }}`, company ← `{{ $json.body.company }}`, message ← `{{ $json.body.message }}`, timestamp ← `{{ $json.body.timestamp }}`, source ← `{{ $json.body.source }}` |
| 3     | **Gmail**   | Send to `ugamochi.pavel@gmail.com`, subject `🔥 New Lead: {{ $json.name }}`, HTML body (see Stage 1 doc) |
| 4     | **Gmail**   | Send to `{{ $json.email }}`, subject `Thanks for reaching out, {{ $json.name }}!`, HTML body (see Stage 1 doc) |

- **Save** → toggle **Active** ON
- Copy the webhook URL: **http://localhost:5678/webhook/lead-form** (already set in `js/modules/form.js` for local use)

## 4. Test

- Serve the site from the same machine, e.g. `python3 -m http.server 8000` or `npx serve`
- Open **http://localhost:8000** (or the port you used) → scroll to contact form → submit
- You should get the success message, and both notification and confirmation emails should arrive

## 5. Production

For the live site (e.g. https://pavel.systems), the browser cannot call `localhost`. Either:

- Use **n8n Cloud** (https://cloud.n8n.io), create the same workflow there, and in `js/modules/form.js` set `webhookUrl` to your cloud webhook URL, or  
- Run n8n with a public URL (e.g. `n8n start --tunnel` or your own server) and set `webhookUrl` to that URL.
