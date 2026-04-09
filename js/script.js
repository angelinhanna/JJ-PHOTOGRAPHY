/**
 * JJ PHOTOGRAPHY - Premium Command Center logic
 * Non-scrolling, curtain reveals, custom cursor, 3x3 grids.
 */

// Prevent browser from trying to "save" scroll positions
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. LOADER & CURTAIN REVEAL ---

    // Initialize Flatpickr Premium Calendar Date Selection
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#event_date", {
            dateFormat: "d M Y", // e.g., 24 Oct 2024
            minDate: "today",
            animate: true,
            disableMobile: "true", // use flatpickr custom interface even on mobile
        });
    }

    const loader = document.getElementById('loader');
    const goldLine = document.querySelector('.gold-line');

    // Curtain Reveal logic
    setTimeout(() => {
        if (goldLine) {
            // After shimmerReveal animation finishes (3s)
            goldLine.classList.add('curtain-open');

            setTimeout(() => {
                loader.classList.add('fade-out');
                document.body.classList.add('site-loaded');

                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1000);
            }, 1000);
        }
    }, 3000);


    // --- 2. MENU TOGGLE ---
    window.toggleMenu = function () {
        document.body.classList.toggle('menu-active');
    };


    // --- 4. STATE MANAGEMENT (PORTAL TRANSITIONS) ---
    const validStates = ['hero', 'about', 'services', 'grid', 'testimonials', 'contact', 'folder', 'gallery'];
    const getStateFromHash = () => {
        const hashState = window.location.hash.replace('#', '').trim().toLowerCase();
        return validStates.includes(hashState) ? hashState : 'hero';
    };

    let currentState = getStateFromHash();
    const appContainer = document.getElementById('app-container');

    // Initialize History State
    history.replaceState({ state: currentState }, '', `#${currentState}`);

    window.switchState = function (targetState, isBackNavigation = false) {
        // Close menu if open (always unconditionally)
        document.body.classList.remove('menu-active');

        if (targetState === currentState && !isBackNavigation) return;

        const states = document.querySelectorAll('.app-state');
        const targetElement = document.getElementById(`${targetState}-state`);

        if (!targetElement) {
            console.error(`State ${targetState} not found`);
            return;
        }

        // Highlight active menu links
        const navLinks = document.querySelectorAll('.nav-links a, .menu-content a');
        navLinks.forEach(link => {
            // Check if the link's onclick contains the switchState call with targetState
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`switchState('${targetState}')`)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Handle transitions cleanly
        states.forEach(s => {
            s.classList.remove('active');
            s.classList.remove('hidden-state'); 
        });

        appContainer.classList.remove(`state-${currentState}`);
        targetElement.classList.add('active');
        appContainer.classList.add(`state-${targetState}`);

        if (document.activeElement) {
            document.activeElement.blur();
        }

        const resetScroll = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            if (appContainer) appContainer.scrollTop = 0;
            if (targetElement) targetElement.scrollTop = 0;
        };

        resetScroll();
        setTimeout(resetScroll, 10);
        setTimeout(resetScroll, 50);
        setTimeout(resetScroll, 100); // Extra safety for mobile transitions

        currentState = targetState;

        // Push to History API if this is a fresh navigation (not from back/popstate)
        if (!isBackNavigation) {
            history.pushState({ state: targetState }, '', `#${targetState}`);
        }
    };

    // Initialize initial state highlight
    const initialNavLinks = document.querySelectorAll('.nav-links a, .menu-content a');
    initialNavLinks.forEach(link => {
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`switchState('${currentState}')`)) {
            link.classList.add('active');
        }
    });

    window.goBack = function () {
        // Simply use browser history to go back
        history.back();
    };

    // Listen for Back/Forward Button actions
    window.addEventListener('popstate', (event) => {
        // First check if a lightbox is open, if so close it
        const lightbox = document.getElementById('lightbox-modal');
        if (lightbox && lightbox.classList.contains('active')) {
            window.closeLightbox(false); // Close without calling history.back()
            return;
        }

        if (event.state && event.state.state) {
            window.switchState(event.state.state, true);
        } else {
            // Fallback to hash if available, otherwise hero
            window.switchState(getStateFromHash(), true);
        }
    });

    // Apply initial state from URL hash on first load
    if (currentState !== 'hero') {
        window.switchState(currentState, true);
    }


    // --- 4. PORTFOLIO CONFIGURATION ---
    const CLOUD_NAME = "dlwevdqsf"; // <-- AUTOMATICALLY UPDATED

    window.loadGallery = function(category, folderId) {
        console.log(`Loading gallery for category: ${category}`);
        
        const galleryContainer = document.getElementById('gallery-container');
        const folderTitle = document.getElementById('current-folder');
        
        if (!galleryContainer || !folderTitle) return;
        
        // Update title
        folderTitle.textContent = category;
        
        // Show loading state
        galleryContainer.innerHTML = `
            <div class="gallery-loader" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 1rem; opacity: 0.7;">Loading beautiful memories...</p>
            </div>
        `;
        
        // Switch to gallery state
        window.switchState('gallery');
        
        // Load images with optimizations
        setTimeout(() => {
            // Normalize tag for Cloudinary (lowercase, no spaces)
            const tag = category.toLowerCase().replace(/\s+/g, '-') + '-gallery';
            const cacheBuster = Date.now();
            const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json?_=${cacheBuster}`;
            
            console.log(`Fetching from Cloudinary: ${url}`);
            
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    const images = data.resources || [];
                    console.log(`Found ${images.length} images for ${category}`);
                    
                    if (images.length === 0) {
                        galleryContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; opacity: 0.5;">No photos uploaded to ${category} yet.</p>`;
                        return;
                    }
                    
                    // Optimized image loading with thumbnails and progressive enhancement
                    let html = '';
                    images.forEach((img, index) => {
                        // Generate optimized image URLs
                        const thumbnailUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_300,h_300,c_fill,q_auto,f_auto/${img.public_id}.${img.format}`;
                        const fullSizeUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,h_1200,c_limit,q_auto,f_auto/${img.public_id}.${img.format}`;
                        
                        html += `
                            <div class="gallery-item" onclick="event.stopPropagation(); window.openLightbox('${fullSizeUrl}')" style="animation-delay: ${index * 0.1}s">
                                <div class="gallery-placeholder"></div>
                                <img 
                                    src="${thumbnailUrl}" 
                                    data-src="${fullSizeUrl}"
                                    loading="lazy" 
                                    decoding="async" 
                                    alt="Gallery Photo"
                                    onload="this.previousElementSibling.style.display='none'; this.style.opacity='1';"
                                    onerror="this.style.display='none'; this.previousElementSibling.innerHTML='<i style=\\'color: #666; font-size: 2rem;\\' class=\\'fas fa-exclamation-triangle\\'></i>';"
                                >
                            </div>
                        `;
                    });
                    
                    galleryContainer.innerHTML = html;
                    
                    // Implement intersection observer for even better performance
                    if ('IntersectionObserver' in window) {
                        const imageObserver = new IntersectionObserver((entries, observer) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    const img = entry.target;
                                    img.style.opacity = '0';
                                    img.style.transition = 'opacity 0.3s ease';
                                    
                                    // Load higher quality image when in view
                                    if (img.dataset.src && img.src !== img.dataset.src) {
                                        const tempImg = new Image();
                                        tempImg.onload = () => {
                                            img.src = img.dataset.src;
                                            img.style.opacity = '1';
                                        };
                                        tempImg.src = img.dataset.src;
                                    }
                                    
                                    observer.unobserve(img);
                                }
                            });
                        });
                        
                        document.querySelectorAll('.gallery-item img').forEach(img => {
                            imageObserver.observe(img);
                        });
                    }
                })
                .catch(err => {
                    console.error("Cloudinary Fetch Error:", err);
                    galleryContainer.innerHTML = `
                        <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                            <p style="color: #ff6b6b; margin-bottom: 1rem;">Unable to load gallery.</p>
                            <p style="font-size: 0.7rem; opacity: 0.6;">Please check your connection and try again.</p>
                        </div>
                    `;
                });
        }, 500); // Small delay for smooth transition
    };

    // Function to enter folder from portfolio cards
    window.enterFolder = function(category) {
        console.log(`Entering folder: ${category}`);
        window.loadGallery(category);
    };

    window.openGallery = function (category, folderId) {
        // Kept for compatibility if called, but redirects to loadGallery logic
        window.loadGallery(category, folderId);
    };

    // --- 5. LIGHTBOX LOGIC ---
    window.openLightbox = function (imgSrc) {
        const modal = document.getElementById('lightbox-modal');
        const img = document.getElementById('lightbox-img');
        if (!modal || !img) return;

        img.src = imgSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll

        // Add a "virtual" lightbox state to history so back button can close it
        history.pushState({ state: currentState, view: 'lightbox' }, '', '');
    };

    window.closeLightbox = function (triggerHistoryBack = true) {
        const modal = document.getElementById('lightbox-modal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll

        // Only go back in history if the close was triggered by user click (not back button)
        if (triggerHistoryBack && history.state && history.state.view === 'lightbox') {
            history.back();
        }
    };


    // --- 6. SERVICE CARD EXPANSION ---
    window.expandService = function (serviceType) {
        const details = {
            'Wedding': 'Cinematic storytelling for your big day. We capture the vows, the tears, and the joy in high-fidelity 8k style.',
            'Engagement': 'Intimate portraits that celebrate your journey toward forever. Beautiful location shoots with professional lighting.',
            'Pre Wedding': 'Romantic preludes to your big day. Let us tell the story of your love with beautiful, relaxed shoots before you say "I do".',
            'Baptism': 'A sacred milestone captured with grace and subtlety. Preserve the blessings for generations to come.',
            'Baby Shower': 'Embracing the joy of expecting. We capture the laughter, games, and radiant glow of the mother-to-be in soft, beautiful light.',
            'Maternity Shoot': 'Celebrate the miracle of life. Artistic, elegant, and glowing portraits highlighting the beautiful journey of motherhood.',
            'Naming Ceremony': 'Celebrating the first of many beautiful moments. Soft, authentic, and heartwarming visuals.',
            'Portraits': 'Professional studio and outdoor portraiture. Headshots, fashion, and artistic character studies.',
            'Other Events': 'Birthdays, corporate galas, and private celebrations. High-energy coverage that preserves the memory of your special event.'
        };

        const modal = document.createElement('div');
        modal.className = 'service-detail-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
                <h2 class="gold-text">${serviceType}</h2>
                <p>${details[serviceType] || 'Detailed description coming soon.'}</p>
                <button class="book-now-btn" onclick="switchState('contact'); this.parentElement.parentElement.remove()">Book Now</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Trigger CSS transition
        setTimeout(() => modal.classList.add('active'), 10);
    };

    // --- 7. CONTACT FORM LOGIC (DIRECT WHATSAPP DMs) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const eventTypeSelect = document.getElementById('event_type_select');
    const otherEventInput = document.getElementById('other_event_input');
    const whatsappNumber = '919742577904'; // Photographer's WhatsApp Number

    // Toggle Other Event Input
    if (eventTypeSelect && otherEventInput) {
        eventTypeSelect.addEventListener('change', function () {
            if (this.value === 'other') {
                otherEventInput.style.display = 'block';
                otherEventInput.required = true;
            } else {
                otherEventInput.style.display = 'none';
                otherEventInput.required = false;
                otherEventInput.value = '';
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Premium Loading State
            submitBtn.classList.add('loading');
            formStatus.classList.add('active');
            formStatus.classList.remove('success', 'error');
            formStatus.innerText = '✨ Preparing your secure WhatsApp inquiry...';

            const formData = new FormData(this);
            const name = formData.get('user_name');
            const email = formData.get('user_email');
            let eventType = formData.get('event_type');
            if (eventType === 'other') {
                eventType = formData.get('other_event') || 'Custom Event';
            }
            const eventDate = formData.get('event_date');
            const msg = formData.get('message');

            // Build a clean plaintext message, then URL-encode once.
            const fullMessage = [
                '*NEW BOOKING INQUIRY*',
                '--------------------------------',
                `*Client:* ${name}`,
                `*Email:* ${email}`,
                `*Event:* ${eventType}`,
                `*Preferred Date:* ${eventDate}`,
                '',
                '*Message:*',
                msg,
                '--------------------------------',
                '_Sent via JJ Photography Portfolio Web_'
            ].join('\n');
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;

            // Redirect smoothly to WhatsApp after a short "premium" delay
            setTimeout(() => {
                // We use window.open for better UX (opens in new tab)
                window.open(whatsappUrl, '_blank');

                // Show success feedback on the form
                submitBtn.classList.remove('loading');
                formStatus.classList.add('success');
                formStatus.innerText = '✅ Form Validated! Redirecting to WhatsApp DMs...';

                // Reset form for next time
                contactForm.reset();
                if (otherEventInput) {
                    otherEventInput.style.display = 'none';
                    otherEventInput.required = false;
                }

                // Hide status after success
                setTimeout(() => {
                    formStatus.classList.remove('active');
                }, 4000);
            }, 1200);
        });
    }

});
