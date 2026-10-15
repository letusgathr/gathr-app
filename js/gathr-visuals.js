/**
 * GATHR Creative Visual Engine
 * Powers the 5 Visual Paradigms:
 * 1. Shader Gradient: WebGL / 2D Canvas Fluid Organic Dynamic Mesh Gradient
 * 2. Liquid Logo: Molten Chrome Shimmer & Interactive Ripple
 * 3. Liquid Glass JS: Dynamic Cursor Glare & Apple-Style VisionOS Refraction
 * 4. 3D Objects & Holographic Pass: Three.js / Canvas Interactive 3D Perspective
 * 5. Scroll World: Cinematic Parallax & Kinetic Scroll Reveals
 */

class GathrVisualEngine {
  constructor() {
    this.gradientCanvas = null;
    this.gradientCtx = null;
    this.gradientAnimId = null;
    this.time = 0;
    
    this.liquidLogoCanvas = null;
    this.liquidLogoCtx = null;
    this.logoRipple = { x: 19, y: 19, intensity: 0 };

    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }

  init() {
    this.initShaderGradient();
    this.initLiquidLogo();
    this.initLiquidGlassTracking();
    this.init3DHolographicPass();
    this.initScrollWorld();
    this.bindWindowEvents();
  }

  // ==========================================================
  // 1. SHADER GRADIENT: Fluid Organic Moving Dynamic Gradient
  // ==========================================================
  initShaderGradient() {
    this.gradientCanvas = document.getElementById('shader-gradient-canvas');
    if (!this.gradientCanvas) {
      this.gradientCanvas = document.createElement('canvas');
      this.gradientCanvas.id = 'shader-gradient-canvas';
      document.body.prepend(this.gradientCanvas);

      const noiseOverlay = document.createElement('div');
      noiseOverlay.className = 'ambient-noise-overlay';
      document.body.prepend(noiseOverlay);
    }
    this.gradientCtx = this.gradientCanvas.getContext('2d');
    this.resizeGradientCanvas();

    const render = () => {
      this.time += 0.006;
      this.drawShaderGradient();
      this.gradientAnimId = requestAnimationFrame(render);
    };
    render();
  }

  resizeGradientCanvas() {
    if (!this.gradientCanvas) return;
    this.gradientCanvas.width = window.innerWidth;
    this.gradientCanvas.height = window.innerHeight;
  }

  drawShaderGradient() {
    const ctx = this.gradientCtx;
    const w = this.gradientCanvas.width;
    const h = this.gradientCanvas.height;

    // Fill base deep obsidian dark
    ctx.fillStyle = '#08080C';
    ctx.fillRect(0, 0, w, h);

    // Dynamic wave coordinates
    const cx1 = w * (0.35 + 0.25 * Math.sin(this.time * 0.9));
    const cy1 = h * (0.35 + 0.2 * Math.cos(this.time * 0.7));
    const r1 = Math.max(w, h) * 0.55;

    const g1 = ctx.createRadialGradient(cx1, cy1, 10, cx1, cy1, r1);
    g1.addColorStop(0, 'rgba(255, 85, 0, 0.28)'); // Cyber Orange
    g1.addColorStop(0.5, 'rgba(255, 140, 0, 0.12)'); // Molten Amber
    g1.addColorStop(1, 'rgba(8, 8, 12, 0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const cx2 = w * (0.75 + 0.2 * Math.cos(this.time * 0.8));
    const cy2 = h * (0.65 + 0.25 * Math.sin(this.time * 1.1));
    const r2 = Math.max(w, h) * 0.6;

    const g2 = ctx.createRadialGradient(cx2, cy2, 10, cx2, cy2, r2);
    g2.addColorStop(0, 'rgba(121, 40, 202, 0.22)'); // Electric Violet
    g2.addColorStop(0.5, 'rgba(0, 112, 243, 0.08)'); // Deep Cyber Blue
    g2.addColorStop(1, 'rgba(8, 8, 12, 0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    // Accent floating amber aura
    const cx3 = w * (0.5 + 0.3 * Math.sin(this.time * 1.4));
    const cy3 = h * (0.2 + 0.15 * Math.sin(this.time * 0.6));
    const r3 = Math.max(w, h) * 0.35;

    const g3 = ctx.createRadialGradient(cx3, cy3, 5, cx3, cy3, r3);
    g3.addColorStop(0, 'rgba(255, 170, 0, 0.18)');
    g3.addColorStop(1, 'rgba(8, 8, 12, 0)');
    ctx.fillStyle = g3;
    ctx.fillRect(0, 0, w, h);
  }

  // ==========================================================
  // 2. LIQUID LOGO: Molten Chrome Shimmer & Interactive Ripple
  // ==========================================================
  initLiquidLogo() {
    const emblem = document.querySelector('.liquid-metal-emblem');
    if (!emblem) return;

    this.liquidLogoCanvas = document.createElement('canvas');
    this.liquidLogoCanvas.className = 'liquid-metal-canvas';
    this.liquidLogoCanvas.width = 76;
    this.liquidLogoCanvas.height = 76;
    emblem.appendChild(this.liquidLogoCanvas);
    this.liquidLogoCtx = this.liquidLogoCanvas.getContext('2d');

    emblem.addEventListener('mousemove', (e) => {
      const rect = emblem.getBoundingClientRect();
      this.logoRipple.x = (e.clientX - rect.left) * 2;
      this.logoRipple.y = (e.clientY - rect.top) * 2;
      this.logoRipple.intensity = 1.0;
    });

    const drawLogo = () => {
      if (this.liquidLogoCtx) {
        const ctx = this.liquidLogoCtx;
        const w = 76;
        const h = 76;
        ctx.clearRect(0, 0, w, h);

        const grad = ctx.createLinearGradient(0, 0, w, h);
        const shift = Math.sin(this.time * 2) * 20;
        grad.addColorStop(0, '#22222E');
        grad.addColorStop(0.35, '#555566');
        grad.addColorStop(0.5 + Math.sin(this.time * 3) * 0.1, '#FFFFFF'); // Molten Chrome Glare
        grad.addColorStop(0.7, '#FF5500'); // Orange reflection
        grad.addColorStop(1, '#111118');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Draw GATHR "G" emblem geometry
        ctx.save();
        ctx.beginPath();
        ctx.arc(38, 38, 22, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(38, 38);
        ctx.closePath();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Inner glowing orange core
        ctx.beginPath();
        ctx.arc(38, 38, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF5500';
        ctx.shadowColor = '#FF5500';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        // Ripple dissipation
        if (this.logoRipple.intensity > 0.02) {
          ctx.beginPath();
          ctx.arc(this.logoRipple.x, this.logoRipple.y, 18 * (1 - this.logoRipple.intensity + 0.1), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${this.logoRipple.intensity * 0.8})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          this.logoRipple.intensity *= 0.94;
        }
      }
      requestAnimationFrame(drawLogo);
    };
    drawLogo();
  }

  // ==========================================================
  // 3. LIQUID GLASS JS: Dynamic Cursor Glare & VisionOS Glass
  // ==========================================================
  initLiquidGlassTracking() {
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.liquid-glass-card, .event-card, .navbar');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // ==========================================================
  // 4. 3D OBJECTS & HOLOGRAPHIC PASS (Three.js / Tilt Physics)
  // ==========================================================
  init3DHolographicPass() {
    const passCard = document.querySelector('.ticket-pass');
    if (!passCard) return;

    passCard.classList.add('tilt-3d');
    
    // Add holographic overlay layer if not present
    if (!passCard.querySelector('.holographic-glare-layer')) {
      const glare = document.createElement('div');
      glare.className = 'holographic-glare-layer';
      passCard.appendChild(glare);
    }

    const wrapper = document.querySelector('.ticket-pass-wrapper');
    if (wrapper) {
      wrapper.classList.add('pass-3d-scene-wrap');
      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotY = (x / (rect.width / 2)) * 16;
        const rotX = -(y / (rect.height / 2)) * 16;
        
        passCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        const glare = passCard.querySelector('.holographic-glare-layer');
        if (glare) {
          const glareX = 50 + (x / rect.width) * 60;
          const glareY = 50 + (y / rect.height) * 60;
          glare.style.background = `linear-gradient(${115 + rotY * 2}deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(0,255,240,0.3) ${glareX - 10}%, rgba(255,0,128,0.3) ${glareX}%, rgba(255,180,0,0.25) ${glareX + 10}%, transparent 100%)`;
        }
      });

      wrapper.addEventListener('mouseleave', () => {
        passCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    }
  }

  // ==========================================================
  // 5. SCROLL WORLD: Cinematic Parallax & Storytelling
  // ==========================================================
  initScrollWorld() {
    const revealEls = document.querySelectorAll('.cinematic-reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, { threshold: 0.15 });

      revealEls.forEach(el => observer.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // Parallax scrolling elements
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxEls = document.querySelectorAll('[data-parallax]');
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax') || '0.2');
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    }, { passive: true });
  }

  bindWindowEvents() {
    window.addEventListener('resize', () => {
      this.resizeGradientCanvas();
    });
  }
}

// Global instance
window.gathrVisuals = new GathrVisualEngine();
document.addEventListener('DOMContentLoaded', () => {
  window.gathrVisuals.init();
});
