document.addEventListener('DOMContentLoaded', () => {
    // Mobile Nav Toggle
    const menuToggle = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // Dynamic Graph Animation Observer (Re-triggers on scroll into view)
    const graphObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-animating');
            } else {
                entry.target.classList.remove('is-animating');
            }
        });
    }, { threshold: 0.15 });

    const graphAnim = document.querySelector('.pain-points-anim');
    if (graphAnim) {
        graphObserver.observe(graphAnim);
    }

    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = header.classList.contains('active');

            // Close all
            accordionHeaders.forEach(h => {
                h.classList.remove('active');
                h.setAttribute('aria-expanded', 'false');
                h.nextElementSibling.style.maxHeight = null;
            });

            // Open clicked if it wasn't open
            if (!isOpen) {
                header.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.classList.remove('active');
                    }
                }
            }
        });
    });

    // Network Canvas Animation (Synchronization / Logic representation)
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const initCanvas = () => {
            width = canvas.width = window.innerWidth;
            // Height covers the hero section
            const heroSection = document.querySelector('.hero');
            height = canvas.height = heroSection ? heroSection.offsetHeight : window.innerHeight;
            particles = [];
            
            // Adjust particle count based on screen width
            const particleCount = Math.min(Math.floor(width / 30), 60); 
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: Math.random() * 1.5 + 1
                });
            }
        };

        const animateCanvas = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(244, 162, 97, 0.6)';
            ctx.lineWidth = 0.5;

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges smoothly
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                // Connect to nearby nodes to form the "Logic / Sync" network
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) { 
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(244, 162, 97, ${0.3 * (1 - dist / 150)})`; 
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animateCanvas);
        };

        // Initialize and bind resize
        initCanvas();
        animateCanvas();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                initCanvas();
            }, 200);
        });
    }

    // Preloader fade out when full page load is complete
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 600); // Allow brief presentation of the brand logo before fading
        }
    });

    // Mobile FAB Scroll Reveal
    const mobileFab = document.getElementById('mobileFab');
    if (mobileFab) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) { // Visible after scrolling past half of hero
                mobileFab.classList.add('visible');
            } else {
                mobileFab.classList.remove('visible');
            }
        });
    }

    // Contact Mobile Accordion Toggle
    const accordionBtn = document.querySelector('.mobile-accordion-btn');
    if (accordionBtn) {
        accordionBtn.addEventListener('click', () => {
            accordionBtn.closest('.mobile-accordion-wrapper').classList.toggle('is-open');
        });
    }
});
