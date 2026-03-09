// Modern Minimal Particle System and Background Effects

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 60;
        this.mouse = { x: 0, y: 0 };
        this.isMouseMoving = false;
        this.lastMouseMove = 0;
        this.animationId = null;

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    init() {
        // Create initial particles with better distribution
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.min(this.canvas.width, this.canvas.height) * 0.4;
        const x = this.centerX + Math.cos(angle) * distance;
        const y = this.centerY + Math.sin(angle) * distance;

        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 3 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
            life: Math.random() * 1500 + 1000,
            maxLife: Math.random() * 1500 + 1000,
            color: this.getRandomColor(),
            connections: [],
            trail: [],
            maxTrail: 8,
            phase: Math.random() * Math.PI * 2,
            frequency: 0.01 + Math.random() * 0.02,
            amplitude: 0.5 + Math.random() * 1.5
        };
        this.particles.push(particle);
    }

    getRandomColor() {
        const colors = [
            'rgba(255, 255, 255, 0.12)',
            'rgba(220, 220, 220, 0.08)',
            'rgba(180, 180, 180, 0.06)',
            'rgba(140, 140, 140, 0.04)',
            'rgba(100, 100, 100, 0.03)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        // Mouse interaction with smoother tracking
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.isMouseMoving = true;
            this.lastMouseMove = Date.now();
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseMoving = false;
        });

        // Touch support
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
            this.isMouseMoving = true;
            this.lastMouseMove = Date.now();
        });

        this.canvas.addEventListener('touchend', () => {
            this.isMouseMoving = false;
        });
    }

    update() {
        const now = Date.now();

        // Update particles with smoother physics
        this.particles.forEach((particle, index) => {
            // Organic movement with sine waves
            particle.phase += particle.frequency;
            const waveX = Math.sin(particle.phase) * particle.amplitude;
            const waveY = Math.cos(particle.phase * 0.7) * particle.amplitude;

            // Update position with organic motion
            particle.x += particle.vx + waveX * 0.1;
            particle.y += particle.vy + waveY * 0.1;

            // Wrap around edges with smooth transition
            if (particle.x < -50) particle.x = this.canvas.width + 50;
            if (particle.x > this.canvas.width + 50) particle.x = -50;
            if (particle.y < -50) particle.y = this.canvas.height + 50;
            if (particle.y > this.canvas.height + 50) particle.y = -50;

            // Mouse interaction with smooth attraction/repulsion
            if (this.isMouseMoving && now - this.lastMouseMove < 2000) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 120;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);

                    // Subtle attraction for nearby particles
                    if (distance > 40) {
                        particle.vx += Math.cos(angle) * force * 0.02;
                        particle.vy += Math.sin(angle) * force * 0.02;
                    } else {
                        // Gentle repulsion for very close particles
                        particle.vx -= Math.cos(angle) * force * 0.01;
                        particle.vy -= Math.sin(angle) * force * 0.01;
                    }
                }
            }

            // Apply smooth friction
            particle.vx *= 0.995;
            particle.vy *= 0.995;

            // Update trail
            particle.trail.unshift({ x: particle.x, y: particle.y, opacity: particle.opacity });
            if (particle.trail.length > particle.maxTrail) {
                particle.trail.pop();
            }

            // Update life with smooth opacity transition
            particle.life--;
            const lifeRatio = particle.life / particle.maxLife;
            particle.opacity = lifeRatio * 0.4 + 0.1;

            // Respawn particle when life ends
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                this.createParticle();
            }
        });

        // Update connections with improved logic
        this.updateConnections();
    }

    updateConnections() {
        this.particles.forEach(particle => {
            particle.connections = [];
        });

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 180) {
                    const opacity = Math.max(0, (180 - distance) / 180) * 0.08;
                    p1.connections.push({ particle: p2, distance, opacity });
                    p2.connections.push({ particle: p1, distance, opacity });
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections first with smooth gradients
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 0.8;
        this.ctx.lineCap = 'round';

        this.particles.forEach(particle => {
            particle.connections.forEach(connection => {
                const gradient = this.ctx.createLinearGradient(
                    particle.x, particle.y,
                    connection.particle.x, connection.particle.y
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${connection.opacity})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, ${connection.opacity * 0.3})`);

                this.ctx.strokeStyle = gradient;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(connection.particle.x, connection.particle.y);
                this.ctx.stroke();
            });
        });

        // Draw particle trails
        this.particles.forEach(particle => {
            particle.trail.forEach((point, index) => {
                const trailOpacity = (point.opacity * (particle.trail.length - index) / particle.trail.length) * 0.6;
                this.ctx.save();
                this.ctx.globalAlpha = trailOpacity;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, particle.size * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        });

        // Draw particles with enhanced visuals
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;

            // Outer glow
            const glowGradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            glowGradient.addColorStop(0, particle.color);
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Main particle with subtle inner highlight
            const particleGradient = this.ctx.createRadialGradient(
                particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, 0,
                particle.x, particle.y, particle.size
            );
            particleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            particleGradient.addColorStop(0.7, particle.color);
            particleGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

            this.ctx.fillStyle = particleGradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles = [];
    }
}
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx += (dx / distance) * force * 0.01;
                    particle.vy += (dy / distance) * force * 0.01;
                }
            }

            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Update life
            particle.life--;
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
                this.createParticle();
            }

            // Update opacity based on life
            particle.opacity = (particle.life / particle.maxLife) * 0.5 + 0.1;
        });

        // Update connections
        this.updateConnections();
    }

    updateConnections() {
        this.particles.forEach(particle => {
            particle.connections = [];
        });

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    p1.connections.push({ particle: p2, distance });
                    p2.connections.push({ particle: p1, distance });
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections first
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 0.5;

        this.particles.forEach(particle => {
            particle.connections.forEach(connection => {
                const opacity = (1 - connection.distance / 150) * 0.1;
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(connection.particle.x, connection.particle.y);
                this.ctx.stroke();
            });
        });

        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Background Gradient System
class BackgroundGradient {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.animationId = null;
        this.mouse = { x: 0.5, y: 0.5 };
        this.targetMouse = { x: 0.5, y: 0.5 };

        this.resize();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        // Mouse tracking for interactive lighting
        document.addEventListener('mousemove', (e) => {
            this.targetMouse.x = e.clientX / window.innerWidth;
            this.targetMouse.y = e.clientY / window.innerHeight;
        });
    }

    draw() {
        // Smooth mouse interpolation
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.02;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.02;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Create multiple layered gradients for depth
        this.drawBaseGradient();
        this.drawSoftLighting();
        this.drawDynamicOrbs();
    }

    drawBaseGradient() {
        // Smooth animated base gradient
        const time = this.time * 0.0005;
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width * 0.5, this.canvas.height * 0.5, 0,
            this.canvas.width * 0.5, this.canvas.height * 0.5,
            Math.max(this.canvas.width, this.canvas.height) * 0.8
        );

        // Subtle color variations
        const hue1 = (Math.sin(time) * 10 + 200) % 360;
        const hue2 = (Math.sin(time * 0.7) * 5 + 220) % 360;

        gradient.addColorStop(0, `hsla(${hue1}, 8%, 6%, 0.9)`);
        gradient.addColorStop(0.4, `hsla(${hue2}, 6%, 8%, 0.7)`);
        gradient.addColorStop(0.7, `hsla(${(hue1 + 60) % 360}, 4%, 10%, 0.5)`);
        gradient.addColorStop(1, `hsla(${(hue2 + 30) % 360}, 2%, 12%, 0.8)`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSoftLighting() {
        // Mouse-responsive soft lighting
        const lightX = this.mouse.x * this.canvas.width;
        const lightY = this.mouse.y * this.canvas.height;

        // Main light blob
        const mainLight = this.ctx.createRadialGradient(
            lightX, lightY, 0,
            lightX, lightY, 300
        );
        mainLight.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        mainLight.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
        mainLight.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.ctx.fillStyle = mainLight;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Secondary light for depth
        const secondaryLight = this.ctx.createRadialGradient(
            this.canvas.width - lightX * 0.3, this.canvas.height - lightY * 0.3, 0,
            this.canvas.width - lightX * 0.3, this.canvas.height - lightY * 0.3, 200
        );
        secondaryLight.addColorStop(0, 'rgba(200, 200, 200, 0.04)');
        secondaryLight.addColorStop(1, 'rgba(200, 200, 200, 0)');

        this.ctx.fillStyle = secondaryLight;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawDynamicOrbs() {
        const time = this.time * 0.001;
        const orbs = [
            {
                x: this.canvas.width * 0.2 + Math.sin(time) * 50,
                y: this.canvas.height * 0.3 + Math.cos(time * 0.8) * 30,
                radius: 150,
                opacity: 0.06,
                color: 'rgba(255, 255, 255, 0.08)'
            },
            {
                x: this.canvas.width * 0.8 + Math.sin(time * 1.2) * 40,
                y: this.canvas.height * 0.7 + Math.cos(time * 0.6) * 35,
                radius: 120,
                opacity: 0.04,
                color: 'rgba(220, 220, 220, 0.06)'
            },
            {
                x: this.canvas.width * 0.6 + Math.sin(time * 0.9) * 60,
                y: this.canvas.height * 0.2 + Math.cos(time * 1.1) * 25,
                radius: 100,
                opacity: 0.05,
                color: 'rgba(180, 180, 180, 0.05)'
            },
            {
                x: this.canvas.width * 0.1 + Math.sin(time * 1.5) * 45,
                y: this.canvas.height * 0.8 + Math.cos(time * 0.7) * 40,
                radius: 80,
                opacity: 0.03,
                color: 'rgba(150, 150, 150, 0.04)'
            }
        ];

        orbs.forEach(orb => {
            const gradient = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.radius
            );
            gradient.addColorStop(0, orb.color);
            gradient.addColorStop(0.7, orb.color.replace('0.', '0.0'));
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.time++;
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Floating Shapes System
class FloatingShapes {
    constructor() {
        this.shapes = [];
        this.maxShapes = 8;
        this.init();
        this.animate();
    }

    init() {
        for (let i = 0; i < this.maxShapes; i++) {
            this.createShape();
        }
    }

    createShape() {
        const shape = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 100 + 50,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.01,
            opacity: Math.random() * 0.1 + 0.05,
            type: Math.floor(Math.random() * 3), // 0: circle, 1: square, 2: triangle
            color: this.getRandomShapeColor()
        };
        this.shapes.push(shape);
    }

    getRandomShapeColor() {
        const colors = [
            'rgba(255, 255, 255, 0.03)',
            'rgba(200, 200, 200, 0.02)',
            'rgba(150, 150, 150, 0.025)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.shapes.forEach((shape, index) => {
            shape.x += shape.vx;
            shape.y += shape.vy;
            shape.rotation += shape.rotationSpeed;

            // Wrap around edges
            if (shape.x < -shape.size) shape.x = window.innerWidth + shape.size;
            if (shape.x > window.innerWidth + shape.size) shape.x = -shape.size;
            if (shape.y < -shape.size) shape.y = window.innerHeight + shape.size;
            if (shape.y > window.innerHeight + shape.size) shape.y = -shape.size;

            // Update DOM element
            const element = document.querySelector(`.shape-${index + 1}`);
            if (element) {
                element.style.transform = `translate(${shape.x}px, ${shape.y}px) rotate(${shape.rotation}rad)`;
                element.style.opacity = shape.opacity;
                element.style.background = shape.color;
            }
        });
    }

    animate() {
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particleSystem = new ParticleSystem('particles-canvas');

    // Initialize background gradient
    const backgroundGradient = new BackgroundGradient('background-canvas');

    // Initialize floating shapes
    const floatingShapes = new FloatingShapes();

    // Add performance monitoring
    let frameCount = 0;
    let lastTime = performance.now();

    function monitorPerformance() {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            console.log(`FPS: ${fps}`);
            frameCount = 0;
            lastTime = currentTime;
        }

        requestAnimationFrame(monitorPerformance);
    }

    // Uncomment to enable performance monitoring
    // monitorPerformance();
});

// Export for potential use in other files
window.ParticleSystem = ParticleSystem;
window.BackgroundGradient = BackgroundGradient;
window.FloatingShapes = FloatingShapes;
