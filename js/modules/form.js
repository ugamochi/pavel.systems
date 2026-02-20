const WEBHOOK_URL = 'https://n8n-service-uwaf.onrender.com/webhook/lead-form';
const REQUEST_TIMEOUT_MS = 10000;

export function initForm() {
  const leadForm = document.getElementById('leadForm');
  if (!leadForm || leadForm.dataset.formInit === 'true') return;
  leadForm.dataset.formInit = 'true';

  const btn = leadForm.querySelector('.form-submit');
  const btnText = btn?.querySelector('.btn-text');
  const btnLoading = btn?.querySelector('.btn-loading');
  const formStatus = leadForm.querySelector('.form-status');
  const emailInput = leadForm.querySelector('input[name="email"]');
  const honeypotInput = leadForm.querySelector('input[name="website"]');

  const setLoadingState = (isLoading) => {
    if (btn) btn.disabled = isLoading;
    if (btnText) btnText.style.display = isLoading ? 'none' : 'inline';
    if (btnLoading) btnLoading.style.display = isLoading ? 'inline' : 'none';
  };

  const setStatus = (status, messageHtml) => {
    if (!formStatus) return;
    formStatus.className = `form-status ${status}`;
    formStatus.innerHTML = messageHtml;
    formStatus.style.display = 'block';
  };

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (honeypotInput?.value?.trim()) {
      console.log('Bot detected via honeypot field');
      return;
    }

    if (formStatus) formStatus.style.display = 'none';
    setLoadingState(true);

    const rawFields = Object.fromEntries(new FormData(leadForm).entries());
    delete rawFields.website;

    const formData = {
      ...rawFields,
      name: (rawFields.name || '').trim(),
      email: (rawFields.email || '').trim(),
      company: (rawFields.company || '').trim(),
      intent: rawFields.intent || 'send_project_details',
      message: (rawFields.message || '').trim(),
      timestamp: new Date().toISOString(),
      source: window.location.pathname || 'ugamochi.systems',
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };

    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeoutId = controller
      ? window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
      : null;

    try {
      if (!WEBHOOK_URL || WEBHOOK_URL.startsWith('YOUR_')) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        throw new Error('n8n webhook not configured yet');
      }

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller?.signal
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      setStatus('success', '✓ Thanks! I\'ll review your request and reach out within 24 hours.');
      leadForm.reset();

      if (typeof window.plausible === 'function') {
        window.plausible('Lead Submitted', { props: { company: formData.company || 'none' } });
      }
    } catch (error) {
      console.error('Form submission error:', error);

      if (error instanceof Error && error.name === 'AbortError') {
        setStatus('error', '⚠️ Request timed out. Please try again or email me directly at <a href="mailto:ugamochi.pavel@gmail.com" style="color: var(--warm); text-decoration: underline;">ugamochi.pavel@gmail.com</a>');
      } else if (error instanceof Error && error.message.includes('webhook not configured')) {
        setStatus('error', '⚠️ Form backend not yet configured. Please contact me at <a href="mailto:ugamochi.pavel@gmail.com" style="color: var(--warm); text-decoration: underline;">ugamochi.pavel@gmail.com</a>');
      } else {
        setStatus('error', '⚠️ Submission failed. Please email me directly at <a href="mailto:ugamochi.pavel@gmail.com" style="color: var(--warm); text-decoration: underline;">ugamochi.pavel@gmail.com</a>');
      }
    } finally {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      setLoadingState(false);
    }
  });

  if (emailInput) {
    emailInput.addEventListener('blur', function () {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.value && !emailRegex.test(this.value)) {
        this.setCustomValidity('Please enter a valid email address');
        this.reportValidity();
      } else {
        this.setCustomValidity('');
      }
    });
  }
}
