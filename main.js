// Modern Minimal Developer Profile - Main Application Logic

class App {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupPerformanceMonitoring();
    }

    init() {
        console.log('🚀 Initializing Modern Minimal Developer Profile');

        // Initialize core components
        this.checkBrowserSupport();
        this.setupCanvas();
        this.initializeAnimations();
        this.setupAccessibility();
        this.setupSEO();

        // Start the application
        this.start();
    }

    checkBrowserSupport() {
        // Check for required features
        const requiredFeatures = [
            'querySelector',
            'addEventListener',
            'classList',
            'requestAnimationFrame',
            'getContext'
        ];

        const missingFeatures = requiredFeatures.filter(feature => {
            if (feature === 'getContext') {
                return !document.createElement('canvas').getContext;
            }
            return !window[feature] && !document[feature];
        });

        if (missingFeatures.length > 0) {
            console.warn('⚠️ Some features may not be supported:', missingFeatures);
            this.showFallbackMessage();
        }
    }

    showFallbackMessage() {
        const fallback = document.createElement('div');
        fallback.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #ff6b6b; color: white; padding: 10px 20px; border-radius: 5px; font-family: Arial, sans-serif; z-index: 10000;">
                Some features may not work in this browser. Please update to a modern browser for the best experience.
            </div>
        `;
        document.body.appendChild(fallback);

        setTimeout(() => fallback.remove(), 5000);
    }

    setupCanvas() {
        // Ensure canvases are properly sized
        const canvases = ['background-canvas', 'particles-canvas'];

        canvases.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        });
    }

    initializeAnimations() {
        // Wait for other scripts to load
        this.waitForScripts(['particles.js', 'effects.js'], () => {
            console.log('✅ All scripts loaded, initializing enhanced animations...');

            // Initialize enhanced interactive effects
            setTimeout(() => {
                // Custom cursor with glow and particle trail
                this.customCursor = new CustomCursor();

                // Magnetic effects for social links
                this.magneticEffect = new MagneticEffect('.social-link', 0.4);

                // Ripple effects for clicks
                this.rippleEffect = new RippleEffect();

                // 3D tilt effect for profile card
                this.card3DEffect = new Card3DEffect('.profile-card');

                // Enhanced parallax background
                this.enhancedParallax = new EnhancedParallax();

                // Enhanced scroll reveal animations
                this.enhancedScrollReveal = new EnhancedScrollReveal();

                // Interactive background
                this.interactiveBackground = new InteractiveBackground();

                // Avatar 3D tilt effect
                this.avatar3DEffect = new Card3DEffect('.avatar');

                console.log('🎨 All enhanced animations initialized');
            }, 1000);
        });
    }

    waitForScripts(scriptNames, callback) {
        const checkScripts = () => {
            const loadedScripts = scriptNames.filter(name => {
                return document.querySelector(`script[src*="${name}"]`) ||
                       window[name.replace('.js', '')];
            });

            if (loadedScripts.length === scriptNames.length) {
                callback();
            } else {
                setTimeout(checkScripts, 100);
            }
        };
        checkScripts();
    }

    bindEvents() {
        // Window resize handling
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Touch events for mobile
        this.setupTouchEvents();

        // Context menu prevention (optional)
        document.addEventListener('contextmenu', (e) => {
            // Uncomment to disable right-click
            // e.preventDefault();
        });

        // Service worker registration (for PWA capabilities)
        this.registerServiceWorker();
    }

    handleResize() {
        console.log('📐 Window resized, updating canvases...');
        this.setupCanvas();

        // Trigger resize events for other components
        window.dispatchEvent(new Event('app-resize'));
    }

    handleKeyboard(e) {
        // Accessibility keyboard shortcuts
        switch(e.key) {
            case 'Escape':
                // Close any open modals or menus
                this.closeActiveElements();
                break;
            case 'Tab':
                // Ensure focus management
                this.handleTabNavigation(e);
                break;
            case 'Enter':
            case ' ':
                // Handle activation of focused elements
                this.handleActivation(e);
                break;
        }
    }

    setupTouchEvents() {
        let touchStartY = 0;
        let touchStartX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.isVerticalScroll(e.touches[0].clientY - touchStartY)) {
                // Prevent horizontal scrolling on touch
                e.preventDefault();
            }
        });
    }

    isVerticalScroll(deltaY) {
        return Math.abs(deltaY) > Math.abs(window.innerWidth * 0.1);
    }

    closeActiveElements() {
        // Close any active modals, dropdowns, etc.
        const activeElements = document.querySelectorAll('.active, .open');
        activeElements.forEach(element => {
            element.classList.remove('active', 'open');
        });
    }

    handleTabNavigation(e) {
        // Ensure proper focus management
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    handleActivation(e) {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'BUTTON' || activeElement.tagName === 'A')) {
            e.preventDefault();
            activeElement.click();
        }
    }

    setupAccessibility() {
        // Add ARIA labels and roles
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.setAttribute('aria-label', `Visit ${link.textContent.trim()} profile`);
        });

        // Add skip link for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add CSS for skip link
        const style = document.createElement('style');
        style.textContent = `
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                z-index: 100;
            }
            .skip-link:focus {
                top: 6px;
            }
        `;
        document.head.appendChild(style);
    }

    setupSEO() {
        // Add meta tags for SEO
        const metaTags = [
            { name: 'description', content: 'Modern minimal developer profile showcasing clean design and elegant animations' },
            { name: 'keywords', content: 'developer, profile, modern, minimal, dark mode, web development' },
            { name: 'author', content: 'Developer Name' },
            { property: 'og:title', content: 'Developer Name - Modern Minimal Profile' },
            { property: 'og:description', content: 'Passionate developer crafting elegant solutions with modern technologies' },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' }
        ];

        metaTags.forEach(tag => {
            const meta = document.createElement('meta');
            Object.keys(tag).forEach(key => {
                meta.setAttribute(key, tag[key]);
            });
            document.head.appendChild(meta);
        });

        // Add structured data
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Developer Name",
            "jobTitle": "Software Developer",
            "description": "Passionate developer crafting elegant solutions with modern technologies",
            "url": window.location.href,
            "sameAs": [
                "https://github.com/username",
                "https://linkedin.com/in/username",
                "https://twitter.com/username"
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Note: Service worker would need to be created separately
                // navigator.serviceWorker.register('/sw.js')
                //     .then(registration => console.log('SW registered'))
                //     .catch(error => console.log('SW registration failed'));
            });
        }
    }

    setupPerformanceMonitoring() {
        // Monitor performance
        if ('performance' in window && 'PerformanceObserver' in window) {
            // Monitor long tasks
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('⚠️ Long task detected:', entry.duration + 'ms');
                    }
                }
            });
            observer.observe({ entryTypes: ['longtask'] });

            // Monitor layout shifts
            const layoutObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.value > 0.1) {
                        console.warn('⚠️ Layout shift detected:', entry.value);
                    }
                }
            });
            layoutObserver.observe({ entryTypes: ['layout-shift'] });
        }

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                const used = Math.round(memInfo.usedJSHeapSize / 1048576);
                const total = Math.round(memInfo.totalJSHeapSize / 1048576);

                if (used > total * 0.8) {
                    console.warn('⚠️ High memory usage:', used + 'MB /' + total + 'MB');
                }
            }, 10000);
        }
    }

    start() {
        console.log('🎯 Application started successfully');

        // Add loading complete class to body
        document.body.classList.add('loaded');

        // Trigger any final animations
        setTimeout(() => {
            document.body.classList.add('animations-ready');
        }, 1000);

        // Log application info
        this.logAppInfo();
    }

    logAppInfo() {
        const info = {
            version: '1.0.0',
            build: new Date().toISOString(),
            browser: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: window.devicePixelRatio,
            touchSupport: 'ontouchstart' in window,
            webglSupport: this.checkWebGLSupport()
        };

        console.table(info);
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                     canvas.getContext('webgl'));
        } catch (e) {
            return false;
        }
    }

    // Utility methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('🚨 Application Error:', e.error);
    // Could send error to monitoring service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('🚨 Unhandled Promise Rejection:', e.reason);
    // Could send error to monitoring service
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Export for debugging
window.App = App;

// Add some developer-friendly features
if (window.location.search.includes('debug')) {
    console.log('🐛 Debug mode enabled');

    // Add debug info to page
    const debugInfo = document.createElement('div');
    debugInfo.id = 'debug-info';
    debugInfo.innerHTML = `
        <div style="position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 5px; font-size: 12px; z-index: 10000;">
            <div>FPS: <span id="fps">0</span></div>
            <div>Memory: <span id="memory">0</span> MB</div>
            <button onclick="this.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(debugInfo);

    // Update debug info
    let frameCount = 0;
    let lastTime = performance.now();

    function updateDebugInfo() {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            document.getElementById('fps').textContent = fps;

            if (performance.memory) {
                const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
                document.getElementById('memory').textContent = used;
            }

            frameCount = 0;
            lastTime = currentTime;
        }

        requestAnimationFrame(updateDebugInfo);
    }

    updateDebugInfo();
}
