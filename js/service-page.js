import { initNav } from './modules/nav.js';
import { initTheme } from './modules/theme.js';
import { initForm } from './modules/form.js';
import { initFaq } from './modules/faq.js';
import { initServicePageEnhancements } from './modules/service-page-enhancements.js';
import { initServicePageAnimations } from './modules/service-page-animations.js';
import { renderServicePage } from './modules/service-page-renderer.js';

function safeInit(name, initializer) {
  try {
    initializer();
  } catch (error) {
    console.error(`[init] ${name} failed`, error);
  }
}

safeInit('service-renderer', renderServicePage);
safeInit('nav', initNav);
safeInit('theme', initTheme);
safeInit('form', initForm);
safeInit('faq', initFaq);
safeInit('service-enhancements', initServicePageEnhancements);
safeInit('service-animations', initServicePageAnimations);
