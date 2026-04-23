document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            // Note: In a real commercial scenario, you'd use a service like Formspree or a custom backend.
            // For now, we simulate the submission and show success.
            e.preventDefault();
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Thank you for your message. Our team will get back to you shortly!');
                contactForm.reset();
            } catch (err) {
                alert('Sorry, there was an error. Please email us directly.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }

    // Cookie Consent Logic - GDPR/CCPA Compliant
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    // Check if cookies have been accepted or rejected
    const cookiePreference = localStorage.getItem('cookiesPreference');
    
    if (!cookiePreference) {
        // Show cookie consent banner if no preference set
        cookieConsent.style.display = 'flex';
    } else if (cookiePreference === 'accepted') {
        // Enable analytics if accepted
        enableAnalytics();
    }
    // If rejected, do nothing (analytics remain disabled)

    // Accept all cookies
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesPreference', 'accepted');
            cookieConsent.style.display = 'none';
            enableAnalytics();
        });
    }

    // Reject all cookies
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesPreference', 'rejected');
            cookieConsent.style.display = 'none';
            // Analytics remain disabled
        });
    }

    // Enable Google Analytics
    function enableAnalytics() {
        // Re-enable Google Analytics if it was previously blocked
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }

    // Scroll animation for elements
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add animations for existing elements
    document.querySelectorAll('.service-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Add animations for new content blocks (Product Cards and Team Members)
    document.querySelectorAll('.product-card, .team-member, .tech-category, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Statistics counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const statsSection = document.querySelector('.statistics-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = stat.textContent.trim();
            let isCurrency = target.includes('$');
            let isPercentage = target.includes('%');
            let isDownloads = target.includes('M+') || target.includes('M+');
            
            // Extract numeric value
            let numericTarget = target.replace(/[^0-9.]/g, '');
            if (numericTarget === '') return;
            
            const finalValue = parseFloat(numericTarget);
            let count = 0;
            const duration = 2000; // 2 seconds
            const increment = finalValue / (duration / 16); // 60fps approx
            
            const updateCounter = () => {
                count += increment;
                if (count >= finalValue) {
                    stat.textContent = target;
                } else {
                    let displayValue;
                    if (isCurrency) {
                        displayValue = '$' + Math.ceil(count).toLocaleString() + '+';
                    } else if (isPercentage) {
                        displayValue = Math.ceil(count) + '%';
                    } else if (isDownloads && finalValue >= 1000000) {
                        displayValue = Math.ceil(count / 1000000) + 'M+';
                    } else {
                        displayValue = Math.ceil(count) + '+';
                    }
                    stat.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                }
            };
            
            updateCounter();
        });
    }
});