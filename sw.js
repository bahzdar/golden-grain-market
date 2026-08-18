/* Quran Kareem — service worker: offline-first app shell + quran data cache */
const VERSION = "qk-v2";
const SHELL = [
  "/", "/index.html", "/css/style.css", "/manifest.webmanifest",
  "/js/i18n.js", "/js/surahs.js", "/js/store.js", "/js/data.js", "/js/hadiths.js",
  "/js/prophets.js", "/js/adhkar.js", "/js/articles.js", "/js/reciters.js",
  "/js/praytimes.js", "/js/audio.js", "/js/assistant.js",
  "/js/views-core.js", "/js/views-quran.js", "/js/views-more.js", "/js/app.js",
  "/icons/icon-192.png", "/icons/icon-512.png", "/icons/maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // quran data: cache-first
  if (url.pathname.includes("/data/quran/")) {
    e.respondWith(
      caches.open(VERSION).then(async c => {
        const hit = await c.match(e.request);
        if (hit) return hit;
        const res = await fetch(e.request);
        if (res.ok) c.put(e.request, res.clone());
        return res;
      })
    );
    return;
  }
  // app shell: stale-while-revalidate
  if (url.origin === location.origin) {
    e.respondWith(
      caches.open(VERSION).then(async c => {
        const hit = await c.match(e.request);
        const p = fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }).catch(() => hit);
        return hit || p;
      })
    );
    return;
  }
  // external (audio CDNs, fonts): network with no-store
  e.respondWith(fetch(e.request, { cache: "no-store" }));
});
