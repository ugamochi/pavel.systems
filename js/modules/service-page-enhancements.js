export function initServicePageEnhancements() {
  initSectionNavHighlight();
  initContactIntentCapture();
}

function initSectionNavHighlight() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!links.length) return;

  const sectionIds = ['problem', 'process', 'packages', 'faq'];
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

  document.querySelectorAll('[data-intent], .btn-primary, .nav-cta, .btn-ghost').forEach((button) => {
    button.addEventListener('click', () => {
      const intent = button.dataset.intent
        || (button.classList.contains('btn-ghost') ? 'book_discovery_call' : 'send_project_details');
      setIntent(intent);

      const href = button.getAttribute('href');
      if (intent === 'book_discovery_call' && href === '#contact') {
        const message = form.querySelector('#message');
        if (message && !message.value.trim()) {
          message.value = 'Request: Book a discovery call.\nContext: ';
          message.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    });
  });
}
