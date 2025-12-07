// ========================================
// HS COURIER - JAVASCRIPT
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');

    mobileToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close mobile nav when clicking on a link
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // ========================================
    // HERO SLIDER
    // ========================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.hero-nav-btn.prev');
    const nextBtn = document.querySelector('.hero-nav-btn.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Handle index bounds
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });

        currentSlide = index;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Navigation buttons
    nextBtn.addEventListener('click', function () {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', function () {
        prevSlide();
        resetInterval();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            showSlide(index);
            resetInterval();
        });
    });

    // Auto slide
    function startInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    startInterval();

    // ========================================
    // FAQ ACCORDION
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);

            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ========================================
    // HEADER SHADOW ON SCROLL
    // ========================================
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
        }
    });

    // ========================================
    // CONTACT FORM
    // ========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Create WhatsApp message
            const whatsappMessage = `Hola, soy ${name}.%0A%0A` +
                `Email: ${email}%0A` +
                `Teléfono: ${phone}%0A` +
                `Asunto: ${subject}%0A%0A` +
                `Mensaje: ${message}`;

            // Open WhatsApp
            window.open(`https://wa.me/51903365398?text=${whatsappMessage}`, '_blank');

            // Clear form
            contactForm.reset();

            // Show success message
            alert('¡Gracias por contactarnos! Te redirigimos a WhatsApp.');
        });
    }

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    const animateElements = document.querySelectorAll('.service-card, .why-card, .step-card, .about-feature, .faq-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // ========================================
    // COUNTER ANIMATION
    // ========================================
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 30);
    }

    const experienceNumber = document.querySelector('.experience-number');
    if (experienceNumber) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(experienceNumber, 4099);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(experienceNumber);
    }

    // ========================================
    // SHIPPING CALCULATOR - HS COURIER LOGIC
    // ========================================
    const calcBtn = document.getElementById('calcBtn');
    const productCostInput = document.getElementById('productCost');
    const weightInput = document.getElementById('weight');
    const zoneSelect = document.getElementById('zone');
    const calcResult = document.getElementById('calcResult');
    const resultPrice = document.getElementById('resultPrice');
    const fletePrice = document.getElementById('fletePrice');
    const adminPrice = document.getElementById('adminPrice');
    const deliveryPrice = document.getElementById('deliveryPrice');
    const deliveryRow = document.getElementById('deliveryRow');
    const resultMessage = document.getElementById('resultMessage');

    if (calcBtn && weightInput && zoneSelect) {
        calcBtn.addEventListener('click', function () {
            const productCost = parseFloat(productCostInput.value) || 0;
            const weight = parseFloat(weightInput.value);
            const zone = zoneSelect.value;

            if (isNaN(weight) || weight <= 0) {
                alert('Por favor, ingresa un peso válido.');
                return;
            }

            // HS Courier Pricing Logic:
            // Flete Miami -> Lima: $10 USD per kg
            // Costo Administrativo: $9 USD (fixed)
            // Delivery Lima/Callao: $7 USD
            // Provincia: Message about agency payment
            // Sin Delivery: Message about pickup
            // Tax: Products over $200 USD pay SUNAT taxes

            const FLETE_PER_KG = 10;
            const ADMIN_COST = 9;
            const DELIVERY_LIMA_CALLAO = 7;
            const TAX_THRESHOLD = 200;

            // Calculate Flete
            const flete = weight * FLETE_PER_KG;

            // Calculate total based on zone
            let delivery = 0;
            let total = 0;
            let showDeliveryRow = true;
            let messages = [];

            switch (zone) {
                case 'lima':
                case 'callao':
                    delivery = DELIVERY_LIMA_CALLAO;
                    total = flete + ADMIN_COST + delivery;
                    showDeliveryRow = true;
                    break;
                case 'provincia':
                    delivery = 0;
                    total = flete + ADMIN_COST;
                    showDeliveryRow = false;
                    messages.push({
                        type: 'info',
                        text: '<i class="fas fa-info-circle"></i> El costo de envío a provincia lo pagará en la agencia de transporte de su preferencia (modalidad "pago a destino").'
                    });
                    break;
                case 'sindelivery':
                    delivery = 0;
                    total = flete + ADMIN_COST;
                    showDeliveryRow = false;
                    messages.push({
                        type: 'warning',
                        text: '<i class="fas fa-warehouse"></i> Deberá recoger su paquete en nuestro almacén: Calle Alas Peruanas #128, Urb. Santa Luzmila, Comas.'
                    });
                    break;
            }

            // Check if product exceeds tax threshold
            if (productCost > TAX_THRESHOLD) {
                messages.push({
                    type: 'tax',
                    text: '<i class="fas fa-exclamation-triangle"></i> <strong>Aviso de Impuestos:</strong> Tu compra supera los $200 USD. Deberás pagar impuestos a la SUNAT. El monto aproximado es el 20% del valor que excede los $200.'
                });
            }

            // Update UI
            fletePrice.textContent = '$' + flete.toFixed(2);
            adminPrice.textContent = '$' + ADMIN_COST.toFixed(2);

            if (showDeliveryRow) {
                deliveryRow.style.display = 'flex';
                deliveryPrice.textContent = '$' + delivery.toFixed(2);
            } else {
                deliveryRow.style.display = 'none';
            }

            resultPrice.textContent = '$' + total.toFixed(2);

            // Show messages
            if (messages.length > 0) {
                let messagesHTML = messages.map(msg =>
                    `<div class="result-message ${msg.type}">${msg.text}</div>`
                ).join('');
                resultMessage.innerHTML = messagesHTML;
                resultMessage.style.display = 'block';
            } else {
                resultMessage.innerHTML = '';
                resultMessage.style.display = 'none';
            }

            // Show result - remove and re-add animation class to allow repeated animations
            calcResult.style.display = 'block';
            calcResult.classList.remove('animate-fade');
            void calcResult.offsetWidth; // Trigger reflow
            calcResult.classList.add('animate-fade');
        });

        // Also calculate on Enter key
        weightInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                calcBtn.click();
            }
        });

        productCostInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                calcBtn.click();
            }
        });
    }


    // ========================================
    // STORE CATEGORY TABS
    // ========================================
    const storeTabs = document.querySelectorAll('.store-tab');
    const storeCategories = document.querySelectorAll('.store-category');

    if (storeTabs.length > 0) {
        storeTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const category = this.getAttribute('data-category');

                // Update active tab
                storeTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Show corresponding category
                storeCategories.forEach(cat => {
                    cat.classList.remove('active');
                    if (cat.getAttribute('data-category') === category) {
                        cat.classList.add('active');
                    }
                });
            });
        });
    }

    // ========================================
    // COPY MIAMI ADDRESS
    // ========================================
    const copyAddressBtn = document.getElementById('copyAddress');

    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', function () {
            const address = '7270 NW 35th Terrace, Suite 101 Miami, FL. 33122';

            navigator.clipboard.writeText(address).then(() => {
                // Change button text temporarily
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                this.style.background = 'var(--accent)';

                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                }, 2000);
            }).catch(err => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = address;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';

                setTimeout(() => {
                    this.innerHTML = originalHTML;
                }, 2000);
            });
        });
    }

    // Add store cards to scroll animations
    const storeCards = document.querySelectorAll('.store-card, .pricing-card');
    storeCards.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // ========================================
    // WHATSAPP FLOATING WIDGET
    // ========================================
    const whatsappBtn = document.getElementById('whatsappBtn');
    const whatsappPopup = document.getElementById('whatsappPopup');
    const whatsappClose = document.getElementById('whatsappClose');

    if (whatsappBtn && whatsappPopup) {
        // Toggle popup on button click
        whatsappBtn.addEventListener('click', function () {
            whatsappPopup.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close popup on close button click
        if (whatsappClose) {
            whatsappClose.addEventListener('click', function (e) {
                e.stopPropagation();
                whatsappPopup.classList.remove('active');
                whatsappBtn.classList.remove('active');
            });
        }

        // Close popup when clicking outside
        document.addEventListener('click', function (e) {
            if (!whatsappBtn.contains(e.target) && !whatsappPopup.contains(e.target)) {
                whatsappPopup.classList.remove('active');
                whatsappBtn.classList.remove('active');
            }
        });
    }

});
