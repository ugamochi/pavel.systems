import { initNav } from './modules/nav.js';
import { initTheme } from './modules/theme.js';
import { initAnimations } from './modules/animations.js';
import { initForm } from './modules/form.js';
import { initServiceCards } from './modules/service-cards.js';
import { initFaq } from './modules/faq.js';

function safeInit(name, initializer) {
  try {
    initializer();
  } catch (error) {
    console.error(`[init] ${name} failed`, error);
  }
}

safeInit('nav', initNav);
safeInit('theme', initTheme);
safeInit('form', initForm);
safeInit('animations', initAnimations);
safeInit('service-cards', initServiceCards);
safeInit('faq', initFaq);
