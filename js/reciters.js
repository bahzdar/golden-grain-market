/* Quran Kareem — Reciters library: profiles + audio source builders */
(function () {
  "use strict";
  // ayah: [everyayah dir, islamic.network edition] ; surah: mp3quran pattern (nullable)
  const RECITERS = [
    { id: "alafasy", ar: "مشاري راشد العفاسي", ku: "مشاری ڕاشد عەفاسی", en: "Mishary Rashid Alafasy",
      riwaya: "حەفس لە عاسم", country: "کوەیت",
      ayah: ["Alafasy_128kbps", "ar.alafasy"],
      surah: "https://server8.mp3quran.net/afs/{s}.mp3",
      bio: "قورئانخوێن و مونشیدی کوەیتییە، لە ساڵی ١٩٧٦ لەدایکبووە. یەکێکە لە بەناوبانگترین قورئانخوێنەکانی جیهان و دەنگی تایبەت و شیرینی هەیە. خوێندنەوەکانی بە تەڕتیل و تەجوییدی ورد ناسراون و لە زۆربەی جیهاندا گوێی لێدەگیرێت." },
    { id: "husary", ar: "محمود خليل الحصري", ku: "مەحموود خەلیل حوسەری", en: "Mahmoud Khalil Al-Husary",
      riwaya: "حەفس لە عاسم", country: "میسر",
      ayah: ["Husary_128kbps", "ar.husary"],
      surah: "https://server13.mp3quran.net/husr/{s}.mp3",
      bio: "قورئانخوێنی میسرییە (١٩١٧-١٩٨٠). یەکەم کەس بوو کە تەواوی قورئانی بە تەجویید تۆمار کرد و یەکەم سەرۆکی سەندیکای قورئانخوێنانی میسر بوو. خوێندنەوەکەی بە وردی و تەماتیکەوە ناسراوە و وەک سەرچاوەی فێربوون بەکاردێت." },
    { id: "abdulbasit", ar: "عبد الباسط عبد الصمد", ku: "عەبدولباست عەبدوسسەمەد", en: "Abdul Basit Abdus-Samad",
      riwaya: "حەفس و وەرش", country: "میسر",
      ayah: ["Abdul_Basit_Murattal_192kbps", "ar.abdulbasitmurattal"],
      surah: "https://server7.mp3quran.net/basit/{s}.mp3",
      bio: "یەکێکە لە گەورەترین قورئانخوێنەکانی مێژوو (١٩٢٧-١٩٨٨). بە (گردنی زێڕین) ناسراوە و دەنگێکی فراوان و ناوازەی هەبوو. خوێندنەوەکانی بە موجوەد و موڕەتەل لە هەموو جیهاندا بڵاوە و ملیۆنان کەس پێی قورئانیان فێربووە." },
    { id: "minshawi", ar: "محمد صديق المنشاوي", ku: "محەمەد سدیق مینشاوی", en: "Muhammad Siddiq Al-Minshawi",
      riwaya: "حەفس لە عاسم", country: "میسر",
      ayah: ["Minshawy_Murattal_128kbps", "ar.minshawimurattal"],
      surah: "https://server10.mp3quran.net/minsh/{s}.mp3",
      bio: "قورئانخوێنی میسرییە (١٩٢٠-١٩٦٩) و بە (دەنگە گریاوەکە) ناسراوە چونکە خوێندنەوەکەی پڕە لە خشوع و کاریگەری. لە بنەماڵەیەکی قورئانخوێندا لەدایکبووە و خوێندنەوەکەی لە خۆشەویستترین خوێندنەوەکانە لای گوێگران." },
    { id: "maher", ar: "ماهر المعيقلي", ku: "ماهیر موعەیقلی", en: "Maher Al-Muaiqly",
      riwaya: "حەفس لە عاسم", country: "سعودیە",
      ayah: ["MaherAlMuaiqly128kbps", "ar.mahermuaiqly"],
      surah: "https://server12.mp3quran.net/maher/{s}.mp3",
      bio: "قورئانخوێن و ئیمامی مزگەوتی حەرامی مەککەیە، لە ساڵی ١٩٦٩ لەدایکبووە. دەنگێکی نەرم و پڕ سۆزی هەیە و یەکێکە لە خۆشەویستترین ئیمامەکانی مزگەوتی حەرام لای موسڵمانان." },
    { id: "sudais", ar: "عبد الرحمن السديس", ku: "عەبدولڕەحمان سودەیس", en: "Abdulrahman Al-Sudais",
      riwaya: "حەفس لە عاسم", country: "سعودیە",
      ayah: ["Abdurrahmaan_As-Sudais_192kbps", "ar.abdurrahmaansudais"],
      surah: "https://server11.mp3quran.net/sds/{s}.mp3",
      bio: "ئیمام و وتاربێژی مزگەوتی حەرامی مەککەیە، لە ساڵی ١٩٦٠ لەدایکبووە. دەنگی بەهێز و خوێندنەوە کاریگەرەکەی لە هەموو جیهاندا ناسراوە و چەندین ساڵە لە نوێژەکانی حەرامدا دەنگی دەبیسترێت." },
    { id: "shuraim", ar: "سعود الشريم", ku: "سەعود شورەیم", en: "Saud Al-Shuraim",
      riwaya: "حەفس لە عاسم", country: "سعودیە",
      ayah: ["Saud_Al-Shuraim_128kbps", "ar.saoodshuraym"],
      surah: null,
      bio: "ئیمامی پێشووی مزگەوتی حەرامی مەککە و دادوەرە، لە ساڵی ١٩٦٦ لەدایکبووە. خوێندنەوەکەی بە تەماتیک و هێمنی ناسراوە و لە خۆشەویستترین دەنگەکانی قورئانە." },
    { id: "ghamdi", ar: "سعد الغامدي", ku: "سەعد غامدی", en: "Saad Al-Ghamdi",
      riwaya: "حەفس لە عاسم", country: "سعودیە",
      ayah: ["Ghamadi_40kbps", "ar.saadalgamdi"],
      surah: "https://server7.mp3quran.net/s_gmd/{s}.mp3",
      bio: "قورئانخوێنی سعودییە، لە ساڵی ١٩٦٧ لەدایکبووە. دەنگێکی تایبەت و نەرمی هەیە و خوێندنەوەکانی زۆر بڵاون لە تۆڕەکاندا." },
    { id: "ayyoub", ar: "محمد أيوب", ku: "محەمەد ئەییووب", en: "Muhammad Ayyub",
      riwaya: "حەفس لە عاسم", country: "سعودیە",
      ayah: ["Muhammad_Ayyoub_128kbps", "ar.muhammadayyoub"],
      surah: null,
      bio: "ئیمامی پێشووی مزگەوتی پێغەمبەر ﷺ لە مەدینەیە (١٩٥٢-٢٠١٦). خوێندنەوەکەی بە هێمنی و خشوع ناسراوە و چەندین ساڵ لە نوێژەکانی مزگەوتی پێغەمبەردا دەنگی تۆمار کراوە." },
    { id: "yasser", ar: "ياسر الدوسري", ku: "یاسر دۆسەری", en: "Yasser Al-Dosari",
      riwaya: "حەفس لە عاسم", country: "سعودیە",
      ayah: ["Yasser_Ad-Dussary_128kbps", "ar.yasseraldosary"],
      surah: "https://server11.mp3quran.net/yasser/{s}.mp3",
      bio: "ئیمامی ئێستای مزگەوتی حەرامی مەککەیە، لە ساڵی ١٩٨٠ لەدایکبووە. دەنگێکی بەهێز و کاریگەری هەیە و خوێندنەوەکانی زۆر بڵاو دەبنەوە." }
  ];

  const byId = id => RECITERS.find(r => r.id === id) || RECITERS[0];

  function pad3(n) { return String(n).padStart(3, "0"); }

  /* per-ayah sources: [everyayah, islamic.network] */
  function ayahSources(reciterId, s, a) {
    const r = byId(reciterId);
    const g = QSURAH.localToGlobal(s, a);
    return [
      `https://everyayah.com/data/${r.ayah[0]}/${pad3(s)}${pad3(a)}.mp3`,
      `https://cdn.islamic.network/quran/audio/128/${r.ayah[1]}/${g}.mp3`
    ];
  }
  /* full surah sources */
  function surahSources(reciterId, s) {
    const r = byId(reciterId);
    if (r.surah) return [r.surah.replace("{s}", pad3(s))];
    return [];
  }

  window.QRECITERS = { list: RECITERS, byId, ayahSources, surahSources };
})();
