import { Leader } from '../types';

/**
 * Türkiye, Almanya, İngiltere, İspanya, Fransa ve ABD'nin
 * Mevcut En Büyük 4 Partisinin Liderleri ve İspanya Tarihi
 * Her biri 6 boyutlu puanlama, parti ve ülke bilgileri,
 * temel başarılar ve en tartışmalı 3 konusuyla detaylandırılmıştır.
 */
export const PARTY_LEADERS_AND_SPAIN: Leader[] = [
  // ==========================================
  // TÜRKİYE 4 BÜYÜK PARTİ LİDERLERİ
  // ==========================================

  // 1. ÖZGÜR ÖZEL (CHP)
  {
    id: 'ozgur-ozel',
    name: 'Özgür Özel',
    originalName: 'Özgür Özel',
    title: 'Cumhuriyet Halk Partisi (CHP) Genel Başkanı (2023 – Günümüz)',
    country: 'Türkiye',
    countryCode: 'TR',
    flag: '🇹🇷',
    century: '21. yy',
    era: '21st',
    yearsActive: '2023 – Günümüz',
    category: 'turkey',
    subCategory: 'tr-party',
    region: 'asia',
    regions: ['europe', 'asia'],
    defaultScores: { military: 68, economy: 75, societal: 84, diplomacy: 77, leadership: 86, legacy: 79 },
    summary: '2023 kurultayında değişim hareketiyle genel başkan seçilen, 31 Mart 2024 yerel seçimlerinde CHP’yi 47 yıl sonra Türkiye genelinde 1. parti yapan muhalefet lideri.',
    keyAchievements: [
      '31 Mart 2024 yerel seçimlerinde CHP’yi Türkiye genelinde tarihi bir zaferle 1. parti konumuna taşıması',
      'Emekli, asgari ücret ve tarım mitingleriyle muhalefet tabanını dinamik tutması',
      'Sosyalist Enternasyonal zirvelerinde Türkiye ana muhalefetinin diplomatik temsilini güçlendirmesi',
    ],
    controversies: [
      'Cumhurbaşkanı Erdoğan ile yürüttüğü "siyasi normalleşme/yumuşama" görüşmelerinin muhalefet tabanında eleştirilmesi',
      'Kayyum atamaları ve DEM Partili belediyelerle ortak mitingler konusundaki siyasi denge tartışmaları',
      'Parti içi Kemal Kılıçdaroğlu yanlıları ve belediye başkanları arasındaki güç dengelerini yönetme zorluğu',
    ],
  },

  // 2. TUNCER BAKIRHAN & TÜLAY HATİMOĞULLARI (DEM PARTİ)
  {
    id: 'dem-parti-liderleri',
    name: 'Tuncer Bakırhan & Tülay Hatimoğulları',
    originalName: 'DEM Parti Eş Genel Başkanları',
    title: 'Halkların Eşitlik ve Demokrasi Partisi (DEM Parti) Eş Genel Başkanları',
    country: 'Türkiye',
    countryCode: 'TR',
    flag: '🇹🇷',
    century: '21. yy',
    era: '21st',
    yearsActive: '2023 – Günümüz',
    category: 'turkey',
    subCategory: 'tr-party',
    region: 'asia',
    regions: ['europe', 'asia'],
    defaultScores: { military: 58, economy: 68, societal: 82, diplomacy: 72, leadership: 76, legacy: 70 },
    summary: 'Türkiye Büyük Millet Meclisi’nin 3. büyük grubu olan DEM Parti’nin eş başkanları; Kürt meselesi, yerel yönetimler ve barış çağrıları ekseninde siyaset yürüten figürler.',
    keyAchievements: [
      '31 Mart 2024 yerel seçimlerinde Güneydoğu ve Doğu Anadolu’da birçok büyükşehir ve ili yeniden kazanmaları',
      'TBMM çatısı altında güçlü bir grup temsilini ve kadın kotası/eş başkanlık modelini sürdürmeleri',
    ],
    controversies: [
      'PKK ve Abdullah Öcalan söylemleri sebebiyle terörle araya mesafe koyamama eleştirileri ve kapatma davaları',
      'Kazanılan belediyelere İçişleri Bakanlığı tarafından terör soruşturmaları gerekçesiyle kayyum atanması',
      'Devlet Bahçeli’nin 2024 tokalaşma ve meclis çağrısı sonrası gelişen süreçte tabanın beklentileriyle devlet çizgisi arasındaki gerilim',
    ],
  },

  // 3. MÜSAVAT DERVİŞOĞLU (İYİ PARTİ)
  {
    id: 'musavat-dervisoglu',
    name: 'Müsavat Dervişoğlu',
    originalName: 'Dursun Müsavat Dervişoğlu',
    title: 'İYİ Parti Genel Başkanı (2024 – Günümüz)',
    country: 'Türkiye',
    countryCode: 'TR',
    flag: '🇹🇷',
    century: '21. yy',
    era: '21st',
    yearsActive: '2024 – Günümüz',
    category: 'turkey',
    subCategory: 'tr-party',
    region: 'asia',
    regions: ['europe', 'asia'],
    defaultScores: { military: 74, economy: 70, societal: 76, diplomacy: 71, leadership: 78, legacy: 72 },
    summary: 'Meral Akşener’in istifası sonrası çekişmeli kurultayda İYİ Parti Genel Başkanı seçilen, milliyetçi ve cumhuriyetçi değerleri sert meclis konuşmalarıyla savunan siyasetçi.',
    keyAchievements: [
      'Partisinin 2024 yerel seçim hezimeti sonrası dağılma riskini önleyerek meclis grubunu bir arada tutması',
      'Meclis kürsüsünden yaptığı sert muhalefet çıkışlarıyla milliyetçi tabanda yankı bulması',
    ],
    controversies: [
      'Partiden peş peşe yaşanan milletvekili ve kurucu kadro istifalarını durdurmakta zorlanması',
      'TBMM kürsüsünden Bahçeli’ye ip fırlatarak yaptığı konuşmanın yarattığı siyasi kutuplaşma',
      'Partinin %3-4 bandına gerileyen oy oranını toparlama konusunda yaşadığı siyasi tıkanıklık',
    ],
  },

  // ==========================================
  // ALMANYA 4 BÜYÜK PARTİ LİDERLERİ
  // ==========================================

  // 1. FRIEDRICH MERZ (CDU/CSU)
  {
    id: 'friedrich-merz',
    name: 'Friedrich Merz',
    originalName: 'Friedrich Merz (März)',
    title: 'CDU Genel Başkanı & Almanya Şansölye Adayı / Şansölyesi',
    country: 'Almanya',
    countryCode: 'DE',
    flag: '🇩🇪',
    century: '21. yy',
    era: '21st',
    yearsActive: '2022 – Günümüz',
    category: 'germany',
    subCategory: 'de-party',
    region: 'europe',
    defaultScores: { military: 78, economy: 88, societal: 76, diplomacy: 84, leadership: 86, legacy: 80 },
    summary: 'Merkel döneminin merkez sol politikalarına karşı CDU’yu yeniden klasik muhafazakar ve serbest piyasacı köklerine döndüren, 2025 seçimlerinin en güçlü şansölye adayı.',
    keyAchievements: [
      'Merkel sonrası parçalanan Hristiyan Demokrat Birliği’ni (CDU/CSU) anketlerde açık ara %32-35 ile 1. partiliğe taşıması',
      'Almanya’nın katı borç freni (Schuldenbremse) kuralını ve mali disiplinini tavizsiz savunması',
    ],
    controversies: [
      'Göçmenler ve mülteciler konusunda kullandığı "küçük paşalar" ve "sosyal turizm" gibi sert ifadelerin tepki çekmesi',
      'AfD ile eyalet düzeyinde temas iddiaları ve "Güvenlik Duvarı" (Brandmauer) ilkesindeki tereddütleri',
      'Büyük uluslararası fon şirketi BlackRock yöneticiliği geçmişi sebebiyle aşırı sermaye yanlısı görülmesi',
    ],
  },

  // 2. ALICE WEIDEL (AfD)
  {
    id: 'alice-weidel',
    name: 'Alice Weidel',
    originalName: 'Alice Elisabeth Weidel',
    title: 'Almanya için Alternatif (AfD) Eş Genel Başkanı & Grup Başkanı',
    country: 'Almanya',
    countryCode: 'DE',
    flag: '🇩🇪',
    century: '21. yy',
    era: '21st',
    yearsActive: '2017 – Günümüz',
    category: 'germany',
    subCategory: 'de-party',
    region: 'europe',
    defaultScores: { military: 70, economy: 78, societal: 54, diplomacy: 65, leadership: 82, legacy: 68 },
    summary: 'Eski Goldman Sachs ekonomisti; göç karşıtı, aşırı sağcı AfD’yi Doğu Almanya eyalet seçimlerinde 1. parti yapan ve ülke genelinde %20 bandına taşıyan tartışmalı lider.',
    keyAchievements: [
      'AfD’yi Thüringen ve Saksonya eyaletlerinde tarihi oy oranlarıyla 1. ve 2. parti konumuna getirmesi',
      'Ekonomi doktorası ve parlamento hatipliğiyle partisinin radikal imajını orta sınıfa meşrulaştırma çabası',
    ],
    controversies: [
      'Alman Anayasayı Koruma Teşkilatı (BfV) tarafından partisinin aşırı sağcı şüpheli örgüt olarak izlenmesi',
      'Potsdam’da yapılan gizli "Tersine Göç" (Remigration) toplantısı ve milyonlarca göçmenin sınır dışı edilme planı tartışması',
      'Kendisi eşcinsel bir evlilik yapıp İsviçre’de yaşamasına rağmen partisinin geleneksel aile ve göçmen karşıtı katı söylemleri',
    ],
  },

  // 3. ROBERT HABECK (BÜNDNIS 90/DIE GRÜNEN)
  {
    id: 'robert-habeck',
    name: 'Robert Habeck',
    originalName: 'Robert Habeck',
    title: 'Almanya Başbakan Yardımcısı, Ekonomi Bakanı & Yeşiller Şansölye Adayı',
    country: 'Almanya',
    countryCode: 'DE',
    flag: '🇩🇪',
    century: '21. yy',
    era: '21st',
    yearsActive: '2021 – Günümüz',
    category: 'germany',
    subCategory: 'de-party',
    region: 'europe',
    defaultScores: { military: 74, economy: 72, societal: 86, diplomacy: 82, leadership: 79, legacy: 76 },
    summary: 'Felsefeci ve yazar kimlikli Yeşiller lideri. Rus gazı krizinde Almanya’yı dondurucu kıştan kurtaran pragmatik adımlar atan ancak tartışmalı Isıtma Yasası (Heizungsgesetz) ile sert eleştirilen bakan.',
    keyAchievements: [
      'Rus gazı ambargosu sonrası rekor hızla sıvılaştırılmış doğal gaz (LNG) terminalleri kurarak ülkeyi çöküşten kurtarması',
      'Yenilenebilir enerji (rüzgar ve güneş) yatırımlarının payını Almanya elektrik üretiminde %55’in üzerine çıkarması',
    ],
    controversies: [
      'Bina Enerji Yasası (Isıtma Yasası) ile ev sahiplerine pahalı ısı pompası zorunluluğu getirip halkta büyük infial yaratması',
      'Almanya ekonomisinin 2 yıl üst üste küçülerek resesyona girmesinde sanayi maliyetlerini artıran politikaları',
      'Pasifist Yeşiller geleneğine rağmen Ukrayna’ya ağır silah sevkiyatını en hararetle savunan isim olması',
    ],
  },

  // ==========================================
  // BİRLEŞİK KRALLIK (İNGİLTERE) PARTİ LİDERLERİ
  // ==========================================

  // 1. KEMI BADENOCH (CONSERVATIVES)
  {
    id: 'kemi-badenoch',
    name: 'Kemi Badenoch',
    originalName: 'Olukemi Olufunto Badenoch',
    title: 'Muhafazakar Parti Lideri (2024 – Günümüz) & Ana Muhalefet Lideri',
    country: 'Birleşik Krallık',
    countryCode: 'GB',
    flag: '🇬🇧',
    century: '21. yy',
    era: '21st',
    yearsActive: '2024 – Günümüz',
    category: 'uk',
    subCategory: 'uk-party',
    region: 'europe',
    defaultScores: { military: 72, economy: 76, societal: 74, diplomacy: 75, leadership: 81, legacy: 74 },
    summary: 'İngiltere tarihinin büyük bir siyasi partiye liderlik eden ilk siyahi kadını. Kültür savaşlarında "anti-woke" tavrıyla bilinen, 2024 hezimeti sonrası partiyi toparlamaya çalışan yeni Muhafazakar lider.',
    keyAchievements: [
      'Ticaret Bakanlığı döneminde Birleşik Krallık’ın CPTPP Asya-Pasifik serbest ticaret paktına katılmasını sağlaması',
      'Muhafazakar Parti tabanının ezici desteğiyle liderlik yarışını kazanarak ilk siyahi parti lideri olması',
    ],
    controversies: [
      'Doğum izni ödeneklerinin aşırı olduğunu ima eden gafları ve asgari ücret eleştirileri',
      'Kültür savaşlarında kullandığı kışkırtıcı dil ve bürokratlarla yaşadığı çatışmacı yönetim tarzı',
      'Partisinin Reform UK ve Nigel Farage karşısında oy kaybetmesini durdurma konusundaki belirsizlik',
    ],
  },

  // 2. NIGEL FARAGE (REFORM UK)
  {
    id: 'nigel-farage',
    name: 'Nigel Farage',
    originalName: 'Nigel Paul Farage',
    title: 'Reform UK Partisi Lideri & Clacton Milletvekili',
    country: 'Birleşik Krallık',
    countryCode: 'GB',
    flag: '🇬🇧',
    century: '21. yy',
    era: '21st',
    yearsActive: '2010 – Günümüz',
    category: 'uk',
    subCategory: 'uk-party',
    region: 'europe',
    defaultScores: { military: 70, economy: 73, societal: 58, diplomacy: 71, leadership: 88, legacy: 86 },
    summary: '2016 Brexit referandumunun baş mimarı. 2024 genel seçimlerinde 4 milyondan fazla oy alarak Avam Kamarası’na giren, göç karşıtı sağ popülist hareketin küresel sembolü.',
    keyAchievements: [
      'Yıllarca yürüttüğü UKIP kampanyasıyla İngiltere’yi Avrupa Birliği’nden ayıran Brexit sürecini tetiklemesi',
      '2024 genel seçimlerinde Reform UK partisiyle 4.1 milyon oy alarak İngiliz iki partili sistemini sarsması',
    ],
    controversies: [
      'Rusya-Ukrayna savaşı konusunda Batı’yı ve NATO’yu Putin’i kışkırtmakla suçlayan açıklamaları',
      'Kanalı küçük botlarla geçen sığınmacılar üzerinden yürüttüğü sert söylemlerin 2024 sokak isyanlarını körüklediği eleştirisi',
      'Donald Trump mitinglerinde aktif rol alarak İngiliz dış politikasında diplomatik krizler yaratması',
    ],
  },

  // 3. ED DAVEY (LIBERAL DEMOCRATS)
  {
    id: 'ed-davey',
    name: 'Sir Ed Davey',
    originalName: 'Edward Anthony Davey',
    title: 'Liberal Demokrat Parti Lideri (2020 – Günümüz)',
    country: 'Birleşik Krallık',
    countryCode: 'GB',
    flag: '🇬🇧',
    century: '21. yy',
    era: '21st',
    yearsActive: '2020 – Günümüz',
    category: 'uk',
    subCategory: 'uk-party',
    region: 'europe',
    defaultScores: { military: 68, economy: 76, societal: 85, diplomacy: 82, leadership: 80, legacy: 78 },
    summary: '2024 seçimlerinde 72 milletvekili çıkararak partisini 100 yılın en yüksek sandalye sayısına ulaştıran, eğlenceli seçim dublörlükleriyle ve bakım hizmetleri savunuculuğuyla dikkat çeken lider.',
    keyAchievements: [
      '2024 genel seçimlerinde partisinin sandalye sayısını 11’den 72’ye çıkararak tarihi bir rekor kırması',
      'Engelli oğlunun bakım hikayesini siyasete taşıyarak hasta ve yaşlı bakıcılarının haklarını ulusal gündeme oturtması',
    ],
    controversies: [
      'Post Office skandalında bakanlık yaptığı dönemde haksız yere hapsedilen postane memurlarını dinlemeyi reddettiği ortaya çıkması',
      'Seçim kampanyasında bungee jumping ve su kayağı gibi şaklabanlıklarla siyasetin ciddiyetini sulandırdığı eleştirileri',
      'Avrupa Birliği ile Tek Pazar’a yeniden katılım vaadinin yarattığı belirsizlikler',
    ],
  },

  // ==========================================
  // İSPANYA TARİHİ & 4 BÜYÜK PARTİ LİDERLERİ
  // ==========================================

  // 1. ISABELLA I OF CASTILE (KATOLİK İSABELLA)
  {
    id: 'isabella-castile',
    name: 'I. İsabella (Katolik İsabella)',
    originalName: 'Isabel I de Castilla',
    title: 'Kastilya Kraliçesi (1474 – 1504) & Birleşik İspanya Kurucusu',
    country: 'İspanya',
    countryCode: 'ES',
    flag: '🇪🇸',
    century: '15. - 16. yy',
    era: 'early-modern',
    yearsActive: '1474 – 1504',
    category: 'spain',
    subCategory: 'es-monarch',
    region: 'europe',
    defaultScores: { military: 93, economy: 94, societal: 76, diplomacy: 91, leadership: 96, legacy: 99 },
    summary: 'Aragon Kralı II. Fernando ile evlenerek modern İspanya’yı kuran; 1492’de Granada’yı fethedip Reconquista’yı tamamlayan ve Kristof Kolomb’u finanse ederek Amerika’nın keşfini başlatan tarihi kraliçe.',
    keyAchievements: [
      '1492 Granada fethiyle İber Yarımadası’ndaki 800 yıllık Endülüs İslam hakimiyetini sona erdirmesi (Reconquista)',
      'Kristof Kolomb’a 3 gemi tahsis ederek Yeni Dünya’nın (Amerika) keşfini ve küresel İspanyol İmparatorluğu’nu başlatması',
      'Kastilya ve Aragon krallıklarını birleştirerek modern İspanya ulus devletinin temelini atması',
    ],
    controversies: [
      '1492 Elhamra Kararnamesi ile yüz binlerce Yahudi ve Müslümanı zorla vaftiz ettirmesi veya sürgüne göndermesi',
      'İspanyol Engizisyonu’nu kurdurarak binlerce insanın diri diri yakılmasına ve işkence görmesine onay vermesi',
      'Amerika yerlilerinin altın ve gümüş madenlerinde köleleştirilmesinin ilk zeminini oluşturması',
    ],
  },

  // 2. PHILIP II OF SPAIN (II. FELİPE)
  {
    id: 'philip-2-spain',
    name: 'II. Felipe',
    originalName: 'Felipe II de España',
    title: 'İspanya ve Portekiz Kralı (1556 – 1598) & Dünya İmparatoru',
    country: 'İspanya',
    countryCode: 'ES',
    flag: '🇪🇸',
    century: '16. yy',
    era: 'early-modern',
    yearsActive: '1556 – 1598',
    category: 'spain',
    subCategory: 'es-monarch',
    region: 'europe',
    defaultScores: { military: 90, economy: 82, societal: 83, diplomacy: 88, leadership: 92, legacy: 96 },
    summary: 'İspanya, Portekiz, Napoli, Hollanda ve Filipinler’i yöneterek "üzerinde güneş batmayan" ilk küresel imparatorluğu kuran; İnebahtı’da Osmanlı’yı durduran ancak Yenilmez Armada’sı fırtınada batan koyu Katolik hükümdar.',
    keyAchievements: [
      'Portekiz tacını da devralarak İber Birliği’ni kurması ve Brezilya’dan Asya’ya uzanan tarihin en büyük imparatorluğunu yönetmesi',
      '1571 İnebahtı Deniz Muharebesi’nde müttefik donanmasıyla Akdeniz’de Osmanlı deniz ilerleyişini durdurması',
      'Madrid yakınlarında anıtsal El Escorial Sarayı ve Manastırı’nı inşa ettirerek dünya yönetim merkezini kurması',
    ],
    controversies: [
      '1588 İspanyol Armadası’nın İngiltere seferinde fırtına ve İngiliz ateşiyle feci şekilde yok olması',
      'Hollanda Seksen Yıl Savaşı’nda Protestanlara yönelik Alba Dükü eliyle uygulanan katı katliam ve terör politikası',
      'Amerika’dan gelen tonlarca gümüşe rağmen devasa askeri harcamalar sebebiyle krallığını 4 kez iflasa sürüklemesi',
    ],
  },

  // 3. PEDRO SÁNCHEZ (PSOE)
  {
    id: 'pedro-sanchez',
    name: 'Pedro Sánchez',
    originalName: 'Pedro Sánchez Pérez-Castejón',
    title: 'İspanya Başbakanı (2018 – Günümüz) & PSOE Genel Sekreteri',
    country: 'İspanya',
    countryCode: 'ES',
    flag: '🇪🇸',
    century: '21. yy',
    era: '21st',
    yearsActive: '2018 – Günümüz',
    category: 'spain',
    subCategory: 'es-party',
    region: 'europe',
    defaultScores: { military: 72, economy: 86, societal: 88, diplomacy: 91, leadership: 92, legacy: 86 },
    summary: 'İspanya modern tarihinin en mahir taktik ustası. Güvensizlik oylamasıyla Mariano Rajoy’u devirip iktidara gelen, Katalan ayrılıkçılarla koalisyon kurarak asgari ücreti katlayan ve Filistin devletini tanıyan başbakan.',
    keyAchievements: [
      'İspanya ekonomisini AB ortalamasının üzerinde büyütmesi ve asgari ücreti %50’den fazla artırması',
      'Katalonya’daki bağımsızlık krizini affetme (amnistía) politikasıyla sokak tansiyonunu düşürmesi',
      '2024 yılında İrlanda ve Norveç ile birlikte Filistin Devleti’ni resmen tanıma cesareti göstermesi',
    ],
    controversies: [
      'Hükümette kalabilmek uğruna Katalan ayrılıkçı lider Carles Puigdemont’a genel af çıkarması ve devlete karşı anayasal taviz eleştirileri',
      'Eşi Begoña Gómez hakkında açılan nüfuz ticareti ve yolsuzluk soruşturmaları sebebiyle 5 gün görevden çekilme tiyatrosu',
      '2024 Valensiya sel felaketinde merkezi hükümetin kriz müdahalesindeki zaafiyeti sebebiyle halkın çamurlu protestosuna uğraması',
    ],
  },

  // 4. ALBERTO NÚÑEZ FEIJÓO (PP)
  {
    id: 'alberto-feijoo',
    name: 'Alberto Núñez Feijóo',
    originalName: 'Alberto Núñez Feijóo',
    title: 'Halk Partisi (PP) Genel Başkanı & İspanya Ana Muhalefet Lideri',
    country: 'İspanya',
    countryCode: 'ES',
    flag: '🇪🇸',
    century: '21. yy',
    era: '21st',
    yearsActive: '2022 – Günümüz',
    category: 'spain',
    subCategory: 'es-party',
    region: 'europe',
    defaultScores: { military: 74, economy: 84, societal: 76, diplomacy: 80, leadership: 81, legacy: 78 },
    summary: 'Galiçya Özerk Bölgesi’ni 4 dönem üst üste mutlak çoğunlukla yöneten ılımlı muhafazakar yönetici; 2023 genel seçimlerinde partisini 1. yapan ancak hükümet kuracak çoğunluğu bulamayan muhalefet lideri.',
    keyAchievements: [
      'Galiçya’da 13 yıl boyunca borçsuz ve istikrarlı bir bölgesel kamu maliyesi yönetmesi',
      '2023 genel seçimlerinde PP’yi 137 milletvekiline ulaştırarak seçimleri 1. sırada tamamlaması',
    ],
    controversies: [
      'Aşırı sağcı Vox partisiyle bölgesel hükümet ittifakları kurması sebebiyle ılımlı merkez seçmeni ürkütmesi',
      'Seçimi kazanmasına rağmen ayrılıkçı partilerin desteğini alamayıp başbakanlık güvenoylamasını kaybetmesi',
      'Geçmişte Galiçyalı ünlü uyuşturucu kaçakçısı Marcial Dorado’nun yatında çekilen fotoğraflarının yarattığı skandal',
    ],
  },

  // 5. SANTIAGO ABASCAL (VOX)
  {
    id: 'santiago-abascal',
    name: 'Santiago Abascal',
    originalName: 'Santiago Abascal Conde',
    title: 'Vox Partisi Lideri (İspanya)',
    country: 'İspanya',
    countryCode: 'ES',
    flag: '🇪🇸',
    century: '21. yy',
    era: '21st',
    yearsActive: '2014 – Günümüz',
    category: 'spain',
    subCategory: 'es-party',
    region: 'europe',
    defaultScores: { military: 72, economy: 74, societal: 55, diplomacy: 68, leadership: 83, legacy: 70 },
    summary: 'Franco dönemi sonrasında İspanya parlamentosuna giren ilk aşırı sağ partinin kurucusu; Katolik milliyetçiliği, yasa dışı göç karşıtlığı ve özerk bölgelerin lağvedilmesini savunan hatip.',
    keyAchievements: [
      'Sıfırdan kurduğu Vox partisini Endülüs ve İspanya genelinde 3. büyük siyasi güç haline getirmesi',
      'Avrupa Parlamentosu’nda Viktor Orbán ile "Avrupa’nın Vatanseverleri" grubunu kurması',
    ],
    controversies: [
      'İspanya’nın 17 özerk bölgesini kaldırıp tek merkezli üniter devlet dayatması ve ayrılıkçı bölgelerde büyük öfke yaratması',
      'Feminist yasaları, LGBT haklarını ve iklim değişikliği politikalarını tamamen inkâr etmesi',
      'PP ile kurduğu koalisyonları göçmen çocukları kabul etme anlaşmazlığı yüzünden tek taraflı bozması',
    ],
  },

  // 6. YOLANDA DÍAZ (SUMAR)
  {
    id: 'yolanda-diaz',
    name: 'Yolanda Díaz',
    originalName: 'Yolanda Díaz Pérez',
    title: 'İspanya 2. Başbakan Yardımcısı, Çalışma Bakanı & Sumar Kurucusu',
    country: 'İspanya',
    countryCode: 'ES',
    flag: '🇪🇸',
    century: '21. yy',
    era: '21st',
    yearsActive: '2020 – Günümüz',
    category: 'spain',
    subCategory: 'es-party',
    region: 'europe',
    defaultScores: { military: 62, economy: 78, societal: 89, diplomacy: 76, leadership: 82, legacy: 77 },
    summary: 'Komünist kökenli iş hukuku avukatı. Pandemi döneminde milyonlarca istihdamı kurtaran ERTE modelini geliştiren, asgari ücreti artıran ve haftalık çalışma süresini 37.5 saate indirmeyi savunan sol koalisyon lideri.',
    keyAchievements: [
      'İş Reformu (Reforma Laboral) ile İspanya’da geçici ve güvencesiz sözleşmeli çalışan oranını tarihi dip seviyeye indirmesi',
      '15 farklı sol partiyi "Sumar" çatısı altında birleştirerek 2023’te koalisyon hükümetinin kurulmasını sağlaması',
    ],
    controversies: [
      'Parti sözcüsü Íñigo Errejón hakkındaki cinsel taciz iddialarını geç fark edip müdahale etmekte geç kalması skandalı',
      'Podemos partisiyle girdiği sert iç kavgalar sonucu sol blokun mecliste bölünmesine yol açması',
      'İş dünyası ve işveren örgütleriyle çalışma saatlerinin kısaltılması konusunda yaşadığı sert sürtüşmeler',
    ],
  },

  // ==========================================
  // FRANSA 4 BÜYÜK PARTİ LİDERLERİ
  // ==========================================

  // 1. JORDAN BARDELLA (RN)
  {
    id: 'jordan-bardella',
    name: 'Jordan Bardella',
    originalName: 'Jordan Bardella',
    title: 'Ulusal Birlik (Rassemblement National) Başkanı & Avrupa Parlamenteri',
    country: 'Fransa',
    countryCode: 'FR',
    flag: '🇫🇷',
    century: '21. yy',
    era: '21st',
    yearsActive: '2022 – Günümüz',
    category: 'france',
    subCategory: 'fr-party',
    region: 'europe',
    defaultScores: { military: 72, economy: 75, societal: 62, diplomacy: 74, leadership: 88, legacy: 76 },
    summary: '28 yaşında Marine Le Pen’in veliahtı olarak partinin başına geçen; TikTok ve sosyal medyayı ustaca kullanarak RN’yi 2024 Avrupa seçimlerinde %31 oyla Fransa 1.si yapan genç aşırı sağ lider.',
    keyAchievements: [
      '2024 Avrupa Parlamentosu seçimlerinde Fransa tarihinin en yüksek oyunu (%31.4) alarak Macron’u erken seçime zorlaması',
      'Partiyi Le Pen ailesi soyadı dışına taşıyarak genç seçmenler ve banliyölerde popüler hale getirmesi',
    ],
    controversies: [
      '2024 erken genel seçimlerinde "Cumhuriyetçi Cephe" ittifakı karşısında mutlak çoğunluğu ve başbakanlığı kaçırması',
      'Çifte vatandaşların stratejik devlet makamlarında görev almasını yasaklama vaadinin yarattığı ayrımcılık tepkisi',
      'Avrupa Parlamentosu fonlarının kötüye kullanımı ve partinin Rusya ilişkileri soruşturmalarındaki gölgeler',
    ],
  },

  // 2. JEAN-LUC MÉLENCHON (LFI)
  {
    id: 'jean-luc-melenchon',
    name: 'Jean-Luc Mélenchon',
    originalName: 'Jean-Luc Mélenchon',
    title: 'Boyun Eğmeyen Fransa (La France Insoumise) Kurucusu & Sol Lider',
    country: 'Fransa',
    countryCode: 'FR',
    flag: '🇫🇷',
    century: '21. yy',
    era: '21st',
    yearsActive: '2016 – Günümüz',
    category: 'france',
    subCategory: 'fr-party',
    region: 'europe',
    defaultScores: { military: 65, economy: 78, societal: 87, diplomacy: 79, leadership: 91, legacy: 82 },
    summary: 'Fransız solunun en karizmatik hatibi. 6. Cumhuriyet anayasasını, emeklilik yaşının 60’a indirilmesini, servet vergisini savunan ve 2024’te Yeni Halk Cephesi (NFP) zaferini örgütleyen kıdemli siyasetçi.',
    keyAchievements: [
      '2024 erken seçimlerinde tüm sol partileri Yeni Halk Cephesi (NFP) altında birleştirerek mecliste 1. ittifak yapması',
      'Üç kez cumhurbaşkanlığı yarışında %20’nin üzerinde oy alarak Fransız solunun merkez ekseni haline gelmesi',
    ],
    controversies: [
      '7 Ekim Hamas saldırıları sonrası takındığı tavır ve antisemitizm suçlamalarıyla sol blok içinde kriz çıkarması',
      'Öfkeli ve kavgacı üslubu ("Cumhuriyet benim!" çıkışı) ve gazetecilerle yaşadığı sert polemikler',
      'NATO’dan tamamen çekilmeyi ve Venezuela ile yakınlaşmayı savunan radikal dış politika önerileri',
    ],
    famousQuote: 'Cumhuriyet benim, benim bedenim dokunulmazdır!',
  },

  // ==========================================
  // ABD KONGRE VE MECLİS LİDERLERİ
  // ==========================================

  // 1. HAKEEM JEFFRIES (DEMOCRATS)
  {
    id: 'hakeem-jeffries',
    name: 'Hakeem Jeffries',
    originalName: 'Hakeem Sekou Jeffries',
    title: 'ABD Temsilciler Meclisi Demokrat Azınlık Lideri (2023 – Günümüz)',
    country: 'Amerika Birleşik Devletleri',
    countryCode: 'US',
    flag: '🇺🇸',
    century: '21. yy',
    era: '21st',
    yearsActive: '2023 – Günümüz',
    category: 'usa',
    subCategory: 'us-party',
    region: 'americas',
    defaultScores: { military: 72, economy: 80, societal: 88, diplomacy: 81, leadership: 87, legacy: 81 },
    summary: 'Nancy Pelosi’den sonra Demokrat Parti’nin Temsilciler Meclisi liderliğini devralan, tarihte Kongre’de bir partiye liderlik eden ilk Afro-Amerikalı siyasetçi.',
    keyAchievements: [
      'Parti içi bölünmeleri engelleyerek Demokrat Meclis grubunu tek bir fire vermeden blok halinde tutabilmesi',
      'Bütçe krizlerinde ve hükümetin kapanma tehlikelerinde Cumhuriyetçi ılımlılarla uzlaşarak federal işleyişi kurtarması',
    ],
    controversies: [
      'Demokrat Parti içindeki ilerici sol kanat (The Squad) ile geleneksel merkezci çizgi arasındaki gerilimler',
      '2024 seçimlerinde Temsilciler Meclisi çoğunluğunu Cumhuriyetçilerden geri alamaması',
      'İsrail-Gazze savaşı politikalarında parti tabanındaki derin gençlik çatlağını yatıştıramaması',
    ],
  },

  // 2. MIKE JOHNSON (REPUBLICANS)
  {
    id: 'mike-johnson',
    name: 'Mike Johnson',
    originalName: 'James Michael Johnson',
    title: 'ABD Temsilciler Meclisi Başkanı (56. Speaker of the House)',
    country: 'Amerika Birleşik Devletleri',
    countryCode: 'US',
    flag: '🇺🇸',
    century: '21. yy',
    era: '21st',
    yearsActive: '2023 – Günümüz',
    category: 'usa',
    subCategory: 'us-party',
    region: 'americas',
    defaultScores: { military: 76, economy: 78, societal: 68, diplomacy: 79, leadership: 83, legacy: 79 },
    summary: 'Kevin McCarthy’nin devrilmesinin ardından haftalar süren kaos sonrası sürpriz bir uzlaşmayla Meclis Başkanı seçilen, koyu Hristiyan muhafazakar ve anayasa hukukçusu Cumhuriyetçi lider.',
    keyAchievements: [
      'Cumhuriyetçilerin kıl payı meclis çoğunluğundaki fraksiyon kavgalarına rağmen 95 milyar dolarlık Ukrayna ve Tayvan yardım paketini geçirmesi',
      'Hükümetin kapanmasını önleyen bütçe tasarılarını iki partili uzlaşmayla yasalaştırması',
    ],
    controversies: [
      '2020 başkanlık seçim sonuçlarına itiraz eden 147 Kongre üyesinden biri olarak Yüksek Mahkeme’ye dilekçe vermesi',
      'Kürtajın ülke genelinde federal düzeyde tamamen yasaklanmasını savunan aşırı muhafazakar çizgisi',
      'Kendi partisinin aşırı sağcı "Özgürlük Grubu" (Freedom Caucus) tarafından görevden alınma tehditleriyle karşı karşıya kalması',
    ],
  },
];
