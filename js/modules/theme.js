export function initTheme() {
// Theme toggle
const toggle = document.getElementById('themeToggle');
if (!toggle) return;
toggle.addEventListener('click', () => {
  var isLight = document.documentElement.getAttribute('data-theme') === 'light';
  var next = isLight ? 'dark' : 'light';
  if (next === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem('theme', next);
});
}
