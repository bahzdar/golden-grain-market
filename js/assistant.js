/* Quran Kareem — offline smart Islamic assistant (rule-based over in-app data) */
(function () {
  "use strict";

  const QA = [
    { k: ["السلام", "سڵاو", "سلاو", "hello", "hi", "hey", "بەخێر", "بخێر"],
      ku: "سڵاو! بەخێربێیت بۆ قورئانی پیرۆز. دەتوانیت لەبارەی قورئان، فەرموودە، نوێژ، ڕۆژوو، زەکات، حەج، دوعا و پێغەمبەران پرسیار بکەیت.",
      ar: "السلام عليكم! أهلاً بك في القرآن الكريم. يمكنك السؤال عن القرآن والحديث والصلاة والصيام والزكاة والحج والأدعية والأنبياء.",
      en: "Assalamu alaikum! Welcome to Quran Kareem. You can ask about the Quran, hadith, prayer, fasting, zakat, hajj, duas and the prophets." },
    { k: ["شوکر", "سوپاس", "thanks", "thank", "شكرا"],
      ku: "شایانی نییە! هیوادارم سوودت لێبینی. دەتوانیت لە هەر شتێک بپرسیت.",
      ar: "عفوًا! أتمنى أن تستفيد. يمكنك سؤال أي شيء.",
      en: "You're welcome! Feel free to ask anything." },
    { k: ["پایەکانی ئیسلام", "أركان الإسلام", "pillars of islam", "pillars"],
      ku: "ئیسلام لەسەر پێنج پایە بنیات نراوە: ١) شایەتماندان (لا إله إلا الله محمد رسول الله) ٢) نوێژ ٣) زەکات ٤) ڕۆژووی ڕەمەزان ٥) حەجی کەعبە بۆ ئەوەی توانای هەیە. (بوخاری و موسلیم)",
      ar: "بني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمدًا رسول الله، وإقام الصلاة، وإيتاء الزكاة، وصوم رمضان، وحج البيت لمن استطاع إليه سبيلاً. (البخاري ومسلم)",
      en: "Islam is built on five pillars: the testimony of faith, prayer, zakat, fasting Ramadan, and Hajj for those able. (Bukhari & Muslim)" },
    { k: ["پایەکانی ئیمان", "أركان الإيمان", "pillars of faith", "iman"],
      ku: "ئیمان شەش پایەیە: باوەڕ بە خوا، فریشتەکان، کتێبە ئاسمانییەکان، پێغەمبەران، ڕۆژی دوایی و قەزا و قەدەر.",
      ar: "الإيمان ستة أركان: الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره.",
      en: "Faith has six pillars: belief in Allah, His angels, His books, His messengers, the Last Day, and divine decree." },
    { k: ["ووزوو", "الوضوء", "wudu", "ablution"],
      ku: "ووزوو مەرجی نوێژە. پێکهاتووە لە: نییەت و بسم الله، شوشتنی دەستەکان (٣)، دەم و لوت (٣)، دەموچاو (٣)، دەستەکان هەتا ئەنیشک (٣)، مسحی سەر و گوێکان، شوشتنی قاچەکان هەتا ئەژنۆ (٣). خولەکانی ووزوو بزانە لە خولی (تەحەڕووی ووزوو) لە بەشی خولەکان.",
      ar: "الوضوء شرط للصلاة، وأركانه: النية والتسمية، غسل اليدين، المضمضة والاستنشاق، غسل الوجه، غسل اليدين إلى المرفقين، مسح الرأس والأذنين، وغسل الرجلين إلى الكعبين.",
      en: "Wudu is required for prayer: intention, washing hands, mouth, nose, face, arms to elbows, wiping head and ears, and washing feet to ankles." },
    { k: ["نوێژ", "الصلاة", "prayer", "salah", "salat", "چۆنیەتی نوێژ"],
      ku: "نوێژ پێنج جارە لە ڕۆژێکدا: بەیانی (٢ ڕکعات)، نیوەڕۆ (٤)، عەسر (٤)، مەغریب (٣) و عیشا (٤). پێغەمبەر ﷺ فەرمووی: (نوێژ بکەن وەک ئەوەی من نوێژ دەکەم بینیووم). وردەکارییەکانی لە خولی (فێربوونی نوێژ)دا بخوێنەرەوە.",
      ar: "الصلوات خمس: الفجر ركعتان، الظهر أربع، العصر أربع، المغرب ثلاث، والعشاء أربع. قال ﷺ: صلوا كما رأيتموني أصلي.",
      en: "Five daily prayers: Fajr (2), Dhuhr (4), Asr (4), Maghrib (3), Isha (4). The Prophet ﷺ said: Pray as you have seen me pray." },
    { k: ["ڕۆژوو", "الصيام", "fasting", "ramadan", "ڕەمەزان", "رمضان"],
      ku: "ڕۆژووی ڕەمەزان لە بەرەبەیانی ڕاستەوە هەتا ئاوابوونی خۆرە. لە خواردن و خواردنەوە و پەیوەندی خراپ دووربکەوە. پێغەمبەر ﷺ فەرمووی: ئەوەی ڕۆژووی ڕەمەزان بگرێت لەسەر باوەڕ و پاداشتخوازی گوناهە ڕابردووەکانی دەبەخشرێت. سەحەری بخۆ چونکە بەرەکەتی تێدایە.",
      ar: "الصيام من طلوع الفجر إلى غروب الشمس، بالإمساك عن الطعام والشراب. قال ﷺ: من صام رمضان إيمانًا واحتسابًا غفر له ما تقدم من ذنبه.",
      en: "Fasting is from dawn to sunset, abstaining from food and drink. The Prophet ﷺ said: Whoever fasts Ramadan with faith and hope, his past sins are forgiven." },
    { k: ["زەکات", "الزكاة", "zakat", "charity", "خێر"],
      ku: "زەکات ٢.٥٪ی ماڵە کاتێک بگاتە نیساب (٨٥ گرام زێڕ) و ساڵێکی بەسەردا تێپەڕێت. بۆ هەشت دەستە دەدرێت کە لە سوورەتی تەوبە ئایەتی ٦٠دا هاتوون. خێریش (سەدەقە) لە هەر کات و بڕێکدا پاداشتدارە.",
      ar: "الزكاة ربع العشر (2.5%) من المال إذا بلغ النصاب وحال عليه الحول، وتُعطى للأصناف الثمانية المذكورة في سورة التوبة آية ٦٠.",
      en: "Zakat is 2.5% of wealth once it reaches the nisab and a lunar year passes. It is given to the eight categories in Surah At-Tawbah 60." },
    { k: ["حەج", "الحج", "hajj", "umrah", "عومرە"],
      ku: "حەج فەرزە لەسەر ئەوەی توانای هەیە، جارێک لە ژیاندا. پێغەمبەر ﷺ فەرمووی: حەجی وەرگیراو هیچ پاداشتێکی نییە جگە لە بەهەشت. حەج لە مانگی زولحەججەدایە و پایەکانی: ئیحرام، وەستان لە عەرەفە، تەوافی ئیفازە و سەعی.",
      ar: "الحج فريضة مرة واحدة في العمر لمن استطاع. قال ﷺ: الحج المبرور ليس له جزاء إلا الجنة. أركانه: الإحرام والوقوف بعرفة وطواف الإفاضة والسعي.",
      en: "Hajj is obligatory once in a lifetime for those able. The Prophet ﷺ said: An accepted Hajj has no reward but Paradise." },
    { k: ["قیبلە", "القبلة", "qibla", "direction of prayer"],
      ku: "قیبلە ئاراستەی کەعبەیە لە مەککەدا. لە بەشی (کاتەکانی نوێژ)دا دوای دۆزینەوەی شوێنەکەت، کۆمپاسی قیبلە نیشانەت دەدات.",
      ar: "القبلة هي اتجاه الكعبة في مكة. في قسم مواقيت الصلاة يمكنك معرفة اتجاه القبلة بعد تحديد موقعك.",
      en: "The Qibla is the direction of the Kaaba in Makkah. Check the Prayer Times section for a Qibla compass after setting your location." },
    { k: ["شەوی قەدر", "ليلة القدر", "laylat al-qadr", "قەدر"],
      ku: "شەوی قەدر لە دە شەوی کۆتایی ڕەمەزاندایە و لە هەزار مانگ باشترە. پێغەمبەر ﷺ فەرمووی: بەدوای شەوی قەدردا بگەڕێن لە شەوە تاکەکانی دە شەوی کۆتایی ڕەمەزاندا. دوعای: (اللهم إنك عفو تحب العفو فاعف عني) زۆر بکە.",
      ar: "ليلة القدر في العشر الأواخر من رمضان وهي خير من ألف شهر. قال ﷺ: تحروا ليلة القدر في الوتر من العشر الأواخر.",
      en: "Laylat al-Qadr is in the last ten nights of Ramadan, better than a thousand months. Seek it in the odd nights." },
    { k: ["دوعا", "أدعية", "dua", "زیکر", "أذكار", "adhkar", "dhikr"],
      ku: "لە بەشی (دوعا و زیکرەکان)دا کۆمەڵێک دوعای بەیانیان و ئێواران و گەشت و ڕۆژانەت بۆ کۆکراوەتەوە بە وەرگێڕانی کوردی. دوعا عیبادەتە و پێغەمبەر ﷺ فەرمووی: دوعا عیبادەتە.",
      ar: "في قسم الأدعية والأذكار جمعنا لك أذكار الصباح والمساء والسفر والأدعية اليومية مع الترجمة الكردية. قال ﷺ: الدعاء هو العبادة.",
      en: "The Dua & Adhkar section has morning, evening, travel and daily duas with Kurdish translation. The Prophet ﷺ said: Dua is worship." },
    { k: ["تەفسیر", "التفسير", "tafsir", "مانای ئایەت"],
      ku: "لە بەشی (تەفسیر)دا دوو جۆر تەفسیر هەیە: تەفسیری ئاسان بە کوردی بۆ هەر سوورەتێک، و تەفسیری زانستی عەرەبی (جەلەلەین و سیراج) بۆ هەر ئایەتێک.",
      ar: "في قسم التفسير نوعان: تفسير ميسر بالكردية لكل سورة، وتفسير علمي بالعربية (الجلالين والسراج) لكل آية.",
      en: "The Tafsir Center offers easy Kurdish tafsir per surah and scholarly Arabic tafsir (Jalalayn & Siraj) per ayah." },
    { k: ["پێغەمبەر", "الأنبياء", "prophet", "prophets", "نوح", "ئیبراهیم", "موسا", "عیسا", "یوسف", "محەمەد", "محمد"],
      ku: "لە بەشی (پێغەمبەران)دا ژیاننامەی ٢٥ پێغەمبەر بە کوردی هەیە لەگەڵ هێڵی کاتی و ڕووداوەکان و وانەکان. دەتوانیت بە ناو بگەڕێیت.",
      ar: "في قسم الأنبياء سير ٢٥ نبيًا بالكردية مع الخط الزمني والأحداث والدروس. يمكنك البحث بالاسم.",
      en: "The Prophets Encyclopedia has 25 prophets with Kurdish biographies, timeline, events and lessons." },
    { k: ["فەرموودە", "الحديث", "hadith", "احادیث", "حەدیس"],
      ku: "لە بەشی (فەرموودە)دا کۆمەڵێک فەرموودەی سەحیح هەیە بە وەرگێڕانی کوردی و پۆلێنکراو بەپێی بابەت: ئیمان، نوێژ، ڕۆژوو، خێر، حەج، ئەخلاق، خێزان و زانست.",
      ar: "في قسم الحديث أحاديث صحيحة مع الترجمة الكردية مصنفة حسب الموضوع.",
      en: "The Hadith library has authentic hadiths with Kurdish translation, categorized by topic." },
    { k: ["کاتی نوێژ", "مواقيت", "prayer time", "اذان", "بانگ"],
      ku: "لە بەشی (کاتەکانی نوێژ)دا شوێنەکەت دیاری بکە یان با خۆکارانە بدۆزرێتەوە، کاتە وردەکان و نوێژی داهاتوو و کۆمپاسی قیبلەت پێشان دەدەم.",
      ar: "في قسم مواقيت الصلاة حدد موقعك لعرض الأوقات الدقيقة والصلاة القادمة واتجاه القبلة.",
      en: "In Prayer Times, set your location to see accurate times, the next prayer and the Qibla compass." },
    { k: ["بەهەشت", "الجنة", "paradise", "heaven", "دۆزەخ", "جهنم", "hell"],
      ku: "بەهەشت پاداشتی باوەڕدارانە و دۆزەخ سزای بێباوەڕان. خوا فەرموویەتی: (ئەوەی لە ئاگر دووربخرێتەوە و ببرێتە بەهەشتەوە، ئەوە سەرکەوتووە). لە قورئاندا وەسفی بەهەشت و دۆزەخ زۆر هاتووە.",
      ar: "الجنة جزاء المؤمنين والنار عقاب الكافرين. قال تعالى: (فمن زحزح عن النار وأدخل الجنة فقد فاز).",
      en: "Paradise is the reward of the believers and Hell the punishment of the disbelievers. Allah says: Whoever is saved from the Fire and admitted to Paradise has triumphed." },
    { k: ["گوناه", "الذنوب", "sin", "تەوبە", "التوبة", "repent", "forgive", "لێخۆشبوون"],
      ku: "تەوبەی ڕاستەقینە هەموو گوناهێک دەسڕێتەوە. خوا فەرموویەتی: (بڵێ: ئەی بەندەکانم کە لە خۆتاندا زیادەڕەویی کردووە، لە ڕەحمەتی خوا نائومێد مەبن؛ بێگومان خوا هەموو گوناهەکان دەبەخشێت). تەوبە سێ مەرجی هەیە: وازهێنان، پەشیمانی و بڕیاری نەگەڕانەوە.",
      ar: "التوبة الصادقة تمحو الذنوب. قال تعالى: (قل يا عبادي الذين أسرفوا على أنفسهم لا تقنطوا من رحمة الله إن الله يغفر الذنوب جميعًا).",
      en: "Sincere repentance erases sins. Allah says: Say, O My servants who have transgressed, do not despair of the mercy of Allah; He forgives all sins." },
    { k: ["دایک", "الأم", "mother", "باوک", "الوالدين", "parents", "دایک و باوک"],
      ku: "چاکە لەگەڵ دایک و باوک لە گەورەترین عیبادەتەکانە. پێغەمبەر ﷺ فەرمووی: کێ شایستەترینە؟ فەرمووی: دایکت (٣ جار)، پاشان باوکت. خوا فەرموویەتی: (وەسێتمان کرد بە مرۆڤ کە چاکە لەگەڵ دایک و باوکیدا بکات).",
      ar: "بر الوالدين من أعظم العبادات. قال ﷺ: من أحق الناس بحسن صحابتي؟ قال: أمك، ثم أمك، ثم أمك، ثم أبوك.",
      en: "Kindness to parents is among the greatest acts. The Prophet ﷺ said: Your mother, then your mother, then your mother, then your father." },
    { k: ["هاوسەرگیری", "الزواج", "marriage", "خێزان", "الأسرة", "family"],
      ku: "هاوسەرگیری سوننەتی پێغەمبەر ﷺ و نیوەی ئایینە. خوا فەرموویەتی: (لە نیشانەکانی ئەوە کە لە خۆتان هاوسەری بۆ دروستکردوون هەتا ئارامی پێبگرن و خۆشەویستی و بەزەیی لە نێوانتاندا داناوە).",
      ar: "الزواج سنة النبي ﷺ. قال تعالى: (ومن آياته أن خلق لكم من أنفسكم أزواجًا لتسكنوا إليها وجعل بينكم مودة ورحمة).",
      en: "Marriage is a Sunnah of the Prophet ﷺ. Allah says: And among His signs is that He created for you spouses that you may find tranquility in them." },
    { k: ["مۆسیقا", "الموسيقى", "music", "گۆرانی"],
      ku: "زانایان لەسەر مۆسیقا جیاوازییان هەیە؛ زۆربەیان گوێگرتن لە مۆسیقای هاوەڵ بە گوناه و وشەی ناشیرین حەرام دەزانن. بۆ دڵنیایی لە وردەکاری، پەنا ببەرە بەر زانایەکی باوەڕپێکراو. گوێگرتن لە قورئان و نەشیدە پاکەکان جێگرەوەیەکی باشە.",
      ar: "اختلف العلماء في الموسيقى؛ والأحوط اجتنابها والاستماع للقرآن. للتفاصيل راجع عالمًا موثوقًا.",
      en: "Scholars differ on music; the safest path is to avoid it and listen to Quran. Consult a trusted scholar for details." },
    { k: ["قیامەت", "يوم القيامة", "judgment day", "زیندووبوونەوە"],
      ku: "قیامەت ڕۆژی لێپرسینەوەیە و باوەڕبوون پێی پایەیەکی ئیمانە. خوا فەرموویەتی: (ئەی خەڵکینە لە پەروەردگارتان بترسن؛ بێگومان بوومەلەرزەی قیامەت شتێکی گەورەیە).",
      ar: "يوم القيامة يوم الحساب والإيمان به ركن من أركان الإيمان. قال تعالى: (يا أيها الناس اتقوا ربكم إن زلزلة الساعة شيء عظيم).",
      en: "The Day of Judgment is a pillar of faith. Allah says: O mankind, fear your Lord; the quaking of the Hour is a tremendous thing." }
  ];

  const STOP = ["the","a","an","of","in","لە","بە","لەگەڵ","چییە","کێیە","چۆن","کەی","بۆ","ئایا","ما","هو","ما","من","what","is","how","when","who","why","the","about","کی","چی"];

  function tokenize(text) {
    return (text || "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w => w.length > 1 && !STOP.includes(w));
  }

  const QA_NAV = new Set(["فەرموودە", "أدعية", "dua", "دوعا", "تەفسیر", "التفسير", "tafsir", "کاتی نوێژ", "مواقيت", "prayer time", "قیبلە", "القبلة", "qibla", "پێغەمبەر", "الأنبياء", "prophet", "prophets"]);
  async function answer(text) {
    const t = QData.normKu(text.toLowerCase());
    const tokens = tokenize(text).map(QData.normKu).filter(w => w.length > 1);

    // 1) direct knowledge Q&A (skip section-pointers; those come last)
    let best = null, bestScore = 0;
    for (const item of QA) {
      if (QA_NAV.has(item.k[0])) continue;
      let score = 0;
      for (const kw of item.k) {
        const kwN = QData.normKu(kw);
        if (kwN && t.includes(kwN)) score += kwN.length;
      }
      if (score > bestScore) { bestScore = score; best = item; }
    }
    if (best && bestScore >= 3) return { text: best[I18N.lang] || best.ku, type: "qa" };

    // 2) ranked search across hadith / dua / prophets
    const startAny = list => w => list.some(p => w.startsWith(p));
    const wantsDua = tokens.some(startAny(["دوعا", "زیکر", "دعاء", "أذكار", "أدعية"]));
    const wantsHadith = tokens.some(startAny(["فەرموودە", "حەدیس", "حديث", "احادیث"]));
    const wantsQuran = tokens.some(startAny(["ئایەت", "قورئان", "سوورەت", "اية", "آية", "قرآن", "سورة"]));
    const matchScore = (hay, name) => tokens.reduce((acc, w) => {
      if (name === w) return acc + w.length + 6;
      if (hay.includes(w)) return acc + w.length;
      return acc;
    }, 0);

    const cands = [];
    const had = QHADITH.list.map(h => ({ type: "hadith", h, s: matchScore(QData.normKu(h.ku) + " " + QData.normAr(h.ar)) })).sort((a, b) => b.s - a.s)[0];
    if (had.s > 0) cands.push(had);
    const dua = QADHKAR.list.map(x => ({ type: "dua", x, s: matchScore(QData.normKu(x.ku) + " " + QData.normAr(x.ar)) })).sort((a, b) => b.s - a.s)[0];
    if (dua.s > 0) cands.push(dua);
    const pr = QPROPHETS.map(x => ({ type: "prophet", x, s: matchScore(QData.normKu(x.bio + " " + x.ku + " " + x.en), QData.normKu(x.ku)) })).sort((a, b) => b.s - a.s)[0];
    if (pr.s > 0) cands.push(pr);
    // intent boosts
    for (const c of cands) {
      if (c.type === "dua" && wantsDua) c.s = c.s * 2 + 8;
      if (c.type === "hadith" && wantsHadith) c.s = c.s * 2 + 8;
    }
    cands.sort((a, b) => b.s - a.s);
    const top = cands[0];

    // 3) quran search (ku2) — when the query explicitly asks for a verse
    if (wantsQuran) {
      try {
        const GENERIC = ["ئایەت", "ئایەتی", "ئایەتێک", "قورئان", "قورئانی", "سوورەت", "سوورەتی", "لەبارەی", "لەبارهی", "لە", "بە", "و"];
        const q = tokens.filter(w => w.length >= 3 && !GENERIC.includes(w)).join(" ") || text;
        const res = await QData.searchQuran(q, ["ku2"], 3, () => {});
        if (res.length) {
          const r = res[0];
          return { text: "(" + I18N.t("common_surah") + " " + QSURAH.SURAHS[r.s - 1].ar + " " + I18N.t("common_ayah") + " " + r.a + ") " + r.text, type: "quran", ref: { s: r.s, a: r.a } };
        }
      } catch (e) {}
    }

    if (top && top.s >= 4) {
      if (top.type === "hadith") return { text: top.h.ar + "\n\n" + top.h.ku + "\n— " + top.h.src, type: "hadith" };
      if (top.type === "dua") return { text: top.x.ar + "\n\n" + top.x.ku, type: "dua" };
      if (top.type === "prophet") return { text: top.x.ku + " " + top.x.en + " — " + top.x.bio.slice(0, 420) + "…", type: "prophet" };
    }

    // 4) section pointers (nav answers)
    let nav = null, navScore = 0;
    for (const item of QA) {
      if (!QA_NAV.has(item.k[0])) continue;
      let score = 0;
      for (const kw of item.k) {
        const kwN = QData.normKu(kw);
        if (kwN && t.includes(kwN)) score += kwN.length;
      }
      if (score > navScore) { navScore = score; nav = item; }
    }
    if (nav && navScore >= 3) return { text: nav[I18N.lang] || nav.ku, type: "qa" };

    return { text: I18N.lang === "ar"
      ? "لم أجد إجابة واضحة. جرب صياغة أخرى، أو ابحث في أقسام التطبيق (القرآن، الحديث، الأدعية)."
      : I18N.lang === "en"
        ? "I couldn't find a clear answer. Try rephrasing, or browse the app's sections (Quran, Hadith, Duas)."
        : "وەڵامێکی ڕوونم نەدۆزییەوە. بە شێوەیەکی تر پرسیار بکەرەوە، یان لە بەشەکانی ئەپدا بگەڕێ (قورئان، فەرموودە، دوعاکان).", type: "none" };
  }

  const QUICK = [
    { ku: "پایەکانی ئیسلام چین؟", ar: "ما أركان الإسلام؟", en: "What are the pillars of Islam?" },
    { ku: "پایەکانی ئیمان چین؟", ar: "ما أركان الإيمان؟", en: "What are the pillars of faith?" },
    { ku: "دوعایەکم فێر بکە", ar: "علمني دعاء", en: "Teach me a dua" },
    { ku: "فەرموودەیەکم بۆ بڵێ", ar: "حدثني بحديث", en: "Tell me a hadith" },
    { ku: "شەوی قەدر کەیە؟", ar: "متى ليلة القدر؟", en: "When is Laylat al-Qadr?" },
    { ku: "چۆن ووزوو دەگرم؟", ar: "كيف أتوضأ؟", en: "How do I perform wudu?" }
  ];

  window.QAI = { answer, QUICK };
})();
