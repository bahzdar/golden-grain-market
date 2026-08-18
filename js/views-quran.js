/* Quran Kareem — quran reader, tafsir, audio, reciters, bookmarks */
(function () {
  "use strict";
  const T = VCore.T, LANG = VCore.LANG, DIR = VCore.DIR, esc = VCore.esc, $ = VCore.$, $$ = VCore.$$,
    icon = VCore.icon, toast = VCore.toast, surahName = VCore.surahName, skeleton = VCore.skeleton;

  const AR_DIGITS = s => String(s).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);

  /* ================= Quran reader ================= */
  async function readerHTML(s, a) {
    const tt = T();
    const meta = QSURAH.SURAHS[s - 1];
    const st = QK.state;
    let body;
    try {
      const transEd = st.trans === "none" ? "ku1" : st.trans;
      const [ar, tr] = await Promise.all([QData.loadSurah("ar", s), QData.loadSurah(transEd, s)]);
      let taf = null;
      if (st.tafsirMode && st.tafsirMode !== "none") {
        taf = await QData.loadSurah(st.tafsirMode, s).catch(() => null);
      }
      body = versesHTML(meta, ar, tr, taf, a);
    } catch (e) {
      body = `<div class="empty">${tt.common_error} — ${tt.common_retry}</div>`;
    }
    return `
    <section class="reader" dir="${DIR()}">
      <div class="reader-toolbar">
        <button class="ibtn" data-a="history-back">${icon("chev")}</button>
        <button class="btn btn-sm btn-ghost" data-a="open-surah-list">${tt.reader_surah_list}</button>
        <div class="rt-actions">
          <select class="sel" data-a="reader-trans">${["ku1", "ku2", "en", "none"].map(k =>
            `<option value="${k}" ${st.trans === k ? "selected" : ""}>${k === "none" ? tt.reader_translation_none : tt[{"ku1":"reader_translation_kur1","ku2":"reader_translation_kur2","en":"reader_translation_en"}[k]]}</option>`).join("")}
          </select>
          <select class="sel" data-a="reader-tafsir">${[["none", tt.reader_tafsir + " —"], ["easy", tt.reader_tafsir_easy], ["taf1", tt.reader_tafsir_jalalayn], ["taf2", tt.reader_tafsir_siraj]].map(([v, l]) =>
            `<option value="${v}" ${(st.tafsirMode || "none") === v ? "selected" : ""}>${l}</option>`).join("")}
          </select>
          <button class="ibtn" data-a="reader-font-down" title="-">−</button>
          <button class="ibtn" data-a="reader-font-up" title="+">+</button>
        </div>
      </div>

      <header class="surah-head">
        <span class="sh-orn">${icon("logo")}</span>
        <h1>${esc(surahName(s))}</h1>
        <p class="sh-ar">${esc(meta.ar)}</p>
        <div class="sh-chips">
          <span class="chip sm ${meta.rev === "m" ? "tag-m" : "tag-d"}">${meta.rev === "m" ? tt.common_meccan : tt.common_medinan}</span>
          <span class="chip sm">${tt.reader_ayahs_count}: ${meta.ayahs}</span>
          <span class="chip sm">${tt.common_juz}: ${meta.juz}</span>
        </div>
      </header>

      <div class="bismillah">
        <p class="ar-text">${meta.n === 9 ? "" : esc(tt.common_bismillah)}</p>
        ${meta.n === 9 ? `<p class="note">${esc(meta.ku)} — ${T() === "ku" ? "ئەم سوورەتە بە بسم اللە دەست پێناکات" : ""}</p>` : ""}
      </div>

      <div class="surah-intro">
        <b>${tt.reader_surah_theme}</b>
        <p>${esc(meta.theme)}</p>
        <details><summary>${tt.reader_surah_tafsir_intro}</summary><p>${esc(meta.tafsir)}</p></details>
      </div>

      <div class="verses" id="verses">${body}</div>

      <div class="reader-nav">
        ${s > 1 ? `<a class="btn btn-ghost" href="#/quran/${s - 1}">${icon("prev")}${esc(surahName(s - 1))}</a>` : "<span></span>"}
        <label class="go-ayah">${tt.reader_go_to} <input type="number" min="1" max="${meta.ayahs}" data-a="go-ayah" data-s="${s}" value="${a || 1}"></label>
        ${s < 114 ? `<a class="btn btn-ghost" href="#/quran/${s + 1}">${esc(surahName(s + 1))}${icon("next")}</a>` : "<span></span>"}
      </div>
    </section>`;
  }

  function versesHTML(meta, ar, tr, taf, targetA) {
    const tt = T();
    const st = QK.state;
    const showTaf = (st.tafsirMode || "none") !== "none";
    return ar.map((v, i) => {
      const n = i + 1;
      const bm = QK.Progress.isBookmark(meta.n, n);
      const mem = QK.Progress.isMemorized(meta.n, n);
      const read = QK.state.read[meta.n + ":" + n];
      const isSajdah = meta.sajdah === n;
      const tid = "v-" + meta.n + "-" + n;
      return `
      <article class="verse ${n === Number(targetA) ? "target" : ""}" id="${tid}" data-s="${meta.n}" data-a="${n}">
        ${isSajdah ? `<span class="sajdah-badge">${tt.reader_sajdah_note} 🕌</span>` : ""}
        <div class="v-main">
          <span class="v-num">${AR_DIGITS(n)}</span>
          <div class="v-arwrap"><p class="ar-text qline" style="font-size:${st.fontSize}px">${esc(v)}</p></div>
        </div>
        ${st.trans !== "none" ? `<p class="v-trans" dir="auto">${esc(tr[i] || "")}</p>` : ""}
        ${showTaf && taf ? `<p class="v-taf" dir="rtl">${esc(taf[i] || "")}</p>` : showTaf && !taf && st.tafsirMode === "easy" ? `<p class="v-taf easy">${tt.reader_no_tafsir}</p>` : ""}
        <div class="v-actions">
          <button class="vbtn ${bm ? "on" : ""}" data-a="bookmark-verse" data-s="${meta.n}" data-a2="${n}" title="${bm ? tt.reader_remove_bookmark : tt.reader_add_bookmark}">${icon(bm ? "bookmarkFill" : "bookmark")}</button>
          <button class="vbtn ${mem ? "on" : ""}" data-a="hifz-verse" data-s="${meta.n}" data-a2="${n}" title="${tt.reader_memorize}">${icon("check")}</button>
          <button class="vbtn ${read ? "on" : ""}" data-a="mark-read" data-s="${meta.n}" data-a2="${n}" title="${tt.reader_mark_read}">${icon("star")}</button>
          <button class="vbtn" data-a="play-verse" data-s="${meta.n}" data-a2="${n}" title="${tt.reader_play_ayah}">${icon("play")}</button>
          <button class="vbtn" data-a="copy-verse" data-s="${meta.n}" data-a2="${n}" title="${tt.reader_copy_verse}">${icon("copy")}</button>
          <button class="vbtn" data-a="share-verse" data-s="${meta.n}" data-a2="${n}" title="${tt.reader_share_verse}">${icon("share")}</button>
        </div>
      </article>`;
    }).join("");
  }

  function surahListModalHTML() {
    const tt = T();
    return `
    <div class="modal-backdrop" data-a="close-surah-list"></div>
    <div class="modal slm" dir="${DIR()}">
      <div class="modal-head"><b>${tt.reader_surah_list}</b><button class="ibtn" data-a="close-surah-list">${icon("close")}</button></div>
      <div class="searchbox">${icon("search")}<input id="slm-search" type="text" placeholder="${tt.surahs_search}"></div>
      <div class="slm-grid" id="slm-grid"></div>
    </div>`;
  }
  function renderSurahListModal() {
    const grid = $("#slm-grid");
    if (!grid) return;
    const q = ($("#slm-search")?.value || "").trim();
    const qn = QData.normMixed(q);
    const list = QSURAH.SURAHS.filter(x => !q || QData.normMixed(x.ku).includes(qn) || QData.normMixed(x.ar).includes(qn) || String(x.n) === q);
    grid.innerHTML = list.map(x => `<a href="#/quran/${x.n}" data-a="close-surah-list"><b>${x.n}</b>${esc(surahName(x.n))}</a>`).join("");
  }

  /* ================= Tafsir center ================= */
  async function tafsirHTML(s) {
    const tt = T();
    const meta = s ? QSURAH.SURAHS[s - 1] : null;
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.tafsir_title}</h1>
      <p class="page-sub">${tt.tafsir_sub}</p>
      <div class="toolbar">
        <select class="sel" data-a="tafsir-pick">${QSURAH.SURAHS.map(x => `<option value="${x.n}" ${s === x.n ? "selected" : ""}>${x.n}. ${esc(surahName(x.n))} (${x.ayahs})</option>`).join("")}</select>
        <span class="hint">${tt.tafsir_sources}</span>
      </div>
      <div id="tafsir-body">${s ? `<div class="sk">${'<div class="sk-line"></div>'.repeat(4)}</div>` : `<div class="empty">${tt.tafsir_pick}</div>`}</div>
    </section>`;
  }

  async function renderTafsirBody(s) {
    const box = $("#tafsir-body");
    if (!box) return;
    const tt = T();
    const meta = QSURAH.SURAHS[s - 1];
    try {
      const taf = await QData.loadSurah("taf1", s);
      box.innerHTML = `
        <div class="tafsir-card">
          <div class="tc-head"><span>${icon("sparkle")}</span><div><b>${tt.reader_tafsir_easy}</b><i>${esc(surahName(s))}</i></div></div>
          <p><b>${tt.reader_surah_theme}:</b> ${esc(meta.theme)}</p>
          <p>${esc(meta.tafsir)}</p>
        </div>
        <h3 class="sec-title">${tt.reader_tafsir_scholarly} — ${tt.reader_tafsir_jalalayn}</h3>
        <div class="tafsir-verses" id="tafsir-verses"></div>`;
      renderTafsirVerses(s, taf, 1, 40);
    } catch (e) {
      box.innerHTML = `<div class="empty">${tt.common_error}</div>`;
    }
  }

  function renderTafsirVerses(s, taf, from, count) {
    const box = $("#tafsir-verses");
    if (!box) return;
    const meta = QSURAH.SURAHS[s - 1];
    const end = Math.min(from + count, meta.ayahs + 1);
    for (let n = from; n < end; n++) {
      const div = document.createElement("div");
      div.className = "tv-item";
      div.innerHTML = `<a class="tv-num" href="#/quran/${s}/${n}">${AR_DIGITS(n)}</a><p class="ar-text">${esc(taf[n - 1])}</p>`;
      box.appendChild(div);
    }
    if (end <= meta.ayahs) {
      const btn = document.createElement("button");
      btn.className = "btn btn-ghost w100";
      btn.textContent = T()("common_next") + " (" + (meta.ayahs - end + 1) + ")";
      btn.onclick = () => { btn.remove(); renderTafsirVerses(s, taf, end, 40); };
      box.appendChild(btn);
    }
  }

  /* ================= Audio hub ================= */
  function audioHTML() {
    const tt = T();
    const P = QAudio.P;
    const rec = QRECITERS.byId(P.reciter);
    const su = QSURAH.SURAHS[P.s - 1];
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.audio_title}</h1>
      <div class="audio-grid">
        <div class="player-card glass">
          <div class="pc-head">
            <select class="sel" data-a="audio-reciter">${QRECITERS.list.map(r => `<option value="${r.id}" ${r.id === P.reciter ? "selected" : ""}>${esc(r.ku)}</option>`).join("")}</select>
            <button class="ibtn ${QK.state.favReciters.includes(P.reciter) ? "on" : ""}" data-a="fav-reciter" data-id="${P.reciter}">${icon("heart")}</button>
          </div>
          <div class="pc-disc ${P.playing ? "spin" : ""}">${icon("logo")}</div>
          <div class="pc-title">
            <b>${esc(su.ku)}</b>
            <i>${esc(su.ar)} · ${esc(rec.ku)}</i>
          </div>
          <div class="pc-ctrl">
            <button class="ibtn big" data-a="ab-prev">${icon("prev")}</button>
            <button class="bigplay" data-a="ab-toggle">${icon(P.playing ? "pause" : "play")}</button>
            <button class="ibtn big" data-a="ab-next">${icon("next")}</button>
          </div>
          <div class="pc-opts">
            <label class="opt"><span>${tt.audio_speed}</span><select class="sel" data-a="ab-speed">${[0.5, 0.75, 1, 1.25, 1.5, 2].map(v => `<option value="${v}" ${P.speed === v ? "selected" : ""}>${v}x</option>`).join("")}</select></label>
            <label class="opt"><span>${tt.common_repeat}</span><select class="sel" data-a="ab-repeat"><option value="none" ${P.repeat === "none" ? "selected" : ""}>—</option><option value="one" ${P.repeat === "one" ? "selected" : ""}>${tt.common_repeat_one}</option><option value="all" ${P.repeat === "all" ? "selected" : ""}>${tt.common_repeat_all}</option></select></label>
            <label class="opt toggle"><span>${tt.audio_continuous}</span><input type="checkbox" data-a="ab-continuous" ${P.continuous ? "checked" : ""}></label>
          </div>
          <button class="btn btn-gold w100" data-a="download-surah">${icon("download")}${tt.audio_download_surah}</button>
          <p class="hint center">${tt.audio_bg_note} · ${tt.audio_repeat_note}</p>
        </div>
        <div class="surah-picker glass">
          <div class="searchbox">${icon("search")}<input id="audio-surah-search" type="text" placeholder="${tt.surahs_search}"></div>
          <div class="ap-list" id="ap-list"></div>
        </div>
      </div>
    </section>`;
  }

  function renderAudioList() {
    const box = $("#ap-list");
    if (!box) return;
    const tt = T();
    const q = ($("#audio-surah-search")?.value || "").trim();
    const qn = QData.normMixed(q);
    const P = QAudio.P;
    box.innerHTML = QSURAH.SURAHS.filter(x => !q || QData.normMixed(x.ku).includes(qn) || QData.normMixed(x.ar).includes(qn) || String(x.n) === q)
      .map(x => `<button class="ap-item ${P.s === x.n ? "on" : ""}" data-a="play-surah" data-s="${x.n}">
        <span class="ap-num">${String(x.n).padStart(3, "0")}</span>
        <span class="ap-name"><b>${esc(surahName(x.n))}</b><i>${x.ayahs} ${tt.common_ayahs}</i></span>
        ${P.s === x.n ? `<span class="ap-play">${icon(P.playing ? "pause" : "play")}</span>` : `<span class="ap-play">${icon("play")}</span>`}
      </button>`).join("");
  }

  /* ================= Reciters ================= */
  function recitersHTML() {
    const tt = T();
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.reciters_title}</h1>
      <p class="page-sub">${tt.reciters_collection} · ${QRECITERS.list.length} ${tt.reciters_title.toLowerCase()}</p>
      <div class="reciter-grid">
        ${QRECITERS.list.map(r => `
          <div class="reciter-card glass">
            <div class="rc-avatar">${icon("user")}</div>
            <div class="rc-info">
              <b>${esc(r.ku)}</b>
              <i>${esc(r.ar)}</i>
              <span class="chip sm">${esc(r.riwaya)} · ${esc(r.country)}</span>
            </div>
            <div class="rc-actions">
              <button class="btn btn-gold btn-sm" data-a="open-reciter" data-id="${r.id}">${icon("play")}${tt.reciters_listen}</button>
              <button class="ibtn ${QK.state.favReciters.includes(r.id) ? "on" : ""}" data-a="fav-reciter" data-id="${r.id}" title="${tt.reciters_fav}">${icon("heart")}</button>
            </div>
            <p class="rc-bio">${esc(r.bio)}</p>
          </div>`).join("")}
      </div>
    </section>`;
  }

  /* ================= Bookmarks ================= */
  async function bookmarksHTML() {
    const tt = T();
    const items = QK.state.bookmarks.slice();
    if (!items.length) return `<section class="wrap"><h1 class="page-title">${tt.nav_bookmarks}</h1><div class="empty">${tt.common_no_results}</div></section>`;
    const rows = [];
    for (const k of items) {
      const [s, a] = k.split(":").map(Number);
      try {
        const ar = await QData.loadSurah("ar", s);
        const tr = QK.state.trans !== "none" ? await QData.loadSurah(QK.state.trans, s).catch(() => null) : null;
        rows.push([s, a, ar, tr]);
      } catch (e) {}
    }
    return `
    <section class="wrap" dir="${DIR()}">
      <h1 class="page-title">${tt.nav_bookmarks}</h1>
      ${rows.map(([s, a, ar, tr]) => `
        <div class="bm-card glass">
          <div class="bm-head"><a href="#/quran/${s}/${a}"><b>${esc(surahName(s))}</b> · ${tt.common_ayah} ${a}</a>
            <button class="ibtn" data-a="remove-bookmark" data-s="${s}" data-a2="${a}">${icon("close")}</button></div>
          <p class="ar-text">${esc(ar[a - 1])}</p>
          ${tr ? `<p class="v-trans" dir="auto">${esc(tr[a - 1])}</p>` : ""}
          <a class="btn btn-ghost btn-sm" href="#/quran/${s}/${a}">${tt.common_read} ${icon("next")}</a>
        </div>`).join("")}
    </section>`;
  }

  /* ================= actions ================= */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => toast(T()("common_copied"), "check")).catch(() => legacyCopy(text));
    else legacyCopy(text);
  }
  function legacyCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast(T()("common_copied"), "check"); } catch (e) {}
    ta.remove();
  }

  Object.assign(VActions, {
    "reader-trans": (el) => { QK.set("trans", el.value); App.render(); },
    "reader-tafsir": (el) => { QK.set("tafsirMode", el.value); App.render(); },
    "reader-font-up": () => { QK.set("fontSize", Math.min(44, QK.state.fontSize + 2)); $$(".qline").forEach(p => p.style.fontSize = QK.state.fontSize + "px"); },
    "reader-font-down": () => { QK.set("fontSize", Math.max(16, QK.state.fontSize - 2)); $$(".qline").forEach(p => p.style.fontSize = QK.state.fontSize + "px"); },
    "bookmark-verse": (el) => {
      const s = +el.dataset.s, a = +el.dataset.a2;
      const on = QK.Progress.toggleBookmark(s, a);
      el.classList.toggle("on", on);
      el.innerHTML = icon(on ? "bookmarkFill" : "bookmark");
      toast(on ? T()("reader_add_bookmark") : T()("reader_remove_bookmark"), "bookmark");
    },
    "hifz-verse": (el) => {
      const s = +el.dataset.s, a = +el.dataset.a2;
      const on = QK.Progress.toggleMemorized(s, a);
      el.classList.toggle("on", on);
      toast(on ? T()("reader_memorize") : T()("reader_unmemorize"), "check");
    },
    "mark-read": (el) => {
      const s = +el.dataset.s, a = +el.dataset.a2;
      QK.Progress.markRead(s, a);
      el.classList.add("on");
      toast(T()("reader_mark_read"), "check");
    },
    "play-verse": (el) => {
      const s = +el.dataset.s, a = +el.dataset.a2;
      QK.Progress.markRead(s, a);
      QAudio.setContinuous(true);
      QAudio.playAyah(s, a);
      App.renderAudioBar();
    },
    "copy-verse": (el) => {
      const s = +el.dataset.s, a = +el.dataset.a2;
      const ar = QData.verse("ar", s, a);
      const tr = QData.verse(QK.state.trans, s, a);
      copyText((ar ? ar + "\n" : "") + (tr ? tr + "\n" : "") + `(${surahName(s)} ${a})`);
    },
    "share-verse": (el) => {
      const s = +el.dataset.s, a = +el.dataset.a2;
      const ar = QData.verse("ar", s, a);
      const text = `${ar}\n(${surahName(s)} ${a}) — Quran Kareem`;
      if (navigator.share) navigator.share({ text }).catch(() => {});
      else copyText(text);
    },
    "open-surah-list": () => { let m = $("#modal-root"); if (!m) { m = document.createElement("div"); m.id = "modal-root"; document.body.appendChild(m); } m.innerHTML = surahListModalHTML(); renderSurahListModal(); },
    "close-surah-list": () => { const m = $("#modal-root"); if (m) m.innerHTML = ""; },
    "go-ayah": (el) => {
      let v = parseInt(el.value, 10);
      if (isNaN(v)) return;
      const max = QSURAH.SURAHS[+el.dataset.s - 1].ayahs;
      v = Math.max(1, Math.min(max, v));
      location.hash = "/quran/" + el.dataset.s + "/" + v;
    },
    "tafsir-pick": (el) => { location.hash = "/tafsir/" + el.value; },
    "play-surah": (el) => {
      const s = +el.dataset.s;
      QAudio.setContinuous(false);
      QAudio.playSurah(s);
      App.renderAudioBar();
      renderAudioList();
    },
    "open-reciter": (el) => { QAudio.setReciter(el.dataset.id); location.hash = "/audio"; },
    "fav-reciter": (el) => {
      const on = QAudio.toggleFavReciter ? QK.Audio.toggleFavReciter(el.dataset.id) : false;
      el.classList.toggle("on", on);
      toast(on ? T()("reciters_fav") : T()("common_unfavorite"), "heart");
    },
    "audio-reciter": (el) => { QAudio.setReciter(el.value); App.renderAudioBar(); },
    "download-surah": () => {
      const url = QAudio.downloadUrl();
      if (!url) return toast(T()("audio_err"));
      const a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener"; a.download = "";
      document.body.appendChild(a); a.click(); a.remove();
      toast(T()("common_download"));
    },
    "remove-bookmark": (el) => {
      QK.Progress.toggleBookmark(+el.dataset.s, +el.dataset.a2);
      App.render();
    }
  });

  window.VQuran = { readerHTML, tafsirHTML, renderTafsirBody, audioHTML, renderAudioList, recitersHTML, bookmarksHTML, AR_DIGITS, renderSurahListModal };
})();
