# pavel.systems

> Personal portfolio website for Pavel Ugamoti -- Agentic Architect

A single-page portfolio website showcasing AI automation services for professional services businesses (law firms, accounting practices, and service agencies).

## Features

- **Modern Design**: Dark charcoal theme (#0b0b0b) with warm cream text (#e7e6d9) and subtle violet accent (#6236f4)
- **AI-Powered Contact Form**: Lead capture with AI qualification pipeline (n8n stages 1-4 built)
- **GSAP Animations**: Scroll-triggered reveals, count-up numbers, parallax glow, staggered cards
- **Fully Responsive**: Breakpoints at 1024px, 768px, and 480px with mobile hamburger nav
- **Accessibility**: Skip links, ARIA labels, keyboard nav, prefers-reduced-motion, WCAG AA contrast
- **Performance**: Modular architecture, no build step, ~34KB HTML

## Tech Stack

**Frontend:**
- Pure HTML5, CSS3, JavaScript (no framework)
- GSAP 3.12.5 + ScrollTrigger for animations
- Google Fonts: Geist, JetBrains Mono
- CSS Custom Properties for theming

**Backend (Contact Form):**
- n8n for workflow automation (4 stages deployed)
- Gmail for email notifications
- Google Sheets for lead tracking
- OpenAI/Anthropic API for AI lead scoring

## Project Structure

```
pavel.systems/
├── index.html              # Main HTML
├── css/
│   ├── styles.css          # Main imports
│   ├── base/
│   │   ├── variables.css   # CSS custom properties
│   │   └── reset.css       # Base styles
│   ├── components/
│   │   ├── nav.css
│   │   ├── section-headers.css
│   │   └── forms.css
│   └── layout/
│       ├── hero.css
│       ├── sections.css
│       ├── cta.css
│       ├── footer.css
│       ├── animations.css
│       └── responsive.css
├── js/
│   ├── main.js             # Module loader
│   └── modules/
│       ├── nav.js          # Navigation logic
│       ├── theme.js        # Theme toggle
│       ├── animations.js   # GSAP animations
│       └── form.js         # Form submission
├── assets/
│   └── images/
│       ├── og-image.svg    # Social preview
│       └── og-image.html   # PNG source
└── netlify.toml            # Deploy config
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

This is a static HTML website with no build dependencies. Modular architecture with ES6 modules for JS and CSS `@import` for styles.

## Contact Form Setup

The contact form pipeline has 4 stages built. To set up:

### Stage 1: Basic Email Notifications

- **Local n8n:** [../n8n/guides/N8N_LOCAL_QUICKSTART.md](../n8n/guides/N8N_LOCAL_QUICKSTART.md) — use with `n8n start`; form is already pointed at `http://localhost:5678/webhook/lead-form`.
- **Full walkthrough (cloud or local):** [../n8n/guides/N8N_SETUP_STAGE1.md](../n8n/guides/N8N_SETUP_STAGE1.md).

**Quick summary:**
1. Run n8n (local: `n8n start` — or create n8n cloud account at https://cloud.n8n.io)
2. Configure Gmail OAuth2 credential in n8n
3. Create webhook workflow (Webhook → Set → Gmail x2), path `lead-form`
4. For production, set the webhook URL in `js/modules/form.js` to your n8n cloud or public URL
5. Test and deploy

### Stage 2-4: Advanced Features

Workflow JSONs and deploy scripts are in `../n8n/`:
- **Stage 2**: Google Sheets lead tracking
- **Stage 3**: AI lead scoring with conditional routing
- **Stage 4**: Automated personalized responses + spam gate

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

Edit CSS custom properties in `:root` in `css/styles.css`:
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

### Analytics

Plausible is already included. To disable, remove the script from `index.html`.

### og-image (Social Previews)

`assets/images/og-image.svg` is used for link previews. Some platforms (Twitter, LinkedIn) prefer PNG—if previews fail, screenshot `assets/images/og-image.html` at 1200×630, save as `og-image.png` in the same folder, and update the meta tags to point to it.

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
- [x] n8n webhook setup (guide ready: `../n8n/guides/N8N_SETUP_STAGE1.md`)
- [x] Email notifications
- [x] Deploy to production

### Sprint 2
- [x] SEO meta tags (Open Graph, Twitter Cards)
- [x] Favicon
- [x] og-image for social sharing (og-image.svg + og-image.html)
- [x] Google Sheets lead tracking
- [x] Analytics setup (Plausible)

### Sprint 3
- [x] AI lead scoring
- [x] Conditional routing
- [ ] Slack notifications for high-value leads

### Sprint 4
- [x] Accessibility enhancements (WCAG contrast, reduced-motion, focus states)
- [x] Automated personalized responses
- [ ] Meta case study: "How I Built My Own Lead Pipeline"

### Sprint 5 (Ongoing)
- [ ] Content updates
- [ ] A/B testing
- [ ] Performance optimization

---

Built by Pavel Ugamoti -- Agentic Architect
