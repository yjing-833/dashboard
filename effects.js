// Modern Minimal Effects and Animations

class TypingEffect {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.isTyping = false;
        this.cursor = document.createElement('span');
        this.cursor.className = 'typing-cursor';
        this.cursor.textContent = '|';
        this.element.appendChild(this.cursor);
    }

    start() {
        if (this.isTyping) return;
        this.isTyping = true;
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.insertBefore(
                document.createTextNode(this.text.charAt(this.index)),
                this.cursor
            );
            this.index++;
            setTimeout(() => this.type(), this.speed);
        } else {
            this.isTyping = false;
            this.blinkCursor();
        }
    }

    blinkCursor() {
        setInterval(() => {
            this.cursor.style.opacity = this.cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
}

class HoverEffect {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        // Social link hover effects
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('mouseenter', this.handleLinkEnter.bind(this));
            link.addEventListener('mouseleave', this.handleLinkLeave.bind(this));
        });

        // Avatar hover effect
        const avatar = document.querySelector('.avatar');
        if (avatar) {
            avatar.addEventListener('mouseenter', this.handleAvatarEnter.bind(this));
            avatar.addEventListener('mouseleave', this.handleAvatarLeave.bind(this));
        }

        // Profile card hover effect
        const card = document.querySelector('.profile-card');
        if (card) {
            card.addEventListener('mouseenter', this.handleCardEnter.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
        }
    }

    handleLinkEnter(e) {
        const link = e.currentTarget;
        const rect = link.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        link.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        // Add magnetic effect
        this.applyMagneticEffect(link, e.clientX, e.clientY, centerX, centerY);
    }

    handleLinkLeave(e) {
        const link = e.currentTarget;
        link.style.transform = 'translateY(0px)';
    }

    handleAvatarEnter(e) {
        const avatar = e.currentTarget;
        avatar.style.transform = 'scale(1.05) rotate(2deg)';

        // Create glow effect
        const glow = document.createElement('div');
        glow.className = 'avatar-glow-pulse';
        glow.style.position = 'absolute';
        glow.style.top = '-10px';
        glow.style.left = '-10px';
        glow.style.right = '-10px';
        glow.style.bottom = '-10px';
        glow.style.borderRadius = '50%';
        glow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)';
        glow.style.animation = 'glowPulse 1s ease-in-out infinite';
        avatar.parentNode.appendChild(glow);

        setTimeout(() => glow.remove(), 1000);
    }

    handleAvatarLeave(e) {
        const avatar = e.currentTarget;
        avatar.style.transform = 'scale(1) rotate(0deg)';
    }

    handleCardEnter(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-5px) scale(1.01)';
        card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)';
    }

    handleCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0px) scale(1)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)';
    }

    applyMagneticEffect(element, mouseX, mouseY, centerX, centerY) {
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 50;

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const moveX = deltaX * force * 0.1;
            const moveY = deltaY * force * 0.1;
            element.style.transform = `translate(${moveX}px, ${moveY - 3}px)`;
        }
    }
}

class ParallaxEffect {
    constructor() {
        this.elements = [];
        this.mouse = { x: 0, y: 0 };
        this.bindEvents();
        this.init();
    }

    init() {
        // Add parallax to floating shapes
        document.querySelectorAll('.shape').forEach((shape, index) => {
            this.elements.push({
                element: shape,
                speed: (index + 1) * 0.01,
                initialX: parseFloat(shape.style.left) || 0,
                initialY: parseFloat(shape.style.top) || 0
            });
        });
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX / window.innerWidth;
            this.mouse.y = e.clientY / window.innerHeight;
            this.updateParallax();
        });

        window.addEventListener('scroll', () => {
            this.updateScrollParallax();
        });
    }

    updateParallax() {
        this.elements.forEach(item => {
            const moveX = (this.mouse.x - 0.5) * item.speed * 100;
            const moveY = (this.mouse.y - 0.5) * item.speed * 100;

            item.element.style.transform = `translate(${item.initialX + moveX}px, ${item.initialY + moveY}px)`;
        });
    }

    updateScrollParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Apply subtle scroll parallax to background elements
        const card = document.querySelector('.profile-card');
        if (card) {
            card.style.transform = `translateY(${rate * 0.1}px)`;
        }
    }
}

class ScrollRevealEffect {
    constructor() {
        this.elements = document.querySelectorAll('.profile-card, .name, .bio, .social-links');
        this.revealed = new Set();
        this.bindEvents();
        this.checkVisibility();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.checkVisibility());
        window.addEventListener('resize', () => this.checkVisibility());
    }

    checkVisibility() {
        this.elements.forEach(element => {
            if (this.isElementInViewport(element) && !this.revealed.has(element)) {
                this.revealElement(element);
                this.revealed.add(element);
            }
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        // Trigger when element is 20% visible
        const threshold = windowHeight * 0.2;

        return (
            rect.top <= windowHeight - threshold &&
            rect.bottom >= threshold
        );
    }

    revealElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';

        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
}

class LoadingEffect {
    constructor() {
        this.overlay = this.createOverlay();
        this.progress = 0;
        this.isLoading = true;
        this.startLoading();
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">Initializing...</div>
                <div class="loading-progress">
                    <div class="loading-bar"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    startLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                this.finishLoading();
            }
            this.updateProgress();
        }, 100);
    }

    updateProgress() {
        const bar = this.overlay.querySelector('.loading-bar');
        const text = this.overlay.querySelector('.loading-text');

        bar.style.width = `${this.progress}%`;
        text.textContent = `Loading... ${Math.round(this.progress)}%`;
    }

    finishLoading() {
        setTimeout(() => {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                this.overlay.remove();
                this.triggerEntranceAnimations();
            }, 500);
        }, 300);
    }

    triggerEntranceAnimations() {
        // Trigger all entrance animations after loading
        const elements = document.querySelectorAll('.profile-card, .avatar, .name, .bio, .social-links');
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('fade-in');
        });
    }
}

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.init();
    }

    init() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }

        // Add theme toggle functionality (can be triggered by a button if added)
        this.bindEvents();
    }

    bindEvents() {
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Apply theme-specific styles
        this.applyThemeStyles(theme);
    }

    applyThemeStyles(theme) {
        const root = document.documentElement;

        if (theme === 'light') {
            root.style.setProperty('--bg-primary', '#f8f9fa');
            root.style.setProperty('--bg-secondary', '#ffffff');
            root.style.setProperty('--text-primary', '#212529');
            root.style.setProperty('--text-secondary', '#6c757d');
            root.style.setProperty('--border-color', '#dee2e6');
        } else {
            root.style.setProperty('--bg-primary', '#0f0f0f');
            root.style.setProperty('--bg-secondary', '#1a1a1a');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b0b0b0');
            root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
        }
    }

    toggleTheme() {
        this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
    }
}

// Utility functions
const Utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
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
    },

    lerp: (start, end, factor) => {
        return start + (end - start) * factor;
    },

    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },

    random: (min, max) => {
        return Math.random() * (max - min) + min;
    }
};

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading effect
    const loadingEffect = new LoadingEffect();

    // Initialize other effects after a short delay
    setTimeout(() => {
        const typingEffect = new TypingEffect(
            document.querySelector('.bio'),
            "Passionate developer crafting elegant solutions with modern technologies. Always learning, always building."
        );

        const hoverEffect = new HoverEffect();
        const parallaxEffect = new ParallaxEffect();
        const scrollRevealEffect = new ScrollRevealEffect();
        const themeManager = new ThemeManager();

        // Start typing effect
        setTimeout(() => {
            typingEffect.start();
        }, 1000);

        // Add CSS for additional effects
        const style = document.createElement('style');
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }

            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .typing-cursor {
                animation: blink 1s infinite;
                color: #ffffff;
            }

            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }

            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0f0f0f;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }

            .loading-content {
                text-align: center;
                color: #ffffff;
            }

            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(255, 255, 255, 0.1);
                border-top: 3px solid #ffffff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }

            .loading-progress {
                width: 200px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
                margin-top: 20px;
            }

            .loading-bar {
                height: 100%;
                background: #ffffff;
                border-radius: 2px;
                transition: width 0.3s ease;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Performance monitoring
        if (window.performance && window.performance.memory) {
            setInterval(() => {
                console.log('Memory usage:', Math.round(window.performance.memory.usedJSHeapSize / 1048576) + ' MB');
            }, 5000);
        }

    }, 500);
});

// ===== ENHANCED INTERACTIVE EFFECTS =====

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.follower = null;
        this.trails = [];
        this.mouse = { x: 0, y: 0 };
        this.createCursor();
        this.bindEvents();
        this.animate();
    }

    createCursor() {
        // Main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor';
        document.body.appendChild(this.cursor);

        // Follower dot
        this.follower = document.createElement('div');
        this.follower.className = 'cursor-follower';
        document.body.appendChild(this.follower);

        // Hide default cursor
        document.body.style.cursor = 'none';
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';

            this.createTrail(e.clientX, e.clientY);
        });

        // hover
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('a, button, .social-link, .avatar')) {
                this.cursor.style.width = '25px';
                this.cursor.style.height = '25px';
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('a, button, .social-link, .avatar')) {
                this.cursor.style.width = '20px';
                this.cursor.style.height = '20px';
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }, true);
    }

    createTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x - 2 + 'px';
        trail.style.top = y - 2 + 'px';
        document.body.appendChild(trail);

        this.trails.push(trail);

        // Remove trail after animation
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
            this.trails = this.trails.filter(t => t !== trail);
        }, 800);
    }

    animate() {
        // Smooth follower animation
        const animate = () => {
            this.follower.style.left = this.mouse.x - 3 + 'px';
            this.follower.style.top = this.mouse.y - 3 + 'px';
            requestAnimationFrame(animate);
        };
        animate();
    }

    destroy() {
        if (this.cursor) this.cursor.remove();
        if (this.follower) this.follower.remove();
        this.trails.forEach(trail => trail.remove());
        document.body.style.cursor = 'auto';
    }
}

class MagneticEffect {
    constructor(selector, strength = 0.3) {
        this.elements = document.querySelectorAll(selector);
        this.strength = strength;
        this.mouse = { x: 0, y: 0 };
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            this.elements.forEach(element => {
                this.applyMagneticEffect(element);
            });
        });

        this.elements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('magnetic');
            });

            element.addEventListener('mouseleave', () => {
                element.classList.remove('magnetic');
                element.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    applyMagneticEffect(element) {
        if (!element.classList.contains('magnetic')) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = this.mouse.x - centerX;
        const deltaY = this.mouse.y - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 100;

        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            const moveX = deltaX * force * this.strength;
            const moveY = deltaY * force * this.strength;

            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            element.style.transform = 'translate(0px, 0px)';
        }
    }
}

class RippleEffect {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.social-link, button')) {
                this.createRipple(e.target, e.clientX, e.clientY);
            }
        });
    }

    createRipple(element, x, y) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const rippleX = x - rect.left - size / 2;
        const rippleY = y - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = rippleX + 'px';
        ripple.style.top = rippleY + 'px';

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

class Card3DEffect {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.mouse = { x: 0, y: 0 };
        this.center = { x: 0, y: 0 };
        this.bindEvents();
    }

    bindEvents() {
        if (!this.element) return;

        this.element.addEventListener('mouseenter', () => {
            this.updateCenter();
        });

        this.element.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.apply3DEffect();
        });

        this.element.addEventListener('mouseleave', () => {
            this.reset3DEffect();
        });
    }

    updateCenter() {
        const rect = this.element.getBoundingClientRect();
        this.center.x = rect.left + rect.width / 2;
        this.center.y = rect.top + rect.height / 2;
    }

    apply3DEffect() {
        const deltaX = (this.mouse.x - this.center.x) / 20;
        const deltaY = (this.mouse.y - this.center.y) / 20;

        const rotateX = deltaY * -1;
        const rotateY = deltaX;

        this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0px)`;
    }

    reset3DEffect() {
        this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }
}

class EnhancedParallax {
    constructor() {
        this.layers = [];
        this.mouse = { x: 0, y: 0 };
        this.createLayers();
        this.bindEvents();
        this.animate();
    }

    createLayers() {
        // Create parallax layers
        for (let i = 1; i <= 3; i++) {
            const layer = document.createElement('div');
            layer.className = `parallax-layer parallax-layer-${i}`;
            document.body.appendChild(layer);
            this.layers.push({
                element: layer,
                speed: i * 0.01,
                initialX: 0,
                initialY: 0
            });
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX / window.innerWidth;
            this.mouse.y = e.clientY / window.innerHeight;
        });

        window.addEventListener('scroll', () => {
            this.updateScrollParallax();
        });
    }

    animate() {
        this.layers.forEach(layer => {
            const moveX = (this.mouse.x - 0.5) * layer.speed * 100;
            const moveY = (this.mouse.y - 0.5) * layer.speed * 100;

            layer.element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        requestAnimationFrame(() => this.animate());
    }

    updateScrollParallax() {
        const scrolled = window.pageYOffset;
        this.layers.forEach((layer, index) => {
            const rate = scrolled * layer.speed * (index + 1) * 0.1;
            layer.element.style.transform += ` translateY(${rate}px)`;
        });
    }
}

class EnhancedScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.profile-card, .avatar, .name, .bio, .social-links');
        this.revealed = new Set();
        this.bindEvents();
        this.checkVisibility();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.checkVisibility());
        window.addEventListener('resize', () => this.checkVisibility());
    }

    checkVisibility() {
        this.elements.forEach((element, index) => {
            if (this.isElementInViewport(element) && !this.revealed.has(element)) {
                this.revealElement(element, index);
                this.revealed.add(element);
            }
        });
    }

    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        const threshold = windowHeight * 0.1;
        return (
            rect.top <= windowHeight - threshold &&
            rect.bottom >= threshold
        );
    }

    revealElement(element, index) {
        const delay = index * 200; // Staggered reveal

        setTimeout(() => {
            element.classList.add('reveal');

            // Add specific reveal directions
            if (element.classList.contains('avatar')) {
                element.classList.add('reveal-scale');
            } else if (element.classList.contains('social-links')) {
                element.classList.add('reveal-left');
            } else {
                element.classList.add('reveal-right');
            }

            setTimeout(() => {
                element.classList.add('revealed');
            }, 100);
        }, delay);
    }
}

class InteractiveBackground {
    constructor() {
        this.element = document.querySelector('.interactive-bg') || this.createElement();
        this.mouse = { x: 50, y: 50 };
        this.bindEvents();
    }

    createElement() {
        const bg = document.createElement('div');
        bg.className = 'interactive-bg';
        document.body.appendChild(bg);
        return bg;
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 100;
            this.mouse.y = (e.clientY / window.innerHeight) * 100;

            this.element.style.setProperty('--mouse-x', this.mouse.x + '%');
            this.element.style.setProperty('--mouse-y', this.mouse.y + '%');
        });
    }
}

// Export classes for potential use in other files
window.TypingEffect = TypingEffect;
window.HoverEffect = HoverEffect;
window.ParallaxEffect = ParallaxEffect;
window.ScrollRevealEffect = ScrollRevealEffect;
window.LoadingEffect = LoadingEffect;
window.ThemeManager = ThemeManager;
window.Utils = Utils;

// Export new enhanced classes
window.CustomCursor = CustomCursor;
window.MagneticEffect = MagneticEffect;
window.RippleEffect = RippleEffect;
window.Card3DEffect = Card3DEffect;
window.EnhancedParallax = EnhancedParallax;
window.EnhancedScrollReveal = EnhancedScrollReveal;
window.InteractiveBackground = InteractiveBackground;
