/* ============================================================
   BAZHDAR & SHAZIN — Main Application Logic
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Config ---------- */
  // Anniversary / start date for love counter (customize)
  const LOVE_START = new Date("2023-02-14T00:00:00");

  const LETTERS = [
    {
      title: "بۆ شازین، دڵی من",
      body: `خۆشەویستەکەم شازین،

هەر کاتێک چاوت دەبینم، جیهان دەوەستێت. تۆ نەک تەنها خۆشەویستیم، بەڵکو هەناسەم، خەونم، و هۆکاری هەموو پێکەنینێکی منی.

لەو ڕۆژەوە کە ناسیومت، ژیان ڕەنگێکی نوێی وەرگرتووە — ڕەنگی ئاڵ و زێڕ و هەموو ئەو شتانەی کە جوانن.

بەڵێنت پێدەدەم کە هەمیشە لە کەنارت بم، لە هەموو خۆشی و ناخۆشییەکدا، لە هەموو بەیانێک و هەموو ئێوارەیەکدا.

لە دڵمەوە بۆ هەمیشە.

تۆم خۆشدەوێت، زیاتر لە ئەستێرەکان.`,
      sign: "— بەژدار ❤",
    },
    {
      title: "بۆ بەژدار، ڕووناکیم",
      body: `بەژداری دڵم،

تۆ ڕووناکیی ژیانمی. کاتێک تۆم بینی، زانیم کە چارەنووس ڕێگایەکی تایبەتی بۆ ئێمە نوسیوە.

هەر وشەیەکت، هەر پێکەنینێکت، هەر دەستێکت — هەموویان دڵم دەکەنە ماڵێکی گەرم و پڕ لە خۆشەویستی.

سوپاس بۆ ئەوەی کە تۆی. سوپاس بۆ ئەوەی کە هەموو ڕۆژێک هەڵدەبژێریت بمخوێنیتەوە وەک یەکەم جار.

من تۆم بۆ هەمیشە دەوێت — لەم ژیانە و لە هەموو ژیانێکی تردا.`,
      sign: "— شازین ❤",
    },
    {
      title: "بۆ یەکتر — بەڵێنەکەمان",
      body: `ئێمە، بەژدار و شازین،

بەڵێن دەدەین کە خۆشەویستییەکەمان بپارێزین وەک گەوهەرێکی دەگمەن.

بەڵێن دەدەین کە پێکەنینمان لە بیر نەچێت، کە دەستەکانمان هەرگیز جیا نەبنەوە، و کە هەر سبەیەک بە «سڵاو، خۆشەویستەکەم» دەست پێبکەین.

پێکەوە، ئێمە هێزین.
پێکەوە، ئێمە خۆشەویستین.
پێکەوە، ئێمە هەمیشەیین.

❤️ BAZHDAR & SHAZIN ❤️
Love Forever`,
      sign: "— بۆ هەمیشە پێکەوە ♾️",
    },
  ];

  const GALLERY = [
    { emoji: "💑", caption: "یەکەم یادی", grad: "linear-gradient(135deg,#ff1744,#c51162)" },
    { emoji: "🌹", caption: "گوڵە سوورەکان", grad: "linear-gradient(135deg,#e91e63,#ad1457)" },
    { emoji: "🌙", caption: "شەوی ئەستێرە", grad: "linear-gradient(135deg,#4a148c,#880e4f)" },
    { emoji: "☕", caption: "قاوەی بەیانی", grad: "linear-gradient(135deg,#6d4c41,#3e2723)" },
    { emoji: "🌊", caption: "سەفەری دەریا", grad: "linear-gradient(135deg,#0277bd,#01579b)" },
    { emoji: "🎂", caption: "جێژنی لەدایکبوون", grad: "linear-gradient(135deg,#ff6f00,#e65100)" },
    { emoji: "💍", caption: "بەڵێنی هەمیشەیی", grad: "linear-gradient(135deg,#ffd700,#ff8f00)" },
    { emoji: "🌅", caption: "خۆرئاوابوون", grad: "linear-gradient(135deg,#ff1744,#ff6f00)" },
    { emoji: "🎵", caption: "گۆرانی ئێمە", grad: "linear-gradient(135deg,#7b1fa2,#4a148c)" },
    { emoji: "🕊️", caption: "ئاشتی دڵ", grad: "linear-gradient(135deg,#81d4fa,#f8bbd0)" },
    { emoji: "🌸", caption: "بەهاری خۆشەویستی", grad: "linear-gradient(135deg,#f48fb1,#fce4ec)" },
    { emoji: "♾️", caption: "بۆ هەمیشە", grad: "linear-gradient(135deg,#ff1744,#ffd700)" },
  ];

  /* ---------- DOM Ready ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initNav();
    initReveal();
    initCounters();
    initGallery();
    initLetters();
    initHeartClick();
    initFireworks();
    initPetals();
    initMusic();
    initLiveLoveCounter();
    initYear();
    initCursorHearts();
    initLang();
    initSW();

    // GSAP enhancements when available
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      initGSAP();
    }
  });

  function initSW() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  /* ---------- Loader ---------- */
  function initLoader() {
    const loader = document.getElementById("loader");
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader?.classList.add("hide");
        document.body.classList.add("loaded");
        // Entrance rain of hearts
        setTimeout(() => {
          window.LoveParticles?.heartRain(2500);
        }, 400);
      }, 2000);
    });
    // Fallback
    setTimeout(() => loader?.classList.add("hide"), 4000);
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");
    const anchors = links?.querySelectorAll("a") || [];

    window.addEventListener(
      "scroll",
      () => {
        nav?.classList.toggle("scrolled", window.scrollY > 40);
        // Active section
        const sections = document.querySelectorAll("section[id]");
        let current = "";
        sections.forEach((s) => {
          if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        anchors.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + current);
        });
      },
      { passive: true }
    );

    toggle?.addEventListener("click", () => {
      toggle.classList.toggle("open");
      links?.classList.toggle("open");
    });

    anchors.forEach((a) => {
      a.addEventListener("click", () => {
        toggle?.classList.remove("open");
        links?.classList.remove("open");
      });
    });
  }

  /* ---------- Scroll Reveal ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Love Counters ---------- */
  function initCounters() {
    const daysEl = document.getElementById("love-days");
    const hoursEl = document.getElementById("love-hours");

    function update() {
      const now = new Date();
      const diff = now - LOVE_START;
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor(diff / 3600000);

      if (daysEl) animateNumber(daysEl, days);
      if (hoursEl) hoursEl.textContent = hours.toLocaleString("en");
    }

    update();
    setInterval(update, 60000);
  }

  function animateNumber(el, target) {
    const start = parseInt(el.textContent.replace(/\D/g, ""), 10) || 0;
    if (start === target) {
      el.textContent = target.toLocaleString("en");
      return;
    }
    const dur = 1200;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(start + (target - start) * eased).toLocaleString("en");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Gallery ---------- */
  function initGallery() {
    const wall = document.getElementById("polaroid-wall");
    if (!wall) return;

    GALLERY.forEach((item, i) => {
      const el = document.createElement("div");
      el.className = "polaroid reveal";
      el.style.transitionDelay = `${(i % 6) * 0.08}s`;
      el.innerHTML = `
        <div class="polaroid-tape"></div>
        <div class="polaroid-img">
          <div class="grad" style="background:${item.grad}">${item.emoji}</div>
        </div>
        <div class="polaroid-caption">${item.caption}</div>
      `;
      el.addEventListener("click", (e) => {
        spawnClickHearts(e.clientX, e.clientY, 8);
        window.LoveParticles?.burst(e.clientX, e.clientY, 16);
      });
      wall.appendChild(el);
    });

    // Re-observe new reveals
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    wall.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------- Letters Modal ---------- */
  function initLetters() {
    const modal = document.getElementById("letter-modal");
    const title = document.getElementById("modal-letter-title");
    const body = document.getElementById("modal-letter-body");
    const sign = document.getElementById("modal-letter-sign");
    const closeBtn = modal?.querySelector(".modal-close");
    const backdrop = modal?.querySelector(".modal-backdrop");

    document.querySelectorAll(".letter-card").forEach((card) => {
      const open = () => {
        const idx = parseInt(card.dataset.letter, 10);
        const letter = LETTERS[idx];
        if (!letter || !modal) return;
        title.textContent = letter.title;
        body.textContent = letter.body;
        sign.textContent = letter.sign;
        modal.hidden = false;
        requestAnimationFrame(() => modal.classList.add("open"));
        document.body.style.overflow = "hidden";
      };
      card.querySelector(".letter-open")?.addEventListener("click", open);
      card.addEventListener("dblclick", open);
    });

    function close() {
      modal?.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => {
        if (modal) modal.hidden = true;
      }, 350);
    }

    closeBtn?.addEventListener("click", close);
    backdrop?.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal?.classList.contains("open")) close();
    });
  }

  /* ---------- Heart Click Interaction ---------- */
  function initHeartClick() {
    const stage = document.getElementById("heart-stage");
    const heart = document.getElementById("heart-3d");
    if (!stage || !heart) return;

    stage.addEventListener("click", (e) => {
      heart.classList.remove("burst");
      void heart.offsetWidth;
      heart.classList.add("burst");

      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      window.LoveParticles?.burst(cx, cy, 36);
      window.Heart3D?.pulse();
      spawnClickHearts(cx, cy, 14);
      spawnFireworks(cx, cy, 28);

      // Haptic if available
      if (navigator.vibrate) navigator.vibrate(30);
    });
  }

  /* ---------- Fireworks of Hearts ---------- */
  function initFireworks() {
    document.getElementById("fireworks-btn")?.addEventListener("click", () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      for (let wave = 0; wave < 5; wave++) {
        setTimeout(() => {
          const x = cx + (Math.random() - 0.5) * window.innerWidth * 0.6;
          const y = cy + (Math.random() - 0.5) * window.innerHeight * 0.4;
          spawnFireworks(x, y, 30);
          window.LoveParticles?.burst(x, y, 20);
        }, wave * 280);
      }
      window.LoveParticles?.heartRain(4000);
    });
  }

  function spawnFireworks(x, y, count) {
    const hearts = ["❤️", "💕", "💖", "💗", "💓", "💝", "✨", "⭐", "💛"];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "fw-heart";
      el.textContent = hearts[i % hearts.length];
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const dist = 80 + Math.random() * 160;
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.setProperty("--tx", Math.cos(angle) * dist + "px");
      el.style.setProperty("--ty", Math.sin(angle) * dist + "px");
      el.style.setProperty("--rot", (Math.random() * 60 - 30) + "deg");
      el.style.fontSize = 0.8 + Math.random() * 1.2 + "rem";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }

  function spawnClickHearts(x, y, count) {
    const set = ["❤️", "💕", "💖", "💗", "✨"];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "click-heart";
      el.textContent = set[i % set.length];
      el.style.left = x + (Math.random() - 0.5) * 40 + "px";
      el.style.top = y + (Math.random() - 0.5) * 20 + "px";
      el.style.fontSize = 1 + Math.random() * 1.2 + "rem";
      el.style.transitionDelay = i * 0.03 + "s";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1300);
    }
  }

  /* ---------- Rose Petals ---------- */
  function initPetals() {
    const box = document.getElementById("petals");
    if (!box) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    function spawn() {
      const p = document.createElement("div");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 6 + Math.random() * 8 + "s";
      p.style.animationDelay = Math.random() * 2 + "s";
      p.style.opacity = 0.4 + Math.random() * 0.5;
      const s = 0.6 + Math.random() * 1.1;
      p.style.transform = `scale(${s})`;
      p.style.width = 10 + Math.random() * 10 + "px";
      p.style.height = 12 + Math.random() * 12 + "px";
      box.appendChild(p);
      setTimeout(() => p.remove(), 16000);
    }

    setInterval(spawn, 600);
    for (let i = 0; i < 8; i++) setTimeout(spawn, i * 200);
  }

  /* ---------- Background Music (Web Audio ambient) ---------- */
  function initMusic() {
    const btn = document.getElementById("music-toggle");
    if (!btn) return;

    let ctx = null;
    let playing = false;
    let nodes = [];

    function startAmbient() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const master = ctx.createGain();
      master.gain.value = 0.08;
      master.connect(ctx.destination);

      // Soft romantic pad — simple chord progression
      const notes = [
        [220.0, 277.18, 329.63], // A minor-ish
        [196.0, 246.94, 293.66], // G
        [174.61, 220.0, 261.63], // F
        [196.0, 246.94, 311.13], // G variant
      ];

      let step = 0;

      function playChord() {
        if (!playing || !ctx) return;
        const chord = notes[step % notes.length];
        step++;

        chord.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = i === 0 ? "sine" : "triangle";
          osc.frequency.value = freq;

          filter.type = "lowpass";
          filter.frequency.value = 800;

          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(0.15 / chord.length, ctx.currentTime + 1.5);
          g.gain.linearRampToValueAtTime(0.08 / chord.length, ctx.currentTime + 4);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + 7);

          osc.connect(filter);
          filter.connect(g);
          g.connect(master);

          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 7.2);
          nodes.push(osc);
        });

        // Soft high sparkle
        const sparkle = ctx.createOscillator();
        const sg = ctx.createGain();
        sparkle.type = "sine";
        sparkle.frequency.value = 880 + Math.random() * 440;
        sg.gain.setValueAtTime(0, ctx.currentTime);
        sg.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1);
        sg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        sparkle.connect(sg);
        sg.connect(master);
        sparkle.start();
        sparkle.stop(ctx.currentTime + 1.6);
      }

      playChord();
      const interval = setInterval(() => {
        if (!playing) {
          clearInterval(interval);
          return;
        }
        playChord();
      }, 5500);

      btn._musicInterval = interval;
    }

    function stopAmbient() {
      playing = false;
      if (btn._musicInterval) clearInterval(btn._musicInterval);
      if (ctx) {
        ctx.close().catch(() => {});
        ctx = null;
      }
      nodes = [];
    }

    btn.addEventListener("click", async () => {
      if (!playing) {
        playing = true;
        btn.classList.add("playing");
        startAmbient();
      } else {
        btn.classList.remove("playing");
        stopAmbient();
      }
    });
  }

  /* ---------- Live Love Counter ---------- */
  function initLiveLoveCounter() {
    const el = document.getElementById("live-love-counter");
    if (!el) return;
    let n = 1000000 + Math.floor((Date.now() - LOVE_START.getTime()) / 1000);
    el.textContent = n.toLocaleString("en");
    setInterval(() => {
      n += Math.floor(Math.random() * 3) + 1;
      el.textContent = n.toLocaleString("en");
    }, 2000);
  }

  /* ---------- Year ---------- */
  function initYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Cursor trail hearts (desktop) ---------- */
  function initCursorHearts() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let last = 0;
    document.addEventListener(
      "pointermove",
      (e) => {
        const now = performance.now();
        if (now - last < 80) return;
        last = now;
        if (Math.random() > 0.35) return;
        const el = document.createElement("span");
        el.className = "click-heart";
        el.textContent = Math.random() > 0.5 ? "💕" : "✨";
        el.style.left = e.clientX + "px";
        el.style.top = e.clientY + "px";
        el.style.fontSize = "0.7rem";
        el.style.opacity = "0.7";
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
      },
      { passive: true }
    );
  }

  /* ---------- Language Toggle (KU / EN) ---------- */
  function initLang() {
    const btn = document.getElementById("lang-toggle");
    if (!btn) return;

    const dict = {
      ku: {
        nav_home: "سەرەتا",
        nav_story: "چیرۆک",
        nav_gallery: "گالەری",
        nav_timeline: "کاتەکان",
        nav_letters: "نامەکان",
        nav_dreams: "خەونەکان",
      },
      en: {
        nav_home: "Home",
        nav_story: "Story",
        nav_gallery: "Gallery",
        nav_timeline: "Timeline",
        nav_letters: "Letters",
        nav_dreams: "Dreams",
      },
    };

    let lang = "ku";
    btn.addEventListener("click", () => {
      lang = lang === "ku" ? "en" : "ku";
      btn.textContent = lang === "ku" ? "KU" : "EN";
      document.documentElement.lang = lang === "ku" ? "ku" : "en";
      document.documentElement.dir = lang === "ku" ? "rtl" : "ltr";
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (dict[lang][key]) el.textContent = dict[lang][key];
      });
    });
  }

  /* ---------- GSAP polish ---------- */
  function initGSAP() {
    gsap.utils.toArray(".section-header").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%" },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    });

    gsap.utils.toArray(".story-card, .dream-card, .letter-card").forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 90%" },
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: (i % 3) * 0.1,
        ease: "power3.out",
      });
    });

    gsap.utils.toArray(".timeline-item").forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%" },
        x: 40,
        opacity: 0,
        duration: 0.75,
        delay: i * 0.05,
        ease: "power2.out",
      });
    });

    // Parallax hero glow
    gsap.to(".hero-glow", {
      scrollTrigger: { trigger: ".hero", scrub: true },
      scale: 1.4,
      opacity: 0.3,
    });
  }
})();
