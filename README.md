# pavel.systems

> Personal portfolio website for Pavel Ugamoti -- Agentic Architect

A single-page portfolio website showcasing AI automation services for professional services businesses (law firms, accounting practices, and service agencies).

## Features

- **Modern Design**: Dark charcoal theme (#0b0b0b) with warm cream text (#e7e6d9) and subtle violet accent (#6236f4)
- **AI-Powered Contact Form**: Lead capture with planned AI qualification pipeline
- **GSAP Animations**: Scroll-triggered reveals, count-up numbers, parallax glow, staggered cards
- **Fully Responsive**: Breakpoints at 1024px, 768px, and 480px with mobile hamburger nav
- **Accessibility**: Skip links, ARIA labels, keyboard nav, prefers-reduced-motion, WCAG AA contrast
- **Performance**: Single-file architecture, no build step, ~80KB HTML

## Tech Stack

**Frontend:**
- Pure HTML5, CSS3, JavaScript (no framework)
- GSAP 3.12.5 + ScrollTrigger for animations
- Google Fonts: Inter, JetBrains Mono
- CSS Custom Properties for theming

**Backend (Contact Form - Planned):**
- n8n for workflow automation
- Gmail for email notifications
- Google Sheets for lead tracking
- OpenAI/Anthropic API for AI lead scoring

## Project Structure

```
pavel.systems/
├── index.html              # Single-file website (2,364 lines)
│   ├── CSS (lines 29-1416)
│   ├── HTML (lines 1417-1962)
│   └── JavaScript (lines 1963-2363)
├── README.md               # This file
├── .gitignore              # Git exclusions
├── docs/
│   └── N8N_SETUP_STAGE1.md # n8n Stage 1 setup guide
└── n8n-workflows/          # (To be created) n8n workflow exports
    ├── stage-1-basic.json
    ├── stage-2-sheets.json
    ├── stage-3-ai-scoring.json
    └── stage-4-automated.json
```

## Quick Start

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/ugamochi/pavel.systems.git
cd pavel.systems
```

2. **Open in browser:**
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve

# Or just open index.html directly
open index.html
```

3. **Visit:** `http://localhost:8000`

### No Build Process Required

This is a static HTML website with no build dependencies. The entire site is contained in `index.html`.

## Contact Form Setup

The contact form is currently in development mode. To enable it:

### Stage 1: Basic Email Notifications

See **[docs/N8N_SETUP_STAGE1.md](docs/N8N_SETUP_STAGE1.md)** for the full walkthrough.

**Quick summary:**
1. Create n8n cloud account at https://cloud.n8n.io
2. Configure Gmail OAuth2 credential
3. Create webhook workflow (Webhook -> Set -> Gmail x2)
4. Replace `YOUR_N8N_WEBHOOK_URL` in `index.html` line ~2303
5. Test and deploy

### Stage 2-4: Advanced Features

See `docs/FORM_SETUP.md` (to be created) for:
- Google Sheets integration
- AI lead scoring
- Automated personalized responses

## Deployment

### Option 1: Netlify (Recommended)

1. Log in to Netlify -> New Site -> Import from Git
2. Select this repository
3. Build command: (leave empty)
4. Publish directory: `/`
5. Add custom domain: `pavel.systems`

### Option 2: Vercel

```bash
npm i -g vercel
vercel
```

### Option 3: Traditional Hosting

1. Upload `index.html` to your web server
2. Ensure HTTPS is enabled

## Content Sections

1. **Navigation** - Fixed header with smooth scroll + mobile hamburger
2. **Hero** - Value proposition + proof metrics (40+ systems, 90%, <24h)
3. **Problem** - Client pain points (3 cards)
4. **Services** - 6 service offerings with metrics and tech tags
5. **Process** - 3-phase workflow (Audit, Build, Deploy)
6. **Results** - Impact metrics (4 cards)
7. **Audience** - Target industries (Law, Accounting, Agencies)
8. **Framework** - "Agentic Stack" 4-layer visual
9. **Testimonials** - Client quotes (2 testimonials)
10. **FAQ** - 8 questions across 2 columns
11. **CTA + Contact Form** - Lead capture with cream background
12. **Footer** - Copyright + LinkedIn/Email links

## Customization

### Update Colors

Edit CSS custom properties in `:root` (line 30):
```css
:root {
  --bg: #0b0b0b;              /* Background */
  --bg-card: #161616;          /* Card surfaces */
  --text-primary: #e7e6d9;    /* Warm cream text */
  --text-secondary: #b9b8ae;  /* Secondary text */
  --accent: #6236f4;          /* Violet accent (light bg) */
  --accent-light: #a17ff7;    /* Light violet (dark bg text) */
}
```

### Add Analytics

Add before closing `</head>` tag:
```html
<script defer data-domain="pavel.systems" src="https://plausible.io/js/script.js"></script>
```

## Testing

**Browser Compatibility:**
- Chrome/Edge
- Safari (macOS/iOS)
- Firefox

**Testing Checklist:**
- [ ] All links work
- [ ] Mobile menu opens/closes (hamburger animates to X)
- [ ] FAQ accordions expand/collapse
- [ ] Animations work (or gracefully degrade with prefers-reduced-motion)
- [ ] Form validates correctly
- [ ] Form submits successfully (after n8n setup)
- [ ] Email notifications received

## License

Copyright 2026 Pavel Ugamoti. All rights reserved.

## Roadmap

### Sprint 1 (Current)
- [x] Contact form UI
- [x] Update social links
- [x] UI/UX audit + color scheme overhaul
- [ ] n8n webhook setup (guide ready: `docs/N8N_SETUP_STAGE1.md`)
- [ ] Email notifications
- [ ] Deploy to production

### Sprint 2
- [x] SEO meta tags (Open Graph, Twitter Cards)
- [x] Favicon
- [ ] og-image for social sharing
- [ ] Google Sheets lead tracking
- [ ] Analytics setup (Plausible)

### Sprint 3
- [ ] AI lead scoring
- [ ] Conditional routing
- [ ] Slack notifications for high-value leads

### Sprint 4
- [x] Accessibility enhancements (WCAG contrast, reduced-motion, focus states)
- [ ] Automated personalized responses
- [ ] Meta case study: "How I Built My Own Lead Pipeline"

### Sprint 5 (Ongoing)
- [ ] Content updates
- [ ] A/B testing
- [ ] Performance optimization

---

Built by Pavel Ugamoti -- Agentic Architect
