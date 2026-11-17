export interface LeaderEnTranslation {
  name?: string;
  title: string;
  country?: string;
  century?: string;
  yearsActive?: string;
  summary: string;
  keyAchievements: string[];
  controversies?: string[];
  famousQuote?: string;
}

export const COUNTRY_EN_MAP: Record<string, string> = {
  'Türkiye': 'Turkey',
  'Roma İmparatorluğu': 'Roman Empire',
  'Makedonya / Antik Dünya': 'Macedonia / Ancient World',
  'Osmanlı İmparatorluğu': 'Ottoman Empire',
  'Fransa': 'France',
  'Moğolistan': 'Mongolia',
  'Almanya / Prusya': 'Germany / Prussia',
  'Almanya': 'Germany',
  'Amerika Birleşik Devletleri': 'United States',
  'Birleşik Krallık': 'United Kingdom',
  'Rusya': 'Russia',
  'Mısır / Eyyubiler': 'Egypt / Ayyubids',
  'Antik Yunan / Atina': 'Ancient Greece / Athens',
  'İspanya': 'Spain',
  'Sovyetler Birliği (SSCB)': 'Soviet Union (USSR)',
  'Büyük Hun İmparatorluğu': 'Xiongnu Empire',
  'Avrupa Hun İmparatorluğu': 'Hunnic Empire',
  'Göktürk Kağanlığı': 'First Turkic Khaganate',
  'Büyük Selçuklu Devleti': 'Great Seljuk Empire',
  'Timur İmparatorluğu': 'Timurid Empire',
  'Yugoslavya / Balkanlar': 'Yugoslavia / Balkans',
  'Çin': 'China',
  'Küba': 'Cuba',
  'Küba (Arjantin Doğumlu)': 'Cuba (Argentine-born)',
  'Belçika': 'Belgium',
  'Hollanda': 'Netherlands',
  'İtalya': 'Italy',
  'Polonya': 'Poland',
  'Türkistan / Türkiye': 'Turkestan / Turkey',
  'Çin (Qin Hanedanı)': 'China (Qin Dynasty)',
  'Çin (Tang Hanedanı)': 'China (Tang Dynasty)',
  'Çin / Tayvan': 'China / Taiwan',
  'Mısır': 'Egypt',
  'Roma Cumhuriyeti': 'Roman Republic',
  'Doğu Roma / Bizans': 'Eastern Rome / Byzantium',
  'II. Göktürk Kağanlığı': 'Second Turkic Khaganate',
  'Uygur Kağanlığı': 'Uyghur Khaganate',
  'Gazneliler Devleti': 'Ghaznavid Empire',
  'Anadolu Selçuklu Devleti': 'Sultanate of Rum',
  'Harzemşahlar Devleti': 'Khwarazmian Empire',
  'Karamanoğulları Beyliği': 'Karamanids',
  'Aydınoğulları Beyliği': 'Aydinids',
  'Kadı Burhaneddin Devleti': 'Eretna / Kadi Burhan al-Din State',
  'Akkoyunlu Devleti': 'Aq Qoyunlu Confederation',
  'Türkiye (PKK Kurucusu)': 'Turkey (PKK Founder)',
  'Gana': 'Ghana',
  'Tanzanya': 'Tanzania',
  'Güney Afrika': 'South Africa',
  'Botsvana': 'Botswana',
  'Irak': 'Iraq',
  'Suriye': 'Syria',
  'Filistin': 'Palestine',
  'Suudi Arabistan': 'Saudi Arabia',
  'İran': 'Iran',
  'Râşidîn Halifeliği': 'Rashidun Caliphate',
  'Emeviler': 'Umayyad Caliphate',
  'Endülüs (İspanya)': 'Al-Andalus (Spain)',
  'Abbasiler': 'Abbasid Caliphate',
  'Emeviler / Endülüs': 'Umayyads / Al-Andalus',
  'Memlük Sultanlığı': 'Mamluk Sultanate',
  'Azerbaycan': 'Azerbaijan',
  'Osmanlı İmparatorluğu / Türkistan': 'Ottoman Empire / Turkestan',
  'Rusya İmparatorluğu': 'Russian Empire',
  'İngiltere': 'England',
  'İskoçya / Birleşik Krallık': 'Scotland / United Kingdom',
  'İngiltere / Büyük Britanya': 'England / Great Britain',
  'Ermenistan': 'Armenia',
  'Gürcistan': 'Georgia',
  'Yunanistan': 'Greece',
  'Sırbistan': 'Serbia',
  'Bosna-Hersek': 'Bosnia and Herzegovina',
  'Hırvatistan': 'Croatia',
  'Bulgaristan': 'Bulgaria',
  'Romanya': 'Romania',
  'Arnavutluk': 'Albania',
  'Kuzey Makedonya': 'North Macedonia',
  'Hicaz Halifeliği': 'Hejaz Caliphate',
  'Antik Mısır': 'Ancient Egypt',
  'Kuzey Kore': 'North Korea',
  'Kamboçya': 'Cambodia',
  'İsrail': 'Israel',
  'Japonya': 'Japan',
  'Hristiyanlık Tarihi': 'Christian History',
  'Hristiyanlık Tarihi (Kuzey Afrika)': 'Christian History (North Africa)',
  'Hristiyanlık Tarihi (İtalya)': 'Christian History (Italy)',
  'Papalık / Roma': 'Papal States / Rome',
  'Hristiyanlık Tarihi (Almanya)': 'Christian History (Germany)',
  'Hristiyanlık Tarihi (Fransa / İsviçre)': 'Christian History (France / Switzerland)',
  'Antik Roma': 'Ancient Rome',
  'Doğu Roma (Bizans)': 'Eastern Rome (Byzantium)',
  'SSCB / Rusya': 'USSR / Russia',
  'Rusya Çarlığı': 'Tsardom of Russia',
  'Almanya / Polonya': 'Germany / Poland',
  'Almanya / Avusturya': 'Germany / Austria',
  'ABD': 'United States',
  'İngiltere (İskoçya)': 'United Kingdom (Scotland)',
  'Hindistan': 'India',
  'Brezilya': 'Brazil',
  'Ukrayna': 'Ukraine',
  'Fransa İmparatorluğu': 'French Empire',
  'Fransa (İkinci Cumhuriyet & İkinci İmparatorluk)': 'France (Second Republic & Second Empire)',
  'Frank Krallığı (Fransa)': 'Kingdom of the Franks (France)',
  'Karolenj İmparatorluğu (Fransa)': 'Carolingian Empire (France)',
  'Fransa Krallığı': 'Kingdom of France',
  'Fransa / ABD': 'France / United States',
  'Fransa (Üçüncü Cumhuriyet)': 'France (Third Republic)',
  'Fransa (Vichy Rejimi)': 'France (Vichy Regime)',
  'Fransa / Cenevre': 'France / Geneva',
  'İtalya (Floransa)': 'Italy (Florence)',
  'İtalya Krallığı': 'Kingdom of Italy',
  'İspanya (Kastilya & Valencia)': 'Spain (Castile & Valencia)',
  'İspanya / Habsburg İmparatorluğu': 'Spain / Habsburg Empire',
  'Rusya Cumhuriyeti': 'Russian Republic',
  'Çin (Han Hanedanı)': 'China (Han Dynasty)',
  'Çin (Tang / Zhou Hanedanı)': 'China (Tang / Zhou Dynasty)',
  'Çin (Ming Hanedanı)': 'China (Ming Dynasty)',
  'Çin (Qing Hanedanı)': 'China (Qing Dynasty)',
  'Çin Halk Cumhuriyeti': "People's Republic of China",
  'Hindistan (Maurya İmparatorluğu)': 'India (Maurya Empire)',
  'Hindistan (Babür İmparatorluğu)': 'India (Mughal Empire)',
  'Hindistan (Maratha İmparatorluğu)': 'India (Maratha Empire)',
  'İngiltere / Birleşik Krallık': 'England / United Kingdom',
  'Almanya (Kutsal Roma İmparatorluğu)': 'Germany (Holy Roman Empire)',
  'Almanya (Weimar Cumhuriyeti)': 'Germany (Weimar Republic)',
  'Doğu Almanya (DDR)': 'East Germany (GDR)',
  'Ukrayna (Kiev Rus)': 'Ukraine (Kyivan Rus)',
  'Ukrayna (Kazak Hetmanlığı)': 'Ukraine (Cossack Hetmanate)',
  'Polonya Krallığı': 'Kingdom of Poland',
  'Polonya-Litvanya Birliği': 'Polish-Lithuanian Commonwealth',
  'Hollanda Cumhuriyeti': 'Dutch Republic',
  'Vietnam': 'Vietnam',
  'Libya': 'Libya',
  'Burkina Faso': 'Burkina Faso',
};

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function translateCenturyEn(c: string): string {
  const trimmed = c.trim();
  const isBce = /(?:^|\s)MÖ(?=\s|$)/.test(trimmed);
  const isCe = /(?:^|\s)MS(?=\s|$)/.test(trimmed);

  // Clean prefix/suffix and convert numbers followed by '.'
  let cleaned = trimmed
    .replace(/(?:^|\s)MÖ(?:\s+|$)/g, ' ')
    .replace(/(?:^|\s)MS(?:\s+|$)/g, ' ')
    .replace(/(?:^|\s)yy\.?(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  cleaned = cleaned.replace(/(\d+)\./g, (_, num) => ordinal(parseInt(num, 10)));
  // Normalize separators
  cleaned = cleaned.replace(/\s*-\s*/g, '–').replace(/\s*–\s*/g, '–').replace(/\s*\/\s*/g, ' / ');

  if (isBce) {
    return `${cleaned} c. BCE`;
  }
  if (isCe) {
    return `${cleaned} c. CE`;
  }
  return `${cleaned} c.`;
}

export function translateYearsActiveEn(y: string): string {
  return y
    .replace(/Günümüz/g, 'Present')
    .replace(/MÖ\s+(\d+)/g, '$1 BCE')
    .replace(/MS\s+(\d+)/g, '$1 CE')
    .replace(/Başbakanlık/g, 'Prime Minister')
    .replace(/Başbakan/g, 'PM')
    .replace(/Cumhurbaşkanı/g, 'President')
    .replace(/\bCB\b/g, 'President')
    .replace(/Dışişleri Bakanı/g, 'Foreign Minister')
    .replace(/Dışişleri/g, 'Foreign Minister')
    .replace(/Komutan/g, 'Commander')
    .replace(/Mareşal/g, 'Marshal')
    .replace(/49 Gün/g, '49 Days')
    .replace(/93 Gün/g, '93 Days')
    .replace(/Mayıs – Ağustos/g, 'May – August')
    .replace(/Mayıs/g, 'May')
    .replace(/Ağustos/g, 'August')
    .replace(/Sembolik Saltanat/g, 'Nominal Reign')
    .replace(/Eser Dönemi/g, 'Major Works')
    .replace(/tek başına/g, 'sole rule')
    .replace(/1999’dan beri İmralı Cezaevi/g, 'Imrali Prison since 1999')
    .replace(/1999'dan beri İmralı Cezaevi/g, 'Imrali Prison since 1999')
    .replace(/yaklaşık/gi, 'c.')
    .replace(/Yaklaşık/g, 'c.');
}
