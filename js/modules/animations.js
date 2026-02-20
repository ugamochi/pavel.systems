export function initAnimations() {
// ─── GSAP Animations (respects reduced motion) ───
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

if (!prefersReduced && hasGsap) {
  window.gsap.registerPlugin(window.ScrollTrigger);

  // Kill CSS reveal system — GSAP takes over
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('reveal');
    el.style.opacity = 1;
    el.style.transform = 'none';
  });

  // ── 1. Hero entrance: staggered fade-in ──
  const heroTl = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-tag', { opacity: 0, y: 20, duration: 0.6 })
    .from('.hero h1', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
    .from('.hero-sub', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
    .from('.hero-actions', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
    .from('.hero-proof', { opacity: 0, y: 16, duration: 0.5 }, '-=0.2')
    .call(() => document.querySelector('.hero h1 em')?.classList.add('underlined'));

  // ── 2. Hero glow: subtle parallax on scroll ──
  window.gsap.to('.hero-glow', {
    y: -120,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  window.gsap.to('.hero-grid-bg', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: '60% top',
      end: 'bottom top',
      scrub: true
    }
  });

  // ── 3. Section titles: slide in from left with accent line ──
  window.gsap.utils.toArray('.section-label').forEach(label => {
    window.gsap.from(label, {
      x: -30,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: { trigger: label, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  window.gsap.utils.toArray('.section-title').forEach(title => {
    window.gsap.from(title, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: title, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  window.gsap.utils.toArray('.section-desc').forEach(desc => {
    window.gsap.from(desc, {
      y: 16,
      opacity: 0,
      duration: 0.5,
      delay: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: desc, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  // ── 4. Cards: staggered entrance per grid ──
  const cardGrids = [
    '.problem-grid',
    '.services-grid',
    '.audience-grid',
    '.results-grid',
    '.testimonials-grid'
  ];

  cardGrids.forEach(selector => {
    const grid = document.querySelector(selector);
    if (!grid) return;
    window.gsap.from(grid.children, {
      y: 40,
      opacity: 0,
      duration: 0.55,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: grid, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // ── 5. Process steps: stagger with slight scale ──
  window.gsap.from('.process-step', {
    y: 30,
    opacity: 0,
    scale: 0.97,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.process-steps', start: 'top 85%', toggleActions: 'play none none none' }
  });

  // ── 6. Framework stack: layers cascade down ──
  window.gsap.from('.fw-layer', {
    x: -24,
    opacity: 0,
    duration: 0.45,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.framework-visual', start: 'top 80%', toggleActions: 'play none none none' }
  });

  window.gsap.from('.framework-text > *', {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.framework-text', start: 'top 80%', toggleActions: 'play none none none' }
  });

  // ── 7. Result numbers: count-up animation ──
  window.gsap.utils.toArray('.result-num').forEach(num => {
    const text = num.textContent.trim();
    // Parse the numeric part
    const match = text.match(/^([<>]?)(\d+)(.*)$/);
    if (!match) return;

    const prefix = match[1];
    const target = parseInt(match[2]);
    const suffix = match[3];
    const obj = { val: 0 };

    window.gsap.to(obj, {
      val: target,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: num, start: 'top 90%', toggleActions: 'play none none none' },
      onUpdate: () => {
        num.textContent = prefix + Math.round(obj.val) + suffix;
      }
    });
  });

  // ── 8. FAQ items: subtle stagger ──
  window.gsap.utils.toArray('.faq-list').forEach(list => {
    window.gsap.from(list.querySelectorAll('.faq-item'), {
      y: 16,
      opacity: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: { trigger: list, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // ── 9. CTA section: gentle scale-up ──
  window.gsap.from('.cta-content', {
    y: 40,
    opacity: 0,
    scale: 0.98,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-section', start: 'top 80%', toggleActions: 'play none none none' }
  });

  // ── 10. CTA glow: parallax drift ──
  window.gsap.to('.cta-glow', {
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  // ── 11. Service card hover: magnetic tilt + cursor glow ──
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;

      // Cursor-tracking glow position
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');

      // Subtle tilt
      window.gsap.to(card, {
        rotateY: px * 3,
        rotateX: -py * 3,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800
      });
    });

    card.addEventListener('mouseleave', () => {
      window.gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });

  // ── 12. Magnetic CTA buttons ──
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      window.gsap.to(btn, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      window.gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });

  // ── 13. Hero em underline reveal ──
  setTimeout(() => {
    document.querySelectorAll('.hero h1 em').forEach(em => em.classList.add('underlined'));
  }, 1200);

  // ── 14. Accent text shimmer on section titles ──
  window.gsap.utils.toArray('.section-title em').forEach(em => {
    window.gsap.fromTo(em, {
      backgroundImage: 'linear-gradient(90deg, var(--accent) 0%, rgba(67,55,163,0.5) 50%, var(--accent) 100%)',
      backgroundSize: '200% 100%',
      backgroundClip: 'text',
      webkitBackgroundClip: 'text',
      backgroundPosition: '100% 0'
    }, {
      backgroundPosition: '0% 0',
      duration: 1.2,
      ease: 'power1.inOut',
      scrollTrigger: { trigger: em, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

  // ── 15. Problem card icon pulse on hover ──
  document.querySelectorAll('.problem-card').forEach(card => {
    const icon = card.querySelector('.problem-icon');
    if (!icon) return;
    card.addEventListener('mouseenter', () => {
      window.gsap.fromTo(icon, { scale: 1 }, { scale: 1.1, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 });
    });
  });

} else {
  // Reduced motion: make everything visible instantly
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
}
}
