import { DimensionKey, Leader, LeaderScores, TierLevel } from '../types';

/**
 * Kişiye özel tarihsel nitelik / unvan alt başlıkları.
 * Her liderin gerçek tarihsel rolüne göre yazılmıştır; kurucu olmayan liderlere
 * asla "Kurucu Deha" etiketi verilmez.
 */
export const LEADER_TIER_EPITHETS: Record<string, string> = {
  // --- S TIER (ve Zirve İsimler) ---
  ataturk: 'Cumhuriyet Kurucusu & Başkomutan',
  'suleiman-the-magnificent': 'Kanun Koyucu & Cihan İmparatoru',
  'fatih-mehmed': 'İstanbul Fatihi & Rönesans Hükümdarı',
  'yavuz-sultan-selim': 'Doğu Fatihi & İlk Osmanlı Halifesi',
  'murad-1': 'Balkan Fatihi & Devlet Teşkilatçısı',
  'mahmud-2': 'Köklü Islahatçı & Modernleşme Öncüsü',
  'abdulhamid-2': 'Denge Diplomatı & Hamidiye Mimarı',
  'mete-han': 'Bozkır Teşkilatçısı & Hun Kurucusu',
  attila: 'Avrupa Hun Başbuğu & Bozkır İmparatoru',
  'bumin-kagan': 'Göktürk Kağanlığı Kurucusu',
  'istemi-yabgu': 'Batı Kanadı Yabgusu & İpek Yolu Diplomatı',
  'kutluk-kagan': 'II. Göktürk Kurucusu & İstiklal Önderi',
  'bilge-kagan': 'Orhun Bilgesi & Kağanlık Kurtarıcısı',
  'vezir-tonyukuk': 'Bozkır Stratejisti & Başvezir',
  'kul-tigin': 'Bozkır Başkomutanı & Devlet Koruyucusu',
  'bogu-kagan': 'Yerleşik Uygarlık Öncüsü & Kağan',
  'gazneli-mahmud': 'İlk Sultan & Hindistan Fatihi',
  'tugrul-bey': 'Büyük Selçuklu Kurucusu & İlk Sultan',
  'cagri-bey': 'Anadolu Kaşifi & Başkomutan',
  'sultan-alparslan': 'Malazgirt Fatihi & Büyük Komutan',
  'sultan-meliksah': 'Selçuklu Zirvesi & Cihan Sultanı',
  nizamulmulk: 'Devlet Aklı & Nizamiye Mimarı',
  'alaeddin-keykubad': 'Anadolu Altın Çağı & Ulu Sultan',
  'aydinoglu-umur-bey': 'Ege Denizcisi & Gazi Bey',
  'uzun-hasan': 'Akkoyunlu Zirvesi & Kanunî Hükümdar',
  'emir-timur': 'Yenilmez Komutan & Rönesans Banisi',

  caesar: 'Cumhuriyet Diktatörü & Fetih Dehası',
  octavius: 'İlk Roma İmparatoru & Pax Romana',
  vespasian: 'İstikrar İmparatoru & Flavianus Kurucusu',
  trajan: 'Optimus Princeps & Fetih İmparatoru',
  hadrian: 'Sınır Mimarı & Gezgin İmparator',
  'constantine-the-great': 'Konstantinopolis Banisi & Reform İmparatoru',
  'justinian-i': 'Büyük Kanun Koyucu & Ayasofya Banisi',
  pericles: 'Atina Demokrasisi & Altın Çağ Lideri',

  'george-washington': 'Ulusun Babası & Kurucu Başkan',
  'thomas-jefferson': 'Bağımsızlık Filozofu & Aydın Başkan',
  'abraham-lincoln': 'Birlik Kurtarıcısı & Özgürlük Başkanı',
  'theodore-roosevelt': 'İlerlemeci Reformcu & Süper Güç Mimarı',
  'franklin-d-roosevelt': 'Buhran & Zafer Dönemi Başkanı',
  'harry-truman': 'Soğuk Savaş Stratejisti & Kararlı Başkan',
  'dwight-eisenhower': 'Müttefik Başkomutanı & Altyapı Başkanı',
  'john-f-kennedy': 'Uzay Çağı Vizyoneri & Kriz Lideri',
  'ronald-reagan': 'Ekonomik Dönüşüm & Soğuk Savaş Galibi',

  napoleon: 'Askeri Deha & Hukuk Reformcusu',
  'charles-de-gaulle': 'Direniş Sembolü & Cumhuriyet Mimarı',
  'frederick-the-great': 'Aydın Despot & Askeri Stratejist',
  'otto-von-bismarck': 'Alman Birliği Mimarı & Realpolitik Ustası',
  'konrad-adenauer': 'Batı Almanya Kurucusu & İstikrar Şansölyesi',
  'helmut-schmidt': 'Soğukkanlı Kriz & Ekonomi Şansölyesi',
  'william-the-conqueror': 'İngiltere Fatihi & Feodal Düzen Mimarı',
  'queen-elizabeth-1': 'Tudor Altın Çağı Kraliçesi',
  'william-3': 'Meşrutiyetçi Kral & Devrim Lideri',
  'queen-victoria': 'İmparatorluk Zirvesi & Viktorya Çağı',
  'elizabeth-2': 'Tahtın Sabit Çapası & Anayasal Monark',
  'margaret-thatcher': 'Piyasa Devrimcisi & Demir Leydi',
  'isabella-castile': 'Birleşik İspanya Kurucusu & Katolik Kraliçe',
  'mario-draghi': 'Euro Kurtarıcısı & Teknokrat Lider',
  'ii-katerina': 'Aydınlanma Çariçesi & İmparatorluk Genişleticisi',

  'emperor-taizong': 'Zhenguan Altın Çağı İmparatoru',
  'kubilay-han': 'Yuan İmparatoru & İpek Yolu Hükümdarı',
  saladin: 'Kudüs Fatihi & Şövalye Sultan',
  'hz-ebubekir': 'İlk Halife & Birlik Koruyucusu',
  'hz-omer': 'Adalet Timsali & Devlet Teşkilatçısı',
  'omer-bin-abdulaziz': 'Adil Halife & Islahatçı Hükümdar',
  'abdurrahman-3': 'Kurtuba Altın Çağı & Bilim Hamisi',
  'el-mansur': 'Bağdat Banisi & Teşkilatçı Halife',
  'harun-resid': 'İslam Altın Çağı & İhtişam Halifesi',
  'el-memun': 'Bilim Devrimi & Beytü’l-Hikme Hamisi',
  'sultan-baybars': 'Ayn Calut Galibi & Memlük Kudreti',

  'thomas-sankara': 'Onurlu Kalkınma & Devrimci Lider',
  'nelson-mandela': 'Özgürlük Sembolü & Uzlaşı Başkanı',
  'seretse-khama': 'Botsvana Kurucusu & Kalkınma Öncüsü',

  // --- ÖNE ÇIKAN A / B / C / D LİDERLERİ ---
  'osman-gazi': 'Osmanlı Beyliği Kurucusu & Gazi',
  'orhan-gazi': 'Bursa Fatihi & İlk Devlet Kurumsallaştırıcısı',
  'bayezid-1': 'Yıldırım Komutan & Anadolu Birleştiricisi',
  'mehmed-1': 'Fetret Sonrası Devletin İkinci Banisi',
  'murad-2': 'Balkan Savunucusu & Kültür Hamisi',
  'bayezid-2': 'İstikrar, Donanma & Hoşgörü Sultanı',
  'murad-4': 'Bağdat Fatihi & Otorite Sultanı',
  'selim-3': 'Nizam-ı Cedid & Modernleşme Şehidi',
  abdulmecid: 'Tanzimat Fermanı & Reform Sultanı',
  'ismet-inonu': 'Lozan Diplomatı & Çok Partili Geçiş Lideri',
  'turgut-ozal': 'Serbest Piyasa & Dışa Açılım Mimarı',
  'bulent-ecevit': 'Kıbrıs Fatihi & Sosyal Demokrat Lider',
  'adnan-menderes': 'Demokratik Açılım & Kalkınma Başbakanı',
  'suleyman-demirel': 'Barajlar & Altyapı Siyasetinin Duayeni',
  'necmettin-erbakan': 'Ağır Sanayi & Milli Görüş Kurucusu',
  'recep-tayyip-erdogan': 'Altyapı Dönüşümü & Güçlü İcraat Lideri',
  'alparslan-turkes': 'Milliyetçi Hareketin İdeolog Kurucusu',
  'zeki-velidi-togan': 'Başkurdistan Önderi & Türkoloji Alimi',
  'refik-saydam': 'Halk Sağlığı & Hıfzıssıhha Mimarı',
  'hasan-ali-yucel': 'Köy Enstitüleri & Tercüme Devrimcisi',
  'mahmut-esat-bozkurt': 'Medeni Kanun & Hukuk Devrimcisi',
  'mithat-pasa': 'Kanun-i Esasi & Meşrutiyet Öncüsü',
  'esref-bitlis': 'Terörle Mücadelede Strateji & Barış Komutanı',

  'alexander-the-great': 'Dünya Fatihi & Helenizm Yayıcısı',
  'marcus-aurelius': 'Filozof İmparator & Stoacı Devlet Adamı',
  cicero: 'Cumhuriyet Hatibi & Hukuk Savunucusu',
  'mark-antony': 'Roma Triumviri & Doğu Cephesi Komutanı',
  'genghis-khan': 'Moğol İmparatorluğu Kurucusu & Bozkır Fatihi',
  'peter-the-great': 'Rusya’yı Avrupalılaştıran Reformcu Çar',
  'winston-churchill': 'Savaş Zamanı Direniş Başbakanı',
  'angela-merkel': 'Avrupa Denge Şansölyesi & Kriz Yöneticisi',
  'friedrich-merz': 'Merkez Sağ Ekonomik Toparlanma Lideri',
  'vladimir-lenin': 'Bolşevik Devrim & SSCB Kurucusu',
  'josef-stalin': 'Ağır Sanayi & Totaliter Demir Yumruk',
  'mikhail-gorbachev': 'Glasnost, Perestroyka & Soğuk Savaş Bitiricisi',
  'vladimir-putin': 'Merkezi Otorite & Jeopolitik Revizyonist',
  'sun-yat-sen': 'Modern Çin Cumhuriyeti Kurucu Önderi',
  'mao-zedong': 'Çin Halk Cumhuriyeti Kurucusu & İdeolog',
  'deng-xiaoping': 'Çin Ekonomik Mucizesinin Reform Mimarı',
  'fidel-castro': 'Küba Devrimi Önderi & Anti-Emperyalist Lider',
  'che-guevara': 'Uluslararası Gerilla & Devrim Sembolü',
  'haydar-aliyev': 'Modern Azerbaycan’ın İstikrar Mimarı',
  'ilham-aliyev': 'Karabağ Zaferi & Enerji Diplomasisi Lideri',
  'ebulfez-elcibey': 'Demokratik Bağımsızlık & Milli Cephe Önderi',
  'ruhollah-khomeini': 'İran İslam Devrimi Kurucusu & Rehber',
  'nikol-pashinyan': 'Kadife Devrim Sonrası Kriz Başbakanı',

  'adolf-hitler': 'Totaliter Yıkım & Dünya Savaşı Müsebbibi',
  caligula: 'Keyfi İstibdat & Çalkantılı İmparatorluk',
  'liz-truss': 'Tarihin En Kısa & Mali Çalkantılı Başbakanlığı',
  'kenan-evren': '12 Eylül Darbe Rejimi & Askeri Vesayet',
  'mustafa-1': 'Akli Dengesizlik & Saray Buhranları Dönemi',
  'mustafa-4': 'Kısa Süreli Darbe & Tepki Padişahı',
  'damat-ferid-pasa': 'Sevr İmzalayıcısı & İşgal İşbirlikçisi',
  'ali-kemal': 'Milli Mücadele Karşıtı Kalem & Kısa Nazırlık',
  'saddam-hussein': 'Otoriter Baskı & Yıkıcı Bölgesel Savaşlar',
  'nicolae-ceausescu': 'Baskıcı Rejim & Ekonomik Yıkım Diktatörü',
  'enver-hoxha': 'Aşırı İzolasyonist & Sığınak Rejimi Lideri',
  'abdullah-ocalan': 'Şiddet & Terör Örgütü Elebaşı',
};

type RoleArchetype =
  | 'founder_check'
  | 'monarch'
  | 'commander'
  | 'caliph'
  | 'minister'
  | 'executive'
  | 'party';

function detectRoleArchetype(leader: Leader): RoleArchetype {
  const sub = leader.subCategory || '';
  const titleLower = leader.title.toLowerCase();

  if (sub === 'rashidun' || sub === 'umayyad' || sub === 'abbasid' || titleLower.includes('halife')) {
    return 'caliph';
  }
  if (
    sub === 'islamic-commander' ||
    sub === 'tr-actor' && (titleLower.includes('orgeneral') || titleLower.includes('paşa') || titleLower.includes('komutan')) ||
    titleLower.includes('komutan') ||
    titleLower.includes('başkomutan') ||
    titleLower.includes('general')
  ) {
    return 'commander';
  }
  if (
    sub === 'ottoman-sultan' ||
    sub === 'uk-monarch' ||
    sub === 'es-monarch' ||
    sub === 'turkic-seljuk' ||
    sub === 'ancient-rome' ||
    sub === 'ancient-greece' ||
    sub === 'mn-leader' ||
    titleLower.includes('padişah') ||
    titleLower.includes('sultan') ||
    titleLower.includes('kral') ||
    titleLower.includes('kraliçe') ||
    titleLower.includes('imparator') ||
    titleLower.includes('çar') ||
    titleLower.includes('kağan') ||
    titleLower.includes('şah') ||
    titleLower.includes('han')
  ) {
    return 'monarch';
  }
  if (
    sub === 'tr-minister' ||
    sub === 'ottoman-late' ||
    titleLower.includes('bakan') ||
    titleLower.includes('vezir') ||
    titleLower.includes('sadrazam')
  ) {
    return 'minister';
  }
  if (
    sub.endsWith('-party') ||
    sub === 'gr-current' ||
    titleLower.includes('genel başkan') ||
    titleLower.includes('muhalefet') ||
    titleLower.includes('parti')
  ) {
    return 'party';
  }
  return 'executive';
}

function getTopTwoDimensions(scores: LeaderScores): [DimensionKey, DimensionKey] {
  const entries: [DimensionKey, number][] = [
    ['military', scores.military],
    ['economy', scores.economy],
    ['societal', scores.societal],
    ['diplomacy', scores.diplomacy],
    ['leadership', scores.leadership],
    ['legacy', scores.legacy],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return [entries[0][0], entries[1][0]];
}

/**
 * Liderin hem puanına (S/A/B/C/D) hem de rolüne ve en baskın 2 boyutuna göre
 * kişiselleştirilmiş alt etiket üretir.
 */
export function getLeaderTierSubtitle(
  leader: Leader,
  scores: LeaderScores,
  tier: TierLevel
): string {
  // Lider hâlâ varsayılan tier'ında ise ve özel unvanı tanımlıysa doğrudan kişiye özel unvanı döndür
  const defaultSum =
    leader.defaultScores.military +
    leader.defaultScores.economy +
    leader.defaultScores.societal +
    leader.defaultScores.diplomacy +
    leader.defaultScores.leadership +
    leader.defaultScores.legacy;
  const defaultOverall = Math.round(defaultSum / 6);
  const defaultTier: TierLevel =
    defaultOverall >= 90
      ? 'S'
      : defaultOverall >= 80
      ? 'A'
      : defaultOverall >= 70
      ? 'B'
      : defaultOverall >= 55
      ? 'C'
      : 'D';

  if (tier === defaultTier && LEADER_TIER_EPITHETS[leader.id]) {
    return LEADER_TIER_EPITHETS[leader.id];
  }

  const [top1, top2] = getTopTwoDimensions(scores);
  const role = detectRoleArchetype(leader);
  const overall = Math.round(
    (scores.military +
      scores.economy +
      scores.societal +
      scores.diplomacy +
      scores.leadership +
      scores.legacy) /
      6
  );

  if (tier === 'S') {
    if (top1 === 'military' || (top1 === 'leadership' && top2 === 'military')) {
      return role === 'monarch'
        ? 'Cihan Fatihi & Stratejik Hükümdar'
        : 'Askeri Deha & Tarihi Komutan';
    }
    if (top1 === 'societal' || top2 === 'societal') {
      return role === 'monarch'
        ? 'Kanun Koyucu & Medeniyet Hükümdarı'
        : 'Çağ Açan Hukuk & Toplum Reformcusu';
    }
    if (top1 === 'economy' || top2 === 'economy') {
      return 'Refah Mimarı & Kalkınma Lideri';
    }
    if (top1 === 'diplomacy' || top2 === 'diplomacy') {
      return 'Küresel Denge & Diplomasi Ustası';
    }
    return 'Tarihe Yön Veren Zirve Devlet Adamı';
  }

  if (tier === 'A') {
    if (top1 === 'military' || (top1 === 'leadership' && scores.military >= 84)) {
      if (role === 'monarch') return 'Muzaffer Hükümdar & Askeri Güç';
      if (role === 'commander') return 'Seçkin Başkomutan & Stratejist';
      return 'Kararlı Savunma & Strateji Lideri';
    }
    if (top1 === 'economy' && top2 === 'societal') {
      return 'Ekonomik Kalkınma & Reform Mimarı';
    }
    if (top1 === 'economy' || top2 === 'economy') {
      return role === 'minister'
        ? 'Ekonomi & Maliye Reformcusu'
        : 'Refah & Büyüme Odaklı Devlet Adamı';
    }
    if (top1 === 'societal' || top2 === 'societal') {
      return role === 'minister'
        ? 'Eğitim, Hukuk & Kurum Mimarı'
        : 'İlerlemeci Reform & Hukuk Lideri';
    }
    if (top1 === 'diplomacy' || top2 === 'diplomacy') {
      return 'Usta Diplomat & Uluslararası Aktör';
    }
    if (role === 'monarch') return 'Güçlü Hükümdar & İstikrar Dönemi';
    if (role === 'party') return 'Yüksek Etkili Siyasi Lider';
    return 'Seçkin Devlet Adamı & Dönem Lideri';
  }

  if (tier === 'B') {
    if (top1 === 'military' && scores.military >= 78) {
      return role === 'monarch'
        ? 'Askeri Ağırlıklı Hükümdar'
        : 'Savunma & Güvenlik Odaklı Lider';
    }
    if (top1 === 'economy') {
      return 'Ekonomik İstikrar & Yönetim Odaklı';
    }
    if (top1 === 'societal') {
      return 'Toplumsal Düzen & Hukuk Odaklı';
    }
    if (top1 === 'diplomacy') {
      return 'Denge & Uzlaşı Diplomatı';
    }
    if (top1 === 'leadership') {
      return role === 'party'
        ? 'Karizmatik & Etkili Siyasi Aktör'
        : 'Güçlü İrade, Dengeli İcraat';
    }
    return role === 'monarch'
      ? 'İstikrarlı Taht & Dengeli İdare'
      : 'Yetkin & İstikrarlı Yönetim';
  }

  if (tier === 'C') {
    if (scores.military >= 70 && scores.societal < 55) {
      return 'Sert Güç Odaklı, Tartışmalı Miras';
    }
    if (scores.leadership >= 72 && scores.economy < 55) {
      return 'Yüksek Karizma, Zayıf Mali Bilanço';
    }
    if (scores.economy >= 65 && scores.leadership < 58) {
      return 'Teknokratik Çaba, Sınırlı Liderlik';
    }
    if (role === 'party') {
      return 'Tartışmalı & Kutuplaştırıcı Siyaset';
    }
    return 'Krizlerle Çalkalanan Sınırlı Dönem';
  }

  // D TIER
  if (overall <= 15) {
    return 'Tarihsel Açıdan Yıkıcı & Olumsuz Miras';
  }
  if (scores.military >= 55 && scores.societal <= 30) {
    return 'Otoriter Baskı & Ağır Toplumsal Bedel';
  }
  if (scores.economy <= 35 && scores.leadership <= 40) {
    return 'Ekonomik Çöküş & Yönetim Zaafı';
  }
  return 'Bunalımlı Dönem & Ağır Bilanço';
}
