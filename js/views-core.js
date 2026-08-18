/* Quran Kareem — core views: helpers, shell, home, surahs */
(function () {
  "use strict";
  // hybrid translator: callable t('key') AND t.key property access
  const HYBRID = {};
  const T = () => {
    const lang = I18N.lang;
    if (!HYBRID[lang]) {
      const f = k => I18N.t(k);
      Object.assign(f, I18N[lang] || I18N.ku);
      HYBRID[lang] = f;
    }
    return HYBRID[lang];
  };
  const LANG = () => I18N.lang;
  const DIR = () => (LANG() === "en" ? "ltr" : "rtl");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const ICONS = {
    logo: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="none" stroke="url(#lg)" stroke-width="3"/><path d="M42 14a20 20 0 1 0 6 25 16 16 0 1 1-6-25z" fill="url(#lg)"/><path d="M28 22l3.6 7.4 8.1 1.2-5.8 5.7 1.3 8-7.2-3.8-7.2 3.8 1.3-8-5.8-5.7 8.1-1.2z" fill="url(#lg)"/><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8C766"/><stop offset="1" stop-color="#B08724"/></linearGradient></defs></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    bookmarkFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.1 6.6L21 10l-6.9 2.4L12 19l-2.1-6.6L3 10l6.9-1.4z"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5z"/></svg>'
  };
  const icon = n => ICONS[n] || "";

  function toast(msg, iconName) {
    let t = $("#toasts");
    if (!t) { t = document.createElement("div"); t.id = "toasts"; document.body.appendChild(t); }
    const d = document.createElement("div");
    d.className = "toast";
    d.innerHTML = (iconName ? `<span class="t-ic">${icon(iconName)}</span>` : "") + `<span>${esc(msg)}</span>`;
    t.appendChild(d);
    setTimeout(() => { d.classList.add("out"); setTimeout(() => d.remove(), 400); }, 2600);
  }

  function surahName(s, lang) {
    const L = lang || LANG();
    const m = QSURAH.SURAHS[s - 1];
    return L === "ar" ? m.ar : L === "en" ? m.en : m.ku;
  }

  /* ============ shell ============ */
  const NAV = [
    ["nav_home", "#/home", "logo"], ["nav_quran", "#/quran", "speaker"], ["nav_surahs", "#/surahs", "star"],
    ["nav_tafsir", "#/tafsir", "bookmark"], ["nav_hadith", "#/hadith", "heart"], ["nav_audio", "#/audio", "play"],
    ["nav_reciters", "#/reciters", "user"], ["nav_prophets", "#/prophets", "sparkle"], ["nav_adhkar", "#/adhkar", "check"],
    ["nav_prayer", "#/prayer", "compass"], ["nav_calendar", "#/calendar", "moon"], ["nav_knowledge", "#/knowledge", "copy"],
    ["nav_quizzes", "#/quizzes", "star"], ["nav_courses", "#/courses", "bookmark"], ["nav_assistant", "#/assistant", "send"],
    ["nav_bookmarks", "#/bookmarks", "bookmarkFill"], ["nav_dashboard", "#/dashboard", "user"], ["nav_settings", "#/settings", "close"]
  ];

  function headerHTML() {
    const session = QK.Account.session();
    const tt = T();
    return `
    <header class="topbar" dir="${DIR()}">
      <a class="brand" href="#/home">
        <span class="brand-ic">${icon("logo")}</span>
        <span class="brand-tx"><b>${tt.appNameLatin}</b><i>${tt.appName}</i></span>
      </a>
      <nav class="topnav">
        ${["nav_home","nav_quran","nav_tafsir","nav_hadith","nav_audio","nav_prophets","nav_prayer"].map(k => `<a href="${NAV.find(n => n[0] === k)[1]}" data-nav="${k}">${tt[k]}</a>`).join("")}
      </nav>
      <div class="topbar-act">
        <button class="ibtn" data-a="goto" data-href="#/search" title="${tt.nav_search}">${icon("search")}</button>
        <button class="ibtn" data-a="toggle-theme" title="${tt.settings_theme}">${icon(QK.state.theme === "dark" ? "sun" : "moon")}</button>
        <select class="langsel" data-a="set-lang" title="${tt.settings_lang}">
          <option value="ku" ${LANG() === "ku" ? "selected" : ""}>کوردی</option>
          <option value="ar" ${LANG() === "ar" ? "selected" : ""}>العربية</option>
          <option value="en" ${LANG() === "en" ? "selected" : ""}>English</option>
        </select>
        <a class="ibtn" href="#/dashboard" title="${tt.nav_dashboard}">${icon("user")}${session ? `<span class="userdot"></span>` : ""}</a>
      </div>
    </header>`;
  }

  function bottomNavHTML() {
    const tt = T();
    return `
    <nav class="bottomnav">
      <a href="#/home" data-bn="home"><span>${icon("logo")}</span><i>${tt.nav_home}</i></a>
      <a href="#/quran" data-bn="quran"><span>${icon("speaker")}</span><i>${tt.nav_quran}</i></a>
      <a href="#/audio" data-bn="audio"><span>${icon("play")}</span><i>${tt.nav_audio}</i></a>
      <a href="#/hadith" data-bn="hadith"><span>${icon("heart")}</span><i>${tt.nav_hadith}</i></a>
      <a href="#/prayer" data-bn="prayer"><span>${icon("compass")}</span><i>${tt.nav_prayer}</i></a>
      <button data-a="open-sheet"><span>${icon("star")}</span><i>${tt.nav_more}</i></button>
    </nav>`;
  }

  function sheetHTML() {
    const tt = T();
    const groups = [
      [["nav_quran","#/quran"],["nav_surahs","#/surahs"],["nav_tafsir","#/tafsir"],["nav_hadith","#/hadith"],["nav_reciters","#/reciters"]],
      [["nav_prophets","#/prophets"],["nav_knowledge","#/knowledge"],["nav_adhkar","#/adhkar"],["nav_prayer","#/prayer"],["nav_calendar","#/calendar"]],
      [["nav_dashboard","#/dashboard"],["nav_bookmarks","#/bookmarks"],["nav_quizzes","#/quizzes"],["nav_courses","#/courses"],["nav_assistant","#/assistant"],["nav_settings","#/settings"]]
    ];
    return `<div class="sheet-backdrop" data-a="close-sheet"></div>
    <div class="sheet" dir="${DIR()}">
      <div class="sheet-head"><b>${tt.appNameLatin}</b><button class="ibtn" data-a="close-sheet">${icon("close")}</button></div>
      ${groups.map(g => `<div class="sheet-grid">${g.map(([k, href]) => `<a href="${href}" data-a="close-sheet"><span class="sg-ic">${icon(NAV.find(n => n[0] === k)[2])}</span>${tt[k]}</a>`).join("")}</div>`).join("")}
      <a class="sheet-item2" href="#/settings" data-a="close-sheet">${tt.nav_settings}</a>
    </div>`;
  }

  function audioBarHTML() {
    const P = QAudio.P;
    const tt = T();
    if (!P.started && !P.playing) return "";
    const su = QSURAH.SURAHS[P.s - 1];
    const rec = QRECITERS.byId(P.reciter);
    return `
    <div class="audiobar ${P.playing ? "live" : ""}" dir="${DIR()}">
      <div class="ab-info">
        <div class="ab-disc">${icon("logo")}</div>
        <div class="ab-txt">
          <b>${esc(su.ku)} ${P.mode === "ayah" ? "· " + tt.common_ayah + " " + P.a : ""}</b>
          <i>${esc(rec.ku)}</i>
        </div>
      </div>
      <div class="ab-ctrl">
        <button class="ibtn" data-a="ab-prev" title="${tt.common_prev}">${icon("prev")}</button>
        <button class="ab-play" data-a="ab-toggle">${icon(P.playing ? "pause" : "play")}</button>
        <button class="ibtn" data-a="ab-next" title="${tt.common_next}">${icon("next")}</button>
        <select class="ab-speed" data-a="ab-speed" title="${tt.audio_speed}">
          ${[0.5, 0.75, 1, 1.25, 1.5, 2].map(v => `<option value="${v}" ${P.speed === v ? "selected" : ""}>${v}x</option>`).join("")}
        </select>
        <button class="ibtn ${P.repeat !== "none" ? "on" : ""}" data-a="ab-repeat" title="${tt.common_repeat}">${icon("repeat")}</button>
      </div>
      <button class="ibtn ab-x" data-a="ab-stop" title="${tt.common_close}">${icon("close")}</button>
    </div>`;
  }

  function skeleton(n, cls) {
    return `<div class="sk ${cls || ""}">${Array.from({ length: n }).map(() => '<div class="sk-line"></div>').join("")}</div>`;
  }

  function quranRefHTML(s, a, lang) {
    return `<a href="#/quran/${s}/${a}" class="qref">${esc(surahName(s, lang))} ${a}</a>`;
  }

  /* ============ home ============ */
  async function homeHTML() {
    const tt = T();
    const session = QK.Account.session();
    const st = QK.state;
    const today = new Date();
    const doy = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 864e5);
    const dv = QSURAH.DAILY_VERSES[doy % QSURAH.DAILY_VERSES.length];
    const hadith = QHADITH.list[doy % QHADITH.list.length];
    const transKey = { ku1: "reader_translation_kur1", ku2: "reader_translation_kur2", en: "reader_translation_en" }[st.trans] || "reader_translation_kur1";

    // stats
    const readN = QK.Progress.readCount();
    const khatm = QK.Progress.khatmPct();
    const hifz = QK.Progress.hifzPct();

    // prayer mini
    let prayerHTML = "";
    const loc = st.coords && st.coords.lat !== undefined ? st.coords : (typeof VMore !== "undefined" && VMore.cityObj ? VMore.cityObj() : null);
    if (loc && loc.lat !== undefined) {
      try {
        const method = QPRAY.METHODS[st.pmethod || "MWL"];
        const times = QPRAY.calcTimes(new Date(), loc.lat, loc.lng, loc.tz, method, st.asr === "hanafi" ? 2 : 1);
        const now = new Date();
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const order = [["prayer_fajr", times.fajr], ["prayer_sunrise", times.sunrise], ["prayer_dhuhr", times.dhuhr], ["prayer_asr", times.asr], ["prayer_maghrib", times.maghrib], ["prayer_isha", times.isha]];
        let next = null;
        for (const [k, v] of order) {
          if (v !== null && v > nowMin) { next = [k, v]; break; }
        }
        if (!next) next = [order[0][0], order[0][1] + 1440];
        prayerHTML = `<a class="pray-mini" href="#/prayer">
          <span class="pm-ic">${icon("compass")}</span>
          <span class="pm-tx"><i>${tt.home_next_prayer}</i><b>${tt[next[0]]} · ${QPRAY.fmtTime(next[1])}</b></span>
          <span class="pm-loc">${esc(loc.name || "")}</span>
        </a>`;
      } catch (e) { prayerHTML = ""; }
    }

    const continueHTML = st.lastRead
      ? `<a class="continue-card" href="#/quran/${st.lastRead.s}/${st.lastRead.a}">
          <span class="cc-ic">${icon("play")}</span>
          <span><i>${tt.home_continue}</i><b>${esc(surahName(st.lastRead.s))} · ${tt.common_ayah} ${st.lastRead.a}</b></span>
          <span class="cc-go">${icon("chev")}</span>
        </a>` : "";

    const trending = [[1, 0], [36, 0], [18, 0], [67, 0], [55, 0], [56, 0], [78, 0], [112, 0]];

    let dailyVerseCard = "";
    try {
      const ar = await QData.loadSurah("ar", dv[0]);
      const tr = await QData.loadSurah(st.trans === "none" ? "ku1" : st.trans, dv[0]);
      dailyVerseCard = `<a class="dvc" href="#/quran/${dv[0]}/${dv[1]}">
        <span class="dvc-tag">${icon("sparkle")}${tt.home_daily_verse}</span>
        <p class="ar-text qline">${esc(ar[dv[1] - 1])}</p>
        <p class="dvc-tr">${esc(tr[dv[1] - 1])}</p>
        <span class="dvc-ref">${esc(surahName(dv[0]))} · ${dv[1]}</span>
      </a>`;
    } catch (e) { dailyVerseCard = `<div class="dvc">${tt.common_offline}</div>`; }

    return `
    <section class="hero" dir="${DIR()}">
      <div class="hero-pattern"></div>
      <div class="hero-in">
        <h1>${tt.home_hero_title}</h1>
        <p>${tt.home_hero_sub}</p>
        <div class="hero-cta">
          <a class="btn btn-gold" href="#/quran">${icon("play")}${tt.home_hero_cta_read}</a>
          <a class="btn btn-ghost" href="#/audio">${icon("speaker")}${tt.home_hero_cta_listen}</a>
        </div>
        <div class="hero-stats">
          <div><b>114</b><i>${tt.common_surah}</i></div>
          <div><b>6236</b><i>${tt.common_ayah}</i></div>
          <div><b>30</b><i>${tt.common_juz}</i></div>
          <div><b>3</b><i>${tt.settings_lang}</i></div>
        </div>
      </div>
    </section>

    <section class="wrap home-grid" dir="${DIR()}">
      <div class="home-col">
        ${continueHTML}
        <div id="daily-verse">${dailyVerseCard}</div>
        <div class="dvc hadith-dvc">
          <span class="dvc-tag">${icon("heart")}${tt.home_daily_hadith}</span>
          <p class="ar-text">${esc(hadith.ar)}</p>
          <p class="dvc-tr">${esc(hadith.ku)}</p>
          <span class="dvc-ref">${esc(hadith.src)}</span>
        </div>
      </div>
      <div class="home-col">
        ${prayerHTML}
        <div class="stats-row">
          <a href="#/dashboard" class="stat-card"><b>${readN}</b><i>${tt.home_stats_ayahs}</i></a>
          <a href="#/dashboard" class="stat-card"><b>${st.streak.days || 0}</b><i>${tt.home_stats_streak}</i></a>
          <a href="#/dashboard" class="stat-card"><b>${khatm}%</b><i>${tt.home_stats_khatm}</i></a>
          <a href="#/dashboard" class="stat-card"><b>${hifz}%</b><i>${tt.home_stats_hifz}</i></a>
        </div>
        <h3 class="sec-title">${tt.home_trending}</h3>
        <div class="trend-grid">
          ${trending.map(([s]) => `<a class="trend-card" href="#/quran/${s}">
            <span class="tn-num">${String(s).padStart(3, "0")}</span>
            <b>${esc(surahName(s))}</b>
            <i>${QSURAH.SURAHS[s - 1].ayahs} ${tt.common_ayahs}</i>
          </a>`).join("")}
        </div>
        <h3 class="sec-title">${tt.home_features}</h3>
        <div class="feat-grid">
          ${[["nav_tafsir","#/tafsir","bookmark"],["nav_hadith","#/hadith","heart"],["nav_reciters","#/reciters","speaker"],["nav_prophets","#/prophets","sparkle"],["nav_adhkar","#/adhkar","check"],["nav_prayer","#/prayer","compass"],["nav_quizzes","#/quizzes","star"],["nav_assistant","#/assistant","send"]].map(([k, href, ic]) =>
            `<a class="feat-card" href="${href}"><span>${icon(ic)}</span><b>${tt[k]}</b></a>`).join("")}
        </div>
      </div>
    </section>`;
  }

  /* ============ surahs index ============ */
  function surahsHTML() {
    const tt = T();
    return `
    <section class="wrap">
      <h1 class="page-title">${tt.surahs_title}</h1>
      <div class="toolbar">
        <div class="searchbox">${icon("search")}<input id="surah-search" type="text" placeholder="${tt.surahs_search}"></div>
        <div class="chips" id="surah-filter">
          <button class="chip on" data-f="all">${tt.surahs_filter_all}</button>
          <button class="chip" data-f="m">${tt.surahs_filter_meccan}</button>
          <button class="chip" data-f="d">${tt.surahs_filter_medinan}</button>
        </div>
        <div class="chips" id="surah-sort">
          <button class="chip on" data-s="num">${tt.surahs_sort_num}</button>
          <button class="chip" data-s="az">${tt.surahs_sort_az}</button>
        </div>
      </div>
      <div class="surah-grid" id="surah-grid"></div>
    </section>`;
  }

  function renderSurahGrid() {
    const grid = $("#surah-grid");
    if (!grid) return;
    const tt = T();
    const q = ($("#surah-search").value || "").trim();
    const f = ($("#surah-filter .chip.on")?.dataset.f) || "all";
    const sort = ($("#surah-sort .chip.on")?.dataset.s) || "num";
    let list = QSURAH.SURAHS.slice();
    if (f === "m") list = list.filter(s => s.rev === "m");
    if (f === "d") list = list.filter(s => s.rev === "d");
    if (q) {
      const qn = QData.normMixed(q);
      list = list.filter(s => QData.normMixed(s.ku).includes(qn) || QData.normMixed(s.ar).includes(qn) || s.en.toLowerCase().includes(q.toLowerCase()) || String(s.n) === q);
    }
    if (sort === "az") list = list.slice().sort((a, b) => a.ku.localeCompare(b.ku, "ckb"));
    grid.innerHTML = list.map(s => `
      <a class="surah-card" href="#/quran/${s.n}">
        <span class="sc-num"><b>${s.n}</b><i>${icon("logo")}</i></span>
        <span class="sc-name"><b>${esc(surahName(s.n))}</b><i>${esc(s.en)} · ${tt.common_ayahs} ${s.ayahs}</i></span>
        <span class="sc-ar">${esc(s.ar)}</span>
        <span class="sc-tag ${s.rev === "m" ? "tag-m" : "tag-d"}">${s.rev === "m" ? tt.common_meccan : tt.common_medinan}</span>
      </a>`).join("") || `<div class="empty">${tt.common_no_results}</div>`;
  }

  window.toast = toast;
  window.VCore = { T, LANG, DIR, esc, $, $$, icon, toast, surahName, headerHTML, bottomNavHTML, sheetHTML, audioBarHTML, skeleton, homeHTML, surahsHTML, renderSurahGrid };
  window.VActions = window.VActions || {};
  Object.assign(window.VActions, {
    "toggle-theme": () => { QK.set("theme", QK.state.theme === "dark" ? "light" : "dark"); App.applyTheme(); App.renderShell(); },
    "set-lang": (btn) => { I18N.lang = btn.value; QK.set("lang", btn.value); document.documentElement.lang = btn.value; App.render(); },
    "open-sheet": () => { const s = $("#sheet-root"); if (s) s.innerHTML = sheetHTML(); },
    "close-sheet": () => { const s = $("#sheet-root"); if (s) s.innerHTML = ""; },
    "goto": (btn) => { location.hash = btn.dataset.href.replace("#", ""); }
  });
})();
