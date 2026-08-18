/* Quran Kareem — quran text loaders & search engine */
(function () {
  "use strict";

  const EDITIONS = {
    ar:  { id: "ar",  label: "عربي", dir: "rtl", font: "uthmani" },
    ku1: { id: "ku1", label: "کوردی (١)", dir: "rtl" },
    ku2: { id: "ku2", label: "کوردی (٢)", dir: "rtl" },
    en:  { id: "en",  label: "English", dir: "ltr" },
    taf1:{ id: "taf1", label: "الجلالين", dir: "rtl" },
    taf2:{ id: "taf2", label: "السراج", dir: "rtl" }
  };

  const cache = new Map(); // 'ar:2' -> [verses]
  const loading = new Map();

  async function loadSurah(ed, n) {
    const k = ed + ":" + n;
    if (cache.has(k)) return cache.get(k);
    if (loading.has(k)) return loading.get(k);
    const p = fetch(`data/quran/${ed}/${String(n).padStart(3, "0")}.json`)
      .then(r => { if (!r.ok) throw new Error("load fail " + k); return r.json(); })
      .then(arr => { cache.set(k, arr); loading.delete(k); return arr; })
      .catch(e => { loading.delete(k); throw e; });
    loading.set(k, p);
    return p;
  }

  async function loadMany(ed, list, onProgress) {
    let done = 0;
    const out = [];
    await Promise.all(list.map(async n => {
      const v = await loadSurah(ed, n);
      out[n] = v;
      done++;
      if (onProgress) onProgress(done / list.length);
    }));
    return out;
  }

  /* ---- text normalization for search ---- */
  const AR_DIAC = /[\u064B-\u0652\u0670\u0640\u06D6-\u06ED\u064B-\u065F]/g;
  function normAr(s) {
    return (s || "")
      .replace(AR_DIAC, "")
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/[\u200B-\u200F\u202A-\u202E]/g, "");
  }
  function normKu(s) {
    return (s || "")
      .replace(/[ەۀ]/g, "ه")
      .replace(/[ێ]/g, "ی")
      .replace(/[ۆ]/g, "و")
      .replace(/[ڵ]/g, "ل")
      .replace(/[ڕ]/g, "ر")
      .replace(/[گ]/g, "ک")
      .replace(/[چ]/g, "ج")
      .replace(/[پ]/g, "ب")
      .replace(/[ڤ]/g, "ف")
      .replace(/[ڎ]/g, "د")
      .replace(/[\u200B-\u200F\u202A-\u202E]/g, "")
      .replace(/[؟!.,:؛،()«»"']/g, " ");
  }
  function normMixed(s) {
    const q = normKu(normAr(s)).replace(/\s+/g, " ").trim();
    return q.toLowerCase();
  }

  /* ---- full quran search (lazy loads all surahs) ---- */
  async function searchQuran(q, eds, limit, onProgress) {
    const query = normMixed(q);
    if (query.length < 2) return [];
    const results = [];
    for (const ed of eds) {
      const list = [];
      for (let i = 1; i <= 114; i++) list.push(i);
      await loadMany(ed, list, p => onProgress && onProgress(p, ed));
      for (let s = 1; s <= 114; s++) {
        const verses = cache.get(ed + ":" + s) || [];
        for (let a = 0; a < verses.length; a++) {
          if (normMixed(verses[a]).includes(query)) {
            results.push({ ed, s, a: a + 1, text: verses[a] });
            if (results.length >= limit) return results;
          }
        }
      }
    }
    return results;
  }

  async function searchSurahs(query) {
    const q = normMixed(query);
    return QSURAH.SURAHS.filter(s =>
      !q || normMixed(s.ar).includes(q) || normMixed(s.ku).includes(q) ||
      s.en.toLowerCase().includes(q.toLowerCase()) || s.tr.toLowerCase().includes(q.toLowerCase()) ||
      String(s.n) === q
    );
  }

  const Quran = {
    EDITIONS, loadSurah, loadMany, normAr, normKu, normMixed, searchQuran, searchSurahs,
    verse(ed, s, a) {
      const arr = cache.get(ed + ":" + s);
      return arr ? arr[a - 1] : null;
    }
  };
  window.QData = Quran;
})();
