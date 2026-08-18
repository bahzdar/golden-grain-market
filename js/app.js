/* Quran Kareem — app shell: router, theme, global events */
(function () {
  "use strict";

  let renderSeq = 0;
  const App = {
    route: null,
    async render() {
      const mySeq = ++renderSeq;
      this.applyTheme();
      document.documentElement.dir = I18N.lang === "en" ? "ltr" : "rtl";
      document.documentElement.lang = I18N.lang;
      this.renderShell();
      const { view, params, query } = parseHash(location.hash);
      const main = document.getElementById("main");
      main.innerHTML = "";
      main.scrollTop = 0;
      window.scrollTo(0, 0);

      let html = "";
      let after = null;
      try {
        switch (view) {
          case "home": html = await VCore.homeHTML(); break;
          case "quran": html = await VQuran.readerHTML(+params[0] || QK.state.lastRead?.s || 1, +params[1] || 1); break;
          case "surahs": html = VCore.surahsHTML(); after = () => VCore.renderSurahGrid(); break;
          case "tafsir": html = await VQuran.tafsirHTML(params[0] ? +params[0] : null); if (params[0]) after = () => VQuran.renderTafsirBody(+params[0]); break;
          case "audio": html = VQuran.audioHTML(); after = () => VQuran.renderAudioList(); break;
          case "reciters": html = VQuran.recitersHTML(); break;
          case "hadith": html = VMore.hadithHTML(); after = () => VMore.renderHadith(); break;
          case "prophets": html = VMore.prophetsHTML(params[0] ? +params[0] : null); break;
          case "knowledge": html = VMore.knowledgeHTML(params[0] === "article" && params[1] ? +params[1] : null); after = () => VMore.renderKnowledgeGrid(); break;
          case "adhkar": html = VMore.adhkarHTML(); after = () => VMore.renderAdhkar(); break;
          case "prayer": html = VMore.prayerHTML(); after = () => VMore.tickCountdown(); break;
          case "calendar": html = VMore.calendarHTML(params[0] ? +params[0] : 0); break;
          case "search": html = VMore.searchHTML(query.q || ""); after = () => { if (query.q) VMore.runSearch(query.q); }; break;
          case "dashboard": html = VMore.dashboardHTML(); break;
          case "quizzes": html = VMore.quizzesHTML(); break;
          case "quiz": html = VMore.quizRunnerHTML(params[0] ? +params[0] : 1); break;
          case "course": html = VMore.courseHTML(params[0] ? +params[0] : 1); break;
          case "assistant": html = VMore.assistantHTML(); break;
          case "auth": html = VMore.authHTML(); after = () => VMore.authInit(); break;
          case "bookmarks": html = await VQuran.bookmarksHTML(); break;
          case "settings": html = VMore.settingsHTML(); break;
          default: html = await VCore.homeHTML(); break;
        }
      } catch (e) {
        console.error(e);
        html = `<div class="empty">${I18N.t("common_error")}</div>`;
      }
      if (mySeq !== renderSeq) return; // a newer render started — abort
      main.innerHTML = html;
      if (after) after();
      this.updateActiveNav();
      this.renderAudioBar();
    },

    renderShell() {
      const header = document.getElementById("topbar-root");
      if (header) header.innerHTML = VCore.headerHTML();
      const bn = document.getElementById("bottomnav-root");
      if (bn) bn.innerHTML = VCore.bottomNavHTML();
      const ab = document.getElementById("audiobar-root");
      if (ab) ab.innerHTML = VCore.audioBarHTML();
      const sh = document.getElementById("sheet-root");
      if (sh) sh.innerHTML = "";
    },

    applyTheme() {
      const theme = QK.state.theme || "dark";
      document.documentElement.dataset.theme = theme;
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = theme === "dark" ? "#08121f" : "#f7f5ee";
    },

    updateActiveNav() {
      const h = location.hash.replace(/^#\/?/, "");
      const seg = h.split("/")[0] || "home";
      document.querySelectorAll("[data-nav]").forEach(a => {
        const k = a.dataset.nav;
        const target = { nav_home: "home", nav_quran: "quran", nav_surahs: "surahs", nav_tafsir: "tafsir", nav_hadith: "hadith", nav_audio: "audio", nav_reciters: "reciters", nav_prophets: "prophets", nav_adhkar: "adhkar", nav_prayer: "prayer", nav_calendar: "calendar", nav_knowledge: "knowledge" }[k];
        a.classList.toggle("on", target === seg || (seg === "surahs" && k === "nav_quran"));
      });
      document.querySelectorAll(".bottomnav a").forEach(a => {
        a.classList.toggle("on", a.dataset.bn === seg || (seg === "surahs" && a.dataset.bn === "quran"));
      });
    },

    renderAudioBar() {
      const ab = document.getElementById("audiobar-root");
      if (ab) ab.innerHTML = VCore.audioBarHTML();
    }
  };

  function parseHash(h) {
    let s = h.replace(/^#\/?/, "");
    if (!s) s = "home";
    const [path, qs] = s.split("?");
    const parts = path.split("/").filter(Boolean);
    const view = parts[0] || "home";
    const params = parts.slice(1).map(decodeURIComponent);
    const query = {};
    if (qs) qs.split("&").forEach(p => { const [k, v] = p.split("="); if (k) query[k] = decodeURIComponent(v || ""); });
    return { view, params, query };
  }

  /* global click delegation (buttons/links only — selects & inputs use change/input) */
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-a]");
    if (!el || el.tagName === "SELECT" || el.tagName === "INPUT") return;
    const a = el.dataset.a;
    const fn = VActions[a];
    if (fn) {
      e.preventDefault();
      fn(el);
      if (a === "close-sheet" || a === "open-sheet") App.renderShell();
    }
  });

  /* change delegation for selects & checkboxes */
  document.addEventListener("change", e => {
    const el = e.target.closest("[data-a]");
    if (!el) return;
    if (el.id === "surah-search") return VCore.renderSurahGrid();
    const fn = VActions[el.dataset.a];
    if (fn) fn(el);
  });

  /* global input delegation */
  document.addEventListener("input", e => {
    const el = e.target;
    if (el.dataset && el.dataset.a === "settings-font") { QK.set("fontSize", +el.value); return; }
    if (el.id === "surah-search") VCore.renderSurahGrid();
    if (el.id === "slm-search") VQuran.renderSurahListModal ? VQuran.renderSurahListModal() : VCore.renderSurahGrid();
    if (el.id === "hadith-search") VMore.renderHadith();
    if (el.id === "audio-surah-search") VQuran.renderAudioList();
    if (el.id === "global-search") {
      clearTimeout(App.searchTimer);
      App.searchTimer = setTimeout(() => {
        const v = el.value.trim();
        if (v.length >= 2 || !v) {
          const q = v ? "?q=" + encodeURIComponent(v) : "";
          history.replaceState(null, "", "#/search" + q);
          VMore.runSearch(v);
        }
      }, 450);
    }
  });

  document.addEventListener("change", e => {
    const el = e.target;
    if (el.id === "surah-search") VCore.renderSurahGrid();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.id === "chat-text") {
      const v = e.target.value;
      e.target.value = "";
      if (v.trim() && VMore.chatSend) VMore.chatSend(v);
    }
  });

  /* tab switching inside views (hadith cats, adhkar tabs, auth tabs, kn cats) */
  document.addEventListener("click", e => {
    const chip = e.target.closest(".chips .chip");
    if (chip && chip.closest("#hadith-cats")) { document.querySelector("#hadith-cats .chip.on")?.classList.remove("on"); chip.classList.add("on"); VMore.renderHadith(); }
    if (chip && chip.closest("#kn-cats")) { document.querySelector("#kn-cats .chip.on")?.classList.remove("on"); chip.classList.add("on"); VMore.renderKnowledgeGrid(); }
    if (chip && chip.closest("#surah-filter")) { document.querySelector("#surah-filter .chip.on")?.classList.remove("on"); chip.classList.add("on"); VCore.renderSurahGrid(); }
    if (chip && chip.closest("#surah-sort")) { document.querySelector("#surah-sort .chip.on")?.classList.remove("on"); chip.classList.add("on"); VCore.renderSurahGrid(); }
    const tab = e.target.closest("#adhkar-tabs .tab");
    if (tab) { document.querySelector("#adhkar-tabs .tab.on")?.classList.remove("on"); tab.classList.add("on"); VMore.renderAdhkar(); }
    const atab = e.target.closest("#auth-tabs .tab");
    if (atab) VMore.authMode(atab.dataset.m);
  });

  /* scroll: current ayah tracking */
  let scrollTimer = null;
  window.addEventListener("scroll", () => {
    if (scrollTimer) return;
    scrollTimer = setTimeout(() => {
      scrollTimer = null;
      const verses = document.querySelectorAll(".verse");
      if (!verses.length) return;
      let current = null;
      const y = window.scrollY + 120;
      verses.forEach(v => { if (v.offsetTop <= y) current = v; });
      if (current) {
        const s = +current.dataset.s, a = +current.dataset.a;
        if (!QK.state.lastRead || QK.state.lastRead.s !== s || QK.state.lastRead.a !== a) {
          QK.state.lastRead = { s, a, at: Date.now() };
          QK.save();
        }
        verses.forEach(v => v.classList.toggle("current", v === current));
      }
    }, 120);
  }, { passive: true });

  /* ticker for countdowns */
  setInterval(() => { VMore.tickCountdown(); }, 1000);

  /* audio engine events -> bar refresh */
  QAudio.on((ev) => {
    if (ev === "play" || ev === "pause" || ev === "stop" || ev === "error" || ev === "speed" || ev === "repeat" || ev === "reciter") {
      App.renderAudioBar();
    }
    if (ev === "error") toast(I18N.t("audio_err"));
  });

  /* audio bar controls */
  Object.assign(VActions, {
    "ab-toggle": () => { QAudio.toggle(); },
    "ab-next": () => { QAudio.next(); },
    "ab-prev": () => { QAudio.prev(); },
    "ab-stop": () => { QAudio.stop(); App.renderAudioBar(); },
    "ab-speed": (el) => { QAudio.setSpeed(+el.value); },
    "ab-repeat": (el) => {
      const order = ["none", "one", "all"];
      const next = order[(order.indexOf(QAudio.P.repeat) + 1) % 3];
      QAudio.setRepeat(next);
    },
    "ab-continuous": (el) => { QAudio.setContinuous(el.checked); },
    "history-back": () => { history.length > 1 ? history.back() : (location.hash = "/home"); }
  });

  /* hash routing */
  window.addEventListener("hashchange", () => App.render());
  window.App = App;
  window.parseHash = parseHash;

  /* init */
  document.addEventListener("DOMContentLoaded", () => {
    App.render();
    if ("serviceWorker" in navigator && location.protocol === "https:") {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  });
})();
