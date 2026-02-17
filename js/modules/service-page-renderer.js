import { getServicePage } from '../data/service-pages.js';

export function renderServicePage() {
  const main = document.getElementById('main');
  if (!main) return;

  const slug = main.dataset.serviceSlug || detectSlugFromPath();
  if (!slug) return;

  const service = getServicePage(slug);
  if (!service) {
    main.innerHTML = renderNotFound();
    return;
  }

  applyServiceTheme(service.theme);
  updateMeta(service);
  main.innerHTML = renderServiceMarkup(service);
  injectFaqSchema(service);
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
  const pairs = [
    ['--accent', theme.accent],
    ['--accent-light', theme.accentLight],
    ['--accent-dim', theme.accentDim],
    ['--accent-glow', theme.accentGlow],
    ['--hero-glow', theme.heroGlow],
    ['--accent-pale', withAlpha(theme.accent, 0.08)],
    ['--accent-soft', withAlpha(theme.accent, 0.12)],
    ['--chip-hover-bg', withAlpha(theme.accent, 0.1)],
    ['--chip-hover-border', withAlpha(theme.accent, 0.24)],
    ['--card-accent-shadow', `0 0 0 1px ${withAlpha(theme.accent, 0.24)}, 0 8px 32px ${withAlpha(theme.accent, 0.14)}`],
    ['--faq-glow', withAlpha(theme.accent, 0.06)]
  ];

  pairs.forEach(([key, value]) => {
    if (value) root.style.setProperty(key, value);
  });
}

function updateMeta(service) {
  document.title = `${service.title} | Pavel Ugamoti`;

  const description = service.metaDescription || '';
  setMetaByName('description', description);
  setMetaByProperty('og:title', document.title);
  setMetaByProperty('og:description', description);

  const canonical = document.getElementById('canonicalLink');
  if (canonical) {
    canonical.setAttribute('href', window.location.href);
  }
}

function setMetaByName(name, content) {
  const tag = document.querySelector(`meta[name="${name}"]`);
  if (tag) tag.setAttribute('content', content);
}

function setMetaByProperty(property, content) {
  const tag = document.querySelector(`meta[property="${property}"]`);
  if (tag) tag.setAttribute('content', content);
}

function renderServiceMarkup(service) {
  const bookingHref = `../../book-discovery-call/?service=${encodeURIComponent(service.slug)}`;

  return `
    <section class="service-hero">
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
            <a href="${bookingHref}" class="btn-ghost" data-intent="book_discovery_call">Book a Discovery Call</a>
          </div>
          <p class="service-note">Pricing range: Starter <strong>${escapeHtml(service.pricing.starter)}</strong> · Growth <strong>${escapeHtml(service.pricing.growth)}</strong> · Scale <strong>${escapeHtml(service.pricing.scale)}</strong>. Final quote after discovery.</p>
        </div>
        <div class="service-proof-grid">
          ${service.proof.map((item) => `
            <article class="service-proof">
              <div class="service-proof-value">${escapeHtml(item.value)}</div>
              <div class="service-proof-label">${escapeHtml(item.label)}</div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="service-section" id="problem">
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

    ${renderBlueprint(service.blueprint)}

    <section class="service-section" id="process">
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

    <section class="service-section">
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
        <div>
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

    <section class="service-section">
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

    <section class="service-section" id="packages">
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

    <section class="service-section" id="faq">
      <div class="container">
        <div class="section-label">FAQ</div>
        <h2 class="section-title">${escapeHtml(service.faqTitle)}</h2>
        <div class="service-grid-2">
          ${service.faqs.map((faq) => `
            <article class="service-card-lite">
              <h3>${escapeHtml(faq.q)}</h3>
              <p>${escapeHtml(faq.a)}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="service-cta-band">
      <div class="container">
        <div class="section-label">Next Step</div>
        <h2 class="section-title">${escapeHtml(service.nextStepTitle)}</h2>
        <div class="service-cta-row">
          <a href="#contact" class="btn-primary" data-intent="send_project_details">Send Project Details</a>
          <a href="${bookingHref}" class="btn-ghost" data-intent="book_discovery_call">Book a Discovery Call</a>
        </div>
      </div>
    </section>

    <section class="cta-section" id="contact">
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

function renderBlueprint(blueprint) {
  if (!blueprint) return '';

  return `
    <section class="service-section">
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

function injectFaqSchema(service) {
  const existing = document.getElementById('faq-schema-jsonld');
  if (existing) existing.remove();

  if (!service.faqs || !service.faqs.length) return;

  const schema = {
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

  const script = document.createElement('script');
  script.id = 'faq-schema-jsonld';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
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
