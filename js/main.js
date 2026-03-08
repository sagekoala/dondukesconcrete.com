/* ============================================
   DON DUKES CONCRETE - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initGallery();
    initAboutTabs();
    initScrollAnimations();
    initContactButtons();
    initContactForm();
});

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.pageYOffset > 50);
    }, { passive: true });
}

/* ============================================
   Mobile Menu Toggle
   ============================================ */
function initMobileMenu() {
    const toggle = document.querySelector('.header__toggle');
    const nav = document.querySelector('.header__nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('header__toggle--active');
        nav.classList.toggle('header__nav--open');
    });

    nav.querySelectorAll('.header__link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('header__toggle--active');
            nav.classList.remove('header__nav--open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !nav.contains(e.target)) {
            toggle.classList.remove('header__toggle--active');
            nav.classList.remove('header__nav--open');
        }
    });
}

/* ============================================
   Image Gallery (Universal)
   ============================================ */
function initGallery() {
    const mainImage = document.querySelector('.gallery__main-image img');
    const thumbnails = document.querySelectorAll('.gallery__thumb');
    const prevBtn = document.querySelector('.gallery__btn--prev');
    const nextBtn = document.querySelector('.gallery__btn--next');
    const counter = document.querySelector('.gallery__counter');

    if (!mainImage || thumbnails.length === 0) return;

    let currentIndex = 0;
    const total = thumbnails.length;

    function updateCounter() {
        if (counter) counter.textContent = `${currentIndex + 1} / ${total}`;
    }

    function updateThumbnails() {
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('gallery__thumb--active', i === currentIndex);
        });
    }

    function changeImage(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        currentIndex = index;

        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = thumbnails[currentIndex].querySelector('img').src;
            mainImage.style.opacity = '1';
        }, 150);

        updateThumbnails();
        updateCounter();

        // Scroll active thumbnail into view
        thumbnails[currentIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    thumbnails.forEach((thumb, i) => {
        thumb.addEventListener('click', () => changeImage(i));
    });

    if (prevBtn) prevBtn.addEventListener('click', () => changeImage(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeImage(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changeImage(currentIndex - 1);
        else if (e.key === 'ArrowRight') changeImage(currentIndex + 1);
    });

    updateThumbnails();
    updateCounter();
}

/* ============================================
   About Page Tabs
   ============================================ */
function initAboutTabs() {
    const tabs = document.querySelectorAll('.about-nav__item');
    const sections = document.querySelectorAll('.about-section');
    if (tabs.length === 0 || sections.length === 0) return;

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('about-nav__item--active'));
            tab.classList.add('about-nav__item--active');

            sections.forEach(s => s.classList.remove('about-section--active'));
            if (sections[index]) sections[index].classList.add('about-section--active');
        });
    });
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll, .stagger-children');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
}

/* ============================================
   Contact Buttons (redirect to contact page)
   ============================================ */
function initContactButtons() {
    document.querySelectorAll('[data-contact]').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = './html/contact.html';
        });
    });

    document.querySelectorAll('[data-contact-subpage]').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = './contact.html';
        });
    });
}

/* ============================================
   Contact Form
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateForm(form)) return;

        // Build mailto link and open it
        const name    = form.name.value.trim();
        const email   = form.email.value.trim();
        const phone   = form.phone ? form.phone.value.trim() : '';
        const service = form.service ? form.service.value : '';
        const message = form.message.value.trim();

        const serviceLabel = service
            ? form.service.options[form.service.selectedIndex].text
            : 'Not specified';

        const body = [
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : null,
            `Service: ${serviceLabel}`,
            '',
            `Message:`,
            message,
        ].filter(line => line !== null).join('\n');

        const subject = encodeURIComponent(`Project Inquiry from ${name}`);
        const bodyEncoded = encodeURIComponent(body);

        window.location.href = `mailto:don@hondocrete.com?subject=${subject}&body=${bodyEncoded}`;

        // Show success message
        form.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
    });
}

function validateForm(form) {
    let valid = true;

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Reset
    [name, email, message].forEach(el => el && el.classList.remove('is-invalid'));
    [nameError, emailError, messageError].forEach(el => { if (el) el.textContent = ''; });

    if (!name || name.value.trim() === '') {
        markInvalid(name, nameError, 'Please enter your name.');
        valid = false;
    }

    if (!email || !isValidEmail(email.value.trim())) {
        markInvalid(email, emailError, 'Please enter a valid email address.');
        valid = false;
    }

    if (!message || message.value.trim() === '') {
        markInvalid(message, messageError, 'Please enter a message.');
        valid = false;
    }

    return valid;
}

function markInvalid(input, errorEl, msg) {
    if (input) input.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = msg;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
