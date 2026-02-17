import { initNav } from './modules/nav.js';
import { initTheme } from './modules/theme.js';
import { initForm } from './modules/form.js';
import { initServicePageEnhancements } from './modules/service-page-enhancements.js';
import { renderServicePage } from './modules/service-page-renderer.js';

renderServicePage();
initNav();
initTheme();
initForm();
initServicePageEnhancements();
