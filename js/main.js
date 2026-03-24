/* =====================================================
   AJAY CONSTRUCTIONS – Main JavaScript
   Handles: Navbar, Mobile Menu, Scroll Animations,
            Counters, Intersection Observer
   ===================================================== */

'use strict';

// =====================================================
// 1. NAVBAR – Scroll Effect & Sticky
// =====================================================
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
    if (window.scrollY > 60) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // run on load

// =====================================================
// 2. HAMBURGER MENU
// =====================================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-nav-link, .mobile-menu .btn-primary').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        mobileMenu?.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// =====================================================
// 3. SCROLL ANIMATIONS – Intersection Observer
// =====================================================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
});

// =====================================================
// 4. ANIMATED COUNTERS
// =====================================================
function animateCounter(el, target, duration = 2000) {
    const start = performance.now();
    const startVal = 0;

    function update(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startVal + (target - startVal) * eased);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            animateCounter(el, target);
            counterObserver.unobserve(el); // Only animate once
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => {
    counterObserver.observe(el);
});

// =====================================================
// 5. SMOOTH SCROLL for anchor links
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// =====================================================
// 6. MICRO-INTERACTIONS – Button Click Ripple
// =====================================================
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      background: rgba(255,255,255,0.15);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-anim 0.6s ease-out;
      pointer-events: none;
    `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
});

// Add ripple keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(3); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// =====================================================
// 8. NAVBAR ACTIVE STATE – highlight current page
// =====================================================
(function setActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === current || (current === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
})();
