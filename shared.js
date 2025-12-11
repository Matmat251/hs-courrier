/* ============================================
   HSSC GROUP - Shared JavaScript
   Funcionalidades compartidas para todas las páginas
   ============================================ */

// ============================================
// Inicialización cuando el DOM está listo
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    initMobileNavigation();
    initHeaderScroll();
    initSmoothScroll();
    highlightCurrentPage();
    initStars();
    initPageHeaderEffects();
    initFAQ();
    initScrollReveal();
    initStoreTabs();
});

// ============================================
// Store Category Tabs (tiendas.html)
// ============================================
function initStoreTabs() {
    const tabs = document.querySelectorAll('.store-tab');
    const categories = document.querySelectorAll('.store-category');

    if (tabs.length === 0 || categories.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');

            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            tab.classList.add('active');

            // Hide all categories
            categories.forEach(cat => {
                cat.classList.remove('active');
                cat.style.display = 'none';
            });

            // Show selected category with animation
            const selectedCategory = document.querySelector(`.store-category[data-category="${category}"]`);
            if (selectedCategory) {
                selectedCategory.classList.add('active');
                selectedCategory.style.display = 'grid';

                // Animate store cards with staggered delay
                const cards = selectedCategory.querySelectorAll('.store-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px) scale(0.9)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, index * 80); // 80ms delay between each card
                });
            }
        });
    });

    // Initialize - show only the active category
    categories.forEach(cat => {
        if (!cat.classList.contains('active')) {
            cat.style.display = 'none';
        } else {
            cat.style.display = 'grid';
        }
    });
}

// ============================================
// Scroll Reveal Animation System
// ============================================
function initScrollReveal() {
    // Elements to animate on scroll - comprehensive list
    const revealSelectors = [
        // Headers and sections
        '.section-header',
        'section > .container > *:not(.stores-grid):not(.store-category)',

        // Cards and items
        '.service-card',
        '.why-card',
        '.step-card',
        '.about-feature',
        '.faq-item',
        '.contact-card',
        '.contact-form',
        '.footer-col',
        '.store-card',
        '.team-member',
        '.stat-item',
        '.feature-card',
        '.benefit-item',
        '.timeline-item',
        '.gallery-item',
        '.testimonial-card',
        '.pricing-card',
        '.planet-service-item',

        // Content sections
        '.hero-content',
        '.hero-image',
        '.about-content',
        '.about-image',
        '.about-text',
        '.contact-info',
        '.map-container',
        '.miami-address-box',
        '.stores-tabs',

        // Grids and containers
        '.services-grid > *',
        '.why-grid > *',
        '.steps-grid > *',
        '.faq-grid > *',
        '.contact-grid > *',
        '.about-features > *'
    ];

    // Add reveal class to all elements
    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                // Add staggered delay for items in a group
                el.style.transitionDelay = (index % 4) * 0.1 + 's';
            }
        });
    });

    // Get all elements with reveal class
    const reveals = document.querySelectorAll('.reveal');

    if (reveals.length === 0) return;

    // Intersection Observer for better performance
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing after revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
}

// ============================================
// FAQ Accordion Functionality
// ============================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');

        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-minus');
                        otherIcon.classList.add('fa-plus');
                    }
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                if (icon) {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                if (icon) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                }
            }
        });
    });
}

// ============================================
// Interactive Page Header Effects
// ============================================
function initPageHeaderEffects() {
    const pageHeader = document.querySelector('.page-header');
    if (!pageHeader) return;

    // Create gradient background
    const gradientBg = document.createElement('div');
    gradientBg.className = 'gradient-bg';
    pageHeader.insertBefore(gradientBg, pageHeader.firstChild);

    // Create cursor spotlight
    const spotlight = document.createElement('div');
    spotlight.className = 'cursor-spotlight';
    pageHeader.appendChild(spotlight);

    // Create left blob
    const blobLeft = document.createElement('div');
    blobLeft.className = 'blob-left';
    pageHeader.appendChild(blobLeft);

    // Create floating particles
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particlesContainer.appendChild(particle);
    }
    pageHeader.appendChild(particlesContainer);

    // Mouse tracking for spotlight effect
    pageHeader.addEventListener('mousemove', (e) => {
        const rect = pageHeader.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        spotlight.style.left = x + 'px';
        spotlight.style.top = y + 'px';
        spotlight.style.opacity = '1';
    });

    pageHeader.addEventListener('mouseleave', () => {
        spotlight.style.opacity = '0';
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const headerHeight = pageHeader.offsetHeight;

        if (scrolled < headerHeight) {
            const parallaxValue = scrolled * 0.3;
            gradientBg.style.transform = `translateY(${parallaxValue}px)`;
        }
    });
}

// ============================================
// Navegación Móvil
// ============================================
function initMobileNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }
}

// ============================================
// Header Scroll Effect
// ============================================
function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// ============================================
// Smooth Scroll para enlaces internos
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Solo procesar si hay un ID válido
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ============================================
// Resaltar página actual en navegación
// ============================================
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Limpiar clases previas
        link.classList.remove('current-page', 'active');

        // Marcar la página actual
        if (href === pageName ||
            (pageName === '' && href === 'index.html') ||
            (pageName === 'index.html' && href === 'index.html')) {
            link.classList.add('current-page');
        }
    });
}

// ============================================
// Generar estrellas de fondo
// ============================================
function initStars() {
    const starsContainer = document.querySelector('.stars-container');

    if (starsContainer) {
        const numberOfStars = 50;

        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (2 + Math.random() * 2) + 's';
            starsContainer.appendChild(star);
        }
    }
}

// ============================================
// Animación del contador de números
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        // Iniciar cuando el elemento sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// ============================================
// Efecto de aparición al scroll
// ============================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// ============================================
// Utilidades exportadas
// ============================================
window.HSSCUtils = {
    animateCounters,
    initScrollReveal,

    // Copiar texto al portapapeles
    copyToClipboard: function (text, callback) {
        navigator.clipboard.writeText(text).then(() => {
            if (callback) callback(true);
        }).catch(() => {
            if (callback) callback(false);
        });
    },

    // Formatear precio
    formatPrice: function (amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
};
