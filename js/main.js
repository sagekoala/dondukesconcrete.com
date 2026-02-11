/* ============================================
   STAR CITY SEALANTS - Main JavaScript
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initGallery();
    initAboutTabs();
    initScrollAnimations();
    initContactButtons();
});

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        lastScroll = currentScroll;
    });
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
    
    // Close menu when clicking a link
    const navLinks = nav.querySelectorAll('.header__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('header__toggle--active');
            nav.classList.remove('header__nav--open');
        });
    });
    
    // Close menu when clicking outside
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
    const totalImages = thumbnails.length;
    
    // Update counter display
    function updateCounter() {
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${totalImages}`;
        }
    }
    
    // Update active thumbnail
    function updateThumbnails() {
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('gallery__thumb--active', index === currentIndex);
        });
    }
    
    // Change main image with fade effect
    function changeImage(index) {
        if (index < 0) index = totalImages - 1;
        if (index >= totalImages) index = 0;
        
        currentIndex = index;
        
        // Fade out
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
            mainImage.src = thumbnails[currentIndex].querySelector('img').src;
            mainImage.style.opacity = '1';
        }, 150);
        
        updateThumbnails();
        updateCounter();
    }
    
    // Thumbnail click
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            changeImage(index);
        });
    });
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            changeImage(currentIndex - 1);
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            changeImage(currentIndex + 1);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            changeImage(currentIndex + 1);
        }
    });
    
    // Initialize
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
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('about-nav__item--active'));
            // Add active to clicked tab
            tab.classList.add('about-nav__item--active');
            
            // Hide all sections
            sections.forEach(s => s.classList.remove('about-section--active'));
            // Show corresponding section
            if (sections[index]) {
                sections[index].classList.add('about-section--active');
            }
        });
    });
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .stagger-children');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   Contact Buttons
   ============================================ */
function initContactButtons() {
    const contactBtns = document.querySelectorAll('[data-contact]');
    
    contactBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = './html/contact.html';
        });
    });
    
    // Also handle buttons on subpages
    const subpageContactBtns = document.querySelectorAll('[data-contact-subpage]');
    subpageContactBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = './contact.html';
        });
    });
}

/* ============================================
   Utility: Debounce function
   ============================================ */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
