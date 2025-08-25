// Power of One Personal Training Bangkok - Main JavaScript
// Enhanced functionality for video facades, tracking, and UI interactions

// Simple FAQ toggle functionality (legacy - keeping for compatibility)
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.style.display === 'block';
        
        // Close all FAQ answers
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.style.display = 'none';
        });
        document.querySelectorAll('.faq-question').forEach(q => {
            q.classList.remove('active');
        });
        
        // Toggle current answer
        if (!isOpen) {
            answer.style.display = 'block';
            question.classList.add('active');
        }
    });
});

// Testimonial toggle functionality
function toggleTestimonial(button) {
    const testimonial = button.closest('.testimonial');
    const preview = testimonial.querySelector('.testimonial-preview');
    const full = testimonial.querySelector('.testimonial-full');
    
    if (full.style.display === 'none') {
        preview.style.display = 'none';
        full.style.display = 'block';
        button.textContent = 'Read Less';
    } else {
        preview.style.display = 'block';
        full.style.display = 'none';
        button.textContent = 'Read More';
    }
}

// Phone click tracking for analytics
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        // Track phone clicks for conversion optimization
        if (typeof gtag !== 'undefined') {
            gtag('event', 'phone_click', {
                'event_category': 'contact',
                'event_label': 'phone_number'
            });
        }
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact');
        }
        console.log('Phone number clicked');
    });
});

// Track Calendly button clicks
document.querySelectorAll('a[href*="calendly.com"]').forEach(link => {
    link.addEventListener('click', () => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'schedule_consultation', {
                'event_category': 'conversion',
                'event_label': 'calendly_click'
            });
        }
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Schedule');
        }
        console.log('Calendly link clicked');
    });
});

// YouTube Facade functionality - Performance optimized video loading
function loadYouTubeVideo(facade) {
    const videoId = facade.dataset.videoId;
    const params = facade.dataset.params || '';
    const iframe = document.createElement('iframe');
    
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&${params}`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    
    facade.innerHTML = '';
    facade.appendChild(iframe);
    facade.classList.add('loaded');
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Sticky header functionality
    const header = document.querySelector('.site-header');
    const trustBanner = document.querySelector('.trust-banner');
    
    function handleStickyHeader() {
        if (trustBanner) {
            const trustBannerRect = trustBanner.getBoundingClientRect();
            if (trustBannerRect.bottom <= 0) {
                header?.classList.add('sticky');
            } else {
                header?.classList.remove('sticky');
            }
        }
    }
    
    // Optimize scroll performance with requestAnimationFrame
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleStickyHeader);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16); // ~60fps
        }
    }
    
    window.addEventListener('scroll', requestTick);
    handleStickyHeader(); // Check initial state

    // Initialize YouTube facades with enhanced functionality
    const facades = document.querySelectorAll('.youtube-facade');
    console.log(`YouTube facades found: ${facades.length}`);
    
    facades.forEach((facade, index) => {
        const videoId = facade.dataset.videoId;
        console.log(`Initializing facade ${index + 1} with video ID: ${videoId}`);
        
        // Enhanced click handler for better mobile support
        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`YouTube facade clicked, loading video: ${videoId}`);
            loadYouTubeVideo(facade);
            
            // Track video engagement
            if (typeof gtag !== 'undefined') {
                gtag('event', 'video_play', {
                    'event_category': 'engagement',
                    'event_label': videoId
                });
            }
        };
        
        // Add both click and touch events for better mobile support
        facade.addEventListener('click', clickHandler);
        facade.addEventListener('touchend', clickHandler);
        
        // Add pointer-events and cursor for better UX
        facade.style.cursor = 'pointer';
        facade.style.pointerEvents = 'auto';
        
        // Also add events to play overlay if it exists
        const playOverlay = facade.querySelector('.video-play-overlay');
        if (playOverlay) {
            playOverlay.addEventListener('click', clickHandler);
            playOverlay.addEventListener('touchend', clickHandler);
            playOverlay.style.cursor = 'pointer';
            playOverlay.style.pointerEvents = 'auto';
        }
        
        // Add events to play button if it exists
        const playButton = facade.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', clickHandler);
            playButton.addEventListener('touchend', clickHandler);
            playButton.style.cursor = 'pointer';
            playButton.style.pointerEvents = 'auto';
        }
    });

    // Add intersection observer for lazy loading enhancements
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        // Observe any images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Export functions for global access
window.toggleTestimonial = toggleTestimonial;
window.loadYouTubeVideo = loadYouTubeVideo;