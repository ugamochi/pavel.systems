import { getServicePage } from '../data/service-pages.js';

const SITE_BASE_URL = 'https://ugamochi.github.io/ugamochi.systems/';
const DEFAULT_OG_IMAGE = `${SITE_BASE_URL}assets/images/og-image.svg`;

const SHARED_TESTIMONIALS = [
  {
    quote:
      'We went from 3-day client onboarding to same-day. Pavel redesigned the workflow so automation matched how the team actually works.',
    author: 'Managing Partner',
    role: 'Mid-size Law Firm'
  },
  {
    quote:
      'Support tickets dropped by 60% in the first month. Routine requests are handled automatically and escalated only when needed.',
    author: 'Head of Operations',
    role: 'Digital Marketing Agency'
  }
];

export function renderServicePage() {
  const main = document.getElementById('main');
  if (!main) return;

  const slug = main.dataset.serviceSlug || detectSlugFromPath();
  if (!slug) return;

  const service = getServicePage(slug);
  if (!service) {
    if (!main.children.length) {
      main.innerHTML = renderNotFound();
    }
    return;
  }

  applyServiceTheme(service.theme);
  updateMeta(service);

  // Support both shell pages and pre-rendered static pages.
  if (!main.children.length) {
    main.innerHTML = renderServiceMarkup(service);
  }

  injectFaqSchema(service);
}

export function renderServiceMarkup(service, options = {}) {
  const relativePrefix = options.relativePrefix || '../../';
  const bookingHref = getBookingHref(service.slug, relativePrefix);

  return [
    renderHeroSection(service, bookingHref),
    renderProblemSection(service),
    renderBlueprint(service.blueprint),
    renderProcessSection(service),
    renderFitOutcomesSection(service),
    renderDeliverablesSection(service),
    renderProofSection(service),
    renderPackagesSection(service),
    renderFaqSection(service),
    renderNextStepSection(service, bookingHref),
    renderContactSection(service, bookingHref)
  ].join('\n');
}

export function renderServiceDocument(service, options = {}) {
  const relativePrefix = options.relativePrefix || '../../';
  const baseUrl = options.baseUrl || SITE_BASE_URL;
  const canonicalUrl = getServiceCanonicalUrl(service.slug, baseUrl);
  const bookingHref = getBookingHref(service.slug, relativePrefix);
  const title = `${service.title} | Pavel Ugamoti`;
  const description = service.metaDescription || '';
  const themeStyleTag = renderThemeStyleTag(service.theme);
  const faqSchemaTag = renderFaqSchemaScriptTag(service);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="Pavel Ugamoti">
  <meta name="color-scheme" content="light dark">
  <link rel="canonical" id="canonicalLink" href="${escapeHtml(canonicalUrl)}">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%236236f4'/%3E%3Ctext x='50' y='72' font-size='60' font-family='system-ui' font-weight='700' fill='white' text-anchor='middle'%3EP%3C/text%3E%3C/svg%3E">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:image" content="${escapeHtml(DEFAULT_OG_IMAGE)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(DEFAULT_OG_IMAGE)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script>
    (function() {
      var saved = localStorage.getItem('theme');
      var pref = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      var theme = saved !== null ? saved : pref;
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    })();
  </script>
  <link rel="stylesheet" href="${relativePrefix}css/styles.css">
${themeStyleTag}
${faqSchemaTag}
</head>
<body>
  <a href="#main" class="skip-link">Skip to content</a>

  <nav class="nav" id="nav" aria-label="Main navigation">
    <div class="container">
      <a href="${relativePrefix}index.html" class="nav-logo" aria-label="Pavel Ugamoti homepage">pavel<span>.</span>systems</a>
      <ul class="nav-links" id="navLinks">
        <li><a href="${relativePrefix}index.html">Home</a></li>
        <li><a href="${relativePrefix}index.html#services">Services</a></li>
        <li><a href="#problem">Problem</a></li>
        <li><a href="#process">Process</a></li>
        <li><a href="#packages">Packages</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li>
          <button type="button" class="theme-toggle" id="themeToggle" aria-label="Toggle dark/light theme" title="Toggle theme">
            <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>
        </li>
        <li><a href="${bookingHref}" class="nav-cta" data-intent="book_discovery_call">Book Discovery Call
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
        </a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <main class="service-page" id="main" data-service-slug="${escapeHtml(service.slug)}">
${indentMarkup(renderServiceMarkup(service, { relativePrefix }), 4)}
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-left">&copy; 2026 Pavel Ugamoti. Agentic Architect.</div>
      <ul class="footer-links">
        <li><a href="https://www.linkedin.com/in/pavel-ugamoti/" target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href="mailto:ugamochi.pavel@gmail.com">Email</a></li>
      </ul>
    </div>
  </footer>

  <script type="module" src="${relativePrefix}js/service-page.js"></script>
</body>
</html>`;
}

export function getServiceCanonicalUrl(slug, baseUrl = SITE_BASE_URL) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}services/${slug}/`;
}

export function getBookingHref(slug, relativePrefix = '../../') {
  return `${relativePrefix}book-discovery-call/?service=${encodeURIComponent(slug)}`;
}

function detectSlugFromPath() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const segments = path.split('/').filter(Boolean);
  if (segments.length < 2) return null;
  return segments[segments.length - 1];
}

function applyServiceTheme(theme) {
  if (!theme) return;

  const root = document.documentElement;
  const variables = buildServiceThemeVariables(theme);

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function updateMeta(service) {
  const title = `${service.title} | Pavel Ugamoti`;
  const description = service.metaDescription || '';
  const canonicalUrl = getCurrentCanonicalUrl();

  document.title = title;

  setMetaByName('description', description);
  setMetaByProperty('og:title', title);
  setMetaByProperty('og:description', description);
  setMetaByProperty('og:url', canonicalUrl);

  setMetaByName('twitter:title', title);
  setMetaByName('twitter:description', description);

  const canonical = document.getElementById('canonicalLink');
  if (canonical) {
    canonical.setAttribute('href', canonicalUrl);
  }
}

function getCurrentCanonicalUrl() {
  const url = new URL(window.location.href);
  let pathname = url.pathname;

  if (pathname.endsWith('/index.html')) {
    pathname = pathname.slice(0, -'index.html'.length);
  }

  if (!pathname.endsWith('/')) {
    pathname = `${pathname}/`;
  }

  url.pathname = pathname;
  url.search = '';
  url.hash = '';
  return url.toString();
}

function setMetaByName(name, content) {
  const tag = document.querySelector(`meta[name="${name}"]`);
  if (tag) tag.setAttribute('content', content);
}

function setMetaByProperty(property, content) {
  const tag = document.querySelector(`meta[property="${property}"]`);
  if (tag) tag.setAttribute('content', content);
}

function renderHeroSection(service, bookingHref) {
  return `
    <section class="service-hero service-anim">
      <div class="container service-hero-grid">
        <div>
          <a class="service-back-link" href="../../index.html#services" aria-label="Back to all services">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M13 8H3M7 4L3 8l4 4"/>
            </svg>
            Back to all services
          </a>
          <div class="service-kicker">${escapeHtml(service.serviceNumber)}</div>
          <h1 class="service-headline">${escapeHtml(service.title)}</h1>
          <p class="service-sub">${escapeHtml(service.subtitle)}</p>
          <div class="service-cta-row">
            <a href="#contact" class="btn-primary" data-intent="send_project_details">Send Project Details</a>
            <a href="${bookingHref}" class="btn-ghost" data-intent="book_discovery_call">Book Discovery Call</a>
          </div>
          <p class="service-note">Pricing range: Starter <strong>${escapeHtml(service.pricing.starter)}</strong> · Growth <strong>${escapeHtml(service.pricing.growth)}</strong> · Scale <strong>${escapeHtml(service.pricing.scale)}</strong>. Final quote after discovery.</p>
        </div>

        <aside class="service-rail">
          <div class="service-proof-grid">
            ${service.proof.map((item) => `
              <article class="service-proof">
                <div class="service-proof-value">${escapeHtml(item.value)}</div>
                <div class="service-proof-label">${escapeHtml(item.label)}</div>
              </article>
            `).join('')}
          </div>

          <div class="service-summary-card">
            <h3>Quick Navigation</h3>
            <ul class="service-summary-links">
              <li><a href="#problem">Problem</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#proof">Proof</a></li>
              <li><a href="#packages">Packages</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
            <div class="service-summary-cta">
              <a href="#contact" class="btn-primary" data-intent="send_project_details">Send Details</a>
              <a href="${bookingHref}" class="service-summary-book" data-intent="book_discovery_call">Book Discovery Call</a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderProblemSection(service) {
  return `
    <section class="service-section service-anim" id="problem">
      <div class="container">
        <div class="section-label">The Problem</div>
        <h2 class="section-title">${escapeHtml(service.problemTitle)}</h2>
        <div class="service-grid-3">
          ${service.problems.map((item) => `
            <article class="service-card-lite">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderBlueprint(blueprint) {
  if (!blueprint) return '';

  return `
    <section class="service-section service-anim">
      <div class="container">
        <div class="section-label">System Blueprint</div>
        <h2 class="section-title">${escapeHtml(blueprint.title)}</h2>
        <p class="section-desc">${escapeHtml(blueprint.description)}</p>
        <figure class="service-image">
          <img src="${escapeHtml(blueprint.image)}" alt="${escapeHtml(blueprint.alt)}">
        </figure>
      </div>
    </section>
  `;
}

function renderProcessSection(service) {
  return `
    <section class="service-section service-anim" id="process">
      <div class="container">
        <div class="section-label">How It Works</div>
        <h2 class="section-title">${escapeHtml(service.processTitle)}</h2>
        <div class="service-step-list">
          ${service.process.map((step, index) => `
            <article class="service-step">
              <div class="service-step-num">${String(index + 1).padStart(2, '0')}</div>
              <div>
                <h4>${escapeHtml(step.title)}</h4>
                <p>${escapeHtml(step.text)}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderFitOutcomesSection(service) {
  return `
    <section class="service-section service-anim" id="fit">
      <div class="container service-grid-2">
        <div class="fit-card">
          <div class="section-label">Fit Check</div>
          <h2 class="section-title">${escapeHtml(service.fit.title)}</h2>
          <div class="service-fit-grid">
            <div>
              <h3 class="fit-heading">Good fit</h3>
              <ul class="service-list">
                ${service.fit.for.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
              </ul>
            </div>
            <div>
              <h3 class="fit-heading">Probably not a fit</h3>
              <ul class="service-list fit-list-not">
                ${service.fit.notFor.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
        <div id="outcomes">
          <div class="section-label">Expected Outcomes</div>
          <h2 class="section-title">What should improve in the first <em>90 days</em></h2>
          <div class="service-outcome-grid">
            ${service.outcomes.map((item) => `
              <article class="service-outcome">
                <p>${escapeHtml(item)}</p>
              </article>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderDeliverablesSection(service) {
  return `
    <section class="service-section service-anim" id="deliverables">
      <div class="container service-grid-2">
        <div>
          <div class="section-label">Deliverables</div>
          <h2 class="section-title">What you actually <em>get</em></h2>
          <ul class="service-list">
            ${service.deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
        <div>
          <div class="section-label">Integrations</div>
          <h2 class="section-title">Built on your current stack</h2>
          <div class="service-badges">
            ${service.integrations.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
          </div>
          <div class="service-pricing-note">${escapeHtml(service.ownershipNote)}</div>
        </div>
      </div>
    </section>
  `;
}

function renderProofSection(service) {
  return `
    <section class="service-section service-proof-section service-anim" id="proof">
      <div class="container">
        <div class="section-label">Client Proof</div>
        <h2 class="section-title">Performance patterns seen after deployment</h2>
        <div class="service-grid-3">
          ${service.proof.map((item) => `
            <article class="service-card-lite service-proof-card">
              <h3>${escapeHtml(item.value)}</h3>
              <p>${escapeHtml(item.label)}</p>
            </article>
          `).join('')}
        </div>
        <div class="service-grid-2 service-testimonial-grid">
          ${SHARED_TESTIMONIALS.map((item) => `
            <article class="service-testimonial-card">
              <div class="service-testimonial-quote">&ldquo;</div>
              <blockquote>${escapeHtml(item.quote)}</blockquote>
              <div class="service-testimonial-meta">
                <div class="service-testimonial-author">${escapeHtml(item.author)}</div>
                <div class="service-testimonial-role">${escapeHtml(item.role)}</div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderPackagesSection(service) {
  return `
    <section class="service-section service-anim" id="packages">
      <div class="container">
        <div class="section-label">Packages</div>
        <h2 class="section-title">Choose based on scope and operational complexity</h2>
        <div class="package-grid">
          ${service.packages.map((item) => `
            <article class="package-card">
              <div class="package-name">${escapeHtml(item.name)}</div>
              <div class="package-price">${escapeHtml(item.price)}</div>
              <div class="package-meta">Typical timeline: ${escapeHtml(item.timeline)}</div>
              <p class="package-for">${escapeHtml(item.bestFor)}</p>
              <ul class="service-list package-list">
                ${item.includes.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
              </ul>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderFaqSection(service) {
  const [leftColumn, rightColumn] = splitIntoColumns(service.faqs || []);

  return `
    <section class="faq service-faq service-anim" id="faq">
      <div class="container">
        <div class="section-label">FAQ</div>
        <h2 class="section-title">${escapeHtml(service.faqTitle)}</h2>
        <div class="faq-grid">
          <div class="faq-list">
            ${leftColumn.map(renderFaqItem).join('')}
          </div>
          <div class="faq-list">
            ${rightColumn.map(renderFaqItem).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFaqItem(faq) {
  return `
    <article class="faq-item service-faq-item">
      <button class="faq-question" aria-expanded="false">
        ${escapeHtml(faq.q)}
        <div class="faq-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></div>
      </button>
      <div class="faq-answer">
        <p>${escapeHtml(faq.a)}</p>
      </div>
    </article>
  `;
}

function renderNextStepSection(service, bookingHref) {
  return `
    <section class="service-cta-band service-anim">
      <div class="container">
        <div class="section-label">Next Step</div>
        <h2 class="section-title">${escapeHtml(service.nextStepTitle)}</h2>
        <div class="service-cta-row">
          <a href="#contact" class="btn-primary" data-intent="send_project_details">Send Project Details</a>
          <a href="${bookingHref}" class="btn-ghost" data-intent="book_discovery_call">Book Discovery Call</a>
        </div>
      </div>
    </section>
  `;
}

function renderContactSection(service, bookingHref) {
  return `
    <section class="cta-section service-anim" id="contact">
      <div class="cta-glow"></div>
      <div class="container">
        <div class="cta-content">
          <div class="cta-text">
            <div class="section-label">Send Scope</div>
            <h2>${escapeHtml(service.contact.heading)}</h2>
            <p>${escapeHtml(service.contact.description)}</p>
            <div class="cta-note">${escapeHtml(service.contact.note)}</div>
            <a href="${bookingHref}" class="service-book-link" data-intent="book_discovery_call">Prefer live scoping? Book a discovery call.</a>
          </div>

          <form id="leadForm" class="lead-form" autocomplete="on">
            <div class="form-group">
              <input type="text" id="name" name="name" required aria-required="true" autocomplete="name" placeholder=" ">
              <label for="name">Your Name *</label>
            </div>
            <div class="form-group">
              <input type="email" id="email" name="email" required aria-required="true" autocomplete="email" placeholder=" ">
              <label for="email">Email Address *</label>
            </div>
            <div class="form-group">
              <input type="text" id="company" name="company" autocomplete="organization" placeholder=" ">
              <label for="company">Company (Optional)</label>
            </div>
            <div class="form-group">
              <textarea id="message" name="message" rows="4" placeholder=" " aria-label="${escapeHtml(service.contact.messageLabel)}"></textarea>
              <label for="message">${escapeHtml(service.contact.messageLabel)}</label>
              <span class="form-hint">${escapeHtml(service.contact.messagePlaceholder)}</span>
            </div>
            <input type="hidden" name="intent" value="send_project_details">
            <input type="hidden" name="service_requested" value="${escapeHtml(service.title)}">
            <input type="text" name="website" style="display:none;" tabindex="-1" autocomplete="off">
            <button type="submit" class="btn-primary form-submit">
              <span class="btn-text">Send Project Details</span>
              <span class="btn-loading" style="display:none;">Sending...</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </button>
            <div class="form-status" style="display:none;" role="alert" aria-live="polite"></div>
          </form>
        </div>
      </div>
    </section>
  `;
}

function injectFaqSchema(service) {
  const schema = buildFaqSchema(service);
  if (!schema) return;

  const existing = document.getElementById('faq-schema-jsonld');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.id = 'faq-schema-jsonld';
  script.type = 'application/ld+json';
  script.textContent = safeJsonForScript(schema);
  document.head.appendChild(script);
}

function buildFaqSchema(service) {
  if (!service.faqs || !service.faqs.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };
}

function renderFaqSchemaScriptTag(service) {
  const schema = buildFaqSchema(service);
  if (!schema) return '';

  return `  <script id="faq-schema-jsonld" type="application/ld+json">${safeJsonForScript(schema)}</script>`;
}

function renderThemeStyleTag(theme) {
  const variables = buildServiceThemeVariables(theme);
  const keys = Object.keys(variables);
  if (!keys.length) return '';

  const cssBody = keys.map((key) => `${key}: ${variables[key]};`).join(' ');
  return `  <style id="service-theme-vars">:root { ${cssBody} }</style>`;
}

function buildServiceThemeVariables(theme) {
  if (!theme) return {};

  return {
    '--accent': theme.accent,
    '--accent-light': theme.accentLight,
    '--accent-dim': theme.accentDim,
    '--accent-glow': theme.accentGlow,
    '--hero-glow': theme.heroGlow,
    '--accent-pale': withAlpha(theme.accent, 0.08),
    '--accent-soft': withAlpha(theme.accent, 0.12),
    '--chip-hover-bg': withAlpha(theme.accent, 0.1),
    '--chip-hover-border': withAlpha(theme.accent, 0.24),
    '--card-accent-shadow': `0 0 0 1px ${withAlpha(theme.accent, 0.24)}, 0 8px 32px ${withAlpha(theme.accent, 0.14)}`,
    '--faq-glow': withAlpha(theme.accent, 0.06)
  };
}

function splitIntoColumns(items) {
  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
}

function renderNotFound() {
  return `
    <section class="service-hero">
      <div class="container">
        <div class="service-kicker">Service</div>
        <h1 class="service-headline">Service page not found</h1>
        <p class="service-sub">The requested service page is missing or misconfigured.</p>
        <div class="service-cta-row">
          <a href="../../index.html#services" class="btn-primary">Back to Services</a>
        </div>
      </div>
    </section>
  `;
}

function safeJsonForScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function indentMarkup(markup, spaces) {
  const indentation = ' '.repeat(spaces);
  return markup
    .split('\n')
    .map((line) => (line ? `${indentation}${line}` : line))
    .join('\n');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function withAlpha(hex, alpha) {
  if (!hex || !hex.startsWith('#')) return null;

  const normalized = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;

  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
