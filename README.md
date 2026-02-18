# ugamochi.systems

A portfolio website for AI automation services with a homepage and dedicated service detail pages.

## Stack

- HTML / CSS / JS — no framework, no build step
- GSAP + ScrollTrigger for animations
- Geist + JetBrains Mono (Google Fonts)
- CSS custom properties for theming (dark/light)
- Contact form → n8n webhook (see [n8n repo](https://github.com/ugamochi/n8n-workflows))
- Deployed on GitHub Pages

## Run locally

```bash
git clone https://github.com/ugamochi/ugamochi.systems.git
cd ugamochi.systems
python3 -m http.server 8000
```

## Structure

```
index.html
book-discovery-call/
  index.html          # dedicated discovery call booking intake page
services/
  */index.html        # statically generated service pages from shared service data
css/
  styles.css          # imports
  base/               # variables, reset
  components/         # nav, forms, section headers
  layout/             # hero, sections, service-pages, cta, footer, animations, responsive
js/
  main.js             # homepage module loader
  service-page.js     # service page module loader
  book-call.js        # discovery call page loader
  data/               # service content model
  modules/            # nav, theme, animations, form, renderers, helpers
assets/images/        # og-image + service visuals
tools/
  generate-service-pages.mjs
  validate-service-pages.mjs
```

## Content Workflow

Service pages are generated from `js/data/service-pages.js` via the shared renderer.

```bash
node tools/generate-service-pages.mjs
node tools/validate-service-pages.mjs
```

Run both commands before deploying to GitHub Pages.

## Current Services On Website

The live Services section currently includes:

1. AI Lead Pipeline & Qualification Engine
2. Document Intelligence (PDF-to-Data)
3. Client Onboarding Automation
4. Internal Company Brain (RAG)
5. Automated Performance Reporting
6. OpenClaw Setup & Security Hardening

Service documentation for these offerings is maintained in the sibling workspace folder `../services/`.

## License

Copyright 2026 Pavel Ugamoti. All rights reserved.
