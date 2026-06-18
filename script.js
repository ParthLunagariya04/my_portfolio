/* ----------------------------------------------------------------
   DYNAMIC INTERACTIVE FEATURES & ANIMATIONS
   Owner: Parth Lunagariya
   Year: 2026
   ---------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dynamic Title Rotator (Typewriter Effect) ---
    const rotatorElement = document.getElementById('rotator-text');
    const roles = [
        "Flutter Developer",
        "Node.js Developer",
        "Full-Stack Developer",
        "Software Development Engineer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function rotateText() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Deleting text
            rotatorElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deletes faster
        } else {
            // Typing text
            rotatorElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle typing state changes
        if (!isDeleting && charIndex === currentRole.length) {
            // Full string typed, pause before deleting
            isDeleting = true;
            typingSpeed = 2000; // Pause duration
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length; // Move to next title
            typingSpeed = 500; // Pause before start typing
        }

        setTimeout(rotateText, typingSpeed);
    }

    // Start text rotation
    if (rotatorElement) {
        setTimeout(rotateText, 1000);
    }


    // --- 2. Mobile Navigation Toggle ---
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', () => {
            toggleBtn.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleBtn.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }


    // --- 3. Scroll Progress Indicator & Sticky Navbar ---
    const header = document.getElementById('header');
    const progressBar = document.getElementById('scroll-progress-bar');

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${scrolled}%`;
        }

        // Add class to header when scrolled
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Active Nav Link highlight on Scroll
        highlightNavLink();
    });

    // Highlight Active Nav Link based on visible sections
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav a[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav a[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    }


    // --- 4. Scroll Reveal (Fade-In Intersection Observer) ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Read custom delay attribute
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                
                // Stop observing after reveal to prevent performance overhead
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Element is 10% visible
        rootMargin: '0px 0px -50px 0px' // Reveals slightly before entry
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // --- 5. Achievements Stats Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = entry.target;
                const targetValue = parseFloat(targetElement.getAttribute('data-target'));
                const duration = 2000; // Animation duration in milliseconds
                const frameRate = 1000 / 60; // 60 FPS
                const totalFrames = Math.round(duration / frameRate);
                let currentFrame = 0;

                const counter = setInterval(() => {
                    currentFrame++;
                    const progress = currentFrame / totalFrames;
                    // Ease out expo mathematical progression
                    const easedProgress = 1 - Math.pow(2, -10 * progress);
                    let currentValue = targetValue * easedProgress;

                    // Format values based on their targets
                    if (targetValue >= 100000) {
                        // High values format: e.g. 150K+
                        targetElement.textContent = Math.round(currentValue / 1000) + 'K+';
                    } else if (targetValue === 100) {
                        // Percentage format
                        targetElement.textContent = Math.round(currentValue) + '%';
                    } else {
                        // Standard numeric
                        targetElement.textContent = Math.round(currentValue) + '+';
                    }

                    if (currentFrame === totalFrames) {
                        clearInterval(counter);
                        // Ensure final value is exact
                        if (targetValue >= 100000) {
                            targetElement.textContent = Math.round(targetValue / 1000) + 'K+';
                        } else if (targetValue === 100) {
                            targetElement.textContent = '100%';
                        } else {
                            targetElement.textContent = targetValue + '+';
                        }
                    }
                }, frameRate);

                observer.unobserve(targetElement); // Animate only once
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(stat => {
        countObserver.observe(stat);
    });


    // --- 6. Project Card Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        // Show card with a quick transition
                        card.style.display = 'flex';
                        // Use requestAnimationFrame to ensure display is applied before starting fade
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0) scale(1)';
                            }, 10);
                        });
                    } else {
                        // Fade out card and then set display none
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px) scale(0.98)';
                        setTimeout(() => {
                            // Verify active filter has not changed during animation to avoid race conditions
                            const activeBtn = document.querySelector('.filter-btn.active');
                            const currentFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
                            if (currentFilter !== 'all' && !categories.includes(currentFilter)) {
                                card.style.display = 'none';
                            }
                        }, 300);
                    }
                });
            });
        });
    }
});
