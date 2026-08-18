/* Quran Kareem — persistent store, local accounts (SHA-256 hashed), progress & badges */
(function () {
  "use strict";
  const LS = "qk_";
  const DEFAULTS = {
    lang: "ku", theme: "dark", trans: "ku1", quranFont: "uthmani", fontSize: 24,
    reciter: "alafasy", repeat: "none", speed: 1,
    bookmarks: [], memorized: [], read: {}, history: [], favReciters: [], favHadith: [],
    lastRead: null, streak: { days: 0, last: null }, stats: {}, badges: [], quizScores: {},
    courses: {}, goalWeekly: 200, notif: false, city: null, coords: null,
    adhkarDone: {}, hadithBookmarks: []
  };

  const state = { ...DEFAULTS };
  let loaded = false;

  function load() {
    try {
      const raw = localStorage.getItem(LS + "state");
      if (raw) Object.assign(state, JSON.parse(raw));
      loaded = true;
    } catch (e) { loaded = true; }
  }
  function save() {
    try { localStorage.setItem(LS + "state", JSON.stringify(state)); } catch (e) {}
  }
  function set(k, v) { state[k] = v; save(); }
  function get(k) { return state[k]; }

  /* ---- accounts (local, SHA-256 hashed) ---- */
  function users() {
    try { return JSON.parse(localStorage.getItem(LS + "users") || "[]"); } catch (e) { return []; }
  }
  function setUsers(u) { localStorage.setItem(LS + "users", JSON.stringify(u)); }
  async function sha256(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }
  const Account = {
    async register(name, email, pass) {
      const us = users();
      email = email.trim().toLowerCase();
      if (us.find(u => u.email === email)) return { ok: false, code: "exists" };
      if (pass.length < 6) return { ok: false, code: "short" };
      const h = await sha256(email + "::" + pass);
      const u = { name, email, hash: h, created: Date.now() };
      us.push(u); setUsers(us);
      Account.setSession(u);
      return { ok: true, user: u };
    },
    async login(email, pass) {
      const us = users();
      email = email.trim().toLowerCase();
      const h = await sha256(email + "::" + pass);
      const u = us.find(x => x.email === email && x.hash === h);
      if (!u) return { ok: false, code: "invalid" };
      Account.setSession(u);
      return { ok: true, user: u };
    },
    setSession(u) { try { localStorage.setItem(LS + "session", JSON.stringify({ name: u.name, email: u.email })); } catch (e) {} },
    session() { try { return JSON.parse(localStorage.getItem(LS + "session") || "null"); } catch (e) { return null; } },
    logout() { localStorage.removeItem(LS + "session"); }
  };

  /* ---- bookmarks / progress ---- */
  const key = (s, a) => s + ":" + a;
  const Progress = {
    toggleBookmark(s, a) {
      const k = key(s, a); const i = state.bookmarks.indexOf(k);
      if (i >= 0) state.bookmarks.splice(i, 1); else state.bookmarks.unshift(k);
      save();
      if (!state.badges.includes("first_bookmark")) { state.badges.push("first_bookmark"); save(); }
      return i < 0;
    },
    isBookmark(s, a) { return state.bookmarks.includes(key(s, a)); },
    toggleMemorized(s, a) {
      const k = key(s, a); const i = state.memorized.indexOf(k);
      if (i >= 0) state.memorized.splice(i, 1); else state.memorized.push(k);
      save(); return i < 0;
    },
    isMemorized(s, a) { return state.memorized.includes(key(s, a)); },
    markRead(s, a) {
      const d = state.read; const k = key(s, a);
      if (!d[k]) {
        d[k] = Date.now();
        const today = new Date().toISOString().slice(0, 10);
        state.stats[today] = (state.stats[today] || 0) + 1;
        Progress.touchStreak();
      }
      state.lastRead = { s, a, at: Date.now() };
      save();
      Progress.checkBadges();
    },
    touchStreak() {
      const today = new Date().toISOString().slice(0, 10);
      const st = state.streak;
      if (st.last === today) return;
      const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      st.days = st.last === yest ? st.days + 1 : 1;
      st.last = today;
      if (st.days >= 7 && !state.badges.includes("streak_7")) { state.badges.push("streak_7"); }
      save();
    },
    readCount() { return Object.keys(state.read).length; },
    memorizedCount() { return state.memorized.length; },
    khatmPct() { return Math.min(100, Math.round(Object.keys(state.read).length / 6236 * 1000) / 10); },
    hifzPct() { return Math.min(100, Math.round(state.memorized.length / 6236 * 1000) / 10); },
    juzPct(n) {
      const j = QSURAH.JUZ[n - 1]; const start = QSURAH.localToGlobal(j[1], j[2]);
      const next = n < 30 ? QSURAH.JUZ[n] : null;
      const end = next ? QSURAH.localToGlobal(next[1], next[2]) : 6237;
      let c = 0;
      for (let g = start; g < end; g++) { const { s, a } = QSURAH.globalToLocal(g); if (state.read[key(s, a)]) c++; }
      return Math.round(c / (end - start) * 100);
    },
    checkBadges() {
      const b = state.badges;
      const add = id => { if (!b.includes(id)) { b.push(id); save(); } };
      if (Progress.readCount() >= 100) add("ayahs_100");
      for (let j = 1; j <= 30; j++) if (Progress.juzPct(j) >= 100) add("juz_done");
      if (Progress.khatmPct() >= 100) add("khatm");
      if (Progress.hifzPct() >= (1 / 30 * 100)) add("hifz_juz");
      if (state.history.length >= 10) add("listener_10");
      if (Object.keys(state.quizScores).length >= 3) add("quiz_whiz");
      if (state.bookmarks.length >= 10) add("collector");
      if (state.bookmarks.length >= 5) add("explorer");
    }
  };

  /* ---- audio history / queue ---- */
  const Audio = {
    pushHistory(s, a, reciter) {
      state.history.unshift({ s, a, reciter, at: Date.now() });
      state.history = state.history.slice(0, 100);
      save(); Progress.checkBadges();
    },
    toggleFavReciter(id) {
      const i = state.favReciters.indexOf(id);
      if (i >= 0) state.favReciters.splice(i, 1); else state.favReciters.push(id);
      save(); return i < 0;
    },
    toggleFavHadith(id) {
      const i = state.hadithBookmarks.indexOf(id);
      if (i >= 0) state.hadithBookmarks.splice(i, 1); else state.hadithBookmarks.push(id);
      save(); return i < 0;
    }
  };

  function resetAll() {
    Object.keys(DEFAULTS).forEach(k => { state[k] = JSON.parse(JSON.stringify(DEFAULTS[k])); });
    save();
  }

  window.QK = { state, load, save, set, get, Account, Progress, Audio, resetAll, key };
  QK.load();
})();
