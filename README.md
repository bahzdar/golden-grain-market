# 🕌 Quran Kareem — قورئانی پیرۆز

A premium, multilingual, offline-first Islamic web app: the **complete Holy Quran** (all 114 surahs, 6,236 ayahs) in the Uthmani script with **two Kurdish Sorani translations**, English translation, two scholarly Arabic tafsirs, audio recitations, a hadith library, a prophets encyclopedia, duas & adhkar, prayer times, an Islamic calendar, quizzes, courses and a smart assistant.

Built with **vanilla JS + CSS — no frameworks, no build step**. Just serve the folder.

## ✨ Features

| Area | What's included |
|---|---|
| 📖 Quran | All 114 surahs · Uthmani Arabic · Kurdish (Burhan Muhammad-Amin & Bamoki) · English (Clear Quran) · verse-by-verse navigation · font-size control · sajdah markers |
| 📚 Tafsir | Easy Kurdish tafsir for every surah + per-ayah scholarly Arabic tafsir (al-Jalalayn & Siraj) |
| 🎧 Audio | 10 famous reciters (Alafasy, Al-Husary, Abdul Basit, Al-Minshawi, Al-Muaiqly, As-Sudais, Al-Shuraim, Al-Ghamdi, Ayyub, Al-Dosari) · per-ayah + full-surah playback with CDN fallback chain · repeat (ayah/surah) · continuous Quran mode · 0.5–2× speed · downloads · Media Session background controls |
| 🌙 Hadith | 86 authentic hadiths with Kurdish translation in 8 categories (faith, prayer, fasting, charity, hajj, morality, family, knowledge) |
| 🕌 Prophets | 25 prophets with Kurdish biographies, timeline, events, locations & lessons |
| 🤲 Dua & Adhkar | Morning / evening / travel / prayer / daily — Arabic + Kurdish + audio pronunciation (TTS) + counter |
| 🕰️ Prayer times | Solar-calculation engine (5 methods, Shafi/Hanafi) · geolocation or 43-city picker · next-prayer countdown · Qibla compass · monthly table · adhan notifications |
| 📅 Calendar | Tabular Hijri calendar · Islamic events · Ramadan / Eid countdowns |
| 🔍 Search | Full-text search across the entire Quran (Arabic + Kurdish), tafsir, hadith, prophets, articles & adhkar |
| 👤 Account | Local accounts (SHA-256 hashed) · bookmarks · reading progress · khatm tracker · hifz (memorization) tracker · streaks · badges · listening history · dashboard |
| 🎓 Learning | 4 courses · 8 quizzes · achievement badges |
| 🤖 Assistant | Offline smart assistant answering from the in-app Quran, hadith, duas & knowledge base |
| 🌍 Languages | Kurdish Sorani · العربية · English (full RTL/LTR UI switching) |
| 🎨 Design | Gold / emerald / navy palette, glassmorphism, Islamic patterns, dark & light themes, mobile-first PWA |

## 🚀 Run

```bash
cd quran-kareem
python3 -m http.server 8080   # or any static server
# open http://localhost:8080
```

## 🧱 Architecture

```
index.html            app shell
css/style.css         design system (themes, glass, RTL)
js/i18n.js            UI strings (ku / ar / en)
js/surahs.js          114 surahs metadata + themes + easy Kurdish tafsir
js/store.js           state, local accounts, progress, badges
js/data.js            quran loaders + normalized full-text search
js/hadiths.js · prophets.js · adhkar.js · articles.js · reciters.js
js/praytimes.js       solar prayer-time engine, Hijri calendar, Qibla
js/audio.js           playback engine (fallback sources, repeat, speed)
js/assistant.js       offline smart assistant
js/views-*.js         UI views (hash-routed SPA)
js/app.js             router, theme, event delegation
data/quran/{ar,ku1,ku2,en,taf1,taf2}/NNN.json   6236 verses × 6 editions
sw.js + manifest      PWA, offline caching
```

## 📊 Data sources

- Arabic Uthmani text, Kurdish & English translations, Tafsir al-Jalalayn & Siraj tafsir — via the open [quran-api](https://github.com/fawazahmed0/quran-api) dataset (originally from Tanzil / QuranComplex / QuranEnc)
- Audio streams from everyayah.com, cdn.islamic.network and mp3quran.net (played live; multi-source fallback)
- Prayer times computed locally (astronomical), Hijri calendar is the standard tabular calendar (±1 day vs Umm al-Qura is possible)

All texts are served **offline** from `data/` — only audio streaming needs a connection.

## ⚠️ Note

This is a demo-quality reference build. Hadith translations, Kurdish tafsir notes and biographies were authored for this project; verify any religious content against trusted scholarly sources before republishing.
