/* ============================================================
   Particle Systems — Floating Hearts, Stars, Glitter, Rain
   ============================================================ */

(function () {
  "use strict";

  const heartsCanvas = document.getElementById("hearts-canvas");
  const particlesCanvas = document.getElementById("particles-canvas");
  const bgCanvas = document.getElementById("bg-canvas");

  if (!heartsCanvas || !particlesCanvas || !bgCanvas) return;

  const hCtx = heartsCanvas.getContext("2d");
  const pCtx = particlesCanvas.getContext("2d");
  const bCtx = bgCanvas.getContext("2d");

  let W = 0;
  let H = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let mouseX = -9999;
  let mouseY = -9999;
  let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    [heartsCanvas, particlesCanvas, bgCanvas].forEach((c) => {
      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = W + "px";
      c.style.height = H + "px";
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });

  window.addEventListener(
    "pointermove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  /* ---------- Helpers ---------- */
  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  /* =========================================================
     FLOATING HEARTS
     ========================================================= */
  const HEART_COLORS = [
    "#FF1744",
    "#FF80AB",
    "#F48FB1",
    "#FF4081",
    "#E91E63",
    "#FFD700",
    "#FF5252",
    "#F8BBD0",
  ];

  class Heart {
    constructor(burst) {
      this.reset(burst);
    }

    reset(burst) {
      this.x = rand(0, W);
      this.y = burst ? rand(H * 0.3, H * 0.7) : rand(H + 20, H + 200);
      this.size = rand(6, 22);
      this.speed = rand(0.3, 1.4);
      this.drift = rand(-0.6, 0.6);
      this.wobble = rand(0, Math.PI * 2);
      this.wobbleSpeed = rand(0.01, 0.04);
      this.opacity = rand(0.25, 0.9);
      this.color = pick(HEART_COLORS);
      this.rotation = rand(0, Math.PI * 2);
      this.rotSpeed = rand(-0.02, 0.02);
      this.pulse = rand(0, Math.PI * 2);
      this.glow = Math.random() > 0.6;
      if (burst) {
        this.vx = rand(-4, 4);
        this.vy = rand(-6, -1);
        this.life = 1;
        this.isBurst = true;
      } else {
        this.isBurst = false;
      }
    }

    update() {
      if (this.isBurst) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08;
        this.vx *= 0.99;
        this.life -= 0.012;
        this.opacity = this.life;
        this.rotation += this.rotSpeed * 2;
        if (this.life <= 0) this.reset(false);
        return;
      }

      this.y -= this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * 0.5 + this.drift * 0.15;
      this.rotation += this.rotSpeed;
      this.pulse += 0.04;

      // Mouse attraction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140 && dist > 1) {
        this.x -= (dx / dist) * 0.8;
        this.y -= (dy / dist) * 0.8;
      }

      if (this.y < -40 || this.x < -40 || this.x > W + 40) {
        this.reset(false);
        this.y = H + rand(10, 80);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      const s = this.size * (1 + Math.sin(this.pulse) * 0.08);
      ctx.scale(s / 16, s / 16);
      ctx.globalAlpha = Math.max(0, this.opacity);

      if (this.glow) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 16;
      }

      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Classic heart path
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo(-10, -6, -16, 2, 0, 14);
      ctx.bezierCurveTo(16, 2, 10, -6, 0, 4);
      ctx.fill();

      // Highlight
      ctx.globalAlpha = Math.max(0, this.opacity * 0.35);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(-4, 0, 3, 4, -0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  const heartCount = reducedMotion ? 20 : Math.min(90, Math.floor((W * H) / 14000));
  const hearts = Array.from({ length: heartCount }, () => new Heart(false));

  /* =========================================================
     SPARKLES / STARS / GLITTER
     ========================================================= */
  class Sparkle {
    constructor() {
      this.reset(true);
    }

    reset(init) {
      this.x = rand(0, W);
      this.y = rand(0, H);
      this.size = rand(0.5, 2.5);
      this.twinkle = rand(0, Math.PI * 2);
      this.speed = rand(0.02, 0.08);
      this.opacity = 0;
      this.maxOp = rand(0.4, 1);
      this.color = pick(["#FFD700", "#FFF", "#FF80AB", "#FFE082", "#FF1744"]);
      this.life = init ? rand(0, 1) : 0;
      this.lifeSpeed = rand(0.005, 0.015);
      this.vx = rand(-0.15, 0.15);
      this.vy = rand(-0.2, 0.05);
    }

    update() {
      this.life += this.lifeSpeed;
      this.twinkle += this.speed;
      this.x += this.vx;
      this.y += this.vy;

      if (this.life < 0.3) this.opacity = (this.life / 0.3) * this.maxOp;
      else if (this.life > 0.7) this.opacity = ((1 - this.life) / 0.3) * this.maxOp;
      else this.opacity = this.maxOp;

      if (this.life >= 1 || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset(false);
      }
    }

    draw(ctx) {
      const s = this.size * (0.6 + Math.sin(this.twinkle) * 0.4);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;

      // 4-point star
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        const a2 = a + Math.PI / 4;
        ctx.lineTo(Math.cos(a) * s * 2.2, Math.sin(a) * s * 2.2);
        ctx.lineTo(Math.cos(a2) * s * 0.5, Math.sin(a2) * s * 0.5);
      }
      ctx.closePath();
      ctx.fill();

      // Center glow
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.globalAlpha = Math.max(0, this.opacity * 0.8);
      ctx.fill();
      ctx.restore();
    }
  }

  const sparkleCount = reducedMotion ? 30 : Math.min(160, Math.floor((W * H) / 8000));
  const sparkles = Array.from({ length: sparkleCount }, () => new Sparkle());

  /* =========================================================
     GOLDEN DUST PARTICLES
     ========================================================= */
  class Dust {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = rand(0, W);
      this.y = rand(0, H);
      this.size = rand(0.8, 2.2);
      this.vx = rand(-0.3, 0.3);
      this.vy = rand(-0.4, -0.05);
      this.opacity = rand(0.15, 0.55);
      this.hue = rand(40, 55); // gold range
    }

    update() {
      this.x += this.vx + Math.sin(this.y * 0.01) * 0.2;
      this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) {
        this.reset();
        this.y = H + 10;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const dustCount = reducedMotion ? 15 : 60;
  const dusts = Array.from({ length: dustCount }, () => new Dust());

  /* =========================================================
     BACKGROUND GRADIENT ORBS
     ========================================================= */
  const orbs = [
    { x: 0.2, y: 0.3, r: 280, c: "rgba(255,23,68,0.12)", px: 0, py: 0, t: 0 },
    { x: 0.75, y: 0.6, r: 320, c: "rgba(197,17,98,0.1)", px: 0, py: 0, t: 1.5 },
    { x: 0.5, y: 0.8, r: 250, c: "rgba(255,215,0,0.06)", px: 0, py: 0, t: 3 },
    { x: 0.85, y: 0.2, r: 200, c: "rgba(255,128,171,0.1)", px: 0, py: 0, t: 2 },
  ];

  function drawBackground(t) {
    bCtx.clearRect(0, 0, W, H);

    // Subtle vignette grid of noise-like stars
    orbs.forEach((o, i) => {
      o.t += 0.004;
      const ox = o.x * W + Math.sin(o.t + i) * 40;
      const oy = o.y * H + Math.cos(o.t * 0.8 + i) * 30;
      const g = bCtx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
      g.addColorStop(0, o.c);
      g.addColorStop(1, "transparent");
      bCtx.fillStyle = g;
      bCtx.fillRect(0, 0, W, H);
    });
  }

  /* =========================================================
     ANIMATION LOOP
     ========================================================= */
  let raf = 0;
  let last = 0;

  function frame(ts) {
    raf = requestAnimationFrame(frame);
    if (reducedMotion && ts - last < 50) return;
    last = ts;

    drawBackground(ts * 0.001);

    // Sparkles + dust
    pCtx.clearRect(0, 0, W, H);
    sparkles.forEach((s) => {
      s.update();
      s.draw(pCtx);
    });
    dusts.forEach((d) => {
      d.update();
      d.draw(pCtx);
    });

    // Hearts
    hCtx.clearRect(0, 0, W, H);
    hearts.forEach((h) => {
      h.update();
      h.draw(hCtx);
    });
  }

  raf = requestAnimationFrame(frame);

  /* =========================================================
     PUBLIC API
     ========================================================= */
  window.LoveParticles = {
    burst(x, y, count) {
      count = count || 24;
      for (let i = 0; i < count; i++) {
        const h = new Heart(true);
        h.x = x + rand(-20, 20);
        h.y = y + rand(-20, 20);
        h.vx = rand(-5, 5);
        h.vy = rand(-8, -1);
        h.size = rand(8, 20);
        h.life = 1;
        h.isBurst = true;
        // Replace oldest non-burst or push
        const idx = hearts.findIndex((hh) => !hh.isBurst);
        if (idx >= 0) hearts[idx] = h;
        else if (hearts.length < 200) hearts.push(h);
      }
    },

    heartRain(duration) {
      duration = duration || 3000;
      const start = performance.now();
      const rain = () => {
        if (performance.now() - start > duration) return;
        for (let i = 0; i < 3; i++) {
          const h = new Heart(false);
          h.x = rand(0, W);
          h.y = -rand(10, 60);
          h.speed = rand(1.5, 3.5);
          h.size = rand(10, 26);
          h.opacity = rand(0.5, 1);
          const idx = hearts.findIndex((hh) => !hh.isBurst && hh.y < -20);
          if (idx >= 0) hearts[idx] = h;
          else if (hearts.length < 180) hearts.push(h);
        }
        requestAnimationFrame(rain);
      };
      rain();
    },

    resize,
  };
})();
