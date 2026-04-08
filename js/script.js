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
    let currentState = 'hero';
    const appContainer = document.getElementById('app-container');

    // Initialize History State
    history.replaceState({ state: 'hero' }, '', '');

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
            if (targetElement) targetElement.scrollTop = 0;
        };

        resetScroll();
        setTimeout(resetScroll, 10);
        setTimeout(resetScroll, 50);

        currentState = targetState;

        // Push to History API if this is a fresh navigation (not from back/popstate)
        if (!isBackNavigation) {
            history.pushState({ state: targetState }, '', '');
        }
    };

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
            // Default to hero if no state found
            window.switchState('hero', true);
        }
    });


    // --- 4. PORTFOLIO LOGIC (FOLDERS & GALLERIES) ---
    const portfolioData = {
        "Baby Shower": [
            {
                "id": "bab_ganesha",
                "name": "GANESHA",
                "thumb": "images/Baby Shower/Ganesha/IMG_5715 (1).jpg",
                "images": [
                    "images/Baby Shower/Ganesha/IMG_5715 (1).jpg",
                    "images/Baby Shower/Ganesha/IMG_5785.jpg",
                    "images/Baby Shower/Ganesha/IMG_5987.jpg",
                    "images/Baby Shower/Ganesha/IMG_6046.jpg",
                    "images/Baby Shower/Ganesha/IMG_6067.jpg",
                    "images/Baby Shower/Ganesha/IMG_6668 (1) (1) - Copy.jpg"
                ]
            },
            {
                "id": "bab_liju_manju",
                "name": "LIJU&MANJU",
                "thumb": "images/Baby Shower/Liju&Manju/20251115_160847 (1).jpg",
                "images": [
                    "images/Baby Shower/Liju&Manju/20251115_160847 (1).jpg",
                    "images/Baby Shower/Liju&Manju/IMG_7831 - Copy.jpg",
                    "images/Baby Shower/Liju&Manju/IMG_7855.jpg",
                    "images/Baby Shower/Liju&Manju/IMG_7889.jpg",
                    "images/Baby Shower/Liju&Manju/IMG_7908.jpg",
                    "images/Baby Shower/Liju&Manju/IMG_7911 - Copy.jpg",
                    "images/Baby Shower/Liju&Manju/IMG_7932 (1).jpg",
                    "images/Baby Shower/Liju&Manju/IMG_7948 - Copy.jpg",
                    "images/Baby Shower/Liju&Manju/IMG_8103 - Copy.jpg"

                ]
            },
            {
                "id": "bab_siju_bency",
                "name": "SIJU&BENCY",
                "thumb": "images/Baby Shower/Siju&Bency/JJ-109.JPG",
                "images": [
                    "images/Baby Shower/Siju&Bency/JJ-109.JPG",
                    "images/Baby Shower/Siju&Bency/JJ-116.JPG",
                    "images/Baby Shower/Siju&Bency/JJ-117.JPG",
                    "images/Baby Shower/Siju&Bency/JJ-125.JPG",
                    "images/Baby Shower/Siju&Bency/JJ-82.JPG",
                    "images/Baby Shower/Siju&Bency/JJ-88.JPG",
                    "images/Baby Shower/Siju&Bency/JJ-94.JPG"
                ]
            }
        ],
        "Bachelor Party": [
            {
                "id": "bac_ft.rani",
                "name": "FT.RANI",
                "thumb": "images/Bachelor Party/ft.Rani/DSC00297.jpg",
                "images": [
                    "images/Bachelor Party/ft.Rani/DSC00297.jpg",
                    "images/Bachelor Party/ft.Rani/DSC00307.jpg",
                    "images/Bachelor Party/ft.Rani/DSC00310.jpg",
                    "images/Bachelor Party/ft.Rani/DSC00633.jpg",
                    "images/Bachelor Party/ft.Rani/DSC00767.jpg",
                    "images/Bachelor Party/ft.Rani/DSC00797.jpg",
                    "images/Bachelor Party/ft.Rani/DSC00818.jpg",
                    "images/Bachelor Party/ft.Rani/DSC00845.jpg",
                    "images/Bachelor Party/ft.Rani/DSC00953.jpg",
                    "images/Bachelor Party/ft.Rani/DSC01007.jpg",
                    "images/Bachelor Party/ft.Rani/DSC01040.jpg",
                    "images/Bachelor Party/ft.Rani/DSC01079.jpg",
                    "images/Bachelor Party/ft.Rani/DSC01148.jpg"
                ]
            }
        ],
        "Maternity Shoot": [
            {
                "id": "mat_manju",
                "name": "MANJU",
                "thumb": "images/Maternity Shoot/Manju/20251115_160751 (2).jpg",
                "images": [
                    "images/Maternity Shoot/Manju/20251115_160751 (2).jpg",
                    "images/Maternity Shoot/Manju/20251115_160847 (1).jpg",
                    "images/Maternity Shoot/Manju/20251115_161324 (1).jpg",
                    "images/Maternity Shoot/Manju/20251115_161500.jpg",
                    "images/Maternity Shoot/Manju/IMG_8124.jpg"
                ]
            }
        ],
        "Naming Ceremony": [
            {
                "id": "nam_traditional_ceremony",
                "name": "RUAH MIRIAM LIJU",
                "thumb": "images/Naming Ceremony/Traditional Ceremony/20251115_160847 (1).jpg",
                "images": [
                    "images/Naming Ceremony/Traditional Ceremony/RJ260722.jpg",
                    "images/Naming Ceremony/Traditional Ceremony/RJ260733.jpg",
                    "images/Naming Ceremony/Traditional Ceremony/RJ260761 (1).jpg",
                    "images/Naming Ceremony/Traditional Ceremony/RJ260777.jpg",
                    "images/Naming Ceremony/Traditional Ceremony/RJ260186.jpg",
                    "images/Naming Ceremony/Traditional Ceremony/RJ260198 (1).jpg",
                    "images/Naming Ceremony/Traditional Ceremony/RJ260213.jpg",
                    "images/Naming Ceremony/Traditional Ceremony/RJ260241.jpg",
                    "images/Naming Ceremony/Traditional Ceremony/RJ260296.jpg",
                    "images/Naming Ceremony/Traditional Ceremony/RJ260361.jpg",
                    "images/Naming Ceremony/Traditional Ceremony/RJ260442.jpg"
                ]
            }
        ],
        "Portraits": [],
        "Pre-Wedding": [
            {
                "id": "pre_pre1",
                "name": "FEMI",
                "thumb": "images/Pre-Wedding/pre1/DSC00225 (1).jpg",
                "images": [
                    "images/Pre-Wedding/pre1/DSC00225 (1).jpg",
                    "images/Pre-Wedding/pre1/DSC00232 (1).jpg",
                    "images/Pre-Wedding/pre1/DSC00234 (1).jpg",
                    "images/Pre-Wedding/pre1/DSC00242.jpg",
                    "images/Pre-Wedding/pre1/DSC00250.jpg",
                    "images/Pre-Wedding/pre1/DSC00285 (1).jpg",
                    "images/Pre-Wedding/pre1/DSC00287.jpg",
                    "images/Pre-Wedding/pre1/DSC00540.jpg",
                    "images/Pre-Wedding/pre1/DSC00634 (1).jpg",
                    "images/Pre-Wedding/pre1/DSC00669.jpg"
                ]
            },
            {
                "id": "pre_pre2",
                "name": "RINCY&ANU",
                "thumb": "images/Pre-Wedding/pre2/20250630_130620.jpg",
                "images": [
                    "images/Pre-Wedding/pre2/20250630_130620.jpg",
                    "images/Pre-Wedding/pre2/20250630_130703.jpg",
                    "images/Pre-Wedding/pre2/20250630_131404.jpg",
                    "images/Pre-Wedding/pre2/20250630_132310.jpg",
                    "images/Pre-Wedding/pre2/20250630_132737.jpg",
                    "images/Pre-Wedding/pre2/20250630_143232 (2).jpg",
                    "images/Pre-Wedding/pre2/20250630_143232.jpg",
                    "images/Pre-Wedding/pre2/20250630_161235.jpg",
                    "images/Pre-Wedding/pre2/20250630_162857.jpg"
                ]
            }
        ],
        "Wedding": [
            {
                "id": "wed_arhana_megh",
                "name": "ARHANA&MEGH",
                "thumb": "images/Wedding/Arhana&Megh/RJ-351.jpg",
                "images": [
                    "images/Wedding/Arhana&Megh/RJ-402 (1).JPG",
                    "images/Wedding/Arhana&Megh/RJ-383.JPG",
                    "images/Wedding/Arhana&Megh/RJ-380 (1).JPG",
                    "images/Wedding/Arhana&Megh/RJ-379 (1).JPG",
                    "images/Wedding/Arhana&Megh/RJ-382.JPG",
                    "images/Wedding/Arhana&Megh/RJ-410.JPG",
                    "images/Wedding/Arhana&Megh/RJ-416.JPG",
                    "images/Wedding/Arhana&Megh/RJ-351.jpg",
                    "images/Wedding/Arhana&Megh/RJ-359.jpg",
                    "images/Wedding/Arhana&Megh/RJ-380.jpg",
                    "images/Wedding/Arhana&Megh/RJ-377.jpg",
                    "images/Wedding/Arhana&Megh/RJ-379.jpg"
                ]
            },
            {
                "id": "wed_jenson_grace",
                "name": "JENSON&GRACE",
                "thumb": "images/Wedding/Jenson Grace/IMG_4272.jpg",
                "images": [
                    "images/Wedding/Jenson Grace/IMG_5402.jpg",
                    "images/Wedding/Jenson Grace/IMG_4272.jpg",
                    "images/Wedding/Jenson Grace/IMG_5275.jpg",
                    "images/Wedding/Jenson Grace/IMG_4659.jpg",
                    "images/Wedding/Jenson Grace/IMG_4302.jpg",
                    "images/Wedding/Jenson Grace/IMG_4540.jpg",
                    "images/Wedding/Jenson Grace/IMG_4781.jpg",
                    "images/Wedding/Jenson Grace/IMG_5230.jpg",
                    "images/Wedding/Jenson Grace/IMG_5567.jpg"
                ]
            }
        ],
        "Other Events": []
    };

    window.enterFolder = function (category) {
        const foldersContainer = document.getElementById('folders-container');
        const categoryTitle = document.getElementById('current-category');

        if (!foldersContainer || !categoryTitle) return;

        categoryTitle.innerText = category;
        foldersContainer.innerHTML = ''; // Clear prior

        const data = portfolioData[category] || [];

        let html = '';
        data.forEach(folder => {
            // Use properly escaped values for purely string-based quick render
            html += `
                <div class="category-card" onclick="window.openGallery('${category}', '${folder.id}')">
                    <div class="card-bg" style="background-image: url('${folder.thumb}');"></div>
                    <div class="card-content">
                        <h3>${folder.name}</h3>
                    </div>
                </div>
            `;
        });
        foldersContainer.innerHTML = html;

        window.switchState('folder');
    };

    window.openGallery = function (category, folderId) {
        const galleryContainer = document.getElementById('gallery-container');
        const folderTitle = document.getElementById('current-folder');

        if (!galleryContainer || !folderTitle) return;

        const categoryData = portfolioData[category] || [];
        const folder = categoryData.find(f => f.id === folderId);

        if (!folder) return;

        folderTitle.innerText = folder.name;
        galleryContainer.innerHTML = ''; // Clear prior

        let html = '';
        folder.images.forEach(imgSrc => {
            html += `
                <div class="gallery-item" onclick="event.stopPropagation(); window.openLightbox('${imgSrc}')">
                    <img src="${imgSrc}" loading="lazy" decoding="async" alt="Gallery Photo">
                </div>
            `;
        });
        galleryContainer.innerHTML = html;

        window.switchState('gallery');
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

            // Professional WhatsApp Message Construction
            // Using *Text* for bold and %0A for new lines
            const header = `*NEW BOOKING INQUIRY* %0A--------------------------------%0A`;
            const clientDetails = `*Client:* ${name}%0A*Email:* ${email}%0A`;
            const eventDetails = `*Event:* ${eventType}%0A*Preferred Date:* ${eventDate}%0A`;
            const messageBody = `*Message:*%0A${msg}%0A--------------------------------%0A`;
            const footer = `_Sent via JJ Photography Portfolio Web_`;

            const fullMessage = header + clientDetails + eventDetails + messageBody + footer;
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
