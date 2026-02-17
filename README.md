# ugamochi.systems

A single-page portfolio website showcasing AI automation services for professional services businesses.

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
css/
  styles.css          # imports
  base/               # variables, reset
  components/         # nav, forms, section headers
  layout/             # hero, sections, cta, footer, animations, responsive
js/
  main.js             # module loader
  modules/            # nav, theme, animations, form
assets/images/        # og-image
```

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
