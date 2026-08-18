/* Quran Kareem — prayer times (solar calculation), Hijri calendar, Qibla, events */
(function () {
  "use strict";
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;

  const METHODS = {
    MWL: { name: "Muslim World League", fajr: 18, isha: 17 },
    ISNA: { name: "ISNA", fajr: 15, isha: 15 },
    Egypt: { name: "هيئة المساحة المصرية", fajr: 19.5, isha: 17.5 },
    Makkah: { name: "أم القرى (مكة)", fajr: 18.5, isha: 90 }, // 90 = fixed 90 min after maghrib
    Karachi: { name: "جامعة كراتشي", fajr: 18, isha: 18 },
    Tehran: { name: "جامعة طهران", fajr: 17.7, isha: 14 }
  };

  function sunPosition(jd) {
    const D = jd - 2451545.0;
    const g = (357.529 + 0.98560028 * D) * D2R;
    const q = (280.459 + 0.98564736 * D) * D2R;
    const L = q + (1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * D2R;
    const e = 23.439 - 0.00000036 * D;
    const RA = Math.atan2(Math.cos(e * D2R) * Math.sin(L), Math.cos(L)) / D2R / 15;
    const decl = Math.asin(Math.sin(e * D2R) * Math.sin(L)) / D2R;
    const eqt = q / D2R - RA * 15; // degrees
    return { decl: decl * D2R, eqt: eqt * 4 }; // eqt in minutes
  }

  function julian(date) {
    let y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }

  function calcTimes(date, lat, lng, tz, method, asrShadow) {
    const jd = julian(date) - lng / (15 * 24);
    const { decl, eqt } = sunPosition(jd);
    const latR = lat * D2R;
    const noon = 12 + tz - lng / 15 - eqt / 60; // local solar noon in hours
    // hour-angle (hours) needed to reach a given solar altitude (degrees)
    const H = targetAltDeg => {
      const c = (Math.sin(targetAltDeg * D2R) - Math.sin(latR) * Math.sin(decl)) / (Math.cos(latR) * Math.cos(decl));
      if (c > 1 || c < -1) return null;
      return Math.acos(c) / (15 * D2R);
    };
    const hSun = H(-0.833);
    const sunrise = hSun === null ? null : noon - hSun;
    const sunset = hSun === null ? null : noon + hSun;
    const hFajr = H(-method.fajr);
    const fajr = hFajr === null ? null : noon - hFajr;
    let isha;
    if (method.isha === 90) isha = sunset === null ? null : sunset + 1.5;
    else { const hI = H(-method.isha); isha = hI === null ? null : noon + hI; }
    const asrAltDeg = Math.atan(1 / (asrShadow + Math.tan(Math.abs(latR - decl)))) / D2R;
    const hAsr = H(asrAltDeg);
    const asr = hAsr === null ? null : noon + hAsr;
    const toMin = h => (h === null ? null : ((((h % 24) + 24) % 24) * 60));
    return {
      fajr: toMin(fajr), sunrise: toMin(sunrise), dhuhr: toMin(noon),
      asr: toMin(asr), maghrib: toMin(sunset), isha: toMin(isha)
    };
  }

  function fmtTime(mins) {
    if (mins === null) return "--:--";
    const h = Math.floor(mins / 60), m = Math.floor(mins % 60);
    const hh = h % 12 === 0 ? 12 : h % 12;
    return String(hh).padStart(2, "0") + ":" + String(m).padStart(2, "0") + (h >= 12 ? " PM" : " AM");
  }

  /* ---- Hijri (tabular Islamic calendar) ---- */
  function hijriLeap(y) { return ((y * 11 + 14) % 30) < 11; }
  function hijriFromGregorian(y, m, d) {
    const jd = Math.floor(julian(new Date(y, m - 1, d)) + 0.5);
    const days = jd - 1948440; // 1 Muharram 1 AH
    const cyc = Math.floor(days / 10631);
    let rem = days - cyc * 10631;
    let year = cyc * 30 + 1;
    while (rem >= (hijriLeap(year) ? 355 : 354)) { rem -= hijriLeap(year) ? 355 : 354; year++; }
    let month = 1;
    const mdays = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, hijriLeap(year) ? 30 : 29];
    for (let i = 0; i < 12; i++) {
      if (rem < mdays[i]) break;
      rem -= mdays[i]; month++;
    }
    return { y: year, m: month, d: rem + 1 };
  }
  function hijriStr(h, lang) {
    const months = I18N[lang].calendar_hijri_months;
    return h.d + " " + months[h.m - 1] + " " + h.y;
  }

  /* ---- Qibla bearing from north ---- */
  function qiblaBearing(lat, lng) {
    const mk = 21.4225 * D2R, lk = 39.8262 * D2R;
    const p1 = lat * D2R, p2 = lng * D2R;
    const dL = lk - p2;
    const y = Math.sin(dL);
    const x = Math.cos(p1) * Math.tan(mk) - Math.sin(p1) * Math.cos(dL);
    let b = Math.atan2(y, x) * R2D;
    return (b + 360) % 360;
  }

  /* ---- Islamic events (tabular hijri based) ---- */
  const EVENTS = [
    { m: 1, d: 1, ku: "سەری ساڵی هیجری", ar: "رأس السنة الهجرية", en: "Islamic New Year" },
    { m: 1, d: 10, ku: "ڕۆژی عاشوورا", ar: "عاشوراء", en: "Day of Ashura" },
    { m: 3, d: 12, ku: "مەولیدی پێغەمبەر ﷺ", ar: "المولد النبوي", en: "Mawlid al-Nabi" },
    { m: 7, d: 27, ku: "ئیسرا و معراج", ar: "الإسراء والمعراج", en: "Isra & Mi'raj" },
    { m: 8, d: 15, ku: "شەوی بەرات", ar: "ليلة النصف من شعبان", en: "Nisf Sha'ban" },
    { m: 9, d: 1, ku: "یەکەم ڕۆژی ڕەمەزان", ar: "أول رمضان", en: "First day of Ramadan" },
    { m: 9, d: 27, ku: "شەوی قەدر (بەگوێرەی زۆربەی گێڕانەوەکان)", ar: "ليلة القدر", en: "Laylat al-Qadr" },
    { m: 10, d: 1, ku: "جێژنی ڕەمەزان", ar: "عيد الفطر", en: "Eid al-Fitr" },
    { m: 12, d: 9, ku: "ڕۆژی عەرەفە", ar: "يوم عرفة", en: "Day of Arafah" },
    { m: 12, d: 10, ku: "جێژنی قوربان", ar: "عيد الأضحى", en: "Eid al-Adha" }
  ];

  /* ---- countdown days from today (gregorian) to a hijri target ---- */
  function daysToHijriDate(hm, hd, from) {
    const today = from || new Date();
    let y = today.getFullYear();
    let best = null;
    for (let yy = y - 1; yy <= y + 2; yy++) {
      for (let mm = 1; mm <= 12; mm++) {
        for (let dd = 1; dd <= 30; dd++) {
          const h = hijriFromGregorian(yy, mm, dd);
          if (h.m === hm && h.d === hd) {
            const dt = new Date(yy, mm - 1, dd);
            const diff = Math.ceil((dt - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 864e5);
            if (best === null || Math.abs(diff) < Math.abs(best)) best = diff;
          }
        }
      }
    }
    return best;
  }
  function daysToHijriMonth(hm, from) { return daysToHijriDate(hm, 1, from); }

  /* ---- cities ---- */
  const CITIES = [
    ["هەولێر", 36.1911, 44.0092, 3], ["سلێمانی", 35.5570, 45.4356, 3], ["دهۆک", 36.8679, 42.9885, 3],
    ["کەرکووک", 35.4687, 44.3949, 3], ["هەڵەبجە", 35.1782, 45.9861, 3], ["بەغدا", 33.3152, 44.3661, 3],
    ["بەسرە", 30.5081, 47.7835, 3], ["مووسڵ", 36.3350, 43.1189, 3], ["تاران", 35.6892, 51.3890, 3.5],
    ["ئەستەمبوڵ", 41.0082, 28.9784, 3], ["ئەنقەرە", 39.9334, 32.8597, 3], ["قاهیرە", 30.0444, 31.2357, 2],
    ["ئەسکەندەریە", 31.2001, 29.9187, 2], ["مەککە", 21.3891, 39.8579, 3], ["مەدینە", 24.5247, 39.5692, 3],
    ["ڕیاز", 24.7136, 46.6753, 3], ["جەددە", 21.4858, 39.1925, 3], ["دوبەی", 25.2048, 55.2708, 4],
    ["ئەبووزەبی", 24.4539, 54.3773, 4], ["دەوحە", 25.2854, 51.5310, 3], ["عەممان", 31.9539, 35.9106, 3],
    ["قودس", 31.7683, 35.2137, 2], ["دیمەشق", 33.5138, 36.2765, 3], ["بەیروت", 33.8938, 35.5018, 2],
    ["سەنعا", 15.3694, 44.1910, 3], ["مەسقەت", 23.5859, 58.4059, 4], ["کوەیت", 29.3759, 47.9774, 3],
    ["مەنامە", 26.2285, 50.5860, 3], ["کەرەج", 35.1802, 50.9773, 3.5], ["لەندەن", 51.5074, -0.1278, 0],
    ["بەرلین", 52.5200, 13.4050, 1], ["پاریس", 48.8566, 2.3522, 1], ["نیویۆرک", 40.7128, -74.0060, -5],
    ["لۆس ئەنجلۆس", 34.0522, -118.2437, -8], ["کوالالامپور", 3.1390, 101.6869, 8], ["جاکارتا", -6.2088, 106.8456, 7],
    ["ئیسلاماباد", 33.6844, 73.0479, 5], ["کاراچی", 24.8607, 67.0011, 5], ["دەهلی", 28.6139, 77.2090, 5.5],
    ["داکا", 23.8103, 90.4125, 6], ["کەنۆ", 12.0022, 8.5920, 1], ["ئابوجا", 9.0765, 7.3986, 1],
    ["خەرتوم", 15.5007, 32.5599, 2], ["ئەددیس ئەبابا", 9.1450, 40.4897, 3], ["مۆگادیشو", 2.0469, 45.3182, 3]
  ];

  window.QPRAY = {
    METHODS, calcTimes, fmtTime, hijriFromGregorian, hijriStr, qiblaBearing,
    EVENTS, daysToHijriDate, daysToHijriMonth, CITIES
  };
})();
