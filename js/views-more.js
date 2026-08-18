/* Quran Kareem — hadith, prophets, knowledge, adhkar, prayer, calendar, search, dashboard, quizzes, courses, assistant, auth, settings */
(function () {
  "use strict";
  const T = VCore.T, LANG = VCore.LANG, DIR = VCore.DIR, esc = VCore.esc, $ = VCore.$, $$ = VCore.$$,
    icon = VCore.icon, toast = VCore.toast, surahName = VCore.surahName, AR_DIGITS = VQuran.AR_DIGITS;

  /* ============ Hadith ============ */
  function hadithHTML() {
    const tt = T();
    const cats = [["all", tt.hadith_cat_all], ["faith", tt.hadith_cat_faith], ["prayer", tt.hadith_cat_prayer], ["fasting", tt.hadith_cat_fasting], ["charity", tt.hadith_cat_charity], ["hajj", tt.hadith_cat_hajj], ["morality", tt.hadith_cat_morality], ["family", tt.hadith_cat_family], ["knowledge", tt.hadith_cat_knowledge]];
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.hadith_title}</h1>
      <p class="page-sub">${tt.hadith_sub}</p>
      <div class="toolbar">
        <div class="searchbox grow">${icon("search")}<input id="hadith-search" type="text" placeholder="${tt.hadith_search}"></div>
      </div>
      <div class="chips wrapchips" id="hadith-cats">
        ${cats.map(([v, l], i) => `<button class="chip ${i === 0 ? "on" : ""}" data-c="${v}">${l}</button>`).join("")}
      </div>
      <p class="hint" id="hadith-count"></p>
      <div class="hadith-list" id="hadith-list"></div>
    </section>`;
  }

  function renderHadith() {
    const box = $("#hadith-list");
    if (!box) return;
    const tt = T();
    const q = ($("#hadith-search")?.value || "").trim().toLowerCase();
    const qn = QData.normMixed(q);
    const cat = $("#hadith-cats .chip.on")?.dataset.c || "all";
    let list = QHADITH.list;
    if (cat !== "all") list = list.filter(h => h.c === cat);
    if (q) list = list.filter(h => QData.normMixed(h.ku).includes(qn) || QData.normMixed(h.ar).includes(qn));
    $("#hadith-count").textContent = list.length + " " + tt.hadith_count;
    box.innerHTML = list.map(h => `
      <div class="hadith-card glass">
        <div class="hc-head">
          <span class="hc-cat">${tt["hadith_cat_" + h.c]}</span>
          <button class="ibtn ${QK.state.hadithBookmarks.includes(h.id) ? "on" : ""}" data-a="bookmark-hadith" data-id="${h.id}">${icon(QK.state.hadithBookmarks.includes(h.id) ? "heart" : "heart")}</button>
        </div>
        <p class="ar-text">${esc(h.ar)}</p>
        <p class="v-trans" dir="auto">${esc(h.ku)}</p>
        <div class="hc-foot"><span class="hint">${tt.hadith_source}: ${esc(h.src)}</span></div>
      </div>`).join("") || `<div class="empty">${tt.common_no_results}</div>`;
  }

  /* ============ Prophets ============ */
  function prophetsHTML(p) {
    const tt = T();
    if (p) {
      const x = QPROPHETS.find(z => z.n === p);
      if (!x) return `<section class="wrap"><div class="empty">—</div></section>`;
      const idx = QPROPHETS.indexOf(x);
      return `
      <section class="wrap" dir="${DIR()}">
        <button class="ibtn" data-a="history-back">${icon("chev")}</button>
        <div class="prophet-hero glass">
          <span class="ph-num">${String(x.n).padStart(2, "0")}</span>
          <div><h1>${esc(x.ku)}</h1><p>${esc(x.ar)} · ${esc(x.en)} · ${esc(x.era)}</p></div>
        </div>
        <p class="prophet-bio">${esc(x.bio)}</p>
        <div class="p-grid">
          <div class="glass p-card"><h3>${tt.prophets_events}</h3><ul>${x.events.map(e => `<li>${esc(e)}</li>`).join("")}</ul></div>
          <div class="glass p-card"><h3>${tt.prophets_locations}</h3><ul>${x.loc.map(e => `<li>${esc(e)}</li>`).join("")}</ul></div>
          <div class="glass p-card"><h3>${tt.prophets_lessons}</h3><ul>${x.lessons.map(e => `<li>${esc(e)}</li>`).join("")}</ul></div>
        </div>
        <h3 class="sec-title">${tt.prophets_timeline}</h3>
        <div class="timeline">
          ${QPROPHETS.map((z, i) => `<a href="#/prophets/${z.n}" class="tl-item ${i === idx ? "on" : ""} ${i < idx ? "past" : ""}">
            <span class="tl-dot"></span><b>${esc(z.ku)}</b></a>`).join("")}
        </div>
      </section>`;
    }
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.prophets_title}</h1>
      <p class="page-sub">${tt.prophets_sub}</p>
      <div class="reciter-grid">
        ${QPROPHETS.map(x => `
          <a class="prophet-card glass" href="#/prophets/${x.n}">
            <span class="pc-avatar">${icon("user")}</span>
            <b>${esc(x.ku)}</b>
            <i>${esc(x.ar)}</i>
            <p>${esc(x.bio.slice(0, 110))}…</p>
          </a>`).join("")}
      </div>
    </section>`;
  }

  /* ============ Knowledge ============ */
  function knowledgeHTML(articleId) {
    const tt = T();
    if (articleId) {
      const a = QKNOW.ARTICLES.find(x => x.id === articleId);
      if (!a) return "";
      return `
      <section class="wrap narrow" dir="${DIR()}">
        <button class="ibtn" data-a="history-back">${icon("chev")}</button>
        <article class="article glass">
          <span class="chip sm">${tt["knowledge_cat_" + a.cat]}</span>
          <h1>${esc(a.title)}</h1>
          <p class="hint">${a.min} ${tt.knowledge_min_read}</p>
          <div class="article-body">${a.body.split("\n").map(p => `<p>${esc(p)}</p>`).join("")}</div>
        </article>
      </section>`;
    }
    const cats = [["all", tt.knowledge_cat_all], ["history", tt.knowledge_cat_history], ["companions", tt.knowledge_cat_companions], ["ethics", tt.knowledge_cat_ethics], ["general", tt.knowledge_cat_general]];
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.knowledge_title}</h1>
      <p class="page-sub">${tt.knowledge_sub}</p>
      <div class="chips wrapchips" id="kn-cats">${cats.map(([v, l], i) => `<button class="chip ${i === 0 ? "on" : ""}" data-c="${v}">${l}</button>`).join("")}</div>
      <div class="article-grid" id="kn-grid"></div>
      <h3 class="sec-title">${tt.course_title}</h3>
      <div class="course-grid">
        ${QKNOW.COURSES.map(c => {
          const done = (QK.state.courses[c.id] || []).length;
          const pct = Math.round(done / c.lessons.length * 100);
          return `<a class="course-card glass" href="#/course/${c.id}">
            <span class="cc-icon">${c.icon}</span>
            <b>${esc(c.title)}</b>
            <i>${esc(c.desc)}</i>
            <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
            <span class="hint">${pct}%</span>
          </a>`;
        }).join("")}
      </div>
    </section>`;
  }

  function renderKnowledgeGrid() {
    const box = $("#kn-grid");
    if (!box) return;
    const tt = T();
    const cat = $("#kn-cats .chip.on")?.dataset.c || "all";
    const list = QKNOW.ARTICLES.filter(a => cat === "all" || a.cat === cat);
    box.innerHTML = list.map(a => `
      <a class="article-card glass" href="#/knowledge/article/${a.id}">
        <span class="chip sm">${tt["knowledge_cat_" + a.cat]}</span>
        <b>${esc(a.title)}</b>
        <p>${esc(a.body.slice(0, 130))}…</p>
        <span class="hint">${a.min} ${tt.knowledge_min_read} · ${tt.knowledge_read} ${icon("next")}</span>
      </a>`).join("");
  }

  /* ============ Adhkar ============ */
  function adhkarHTML() {
    const tt = T();
    const tabs = [["morning", "adhkar_morning", "🌅"], ["evening", "adhkar_evening", "🌙"], ["travel", "adhkar_travel", "🧳"], ["prayer", "adhkar_prayer", "🕌"], ["daily", "adhkar_daily", "🤲"]];
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.adhkar_title}</h1>
      <p class="page-sub">${tt.adhkar_sub}</p>
      <div class="tabs" id="adhkar-tabs">${tabs.map(([v, k, ic], i) => `<button class="tab ${i === 0 ? "on" : ""}" data-g="${v}">${ic} ${tt[k]}</button>`).join("")}</div>
      <div class="adhkar-list" id="adhkar-list"></div>
    </section>`;
  }

  function renderAdhkar() {
    const box = $("#adhkar-list");
    if (!box) return;
    const tt = T();
    const g = $("#adhkar-tabs .tab.on")?.dataset.g || "morning";
    const list = QADHKAR.list.filter(x => x.g === g);
    const done = QK.state.adhkarDone;
    box.innerHTML = list.map((x, i) => {
      const id = g + "-" + i;
      const cnt = done[id] || 0;
      return `
      <div class="adhkar-card glass">
        <div class="ak-top"><span class="ak-count">${x.n}×</span><span class="hint">${esc(x.src)}</span></div>
        <p class="ar-text">${esc(x.ar)}</p>
        <p class="v-trans" dir="auto">${esc(x.ku)}</p>
        <div class="ak-actions">
          <button class="btn btn-ghost btn-sm" data-a="listen-adhkar" data-id="${id}" data-src="${id}">${icon("speaker")}${tt.adhkar_listen}</button>
          <button class="btn btn-gold btn-sm ${cnt >= x.n ? "done" : ""}" data-a="count-adhkar" data-id="${id}" data-n="${x.n}">${cnt >= x.n ? icon("check") + tt.adhkar_done : cnt + " / " + x.n}</button>
        </div>
      </div>`;
    }).join("");
  }

  /* ============ Prayer ============ */
  function prayerHTML() {
    const tt = T();
    const st = QK.state;
    const methods = Object.keys(QPRAY.METHODS);
    const cObj = cityObj();
    const loc = st.coords;
    const hasLoc = !!(loc && loc.lat !== undefined) || cObj;
    const hijri = QPRAY.hijriFromGregorian(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
    let timesHTML = "";
    if (hasLoc) {
      const lat = loc && loc.lat !== undefined ? loc.lat : cObj.lat;
      const lng = loc && loc.lng !== undefined ? loc.lng : cObj.lng;
      const tz = loc && loc.tz !== undefined ? loc.tz : cObj.tz;
      const method = QPRAY.METHODS[st.pmethod || "MWL"];
      const times = QPRAY.calcTimes(new Date(), lat, lng, tz, method, st.asr === "hanafi" ? 2 : 1);
      const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
      const order = [["prayer_fajr", times.fajr], ["prayer_sunrise", times.sunrise], ["prayer_dhuhr", times.dhuhr], ["prayer_asr", times.asr], ["prayer_maghrib", times.maghrib], ["prayer_isha", times.isha]];
      let nextKey = null, nextVal = null;
      for (const [k, v] of order) if (v !== null && v > nowMin) { nextKey = k; nextVal = v; break; }
      if (!nextKey) { nextKey = order[0][0]; nextVal = order[0][1] + 1440; }
      timesHTML = `
        <div class="ptimes glass" data-next="${nextVal}">
          <div class="pt-next"><span>${tt.prayer_next}: <b>${tt[nextKey]}</b></span><i id="pt-countdown"></i></div>
          <div class="pt-grid">
            ${order.map(([k, v]) => `<div class="pt-cell ${k === nextKey ? "on" : ""}"><b>${tt[k]}</b><i>${QPRAY.fmtTime(v)}</i></div>`).join("")}
          </div>
          <div class="pt-qibla-row">
            <div class="qibla-compass"><svg viewBox="0 0 200 200" id="qibla-svg"><circle cx="100" cy="100" r="92" class="qc-ring"/><g id="qibla-dial"><line x1="100" y1="14" x2="100" y2="32" class="qc-n"/><polygon points="100,30 94,110 100,124 106,110" class="qc-needle"/></g><text x="100" y="118" text-anchor="middle" class="qc-txt" id="qibla-deg"></text></svg></div>
            <div class="pt-info">
              <b>${tt.prayer_qibla}</b>
              <p id="qibla-help"></p>
              <p class="hint">${tt.prayer_hijri}: ${esc(QPRAY.hijriStr(hijri, LANG()))}</p>
            </div>
          </div>
        </div>`;
      setTimeout(() => {
        const deg = $("#qibla-deg"), help = $("#qibla-help"), dial = $("#qibla-dial");
        if (!deg || !help || !dial) return;
        const b = QPRAY.qiblaBearing(lat, lng);
        deg.textContent = Math.round(b) + "°";
        help.textContent = tt.prayer_qibla_help.replace("X", Math.round(b));
        dial.setAttribute("transform", `rotate(${b} 100 100)`);
        try {
          const navg = (window.DeviceOrientationEvent && "absolute" in new DeviceOrientationEvent(""));
          if (navg) {
            window.addEventListener("deviceorientationabsolute", (e) => {
              const alpha = e.alpha || 0;
              const svg = $("#qibla-svg");
              if (svg) svg.style.transform = `rotate(${-alpha}deg)`;
            }, { once: false });
          }
        } catch (err) { /* orientation not available */ }
      }, 50);
    }
    const monthlyHTML = hasLoc ? monthlyTableHTML(loc, cObj) : "";
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.prayer_title}</h1>
      <p class="page-sub">${tt.prayer_sub}</p>
      <div class="toolbar">
        <button class="btn btn-gold" data-a="detect-location">${icon("compass")}${tt.prayer_detect}</button>
        <select class="sel" data-a="city-select">
          <option value="">${tt.prayer_select_city}…</option>
          ${QPRAY.CITIES.map(c => `<option value="${c[0]}" ${st.city === c[0] ? "selected" : ""}>${c[0]}</option>`).join("")}
        </select>
        <select class="sel" data-a="method-select">${methods.map(m => `<option value="${m}" ${(st.pmethod || "MWL") === m ? "selected" : ""}>${QPRAY.METHODS[m].name}</option>`).join("")}</select>
        <select class="sel" data-a="madhab-select"><option value="shafi" ${st.asr !== "hanafi" ? "selected" : ""}>شافعی</option><option value="hanafi" ${st.asr === "hanafi" ? "selected" : ""}>حەنەفی</option></select>
        <button class="btn btn-ghost" data-a="notif-toggle">${st.notif ? icon("check") + tt.prayer_notif_on : tt.prayer_notif_enable}</button>
      </div>
      <div class="pray-grid">
        <div>${timesHTML || `<div class="empty">${tt.prayer_select_city}</div>`}${monthlyHTML}</div>
      </div>
    </section>`;
  }

  function monthlyTableHTML(loc, city) {
    const tt = T();
    const lat = loc && loc.lat !== undefined ? loc.lat : city.lat;
    const lng = loc && loc.lng !== undefined ? loc.lng : city.lng;
    const tz = loc && loc.tz !== undefined ? loc.tz : city.tz;
    const method = QPRAY.METHODS[QK.state.pmethod || "MWL"];
    const now = new Date();
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const rows = [];
    for (let d = 1; d <= days; d++) {
      const t = QPRAY.calcTimes(new Date(now.getFullYear(), now.getMonth(), d), lat, lng, tz, method, QK.state.asr === "hanafi" ? 2 : 1);
      rows.push(`<tr class="${d === now.getDate() ? "today" : ""}"><td>${d}</td><td>${QPRAY.fmtTime(t.fajr)}</td><td>${QPRAY.fmtTime(t.dhuhr)}</td><td>${QPRAY.fmtTime(t.asr)}</td><td>${QPRAY.fmtTime(t.maghrib)}</td><td>${QPRAY.fmtTime(t.isha)}</td></tr>`);
    }
    return `
      <div class="monthly glass">
        <h3>${tt.prayer_monthly} — ${T()("calendar_gregorian_months")[now.getMonth()]}</h3>
        <div class="tbl-scroll"><table class="tbl"><thead><tr><th>#</th><th>${tt.prayer_fajr}</th><th>${tt.prayer_dhuhr}</th><th>${tt.prayer_asr}</th><th>${tt.prayer_maghrib}</th><th>${tt.prayer_isha}</th></tr></thead>
        <tbody>${rows.join("")}</tbody></table></div>
      </div>`;
  }

  let nextCountdownTimer = null;
  function tickCountdown() {
    const el = $("#pt-countdown");
    const box = $(".ptimes");
    if (!el || !box) return;
    const next = +box.dataset.next;
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    let diff = Math.round(next - nowMin);
    if (diff < 0) { App.render(); return; }
    const h = Math.floor(diff / 60), m = diff % 60;
    el.textContent = T()("prayer_in") + " " + (h ? h + " " + T()("common_hour") + " " : "") + m + " " + T()("common_minute");
  }

  /* ============ Calendar ============ */
  function calendarHTML(hmOffset) {
    const tt = T();
    const now = new Date();
    const hijriToday = QPRAY.hijriFromGregorian(now.getFullYear(), now.getMonth() + 1, now.getDate());
    let hy = hijriToday.y, hm = hijriToday.m;
    hm += (hmOffset || 0);
    while (hm > 12) { hm -= 12; hy++; }
    while (hm < 1) { hm += 12; hy--; }
    const months = T()("calendar_hijri_months");
    const mdays = (hm === 12 ? (leapHijri(hy) ? 30 : 29) : (hm % 2 === 1 ? 30 : 29));
    const firstG = hijriToGreg(hy, hm, 1);
    const startDow = firstG.getDay();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push("<span></span>");
    for (let d = 1; d <= mdays; d++) {
      const isToday = (hy === hijriToday.y && hm === hijriToday.m && d === hijriToday.d);
      const ev = QPRAY.EVENTS.find(e => e.m === hm && e.d === d);
      cells.push(`<span class="cal-day ${isToday ? "today" : ""} ${ev ? "ev" : ""}" title="${ev ? esc(ev[LANG()] || ev.ku) : ""}">${AR_DIGITS(d)}${ev ? "<i>✦</i>" : ""}</span>`);
    }
    const events = QPRAY.EVENTS.map(e => {
      const left = QPRAY.daysToHijriDate(e.m, e.d);
      return `<div class="event-row"><div><b>${esc(e[LANG()] || e.ku)}</b><i class="hint">${months[e.m - 1]} ${AR_DIGITS(e.d)}</i></div><span class="ev-left">${left !== null ? left + " " + tt.calendar_days_left : ""}</span></div>`;
    }).join("");
    const ram = QPRAY.daysToHijriMonth(9), eidF = QPRAY.daysToHijriMonth(10), eidA = QPRAY.daysToHijriDate(12, 10);
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.calendar_title}</h1>
      <p class="page-sub">${tt.calendar_sub}</p>
      <div class="cal-grid">
        <div class="cal-card glass">
          <div class="cal-head">
            <button class="ibtn" data-a="cal-nav" data-d="${(hmOffset || 0) - 1}">${icon("prev")}</button>
            <b>${months[hm - 1]} ${AR_DIGITS(hy)}</b>
            <button class="ibtn" data-a="cal-nav" data-d="${(hmOffset || 0) + 1}">${icon("next")}</button>
          </div>
          <div class="cal-dow">${T()("days_short").map(d => `<span>${d}</span>`).join("")}</div>
          <div class="cal-days">${cells.join("")}</div>
          <p class="hint center">${tt.prayer_hijri} ${tt.calendar_today}: ${esc(QPRAY.hijriStr(hijriToday, LANG()))}</p>
        </div>
        <div class="cal-side">
          <div class="glass ev-card"><h3>${tt.calendar_events}</h3>${events}</div>
          <div class="count-grid">
            <div class="glass cg-card"><b>${ram}</b><i>${tt.calendar_ramadan}</i></div>
            <div class="glass cg-card"><b>${eidF}</b><i>${tt.calendar_eid_fitr}</i></div>
            <div class="glass cg-card"><b>${eidA}</b><i>${tt.calendar_eid_adha}</i></div>
          </div>
        </div>
      </div>
    </section>`;
  }

  function leapHijri(y) { return ((y * 11 + 14) % 30) < 11; }
  function hijriToGreg(y, m, d) {
    const jdi = Math.round(d + Math.ceil(29.5 * (m - 1)) + (y - 1) * 354 + Math.floor((3 + 11 * y) / 30) + 1948439);
    const a = jdi + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor(146097 * b / 4);
    const dd = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor(1461 * dd / 4);
    const mm = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * mm + 2) / 5) + 1;
    const month = mm + 3 - 12 * Math.floor(mm / 10);
    const year = 100 * b + dd - 4800 + Math.floor(mm / 10);
    return new Date(year, month - 1, day);
  }

  /* ============ Search ============ */
  function searchHTML(q) {
    const tt = T();
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.search_title}</h1>
      <div class="searchbox big">${icon("search")}<input id="global-search" type="text" value="${esc(q || "")}" placeholder="${tt.search_placeholder}" autofocus></div>
      <div id="search-results"></div>
    </section>`;
  }

  async function runSearch(q) {
    const box = $("#search-results");
    if (!box) return;
    const tt = T();
    if (!q || q.trim().length < 2) { box.innerHTML = `<div class="empty">${tt.search_hint}</div>`; return; }
    box.innerHTML = `<div class="empty">${icon("search")} ${tt.common_loading}</div>`;
    const query = q.trim();
    const qn = QData.normMixed(query);

    // local sources
    const hadiths = QHADITH.list.filter(h => QData.normMixed(h.ku).includes(qn) || QData.normMixed(h.ar).includes(qn)).slice(0, 12);
    const prophets = QPROPHETS.filter(p => QData.normMixed(p.bio).includes(qn) || QData.normMixed(p.ku).includes(qn) || p.en.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
    const articles = QKNOW.ARTICLES.filter(a => QData.normMixed(a.title + a.body).includes(qn)).slice(0, 6);
    const adhkar = QADHKAR.list.filter(a => QData.normMixed(a.ku).includes(qn) || QData.normMixed(a.ar).includes(qn)).slice(0, 6);
    const surahs = await QData.searchSurahs(query);

    let quranHTML = `<div class="sr-group"><h3>${tt.search_in_quran} <span class="hint">${tt.search_loading_quran}</span><div class="bar"><div class="bar-fill" id="qsearch-bar" style="width:0%"></div></div></h3><div id="sr-quran"></div></div>`;

    box.innerHTML = `
      ${quranHTML}
      ${hadiths.length ? `<div class="sr-group"><h3>${tt.search_in_hadith} (${hadiths.length})</h3>${hadiths.map(h => `<div class="sr-item glass"><p class="ar-text">${esc(h.ar)}</p><p class="v-trans">${esc(h.ku)}</p><span class="hint">${esc(h.src)}</span></div>`).join("")}</div>` : ""}
      ${prophets.length ? `<div class="sr-group"><h3>${tt.search_in_prophets} (${prophets.length})</h3>${prophets.map(p => `<a class="sr-item glass" href="#/prophets/${p.n}"><b>${esc(p.ku)}</b><p>${esc(p.bio.slice(0, 120))}…</p></a>`).join("")}</div>` : ""}
      ${surahs.length ? `<div class="sr-group"><h3>${tt.nav_surahs} (${surahs.length})</h3>${surahs.map(x => `<a class="sr-item glass" href="#/quran/${x.n}"><b>${x.n}. ${esc(surahName(x.n))}</b><i class="hint">${esc(x.en)}</i></a>`).join("")}</div>` : ""}
      ${articles.length ? `<div class="sr-group"><h3>${tt.search_in_articles} (${articles.length})</h3>${articles.map(a => `<a class="sr-item glass" href="#/knowledge/article/${a.id}"><b>${esc(a.title)}</b></a>`).join("")}</div>` : ""}
      ${adhkar.length ? `<div class="sr-group"><h3>${tt.search_in_adhkar} (${adhkar.length})</h3>${adhkar.map(a => `<div class="sr-item glass"><p class="ar-text">${esc(a.ar)}</p><p class="v-trans">${esc(a.ku)}</p></div>`).join("")}</div>` : ""}
    `;

    // quran full-text search (ku2 + ar)
    try {
      const results = await QData.searchQuran(query, ["ku2"], 30, (p) => {
        const bar = $("#qsearch-bar");
        if (bar) bar.style.width = Math.round(p * 100) + "%";
      });
      const srQ = $("#sr-quran");
      if (srQ) {
        if (!results.length) srQ.innerHTML = `<div class="empty">${tt.common_no_results}</div>`;
        else srQ.innerHTML = results.map(r => {
          const s = QSURAH.SURAHS[r.s - 1];
          return `<a class="sr-item glass" href="#/quran/${r.s}/${r.a}">
            <div class="sr-q-head"><b>${esc(surahName(r.s))} ${AR_DIGITS(r.a)}</b><span class="chip sm">${esc(s.ar)}</span></div>
            <p class="v-trans" dir="auto">${esc(r.text)}</p>
          </a>`;
        }).join("");
      }
      const grp = $(".sr-group h3");
      if (grp) grp.innerHTML = tt.search_in_quran + " (" + results.length + "+" + ")";
    } catch (e) {
      const srQ = $("#sr-quran");
      if (srQ) srQ.innerHTML = `<div class="empty">${tt.common_offline}</div>`;
    }
  }

  /* ============ Dashboard ============ */
  function dashboardHTML() {
    const tt = T();
    const st = QK.state;
    const session = QK.Account.session();
    const readN = QK.Progress.readCount();
    const khatm = QK.Progress.khatmPct();
    const hifz = QK.Progress.hifzPct();
    const badges = [
      ["first_bookmark", "badge_first_bookmark", "bookmark"], ["streak_7", "badge_streak_7", "star"], ["ayahs_100", "badge_ayahs_100", "check"],
      ["juz_done", "badge_juz_done", "star"], ["khatm", "badge_khatm", "sparkle"], ["hifz_juz", "badge_hifz_juz", "check"],
      ["quiz_whiz", "badge_quiz_whiz", "star"], ["listener_10", "badge_listener_10", "speaker"], ["explorer", "badge_explorer", "compass"], ["collector", "badge_collector", "heart"]
    ];
    const juzBars = QSURAH.JUZ.map((j, i) => {
      const pct = QK.Progress.juzPct(i + 1);
      return `<div class="juz-row"><b>${AR_DIGITS(i + 1)}</b><div class="bar"><div class="bar-fill ${pct >= 100 ? "full" : ""}" style="width:${pct}%"></div></div><i>${pct}%</i></div>`;
    }).join("");
    const history = st.history.slice(0, 8);
    const topSurahs = Object.entries(st.read).slice().sort((a, b) => b[1] - a[1]).slice(0, 0);
    return `
    <section class="wrap" dir="${DIR()}">
      <div class="dash-head">
        <div><h1 class="page-title">${tt.dash_title}</h1>
        <p class="page-sub">${tt.dash_welcome}, <b>${esc(session ? session.name : tt.dash_guest)}</b></p></div>
        <div>${session ? `<button class="btn btn-ghost" data-a="logout">${tt.auth_logout}</button>` : `<a class="btn btn-gold" href="#/auth">${tt.auth_login}</a>`}</div>
      </div>
      ${!session ? `<div class="glass note-card">${tt.dash_login_prompt}</div>` : ""}
      <div class="stats-grid">
        <div class="glass stat-card2"><b>${readN}</b><i>${tt.dash_ayahs_read}</i></div>
        <div class="glass stat-card2"><b>${st.streak.days || 0}</b><i>${tt.dash_streak}</i></div>
        <div class="glass stat-card2"><b>${khatm}%</b><i>${tt.dash_khatm}</i></div>
        <div class="glass stat-card2"><b>${hifz}%</b><i>${tt.dash_hifz}</i></div>
      </div>
      <div class="ring-row">
        <div class="ring-wrap"><div class="ring" style="--p:${khatm}"><span>${khatm}%</span></div><i>${tt.dash_khatm}</i></div>
        <div class="ring-wrap"><div class="ring" style="--p:${hifz}"><span>${hifz}%</span></div><i>${tt.dash_hifz}</i></div>
        <div class="glass goal-card"><b>${tt.dash_goals}</b>
          <label>${tt.dash_goal_weekly}<input type="number" id="goal-weekly" value="${st.goalWeekly}" data-a="goal-save"></label>
        </div>
      </div>
      ${st.lastRead ? `<a class="continue-card" href="#/quran/${st.lastRead.s}/${st.lastRead.a}"><span class="cc-ic">${icon("play")}</span><span><i>${tt.dash_last_read}</i><b>${esc(surahName(st.lastRead.s))} · ${tt.common_ayah} ${st.lastRead.a}</b></span></a>` : ""}
      <h3 class="sec-title">${tt.dash_badges}</h3>
      <div class="badge-grid">
        ${badges.map(([id, k, ic]) => `<div class="badge ${st.badges.includes(id) ? "got" : ""}"><span>${icon(ic)}</span><b>${tt[k]}</b></div>`).join("")}
      </div>
      <h3 class="sec-title">${tt.dash_surah_progress}</h3>
      <div class="juz-list glass">${juzBars}</div>
      <h3 class="sec-title">${tt.dash_history}</h3>
      <div class="hist-list">
        ${history.length ? history.map(h => `<a class="hist-item glass" href="#/quran/${h.s}/${h.a}">
          <span class="hi-ic">${icon("play")}</span><b>${esc(surahName(h.s))} ${AR_DIGITS(h.a)}</b>
          <i class="hint">${QRECITERS.byId(h.reciter).ku}</i>
        </a>`).join("") : `<div class="empty">${tt.dash_no_history}</div>`}
      </div>
    </section>`;
  }

  /* ============ Quizzes ============ */
  let quizState = null;
  function quizzesHTML() {
    const tt = T();
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.quiz_title}</h1>
      <p class="page-sub">${tt.quiz_sub}</p>
      <div class="course-grid">
        ${QKNOW.QUIZZES.map(q => {
          const best = QK.state.quizScores[q.id];
          return `<a class="course-card glass" href="#/quiz/${q.id}">
            <span class="cc-icon">${q.icon}</span><b>${esc(q.title)}</b>
            <i>${q.qs.length} ${tt.quiz_question.toLowerCase()}</i>
            ${best !== undefined ? `<span class="chip sm">${best}/${q.qs.length}</span>` : ""}
          </a>`;
        }).join("")}
      </div>
    </section>`;
  }

  function quizRunnerHTML(id) {
    const tt = T();
    const q = QKNOW.QUIZZES.find(x => x.id === id);
    if (!q) return "";
    quizState = { q, i: 0, score: 0, answered: false };
    return `
    <section class="wrap narrow" dir="${DIR()}">
      <button class="ibtn" data-a="history-back">${icon("chev")}</button>
      <div class="quiz-card glass" id="quiz-box">
        ${quizQHTML()}
      </div>
    </section>`;
  }

  function quizQHTML() {
    const tt = T();
    const st = quizState;
    const q = st.q.qs[st.i];
    return `
      <div class="quiz-top"><span class="chip sm">${tt.quiz_question} ${st.i + 1} ${tt.quiz_of} ${st.q.qs.length}</span>
      <div class="bar"><div class="bar-fill" style="width:${st.i / st.q.qs.length * 100}%"></div></div></div>
      <h2>${esc(q.q)}</h2>
      <div class="quiz-opts">
        ${q.o.map((o, i) => `<button class="quiz-opt" data-a="quiz-answer" data-i="${i}">${esc(o)}</button>`).join("")}
      </div>
      <div id="quiz-expl"></div>`;
  }

  function quizResultHTML() {
    const tt = T();
    const st = quizState;
    const pct = Math.round(st.score / st.q.qs.length * 100);
    if (!QK.state.quizScores[st.q.id] || st.score > QK.state.quizScores[st.q.id]) {
      QK.state.quizScores[st.q.id] = st.score; QK.save();
    }
    QK.Progress.checkBadges();
    return `
      <div class="quiz-done">
        <span class="qd-ic">${pct >= 80 ? "🎉" : pct >= 50 ? "⭐" : "📚"}</span>
        <h2>${tt.quiz_done_title}</h2>
        <p>${tt.quiz_done_msg}: <b>${st.score} / ${st.q.qs.length}</b> (${pct}%)</p>
        <div class="hero-cta center">
          <button class="btn btn-gold" data-a="quiz-retry">${tt.quiz_retry}</button>
          <a class="btn btn-ghost" href="#/quizzes">${tt.quiz_back}</a>
        </div>
      </div>`;
  }

  /* ============ Courses ============ */
  function courseHTML(id) {
    const tt = T();
    const c = QKNOW.COURSES.find(x => x.id === id);
    if (!c) return "";
    const done = QK.state.courses[c.id] || [];
    return `
    <section class="wrap narrow" dir="${DIR()}">
      <button class="ibtn" data-a="history-back">${icon("chev")}</button>
      <div class="course-head glass">
        <span class="cc-icon big">${c.icon}</span>
        <div><h1>${esc(c.title)}</h1><p>${esc(c.desc)}</p></div>
      </div>
      <div class="bar"><div class="bar-fill" style="width:${Math.round(done.length / c.lessons.length * 100)}%"></div></div>
      <p class="hint">${tt.course_progress}: ${done.length}/${c.lessons.length}</p>
      <div class="lesson-list">
        ${c.lessons.map((l, i) => `
          <details class="lesson glass" ${i === 0 && !done.length ? "open" : ""}>
            <summary><span class="ls-num ${done.includes(i) ? "on" : ""}">${done.includes(i) ? icon("check") : i + 1}</span><b>${esc(l.t)}</b></summary>
            <p>${esc(l.b)}</p>
            <button class="btn btn-gold btn-sm" data-a="lesson-done" data-c="${c.id}" data-i="${i}" ${done.includes(i) ? "disabled" : ""}>${done.includes(i) ? tt.course_completed : tt.course_complete}</button>
          </details>`).join("")}
      </div>
    </section>`;
  }

  /* ============ Assistant ============ */
  function assistantHTML() {
    const tt = T();
    return `
    <section class="wrap chat-wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.ai_title}</h1>
      <p class="page-sub">${tt.ai_sub}</p>
      <div class="chat-box glass" id="chat-box">
        <div class="chat-msg bot"><div class="cm-avatar">${icon("sparkle")}</div><div class="cm-bubble">${esc(tt.ai_disclaimer)}</div></div>
      </div>
      <div class="chat-quick" id="chat-quick">
        ${QAI.QUICK.map((q, i) => `<button class="chip" data-a="ai-quick" data-i="${i}">${esc(q[LANG()] || q.ku)}</button>`).join("")}
      </div>
      <div class="chat-input">
        <input id="chat-text" type="text" placeholder="${tt.ai_placeholder}">
        <button class="btn btn-gold" data-a="ai-send">${icon("send")}${tt.ai_send}</button>
      </div>
    </section>`;
  }

  async function chatSend(text) {
    const box = $("#chat-box");
    if (!box || !text.trim()) return;
    const tt = T();
    box.insertAdjacentHTML("beforeend", `<div class="chat-msg user"><div class="cm-bubble">${esc(text)}</div></div>`);
    box.insertAdjacentHTML("beforeend", `<div class="chat-msg bot typing" id="chat-typing"><div class="cm-avatar">${icon("sparkle")}</div><div class="cm-bubble">${tt.ai_typing}</div></div>`);
    box.scrollTop = box.scrollHeight;
    const res = await QAI.answer(text);
    $("#chat-typing")?.remove();
    let html = "";
    if (res.type === "quran" && res.ref) {
      html = `<a class="chat-qref" href="#/quran/${res.ref.s}/${res.ref.a}">${esc(res.text)}</a>`;
    } else {
      html = res.text.split("\n").map(l => `<p>${esc(l)}</p>`).join("");
    }
    box.insertAdjacentHTML("beforeend", `<div class="chat-msg bot"><div class="cm-avatar">${icon("sparkle")}</div><div class="cm-bubble">${html}</div></div>`);
    box.scrollTop = box.scrollHeight;
  }

  /* ============ Auth ============ */
  function authHTML() {
    const tt = T();
    return `
    <section class="wrap narrow" dir="${DIR()}">
      <div class="auth-card glass">
        <span class="auth-logo">${icon("logo")}</span>
        <h1>${tt.appNameLatin}</h1>
        <div class="tabs" id="auth-tabs">
          <button class="tab on" data-m="login">${tt.auth_login}</button>
          <button class="tab" data-m="register">${tt.auth_register}</button>
        </div>
        <form id="auth-form" class="auth-form">
          <div id="f-name" style="display:none"><label>${tt.auth_name}<input name="name" type="text"></label></div>
          <label>${tt.auth_email}<input name="email" type="email" required dir="ltr"></label>
          <label>${tt.auth_password}<input name="pass" type="password" required dir="ltr"></label>
          <div id="f-pass2" style="display:none"><label>${tt.auth_confirm}<input name="pass2" type="password" dir="ltr"></label></div>
          <button class="btn btn-gold w100" type="submit">${tt.auth_login}</button>
        </form>
        <button class="btn btn-ghost w100" data-a="auth-guest">${tt.auth_guest}</button>
        <p class="hint center">${tt.auth_note}</p>
      </div>
    </section>`;
  }

  function authMode(m) {
    $$("#auth-tabs .tab").forEach(t => t.classList.toggle("on", t.dataset.m === m));
    $("#f-name").style.display = m === "register" ? "" : "none";
    $("#f-pass2").style.display = m === "register" ? "" : "none";
    $("#auth-form button[type=submit]").textContent = m === "register" ? T()("auth_register") : T()("auth_login");
    $("#auth-form").dataset.mode = m;
  }

  function authInit() {
    const form = $("#auth-form");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "1";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const mode = form.dataset.mode || "login";
      const tt = T();
      if (mode === "register") {
        if (fd.get("pass") !== fd.get("pass2")) return toast(tt.auth_pass_mismatch);
        const r = await QK.Account.register(fd.get("name") || "کاربەر", fd.get("email"), fd.get("pass"));
        if (!r.ok) return toast(r.code === "exists" ? tt.auth_exists : tt.auth_pass_short);
        toast(tt.auth_welcome + "، " + r.user.name, "check");
      } else {
        const r = await QK.Account.login(fd.get("email"), fd.get("pass"));
        if (!r.ok) return toast(tt.auth_invalid);
        toast(tt.auth_welcome + "، " + r.user.name, "check");
      }
      location.hash = "/dashboard";
    });
  }

  /* ============ Settings ============ */
  function settingsHTML() {
    const tt = T();
    const st = QK.state;
    return `
    <section class="wrap narrow" dir="${DIR()}">
      <h1 class="page-title">${tt.settings_title}</h1>
      <div class="set-card glass">
        <div class="set-row"><b>${tt.settings_theme}</b>
          <div class="chips"><button class="chip ${st.theme === "dark" ? "on" : ""}" data-a="set-theme" data-v="dark">🌙 ${tt.settings_dark}</button>
          <button class="chip ${st.theme === "light" ? "on" : ""}" data-a="set-theme" data-v="light">☀️ ${tt.settings_light}</button></div></div>
        <div class="set-row"><b>${tt.settings_lang}</b>
          <select class="sel" data-a="settings-lang"><option value="ku" ${LANG() === "ku" ? "selected" : ""}>کوردی</option><option value="ar" ${LANG() === "ar" ? "selected" : ""}>العربية</option><option value="en" ${LANG() === "en" ? "selected" : ""}>English</option></select></div>
        <div class="set-row"><b>${tt.settings_default_trans}</b>
          <select class="sel" data-a="settings-trans">${["ku1", "ku2", "en"].map(k => `<option value="${k}" ${st.trans === k ? "selected" : ""}>${tt[{"ku1":"reader_translation_kur1","ku2":"reader_translation_kur2","en":"reader_translation_en"}[k]]}</option>`).join("")}</select></div>
        <div class="set-row"><b>${tt.settings_default_reciter}</b>
          <select class="sel" data-a="settings-reciter">${QRECITERS.list.map(r => `<option value="${r.id}" ${st.reciter === r.id ? "selected" : ""}>${esc(r.ku)}</option>`).join("")}</select></div>
        <div class="set-row"><b>${tt.settings_font_size}</b>
          <input type="range" min="16" max="44" value="${st.fontSize}" data-a="settings-font"></div>
        <div class="set-row"><b>${tt.dash_goals} — ${tt.dash_goal_weekly}</b>
          <input type="number" class="sel" value="${st.goalWeekly}" data-a="goal-save"></div>
        <div class="set-row danger"><b>${tt.settings_clear}</b><button class="btn btn-ghost" data-a="clear-data">${tt.common_delete}</button></div>
      </div>
      <div class="set-card glass about">
        <h3>${tt.settings_about}</h3>
        <p>${tt.about_text}</p>
        <p class="hint">${tt.settings_version} 1.0 · ${tt.footer_disclaimer}</p>
        <p class="hint">${tt.footer_made} 💛</p>
      </div>
    </section>`;
  }

  /* ============ actions ============ */
  Object.assign(VActions, {
    "bookmark-hadith": (el) => { QK.Audio.toggleFavHadith(+el.dataset.id); renderHadith(); },
    "listen-adhkar": () => { trySpeakArabic(); },
    "count-adhkar": (el) => {
      const id = el.dataset.id, n = +el.dataset.n;
      const d = QK.state.adhkarDone;
      d[id] = ((d[id] || 0) + 1) % (n + 1);
      QK.save();
      renderAdhkar();
    },
    "detect-location": () => {
      if (!navigator.geolocation) return toast(T()("geo_unavailable"));
      navigator.geolocation.getCurrentPosition(pos => {
        QK.set("coords", { lat: pos.coords.latitude, lng: pos.coords.longitude, tz: -pos.coords.longitude / 15, name: "📍" });
        QK.set("city", null);
        App.render();
      }, err => {
        toast(err.code === 1 ? T()("geo_denied") : T()("geo_unavailable"));
      }, { timeout: 8000 });
    },
    "city-select": (el) => {
      if (!el.value) return;
      const c = QPRAY.CITIES.find(x => x[0] === el.value);
      QK.set("city", c[0]);
      QK.set("coords", null);
      QK.state.cityObj = { lat: c[1], lng: c[2], tz: c[3] };
      QK.save();
      App.render();
    },
    "method-select": (el) => { QK.set("pmethod", el.value); App.render(); },
    "madhab-select": (el) => { QK.set("asr", el.value); App.render(); },
    "notif-toggle": async () => {
      if (QK.state.notif) { QK.set("notif", false); App.render(); return; }
      if (!("Notification" in window)) return toast(T()("notif_denied"));
      try {
        const p = await Notification.requestPermission();
        if (p === "granted") { QK.set("notif", true); toast(T()("prayer_notif_on"), "check"); }
        else toast(T()("notif_denied"));
      } catch (e) { toast(T()("notif_denied")); }
      App.render();
    },
    "cal-nav": (el) => { location.hash = "/calendar/" + el.dataset.d; },
    "goal-save": (el) => {
      const v = parseInt(el.value, 10);
      if (v > 0) { QK.set("goalWeekly", v); toast(T()("common_save_ok"), "check"); }
    },
    "logout": () => { QK.Account.logout(); App.render(); toast(T()("auth_logout")); },
    "quiz-answer": (el) => {
      if (!quizState || quizState.answered) return;
      const i = +el.dataset.i;
      const q = quizState.q.qs[quizState.i];
      quizState.answered = true;
      const correct = i === q.a;
      if (correct) quizState.score++;
      $$(".quiz-opt").forEach((b, bi) => {
        b.disabled = true;
        if (bi === q.a) b.classList.add("right");
        if (bi === i && !correct) b.classList.add("wrong");
      });
      const tt = T();
      $("#quiz-expl").innerHTML = `<div class="quiz-expl ${correct ? "ok" : "no"}"><b>${correct ? "✓ " + tt.quiz_correct : "✗ " + tt.quiz_wrong}</b><p>${esc(q.x)}</p>
        <button class="btn btn-gold" data-a="quiz-next">${quizState.i + 1 < quizState.q.qs.length ? tt.quiz_next : tt.quiz_finish}</button></div>`;
    },
    "quiz-next": () => {
      quizState.i++;
      quizState.answered = false;
      const box = $("#quiz-box");
      if (quizState.i >= quizState.q.qs.length) box.innerHTML = quizResultHTML();
      else box.innerHTML = quizQHTML();
    },
    "quiz-retry": () => { quizState = { ...quizState, i: 0, score: 0, answered: false }; $("#quiz-box").innerHTML = quizQHTML(); },
    "lesson-done": (el) => {
      const cid = +el.dataset.c, i = +el.dataset.i;
      const arr = QK.state.courses[cid] || [];
      if (!arr.includes(i)) { arr.push(i); QK.state.courses[cid] = arr; QK.set("courses", QK.state.courses); }
      App.render();
    },
    "ai-send": () => {
      const inp = $("#chat-text");
      const v = inp.value;
      inp.value = "";
      chatSend(v);
    },
    "ai-quick": (el) => {
      const q = QAI.QUICK[+el.dataset.i];
      chatSend(q[LANG()] || q.ku);
    },
    "auth-guest": () => { location.hash = "/dashboard"; },
    "set-theme": (el) => { QK.set("theme", el.dataset.v); App.applyTheme(); App.render(); },
    "settings-lang": (el) => { I18N.lang = el.value; QK.set("lang", el.value); document.documentElement.lang = el.value; App.render(); },
    "settings-trans": (el) => { QK.set("trans", el.value); toast(T()("common_save_ok"), "check"); },
    "settings-reciter": (el) => { QAudio.setReciter(el.value); toast(T()("common_save_ok"), "check"); },
    "settings-font": (el) => { QK.set("fontSize", +el.value); toast(T()("common_save_ok"), "check"); },
    "clear-data": () => {
      if (!confirm(T()("settings_clear_confirm"))) return;
      QK.resetAll();
      location.hash = "/home";
      App.render();
    }
  });

  /* Arabic TTS */
  function trySpeakArabic() {
    const btn = event && event.target ? event.target.closest(".btn") : null;
    const card = btn ? btn.closest(".adhkar-card") : null;
    const text = card ? card.querySelector(".ar-text").textContent : "";
    if (!text) return;
    if (!("speechSynthesis" in window)) return toast("TTS ✗");
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    const arVoice = speechSynthesis.getVoices().find(v => v.lang.startsWith("ar"));
    if (arVoice) u.voice = arVoice;
    u.rate = 0.75;
    speechSynthesis.speak(u);
  }

  /* city object lookup for stored city name */
  function cityObj() {
    const c = QK.state.city;
    if (!c) return null;
    if (QK.state.cityObj) return { name: c, ...QK.state.cityObj };
    const row = QPRAY.CITIES.find(x => x[0] === c);
    return row ? { name: c, lat: row[1], lng: row[2], tz: row[3] } : null;
  }

  window.VMore = { hadithHTML, renderHadith, prophetsHTML, knowledgeHTML, renderKnowledgeGrid, adhkarHTML, renderAdhkar, prayerHTML, tickCountdown, calendarHTML, searchHTML, runSearch, dashboardHTML, quizzesHTML, quizRunnerHTML, courseHTML, assistantHTML, authHTML, authMode, authInit, settingsHTML, cityObj, chatSend };
})();
