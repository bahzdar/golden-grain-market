/* Quran Kareem — audio engine: ayah/surah playback, fallback sources, repeat, continuous */
(function () {
  "use strict";
  const el = new Audio();
  el.preload = "auto";

  const P = {
    mode: "surah",        // 'surah' | 'ayah'
    reciter: QK.state.reciter || "alafasy",
    s: 1, a: 1,
    started: false,
    playing: false,
    repeat: QK.state.repeat || "none",   // none | one | all
    continuous: false,   // keep playing through the whole Quran
    speed: QK.state.speed || 1,
    srcIdx: 0, sources: [],
    listeners: []
  };
  el.playbackRate = P.speed;

  function emit(ev, data) { P.listeners.forEach(fn => { try { fn(ev, data); } catch (e) {} }); }
  P.on = fn => P.listeners.push(fn);

  function nextAyah() {
    const s = QSURAH.SURAHS[P.s - 1];
    if (P.a < s.ayahs) { P.a++; return true; }
    if (P.s < 114) { P.s++; P.a = 1; return true; }
    return false;
  }
  function prevAyah() {
    if (P.a > 1) { P.a--; return true; }
    if (P.s > 1) { P.s--; P.a = QSURAH.SURAHS[P.s - 1].ayahs; return true; }
    return false;
  }

  function loadSources() {
    P.srcIdx = 0;
    if (P.mode === "surah") {
      P.sources = QRECITERS.surahSources(P.reciter, P.s);
      // fallback: chain per-ayah for continuous surah playback
    } else {
      P.sources = QRECITERS.ayahSources(P.reciter, P.s, P.a);
    }
  }

  function play() {
    loadSources();
    if (P.mode === "surah" && P.sources.length === 0) { P.mode = "ayah"; P.a = 1; loadSources(); }
    if (P.sources.length === 0) { toast(I18N.t("audio_err")); return; }
    el.src = P.sources[0];
    el.play().then(() => {
      P.playing = true;
      P.started = true;
      updateMediaSession();
      emit("play", { mode: P.mode, s: P.s, a: P.a, reciter: P.reciter });
    }).catch(() => { P.playing = false; emit("error"); });
  }

  function pause() {
    el.pause();
    P.playing = false;
    emit("pause");
  }
  function toggle() { P.playing ? pause() : play(); }

  function next() {
    let ok;
    if (P.mode === "ayah") ok = nextAyah();
    else { ok = P.s < 114; if (ok) { P.s++; P.a = 1; } }
    if (!ok) { if (P.continuous && P.mode === "surah") { P.s = 1; P.a = 1; } else { stop(); emit("end"); return; } }
    play();
  }
  function prev() {
    let ok;
    if (P.mode === "ayah") ok = prevAyah();
    else { ok = P.s > 1; if (ok) { P.s--; P.a = 1; } }
    if (!ok) { play(); return; }
    play();
  }

  function stop() {
    el.pause(); el.removeAttribute("src"); el.load();
    P.playing = false;
    emit("stop");
  }

  function setSpeed(v) {
    P.speed = v; el.playbackRate = v; QK.set("speed", v);
    emit("speed", v);
  }
  function setRepeat(v) { P.repeat = v; QK.set("repeat", v); emit("repeat", v); }
  function setReciter(id) { P.reciter = id; QK.set("reciter", id); emit("reciter", id); }
  function setContinuous(v) { P.continuous = v; emit("continuous", v); }

  function playSurah(s) { P.mode = "surah"; P.s = s; P.a = 1; play(); }
  function playAyah(s, a) { P.mode = "ayah"; P.s = s; P.a = a; play(); }

  el.addEventListener("timeupdate", () => emit("time", { t: el.currentTime, d: el.duration || 0 }));
  el.addEventListener("error", () => {
    // try next source
    P.srcIdx++;
    if (P.srcIdx < P.sources.length) { el.src = P.sources[P.srcIdx]; el.play().catch(() => {}); return; }
    // all sources failed for this item
    if (P.mode === "ayah") {
      if (P.continuous || P.repeat === "all") { next(); return; }
      P.playing = false; emit("error");
    } else {
      // surah file failed -> fall back to ayah-by-ayah from the start
      P.mode = "ayah"; P.a = 1; P.continuous = true;
      play();
    }
  });
  el.addEventListener("ended", () => {
    QK.Audio.pushHistory(P.s, P.a, P.reciter);
    if (P.mode === "surah") {
      emit("end");
      if (P.repeat === "all") { P.a = 1; play(); return; }
      if (P.continuous) { next(); return; }
      P.playing = false; emit("stop");
      return;
    }
    // ayah mode
    if (P.repeat === "one") { play(); return; }
    if (P.repeat === "all") { const s = QSURAH.SURAHS[P.s - 1]; if (P.a < s.ayahs) { P.a++; play(); return; } P.a = 1; play(); return; }
    if (P.continuous) { next(); return; }
    const s = QSURAH.SURAHS[P.s - 1];
    if (P.a < s.ayahs) { P.a++; play(); } else { P.playing = false; emit("stop"); }
  });
  el.addEventListener("play", () => { P.playing = true; updateMediaSession(); });
  el.addEventListener("pause", () => { P.playing = false; emit("pause"); });

  function updateMediaSession() {
    if (!("mediaSession" in navigator)) return;
    const rec = QRECITERS.byId(P.reciter);
    const su = QSURAH.SURAHS[P.s - 1];
    navigator.mediaSession.metadata = new MediaMetadata({
      title: I18N.t("common_surah") + " " + su.ar + (P.mode === "ayah" ? " — " + I18N.t("common_ayah") + " " + P.a : ""),
      artist: rec.ar,
      album: "Quran Kareem"
    });
    navigator.mediaSession.setActionHandler("play", () => play());
    navigator.mediaSession.setActionHandler("pause", () => pause());
    navigator.mediaSession.setActionHandler("previoustrack", () => prev());
    navigator.mediaSession.setActionHandler("nexttrack", () => next());
  }

  function downloadUrl() {
    if (P.mode === "surah") { loadSources(); if (P.sources.length) return P.sources[0]; }
    const srcs = QRECITERS.surahSources(P.reciter, P.s);
    return srcs.length ? srcs[0] : null;
  }

  window.QAudio = {
    P, play, pause, toggle, next, prev, stop, playSurah, playAyah,
    setSpeed, setRepeat, setReciter, setContinuous, downloadUrl, emit,
    on: fn => P.listeners.push(fn)
  };
  if (!("mediaSession" in navigator)) {
    // no-op fine
  }
})();
