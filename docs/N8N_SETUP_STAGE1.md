# n8n Setup Guide - Stage 1 (Basic Email Notifications)

## Overview

This guide walks you through setting up the **Stage 1** contact form backend using n8n. By the end, your website will:
- ✅ Receive form submissions via webhook
- ✅ Send you email notifications for each lead
- ✅ Send automatic confirmation emails to leads
- ✅ Work reliably 24/7

**Time to complete:** ~30 minutes
**Cost:** Free (n8n cloud free tier: 5,000 executions/month)

---

## Prerequisites

- ✅ Contact form already added to website (completed)
- ✅ Gmail account: `ugamochi.pavel@gmail.com`
- ⏳ n8n cloud account (we'll create this)

---

## Step 1: Create n8n Cloud Account

### 1.1 Sign Up

1. Go to **https://cloud.n8n.io**
2. Click **"Sign up"**
3. Choose one of:
   - Sign up with Google (fastest - use ugamochi.pavel@gmail.com)
   - Sign up with email
4. Verify your email
5. Complete onboarding survey (optional - can skip)

### 1.2 Understand the Free Tier

**Free tier includes:**
- 5,000 workflow executions per month
- All core features
- 2 active workflows
- Community support

**For your use case:**
- Each form submission = 1 execution
- 5,000 leads/month is plenty to start
- Can upgrade to Starter plan ($20/month) later if needed

---

## Step 2: Configure Gmail Connection

### 2.1 Add Gmail Credential

1. In n8n dashboard, click **"Credentials"** (left sidebar)
2. Click **"+ Add Credential"** (top right)
3. Search for **"Gmail OAuth2"**
4. Click on it to configure

### 2.2 Connect Your Google Account

1. Click **"Connect my account"** button
2. You'll be redirected to Google OAuth consent screen
3. **Select account:** `ugamochi.pavel@gmail.com`
4. **Grant permissions:**
   - ✅ Send emails on your behalf
   - ✅ Read email settings
5. Click **"Allow"**
6. You'll be redirected back to n8n

### 2.3 Test the Connection

1. Click **"Test credential"** button
2. Should show: ✅ "Connection test successful"
3. Click **"Save"** to save the credential
4. Name it: `Gmail - pavel.systems`

**Troubleshooting:**
- If test fails with "Access blocked": Enable "Less secure app access" in Gmail settings (not recommended) OR use App Password instead
- **Better solution:** Use Gmail OAuth2 (which we're doing) - no changes needed to Gmail security

---

## Step 3: Create the Workflow

### 3.1 Create New Workflow

1. Click **"Workflows"** (left sidebar)
2. Click **"+ Add workflow"** (top right)
3. Name it: **"Lead Form - Stage 1"**
4. Click **"Save"** (top right)

### 3.2 Add Webhook Node (Trigger)

1. Click **"+"** in the workflow canvas
2. Search for **"Webhook"**
3. Click **"On webhook call"**
4. Configure webhook:
   - **HTTP Method:** POST
   - **Path:** `lead-form` (or any path you want)
   - **Authentication:** None
   - **Response Mode:** "Respond Immediately"
   - **Response Code:** 200
   - **Response Body:**
     ```json
     {
       "success": true,
       "message": "Thanks! We'll be in touch soon."
     }
     ```

5. **IMPORTANT:** Click **"Listen for test event"** button
6. **Copy the Webhook URL** that appears (looks like: `https://yourinstance.app.n8n.cloud/webhook/lead-form`)
   - You'll need this later to update your website
   - Save it somewhere safe!

### 3.3 Add Set Node (Data Cleaning)

1. Click **"+"** after the Webhook node
2. Search for **"Set"**
3. Click **"Edit Fields"**
4. Click **"Add Value"** for each field:

| Keep | Field Name | Expression | Value |
|------|-----------|------------|-------|
| ✅ | name | OFF | `{{ $json.body.name }}` |
| ✅ | email | OFF | `{{ $json.body.email }}` |
| ✅ | company | OFF | `{{ $json.body.company }}` |
| ✅ | message | OFF | `{{ $json.body.message }}` |
| ✅ | timestamp | OFF | `{{ $json.body.timestamp }}` |
| ✅ | source | OFF | `{{ $json.body.source }}` |

**What this does:** Extracts clean data from the webhook payload for use in subsequent nodes.

### 3.4 Add Gmail Node #1 (Notify Yourself)

1. Click **"+"** after the Set node
2. Search for **"Gmail"**
3. Select **"Send Message"**
4. Configure:
   - **Credential:** Select `Gmail - pavel.systems` (created earlier)
   - **Resource:** Message
   - **Operation:** Send
   - **To:** `ugamochi.pavel@gmail.com`
   - **Subject:** `🔥 New Lead: {{ $json.name }}`
   - **Email Type:** HTML
   - **Message (HTML):**

```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px;">
  <h2 style="color: #a17ff7; background: #0b0b0b; padding: 20px; margin: 0;">
    🔥 New Lead from pavel.systems
  </h2>

  <div style="background: #f5f5f5; padding: 20px; border-left: 4px solid #a17ff7;">
    <p style="margin: 0 0 10px 0;"><strong>Name:</strong> {{ $json.name }}</p>
    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:{{ $json.email }}">{{ $json.email }}</a></p>
    <p style="margin: 0 0 10px 0;"><strong>Company:</strong> {{ $json.company || 'Not provided' }}</p>
    <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
    <p style="background: white; padding: 15px; border-radius: 4px; white-space: pre-wrap;">{{ $json.message || 'No message provided' }}</p>
  </div>

  <div style="background: #e8e8e8; padding: 15px; margin-top: 20px;">
    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">
      <strong>Timestamp:</strong> {{ $json.timestamp }}
    </p>
    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">
      <strong>Source:</strong> {{ $json.source }}
    </p>
  </div>

  <div style="margin-top: 20px; padding: 15px; background: #a17ff7; text-align: center;">
    <a href="mailto:{{ $json.email }}" style="color: #0b0b0b; text-decoration: none; font-weight: 600;">
      📧 Reply to this lead
    </a>
  </div>
</div>
```

### 3.5 Add Gmail Node #2 (Confirm to Lead)

1. Click **"+"** after Gmail Node #1
2. Search for **"Gmail"** again
3. Select **"Send Message"**
4. Configure:
   - **Credential:** Select `Gmail - pavel.systems`
   - **Resource:** Message
   - **Operation:** Send
   - **To:** `{{ $json.email }}`
   - **Subject:** `Thanks for reaching out, {{ $json.name }}!`
   - **Email Type:** HTML
   - **Message (HTML):**

```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0b0b0b; padding: 30px; text-align: center;">
    <h1 style="color: #a17ff7; font-family: 'JetBrains Mono', monospace; font-size: 18px; margin: 0;">
      pavel<span style="color: #a17ff7;">.</span>systems
    </h1>
  </div>

  <div style="padding: 30px; background: #f9f9f9;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hi <strong>{{ $json.name }}</strong>,
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Thanks for getting in touch! I received your message{{ $json.company ? ' about automation for <strong>' + $json.company + '</strong>' : '' }}.
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      I'll review your situation and reach out within <strong>24 hours</strong> with some initial thoughts and next steps.
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      In the meantime, feel free to check out case studies and resources on
      <a href="https://pavel.systems" style="color: #a17ff7; text-decoration: none; font-weight: 600;">pavel.systems</a>.
    </p>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
      <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 0;">
        Talk soon,<br>
        <strong>Pavel Ugamoti</strong><br>
        Agentic Architect<br>
        <a href="https://pavel.systems" style="color: #666; text-decoration: none;">pavel.systems</a>
      </p>
    </div>
  </div>

  <div style="background: #e8e8e8; padding: 15px; text-align: center;">
    <p style="font-size: 12px; color: #999; margin: 0;">
      This is an automated confirmation. I'll personally respond to your inquiry soon.
    </p>
  </div>
</div>
```

### 3.6 Save and Activate Workflow

1. Click **"Save"** (top right)
2. Toggle **"Active"** switch to ON (top right)
3. Workflow should show green "Active" badge

---

## Step 4: Test the Workflow

### 4.1 Test with Test Event

1. In Webhook node, click **"Listen for test event"**
2. Open a new tab and use curl or Postman to send a test:

```bash
curl -X POST https://YOUR_N8N_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Company",
    "message": "This is a test message from the n8n workflow setup.",
    "timestamp": "2026-02-11T14:00:00Z",
    "source": "pavel.systems"
  }'
```

**Replace** `YOUR_N8N_WEBHOOK_URL` with the actual URL you copied earlier.

### 4.2 Verify Results

Check that:
- ✅ Workflow execution shows "Success" in n8n
- ✅ You received notification email at `ugamochi.pavel@gmail.com`
- ✅ Test email (`test@example.com`) received confirmation (if using your own email for testing)

**If something fails:**
- Check Gmail credential is properly connected
- Verify email addresses are correct
- Check workflow execution logs for errors

---

## Step 5: Update Website with Webhook URL

### 5.1 Find the Webhook URL

Your webhook URL should look like:
```
https://yourinstance.app.n8n.cloud/webhook/lead-form
```

### 5.2 Update index.html

1. Open `index.html` in your editor
2. Find line ~2303: `const webhookUrl = 'YOUR_N8N_WEBHOOK_URL';`
3. Replace with your actual webhook URL:

```javascript
const webhookUrl = 'https://yourinstance.app.n8n.cloud/webhook/lead-form';
```

4. Save the file

### 5.3 Test Locally

1. Open website locally:
   ```bash
   python3 -m http.server 8000
   # or
   npx serve
   ```

2. Navigate to `http://localhost:8000`
3. Fill out the contact form with real data
4. Click "Book Free Strategy Call"
5. Check:
   - ✅ Form shows success message
   - ✅ You receive notification email
   - ✅ Form clears after submission

---

## Step 6: Deploy to Production

### 6.1 Commit Changes

```bash
git add index.html
git commit -m "feat: Connect contact form to n8n webhook

Stage 1 implementation complete:
- n8n workflow active and tested
- Webhook URL configured in form
- Email notifications working
- Ready for production deployment"

git push -u origin claude/review-website-8s9F9
```

### 6.2 Deploy to Hosting

**Option A: Netlify (Recommended)**
1. Log in to Netlify
2. Go to your site (or create new site from Git)
3. Connect repository: `ugamochi/pavel.systems`
4. Branch to deploy: `claude/review-website-8s9F9` (or merge to main first)
5. Build settings: Leave empty (static site)
6. Publish directory: `/`
7. Click "Deploy site"

**Option B: Vercel**
```bash
npm i -g vercel
vercel --prod
```

**Option C: Traditional hosting**
- Upload `index.html` via FTP/SFTP
- Ensure HTTPS is enabled

### 6.3 Test Production Site

1. Visit your live site
2. Fill out contact form
3. Verify emails received

---

## Troubleshooting

### Form submission fails

**Error: "Submission failed. Please email me directly..."**
- Check webhook URL is correct in `index.html`
- Verify n8n workflow is **Active** (green toggle)
- Check browser console for CORS errors
- Test webhook URL directly with curl

### No notification email received

- Check Gmail credential in n8n is valid
- Verify email address `ugamochi.pavel@gmail.com` is correct
- Check spam folder
- Look at n8n execution log for errors

### Confirmation email not sent to lead

- Check Gmail node #2 configuration
- Verify `To:` field uses `{{ $json.email }}`
- Check execution logs for error messages

### Webhook returns 404

- Verify workflow is Active
- Check webhook path matches URL
- Ensure n8n instance is running (cloud instances don't sleep)

---

## Monitoring & Maintenance

### Check Workflow Executions

1. Go to n8n → Workflows
2. Click "Lead Form - Stage 1"
3. View **"Executions"** tab
4. See all past submissions with success/failure status

### Usage Tracking

- Free tier: 5,000 executions/month
- Check usage: n8n Dashboard → Usage & Billing
- Each form submission = 1 execution
- Set up alerts when approaching limit

### Email Deliverability

**To avoid spam:**
- Don't send too many emails too quickly
- Use professional email content
- Include unsubscribe link (for future automated campaigns)
- Monitor bounce rates

---

## Next Steps

### Stage 2: Google Sheets Tracking (Week 2)

Once Stage 1 is working:
- Add Google Sheets node to log all submissions
- Track: Name, Email, Company, Message, Timestamp, Status
- See `docs/N8N_SETUP_STAGE2.md` (to be created)

### Stage 3: AI Lead Scoring (Week 3)

Add intelligence:
- OpenAI/Anthropic node for lead analysis
- Score 0-100 based on industry fit, urgency, budget
- Route high-value leads differently
- See `docs/N8N_SETUP_STAGE3.md` (to be created)

### Stage 4: Automated Responses (Week 4)

Full automation:
- AI-generated personalized responses
- Calendar booking links for high-score leads
- Case study links for medium-score leads
- See `docs/N8N_SETUP_STAGE4.md` (to be created)

---

## FAQ

**Q: Is my data secure?**
A: Yes. n8n cloud is SOC 2 Type II certified. Webhook uses HTTPS. Gmail uses OAuth2.

**Q: What if I exceed 5,000 executions?**
A: Workflow stops. Upgrade to Starter plan ($20/month for 25,000 executions).

**Q: Can I self-host n8n instead?**
A: Yes! See `docs/N8N_SELF_HOSTING.md` for Railway/Render deployment.

**Q: Can I use a different email provider?**
A: Yes! n8n supports: Outlook, SendGrid, Mailgun, etc. Gmail is easiest for small volume.

**Q: How do I backup my workflow?**
A: Workflows → Lead Form - Stage 1 → Download (exports JSON). Save to `n8n-workflows/stage-1-basic.json`.

---

## Support

**n8n Documentation:** https://docs.n8n.io
**Community Forum:** https://community.n8n.io
**Discord:** https://discord.gg/n8n

**For this project:**
- Issues: https://github.com/ugamochi/pavel.systems/issues
- Email: ugamochi.pavel@gmail.com

---

**Stage 1 Complete! 🎉**

Your contact form now captures leads and sends email notifications automatically. Once you verify it's working, move on to Stage 2 to add Google Sheets tracking.
