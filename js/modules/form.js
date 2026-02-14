export function initForm() {
// ─── Lead Form Submission ───
const leadForm = document.getElementById('leadForm');
if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot field
    if (leadForm.website.value) {
      console.log('Bot detected via honeypot field');
      return; // Silent fail for bots
    }

    const btn = leadForm.querySelector('.form-submit');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    const formStatus = leadForm.querySelector('.form-status');

    // Show loading state
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    formStatus.style.display = 'none';

    // Prepare form data
    const formData = {
      name: leadForm.name.value.trim(),
      email: leadForm.email.value.trim(),
      company: leadForm.company.value.trim(),
      message: leadForm.message.value.trim(),
      timestamp: new Date().toISOString(),
      source: 'pavel.systems',
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };

    try {
      // Local n8n: http://localhost:5678/webhook/lead-form
      // Production: replace with your n8n cloud or public webhook URL
      const webhookUrl = 'http://localhost:5678/webhook/lead-form';

      if (!webhookUrl || webhookUrl.startsWith('YOUR_')) {
        console.log('Form data (dev mode):', formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('n8n webhook not configured yet');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Success
        formStatus.className = 'form-status success';
        formStatus.innerHTML = '✓ Thanks! I\'ll review your request and reach out within 24 hours.';
        formStatus.style.display = 'block';
        leadForm.reset();

        // Track conversion if analytics present
        if (typeof plausible !== 'undefined') {
          plausible('Lead Submitted', { props: { company: formData.company || 'none' } });
        }
      } else {
        throw new Error('Server returned ' + response.status);
      }
    } catch (error) {
      // Error handling
      console.error('Form submission error:', error);
      formStatus.className = 'form-status error';

      if (error.message.includes('webhook not configured')) {
        formStatus.innerHTML = '⚠️ Form backend not yet configured. Please contact me at <a href="mailto:ugamochi.pavel@gmail.com" style="color: var(--warm); text-decoration: underline;">ugamochi.pavel@gmail.com</a>';
      } else {
        formStatus.innerHTML = '⚠️ Submission failed. Please email me directly at <a href="mailto:ugamochi.pavel@gmail.com" style="color: var(--warm); text-decoration: underline;">ugamochi.pavel@gmail.com</a>';
      }

      formStatus.style.display = 'block';
    } finally {
      // Reset button state
      btn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  });

  // Basic client-side validation
  leadForm.email.addEventListener('blur', function() {
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
