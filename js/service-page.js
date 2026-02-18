import { initNav } from './modules/nav.js';
import { initTheme } from './modules/theme.js';
import { initForm } from './modules/form.js';
import { initFaq } from './modules/faq.js';
import { initServicePageEnhancements } from './modules/service-page-enhancements.js';
import { initServicePageAnimations } from './modules/service-page-animations.js';
import { renderServicePage } from './modules/service-page-renderer.js';

renderServicePage();
initNav();
initTheme();
initForm();
initFaq();
initServicePageEnhancements();
initServicePageAnimations();
