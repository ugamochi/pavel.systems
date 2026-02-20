import { initNav } from './modules/nav.js';
import { initTheme } from './modules/theme.js';
import { initForm } from './modules/form.js';
import { getServicePage } from './data/service-pages.js';

function safeInit(name, initializer) {
  try {
    initializer();
  } catch (error) {
    console.error(`[init] ${name} failed`, error);
  }
}

safeInit('nav', initNav);
safeInit('theme', initTheme);
safeInit('booking-context', initBookingContext);
safeInit('form', initForm);

function initBookingContext() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('service') || '';
  const service = getServicePage(slug);

  const serviceName = service ? service.title : 'General automation consulting';
  const title = document.getElementById('bookingServiceName');
  const context = document.getElementById('bookingContext');
  const message = document.getElementById('message');
  const hiddenService = document.getElementById('serviceRequested');

  if (title) title.textContent = serviceName;
  if (context) {
    context.textContent = service
      ? `Discovery call context prefilled for ${service.title}.`
      : 'No specific service selected. Share your scope and priorities.';
  }

  if (hiddenService) hiddenService.value = serviceName;
  if (message && !message.value.trim()) {
    message.value = `Service focus: ${serviceName}\nPreferred timezone: \nPreferred 2-3 time windows: \nCurrent stack and scope: `;
  }
}
