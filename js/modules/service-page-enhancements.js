export function initServicePageEnhancements() {
  injectBackToServicesLink();
  initSectionNavHighlight();
  initContactIntentCapture();
}

function injectBackToServicesLink() {
  const heroCopyColumn = document.querySelector('.service-hero .container > div');
  if (!heroCopyColumn || heroCopyColumn.querySelector('.service-back-link')) return;

  const backLink = document.createElement('a');
  backLink.className = 'service-back-link';
  backLink.href = '../../index.html#services';
  backLink.setAttribute('aria-label', 'Back to services list');
  backLink.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M13 8H3M7 4L3 8l4 4"/>
    </svg>
    Back to all services
  `;

  heroCopyColumn.insertBefore(backLink, heroCopyColumn.firstChild);
}

function initSectionNavHighlight() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!links.length) return;

  const sectionIds = ['problem', 'process', 'faq'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const linkById = new Map(
    links
      .map((link) => {
        const href = link.getAttribute('href');
        return href && href.startsWith('#') ? [href.slice(1), link] : null;
      })
      .filter(Boolean)
  );

  const setActive = (activeId) => {
    linkById.forEach((link, id) => {
      const isActive = id === activeId;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length) {
        setActive(visible[0].target.id);
      }
    },
    {
      rootMargin: '-35% 0px -52% 0px',
      threshold: [0.2, 0.45, 0.7]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initContactIntentCapture() {
  const form = document.getElementById('leadForm');
  if (!form) return;

  let intentInput = form.querySelector('input[name="intent"]');
  if (!intentInput) {
    intentInput = document.createElement('input');
    intentInput.type = 'hidden';
    intentInput.name = 'intent';
    form.appendChild(intentInput);
  }

  const setIntent = (value) => {
    intentInput.value = value;
  };

  setIntent('send_project_details');

  document.querySelectorAll('.btn-primary, .nav-cta').forEach((button) => {
    button.addEventListener('click', () => setIntent('send_project_details'));
  });

  document.querySelectorAll('.btn-ghost').forEach((button) => {
    button.addEventListener('click', () => {
      setIntent('book_discovery_call');
      const message = form.querySelector('#message');
      if (message && !message.value.trim()) {
        message.value = 'Request: Book a discovery call.\nContext: ';
        message.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });
}
