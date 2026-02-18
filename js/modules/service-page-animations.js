export function initServicePageAnimations() {
  const sections = Array.from(document.querySelectorAll('.service-anim'));
  if (!sections.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  document.body.classList.add('service-motion-enabled');

  sections.forEach((section, index) => {
    const delay = Math.min(index * 60, 240);
    section.style.setProperty('--service-anim-delay', `${delay}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  sections.forEach((section) => observer.observe(section));
}
