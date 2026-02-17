export function initNav() {
// Nav scroll effect
const nav = document.getElementById('nav');
if (!nav) return;
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const navLinks = document.getElementById('navLinks');
      if (navLinks) navLinks.classList.remove('open');
    }
  });
});
}
