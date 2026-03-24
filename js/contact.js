/* =====================================================
   AJAY CONSTRUCTIONS – Contact Form Handler
   Formspree Integration + Validation
   ===================================================== */

'use strict';

(function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnArrow = document.getElementById('btn-arrow');
    const btnSpinner = document.getElementById('btn-spinner');

    // ---- Validation ----
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    function setError(inputEl, errorId) {
        const group = inputEl.closest('.form-group');
        group?.classList.add('has-error');
    }

    function clearError(inputEl) {
        const group = inputEl.closest('.form-group');
        group?.classList.remove('has-error');
    }

    function validateForm() {
        let valid = true;

        // Name
        if (!nameInput?.value.trim()) {
            setError(nameInput, 'name-error');
            valid = false;
        } else {
            clearError(nameInput);
        }

        // Email
        if (!emailInput?.value.trim() || !validateEmail(emailInput.value)) {
            setError(emailInput, 'email-error');
            valid = false;
        } else {
            clearError(emailInput);
        }

        // Message
        if (!messageInput?.value.trim()) {
            setError(messageInput, 'message-error');
            valid = false;
        } else {
            clearError(messageInput);
        }

        return valid;
    }

    // Live validation
    [nameInput, emailInput, messageInput].forEach(input => {
        input?.addEventListener('input', () => clearError(input));
        input?.addEventListener('blur', () => {
            if (input === emailInput && input.value && !validateEmail(input.value)) {
                setError(input, 'email-error');
            } else if (!input.value.trim()) {
                setError(input, '');
            }
        });
    });

    // ---- Submit Handler ----
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Show loading state
        btnText.textContent = 'Sending…';
        btnArrow?.classList.add('hidden');
        btnSpinner?.classList.remove('hidden');
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.8';
        submitBtn.style.cursor = 'not-allowed';

        const formData = new FormData(form);
        const action = form.getAttribute('action');

        try {
            // Check if we have a real Formspree ID
            if (action.includes('YOUR_FORM_ID')) {
                // Demo mode: simulate success after 1.5 seconds
                await new Promise(resolve => setTimeout(resolve, 1500));
                showSuccess();
                return;
            }

            const response = await fetch(action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showSuccess();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Form error:', error);
            // Reset button
            btnText.textContent = 'Send Message';
            btnArrow?.classList.remove('hidden');
            btnSpinner?.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            submitBtn.style.cursor = '';

            // Show error notification
            showNotification('Something went wrong. Please try again or email us directly.', 'error');
        }
    });

    function showSuccess() {
        form.style.opacity = '0';
        form.style.transform = 'scale(0.95)';
        form.style.transition = 'all 0.4s ease';

        setTimeout(() => {
            form.classList.add('hidden');
            successMessage?.classList.remove('hidden');
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'scale(0.95)';
            successMessage.style.transition = 'all 0.4s ease';

            requestAnimationFrame(() => {
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'scale(1)';
            });
        }, 400);
    }

    // Expose resetForm globally
    window.resetForm = function () {
        form.reset();
        form.classList.remove('hidden');
        form.style.opacity = '1';
        form.style.transform = 'scale(1)';

        successMessage?.classList.add('hidden');

        btnText.textContent = 'Send Message';
        btnArrow?.classList.remove('hidden');
        btnSpinner?.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.cursor = '';

        // Clear all errors
        document.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
    };

    // ---- Toast Notification ----
    function showNotification(msg, type = 'error') {
        const existing = document.getElementById('form-notification');
        existing?.remove();

        const toast = document.createElement('div');
        toast.id = 'form-notification';
        toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      right: 32px;
      background: ${type === 'error' ? '#ef444420' : '#10b98120'};
      border: 1px solid ${type === 'error' ? '#ef4444' : '#10b981'};
      color: ${type === 'error' ? '#ef4444' : '#10b981'};
      padding: 1rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.9rem;
      max-width: 320px;
      z-index: 9999;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      animation: slideInRight 0.4s ease;
    `;
        toast.textContent = msg;

        const toastStyle = document.createElement('style');
        toastStyle.textContent = `@keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }`;
        document.head.appendChild(toastStyle);

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.4s ease reverse';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ---- Input Focus Animations ----
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('focus', function () {
            const wrapper = this.closest('.input-wrapper');
            const icon = wrapper?.querySelector('.input-icon');
            if (icon) icon.style.color = 'var(--neon, #FF6A00)';
        });

        input.addEventListener('blur', function () {
            const wrapper = this.closest('.input-wrapper');
            const icon = wrapper?.querySelector('.input-icon');
            if (icon && !this.value) icon.style.color = '#4b5563';
        });
    });

})();
