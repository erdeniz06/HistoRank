/**
 * Procedural Multi-Track Audio Engine for Cultural Ambient Music
 * Features multiple distinct, evolving compositions per culture,
 * automatic track rotation, key transposition, polyphonic harmonic progressions,
 * and real-time track metadata.
 */

export type CultureKey =
  | 'turkey'
  | 'germany'
  | 'france'
  | 'uk'
  | 'usa'
  | 'spain'
  | 'ussr'
  | 'turkic'
  | 'europe'
  | 'ancient'
  | 'mongolia'
  | 'world';

export interface CultureAudioProfile {
  key: CultureKey;
  name: string;
  instruments: string;
  scaleDescription: string;
  flag: string;
}

export interface TrackDefinition {
  title: string;
  subTitle: string;
  mood: string;
  tempoBpm: number;
  scale: number[];
  chords: number[][]; // Root and harmony note frequencies for progression
  instrumentType: 'wind' | 'pluck' | 'brass' | 'organ' | 'accordion' | 'strings' | 'throat' | 'bell';
}

export const CULTURES: CultureAudioProfile[] = [
  {
    key: 'turkey',
    name: 'Türk & Osmanlı Tınıları',
    instruments: 'Ney Nefesi, Ud Mızrabı, Santur & Kudüm',
    scaleDescription: 'Hicaz, Nihavend & Segâh Makamı',
    flag: '🇹🇷',
  },
  {
    key: 'uk',
    name: 'Britanya & İngiltere',
    instruments: 'Westminster Çanları, Kelt Flütü & Kraliyet Pirinçleri',
    scaleDescription: 'İngiliz Saray İlahisi & Kelt Modu',
    flag: '🇬🇧',
  },
  {
    key: 'usa',
    name: 'Amerikan Senfonisi & Folk',
    instruments: 'Appalachian Yaylısı, Delta Blues & Pirinç Nefesliler',
    scaleDescription: 'Americana & Dvořák Yeni Dünya',
    flag: '🇺🇸',
  },
  {
    key: 'germany',
    name: 'Alman Barok & Klasik',
    instruments: 'Barok Kilise Orgu, Çello & Wagner Nefeslileri',
    scaleDescription: 'Bach Kontrpuanı & Beethoven Dramı',
    flag: '🇩🇪',
  },
  {
    key: 'spain',
    name: 'İspanyol Flamenko & Rönesans',
    instruments: 'İspanyol Klasik Gitarı & Kastanyet',
    scaleDescription: 'Endülüs Frigya Modu & Conquistador',
    flag: '🇪🇸',
  },
  {
    key: 'france',
    name: 'Fransız Romantizm & İhtilal',
    instruments: 'Paris Akordeonu, Pastoral Flüt & Arp Tınıları',
    scaleDescription: 'Debussy & Satie Empresyonizmi',
    flag: '🇫🇷',
  },
  {
    key: 'ancient',
    name: 'Roma & Antik Lir',
    instruments: 'Antik Kithara, Aulos Flütü & Bronz Savaş Gongu',
    scaleDescription: 'Arkaik Dorik & Frig Modu',
    flag: '🏛️',
  },
  {
    key: 'mongolia',
    name: 'Bozkır & Moğol Destanı',
    instruments: 'Hömey (Gırtlak Müziği) & Morin Khuur (At Başlı Keman)',
    scaleDescription: 'Pentatonik Bozkır Ezgisi & Doğan Ton',
    flag: '🇲🇳',
  },
  {
    key: 'ussr',
    name: 'SSCB Koral Marş & Senfoni',
    instruments: 'Kızıl Ordu Pirinçleri, Bas Koro & Minör Yaylılar',
    scaleDescription: 'Rus Romantik Minör & Törensel Marş',
    flag: '☭',
  },
  {
    key: 'turkic',
    name: 'Eski Türk & Selçuklu Bozkırı',
    instruments: 'Kopuz Mızrabı, Kaval & Savaş Davulu',
    scaleDescription: 'Orta Asya Pentatonik & Selçuklu Segâh',
    flag: '🐺',
  },
  {
    key: 'europe',
    name: 'Avrupa Oda Müziği & Rönesans',
    instruments: 'Venedik Yaylıları, Flaman Org & Leh Polonezi',
    scaleDescription: 'Klasik Kıta Avrupası Kontrpuanı',
    flag: '🇪🇺',
  },
  {
    key: 'world',
    name: 'Evrensel Tarihsel Senfoni',
    instruments: 'Büyük Yaylı Sazlar & Anıtsal Katedral Çanları',
    scaleDescription: 'Epik Senfonik Armoni & Kronos',
    flag: '🌍',
  },
];

// Note frequencies in Hz
const N: Record<string, number> = {
  // Octave 2
  C2: 65.41, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, Bb2: 116.54, B2: 123.47,
  // Octave 3
  C3: 130.81, 'C#3': 138.59, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, 'F#3': 185.0, G3: 196.0, Ab3: 207.65, A3: 220.0, Bb3: 233.08, B3: 246.94,
  // Octave 4
  C4: 261.63, 'C#4': 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, 'F#4': 369.99, G4: 392.0, Ab4: 415.3, A4: 440.0, Bb4: 466.16, B4: 493.88,
  // Octave 5
  C5: 523.25, 'C#5': 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, 'F#5': 739.99, G5: 783.99, A5: 880.0, B5: 987.77,
};

// Distinct, rotating musical compositions per culture
const CULTURE_TRACKS: Record<CultureKey, TrackDefinition[]> = {
  turkey: [
    {
      title: 'Hicaz Gece Taksimi',
      subTitle: 'Ney & Ud ile Derin Melankoli',
      mood: 'Duygusal & Meditatif',
      tempoBpm: 66,
      scale: [N.D4, N.Eb4, N['F#4'], N.G4, N.A4, N.Bb4, N.C5, N.D5],
      chords: [
        [N.D3, N.A3, N.D4],
        [N.G2, N.D3, N.Bb3],
        [N.A2, N.E3, N['C#4']],
        [N.D3, N.A3, N['F#4']],
      ],
      instrumentType: 'wind',
    },
    {
      title: 'Nihavend Saray Peşrevi',
      subTitle: 'Santur & Kudüm Ritimli Klasik Saray Formu',
      mood: 'Zarif & Asil',
      tempoBpm: 84,
      scale: [N.D4, N.E4, N.F4, N.G4, N.A4, N.Bb4, N['C#5'], N.D5],
      chords: [
        [N.D3, N.F3, N.A3],
        [N.G3, N.Bb3, N.D4],
        [N.A3, N['C#4'], N.E4],
        [N.D3, N.A3, N.D4],
      ],
      instrumentType: 'pluck',
    },
    {
      title: 'Segâh & Rast Bozkır Rüzgarı',
      subTitle: 'Bağlama & Kaval ile Anadolu Tınısı',
      mood: 'Dingin & Destansı',
      tempoBpm: 72,
      scale: [N.G3, N.A3, N.B3, N.C4, N.D4, N.E4, N.G4, N.A4],
      chords: [
        [N.G2, N.D3, N.G3],
        [N.C3, N.G3, N.E4],
        [N.D3, N.A3, N['F#4']],
        [N.G2, N.D3, N.B3],
      ],
      instrumentType: 'pluck',
    },
    {
      title: 'Zafer & Kahramanlık Marşı',
      subTitle: 'Nefir & Zurna Çeşitlemesiyle Akıncı Ritmi',
      mood: 'Coşkulu & Epik',
      tempoBpm: 98,
      scale: [N.D4, N.Eb4, N.F4, N.G4, N.A4, N.C5, N.D5],
      chords: [
        [N.D2, N.A2, N.D3],
        [N.F2, N.C3, N.F3],
        [N.G2, N.D3, N.G3],
        [N.A2, N.E3, N.A3],
      ],
      instrumentType: 'brass',
    },
  ],

  uk: [
    {
      title: 'Westminster Katedral Çanları',
      subTitle: 'Kraliyet Töreni & Çan Harmonisi',
      mood: 'Görkemli & Resmi',
      tempoBpm: 68,
      scale: [N.D4, N.E4, N['F#4'], N.G4, N.A4, N.B4, N['C#5'], N.D5],
      chords: [
        [N.D3, N['F#3'], N.A3],
        [N.G2, N.B2, N.D3],
        [N.A2, N['C#3'], N.E3],
        [N.D3, N.A3, N.D4],
      ],
      instrumentType: 'bell',
    },
    {
      title: 'Kelt Sisleri & İskoç Yaylası',
      subTitle: 'Highland Flütü & Pastoral Melodi',
      mood: 'Melankolik & Masalsı',
      tempoBpm: 76,
      scale: [N.D4, N.E4, N.G4, N.A4, N.B4, N.D5, N.E5],
      chords: [
        [N.D3, N.A3, N.D4],
        [N.C3, N.G3, N.C4],
        [N.B2, N['F#3'], N.B3],
        [N.D3, N.A3, N.D4],
      ],
      instrumentType: 'wind',
    },
    {
      title: 'Londra Sisleri & Greensleeves Teması',
      subTitle: 'Rönesans Lavtası & Melankolik Yaylılar',
      mood: 'Hüzünlü & Asil',
      tempoBpm: 60,
      scale: [N.D4, N.F4, N.G4, N.A4, N.B4, N.C5, N['C#5'], N.D5],
      chords: [
        [N.D3, N.F3, N.A3],
        [N.C3, N.E3, N.G3],
        [N.Bb2, N.D3, N.F3],
        [N.A2, N['C#3'], N.E3],
      ],
      instrumentType: 'pluck',
    },
    {
      title: 'Kraliyet Fanfarı (Rule Britannia Tınısı)',
      subTitle: 'Kraliyet Muhafızları Pirinç Korosu',
      mood: 'Muzaffer & Güçlü',
      tempoBpm: 94,
      scale: [N.D4, N['F#4'], N.A4, N.B4, N['C#5'], N.D5],
      chords: [
        [N.D3, N.A3, N.D4],
        [N.A2, N.E3, N.A3],
        [N.G2, N.D3, N.B3],
        [N.D3, N['F#3'], N.A3],
      ],
      instrumentType: 'brass',
    },
  ],

  usa: [
    {
      title: 'Appalachian Dawn & Folk Fiddle',
      subTitle: 'Akustik Dağ Kemanı & Pastoral Yaylı',
      mood: 'Sıcak & Dingin',
      tempoBpm: 74,
      scale: [N.G3, N.A3, N.B3, N.D4, N.E4, N.G4, N.A4, N.B4],
      chords: [
        [N.G2, N.D3, N.B3],
        [N.C3, N.G3, N.E4],
        [N.D3, N.A3, N['F#4']],
        [N.G2, N.D3, N.G3],
      ],
      instrumentType: 'strings',
    },
    {
      title: "Dvořák 'Yeni Dünya' Senfonisi",
      subTitle: 'Geniş Ufuklar & Korno Melodisi',
      mood: 'Umut Dolu & Destansı',
      tempoBpm: 64,
      scale: [N.E4, N.G4, N.A4, N.B4, N.D5, N.E5],
      chords: [
        [N.E3, N.B3, N.E4],
        [N.C3, N.G3, N.C4],
        [N.D3, N.A3, N.D4],
        [N.E3, N.B3, N.G4],
      ],
      instrumentType: 'brass',
    },
    {
      title: 'Delta Blues & Gece Treni',
      subTitle: 'Mavi Notalar & Yavaş Akustik Solo',
      mood: 'Ruhani & Düşünceli',
      tempoBpm: 80,
      scale: [N.G3, N.Bb3, N.C4, N['C#4'], N.D4, N.F4, N.G4],
      chords: [
        [N.G2, N.D3, N.F3],
        [N.C3, N.G3, N.Bb3],
        [N.D3, N.A3, N.C4],
        [N.G2, N.D3, N.B3],
      ],
      instrumentType: 'pluck',
    },
    {
      title: 'Copland Fanfare & Oval Ofis',
      subTitle: 'Modern Cumhuriyet & Açık Beşliler',
      mood: 'Vakur & Görkemli',
      tempoBpm: 88,
      scale: [N.C4, N.D4, N.E4, N.G4, N.A4, N.C5],
      chords: [
        [N.C3, N.G3, N.E4],
        [N.F2, N.C3, N.A3],
        [N.G2, N.D3, N.B3],
        [N.C3, N.G3, N.C4],
      ],
      instrumentType: 'brass',
    },
  ],

  germany: [
    {
      title: 'Bach Tarzı Toccata & Füg Kontrpuani',
      subTitle: 'Barok Kilise Orgu & Çift Hat Polifonisi',
      mood: 'Dramatik & Kusursuz',
      tempoBpm: 86,
      scale: [N.D4, N.E4, N.F4, N.G4, N.A4, N.Bb4, N['C#5'], N.D5],
      chords: [
        [N.D2, N.A2, N.F3],
        [N.G2, N.D3, N.Bb3],
        [N.A2, N.E3, N['C#4']],
        [N.D2, N.A2, N.D3],
      ],
      instrumentType: 'organ',
    },
    {
      title: 'Beethoven 5. ve 9. Senfoni Modifi',
      subTitle: 'Kader Motifi & Güçlü Çello Basları',
      mood: 'Ateşli & Yoğun',
      tempoBpm: 92,
      scale: [N.C4, N.Eb4, N.G4, N.Ab4, N.B4, N.C5],
      chords: [
        [N.C2, N.G2, N.Eb3],
        [N.F2, N.C3, N.Ab3],
        [N.G2, N.D3, N.B3],
        [N.C2, N.G2, N.C3],
      ],
      instrumentType: 'strings',
    },
    {
      title: 'Wagner Valhalla Pirinçleri',
      subTitle: 'Cermen Mitolojisi & Derin Korno Akorları',
      mood: 'Epik & Ağırbaşlı',
      tempoBpm: 62,
      scale: [N.Eb4, N.F4, N.G4, N.Ab4, N.Bb4, N.C5, N.Eb5],
      chords: [
        [N.Eb2, N.Bb2, N.G3],
        [N.Ab2, N.Eb3, N.C4],
        [N.Bb2, N.F3, N.D4],
        [N.Eb2, N.Bb2, N.Eb3],
      ],
      instrumentType: 'brass',
    },
    {
      title: 'Prusya Barok Yürüyüşü',
      subTitle: 'Büyük Friedrich Flüt Konçertosu Esinlenmesi',
      mood: 'Disiplinli & Zarif',
      tempoBpm: 80,
      scale: [N.D4, N.E4, N['F#4'], N.G4, N.A4, N.B4, N.D5],
      chords: [
        [N.D3, N.A3, N['F#4']],
        [N.A2, N.E3, N['C#4']],
        [N.B2, N['F#3'], N.D4],
        [N.G2, N.D3, N.B3],
      ],
      instrumentType: 'wind',
    },
  ],

  spain: [
    {
      title: 'Endülüs Bahçeleri & Flamenko Gitarı',
      subTitle: 'İspanyol Klasik Gitarı & Melankolik Frigya Modu',
      mood: 'Ateşli & Derin',
      tempoBpm: 86,
      scale: [N.E4, N.F4, N.G4, N.Ab4, N.B4, N.C5, N.D5, N.E5],
      chords: [
        [N.E3, N.B3, N.E4],
        [N.F2, N.C3, N.A3],
        [N.G2, N.D3, N.B3],
        [N.E3, N.B3, N.Ab4],
      ],
      instrumentType: 'pluck',
    },
    {
      title: 'Conquistador & İmparatorluk Fanfarı',
      subTitle: 'Kastilya Kraliyet Töreni & Zafer Nefeslileri',
      mood: 'Görkemli & Kudretli',
      tempoBpm: 92,
      scale: [N.D4, N.F4, N.G4, N.A4, N.Bb4, N.C5, N.D5],
      chords: [
        [N.D3, N.A3, N.D4],
        [N.C3, N.G3, N.C4],
        [N.Bb2, N.F3, N.Bb3],
        [N.A2, N.E3, N.A3],
      ],
      instrumentType: 'brass',
    },
  ],

  france: [
    {
      title: 'Debussy Clair de Lune Empresyonizmi',
      subTitle: 'Ay Işığı & Rüyamsı Arp Dokunuşları',
      mood: 'Şiirsel & Rüyamsı',
      tempoBpm: 54,
      scale: [N.Db4, N.Eb4, N.F4, N.Ab4, N.Bb4, N.C5, N.Db5],
      chords: [
        [N.Db3, N.Ab3, N.F4],
        [N.Gb2, N.Db3, N.Bb3],
        [N.Ab2, N.Eb3, N.C4],
        [N.Db3, N.Ab3, N.Db4],
      ],
      instrumentType: 'pluck',
    },
    {
      title: 'Erik Satie Gymnopedie Melankolisi',
      subTitle: 'Yavaş 3/4 Valsi & Minimalist Piyano Çanları',
      mood: 'Dingin & Düşünceli',
      tempoBpm: 58,
      scale: [N.G4, N.A4, N.B4, N['C#5'], N.D5, N['F#5']],
      chords: [
        [N.G2, N.D3, N.B3],
        [N.D3, N['F#3'], N['C#4']],
        [N.E3, N.B3, N.G4],
        [N.A2, N.E3, N['C#4']],
      ],
      instrumentType: 'bell',
    },
    {
      title: 'Montmartre Akordeon Valsi',
      subTitle: 'Paris Sokakları & Fransız Musette Salınımı',
      mood: 'Nostaljik & Canlı',
      tempoBpm: 104,
      scale: [N.A4, N.B4, N.C5, N.D5, N.E5, N.F5, N['G#5'], N.A5],
      chords: [
        [N.A2, N.E3, N.C4],
        [N.D3, N.A3, N.F4],
        [N.E2, N.B2, N['G#3']],
        [N.A2, N.E3, N.A3],
      ],
      instrumentType: 'accordion',
    },
    {
      title: 'Bastille İhtilal Marşı',
      subTitle: 'La Marseillaise & Cumhuriyet Heyecanı',
      mood: 'Devrimci & Cesur',
      tempoBpm: 96,
      scale: [N.G4, N.A4, N.B4, N.C5, N.D5, N.E5, N['F#5'], N.G5],
      chords: [
        [N.G2, N.D3, N.G3],
        [N.C3, N.G3, N.E4],
        [N.D3, N.A3, N['F#4']],
        [N.G2, N.D3, N.B3],
      ],
      instrumentType: 'brass',
    },
  ],

  ancient: [
    {
      title: 'Sezar Lejyonları & Roma Forumu',
      subTitle: 'Arkaik Dorik Aulos & Bronz Savaş Zili',
      mood: 'Kudretli & Törensel',
      tempoBpm: 72,
      scale: [N.D4, N.E4, N.F4, N.G4, N.A4, N.B4, N.C5, N.D5],
      chords: [
        [N.D2, N.A2, N.D3],
        [N.G2, N.D3, N.G3],
        [N.C3, N.G3, N.C4],
        [N.D2, N.A2, N.D3],
      ],
      instrumentType: 'wind',
    },
    {
      title: 'Delphi Tapınağı & Kehanet Liri',
      subTitle: 'Antik Kithara Parmak Vuruşları',
      mood: 'Gizemli & Uhrevi',
      tempoBpm: 60,
      scale: [N.D4, N.Eb4, N.F4, N.G4, N.A4, N.Bb4, N.C5],
      chords: [
        [N.D3, N.A3, N.D4],
        [N.Eb3, N.Bb3, N.Eb4],
        [N.C3, N.G3, N.C4],
        [N.D3, N.A3, N.D4],
      ],
      instrumentType: 'pluck',
    },
    {
      title: 'Kolezyum Gladyatör Girişi',
      subTitle: 'Ritmik Bronz Çekiç & Düşük Trompetler',
      mood: 'Gerilimli & Meydan Okuyan',
      tempoBpm: 92,
      scale: [N.D3, N.F3, N.G3, N.Ab3, N.A3, N.C4, N.D4],
      chords: [
        [N.D2, N.A2, N.D3],
        [N.F2, N.C3, N.F3],
        [N.Ab2, N.Eb3, N.Ab3],
        [N.D2, N.A2, N.D3],
      ],
      instrumentType: 'brass',
    },
  ],

  mongolia: [
    {
      title: 'Cengiz Han Bozkır Akını',
      subTitle: 'Hömey Gırtlak Overtone & Dörtnal Ritim',
      mood: 'Vahşi & Sürükleyici',
      tempoBpm: 108,
      scale: [N.D3, N.F3, N.G3, N.A3, N.C4, N.D4, N.F4, N.G4],
      chords: [
        [N.D2, N.A2, N.D3],
        [N.C2, N.G2, N.C3],
        [N.F2, N.C3, N.F3],
        [N.D2, N.A2, N.D3],
      ],
      instrumentType: 'throat',
    },
    {
      title: 'Altay Dağları Göçebe Ağıtı',
      subTitle: 'Morin Khuur (At Başlı Keman) Titreşimi',
      mood: 'Geniş & Hüzünlü',
      tempoBpm: 64,
      scale: [N.D4, N.F4, N.G4, N.A4, N.C5, N.D5],
      chords: [
        [N.D2, N.A2, N.F3],
        [N.Bb2, N.F3, N.D4],
        [N.C3, N.G3, N.E4],
        [N.D2, N.A2, N.D3],
      ],
      instrumentType: 'strings',
    },
  ],

  ussr: [
    {
      title: 'Kızıl Meydan Kış Marşı',
      subTitle: 'Pirinç Nefesliler & Dramatik Rus Minör Armonisi',
      mood: 'Anıtsal & Kararlı',
      tempoBpm: 76,
      scale: [N.C4, N.D4, N.Eb4, N.F4, N.G4, N.Ab4, N.B4, N.C5],
      chords: [
        [N.C3, N.G3, N.Eb4],
        [N.F2, N.C3, N.Ab3],
        [N.G2, N.D3, N.B3],
        [N.C3, N.G3, N.C4],
      ],
      instrumentType: 'brass',
    },
    {
      title: 'Şostakoviç & Leningrad Ağıtı',
      subTitle: 'Derin Yaylılar & Soğuk Savaş Gerilimi',
      mood: 'Ciddi & Trajik',
      tempoBpm: 62,
      scale: [N.D4, N.E4, N.F4, N.G4, N.A4, N.Bb4, N['C#5'], N.D5],
      chords: [
        [N.D3, N.A3, N.F4],
        [N.Bb2, N.F3, N.D4],
        [N.A2, N.E3, N['C#4']],
        [N.D3, N.A3, N.D4],
      ],
      instrumentType: 'strings',
    },
  ],

  turkic: [
    {
      title: 'Ötüken Bozkır Kopuzu',
      subTitle: 'Pentatonik Dombra & Bozkır Rüzgarı',
      mood: 'Destansı & Kadim',
      tempoBpm: 80,
      scale: [N.D4, N.E4, N.G4, N.A4, N.C5, N.D5, N.E5],
      chords: [
        [N.D3, N.A3, N.D4],
        [N.C3, N.G3, N.C4],
        [N.A2, N.E3, N.A3],
        [N.D3, N.A3, N.D4],
      ],
      instrumentType: 'pluck',
    },
    {
      title: 'Malazgirt & Selçuklu Çevganı',
      subTitle: 'Atlı Akın Nefeslisi & Tören Ritimleri',
      mood: 'Coşkulu & Fatih',
      tempoBpm: 92,
      scale: [N.G3, N.A3, N.Bb3, N.C4, N.D4, N.F4, N.G4],
      chords: [
        [N.G2, N.D3, N.G3],
        [N.F2, N.C3, N.F3],
        [N.D3, N.A3, N.D4],
        [N.G2, N.D3, N.Bb3],
      ],
      instrumentType: 'throat',
    },
  ],

  europe: [
    {
      title: 'Venedik & Brüksel Oda Konçertosu',
      subTitle: 'Klasik Kıta Yaylıları & Zarif Kontrpuan',
      mood: 'Entelektüel & Parlak',
      tempoBpm: 78,
      scale: [N.G3, N.A3, N.B3, N.C4, N.D4, N.E4, N['F#4'], N.G4],
      chords: [
        [N.G2, N.D3, N.B3],
        [N.C3, N.G3, N.E4],
        [N.D3, N.A3, N['F#4']],
        [N.G2, N.D3, N.G3],
      ],
      instrumentType: 'strings',
    },
    {
      title: 'Varşova & Amsterdam Katedral Orgu',
      subTitle: 'Barok Org & Sivil Toplum Harmonisi',
      mood: 'Asil & Dengeli',
      tempoBpm: 72,
      scale: [N.C4, N.D4, N.E4, N.F4, N.G4, N.A4, N.B4, N.C5],
      chords: [
        [N.C3, N.G3, N.E4],
        [N.F2, N.C3, N.A3],
        [N.G2, N.D3, N.B3],
        [N.C3, N.G3, N.C4],
      ],
      instrumentType: 'organ',
    },
  ],

  world: [
    {
      title: 'Kronos & Tarihin Çağrısı',
      subTitle: 'Büyük Senfonik Yaylılar & Çağlar Arası Yankı',
      mood: 'Anıtsal & Zamansız',
      tempoBpm: 70,
      scale: [N.D4, N.F4, N.G4, N.A4, N.C5, N.D5, N.F5],
      chords: [
        [N.D3, N.A3, N.D4],
        [N.Bb2, N.F3, N.Bb3],
        [N.C3, N.G3, N.C4],
        [N.D3, N.A3, N.D4],
      ],
      instrumentType: 'strings',
    },
    {
      title: 'İmparatorlukların Yükselişi',
      subTitle: 'Pirinç Nefesliler & Törensel Yürüyüş',
      mood: 'Epik & Gururlu',
      tempoBpm: 84,
      scale: [N.G3, N.B3, N.D4, N.E4, N.G4, N.A4, N.B4],
      chords: [
        [N.G2, N.D3, N.B3],
        [N.E2, N.B2, N.G3],
        [N.C3, N.G3, N.E4],
        [N.D3, N.A3, N['F#4']],
      ],
      instrumentType: 'brass',
    },
  ],
};

class CulturalAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentCulture: CultureKey = 'turkey';
  private currentTrackIndex: number = 0;
  private isPlaying: boolean = false;
  private volume: number = 0.55;
  private phraseTimerId: number | null = null;
  private trackAutoRotateTimerId: number | null = null;
  private chordIndex: number = 0;
  private droneNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private onStateChange: (() => void) | null = null;

  public init() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;
    this.ctx = new AudioCtxClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public setListener(cb: () => void) {
    this.onStateChange = cb;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentCulture(): CultureKey {
    return this.currentCulture;
  }

  public getCurrentTrack(): TrackDefinition {
    const list = CULTURE_TRACKS[this.currentCulture] || CULTURE_TRACKS.turkey;
    return list[this.currentTrackIndex % list.length];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public getTotalTracksForCulture(): number {
    const list = CULTURE_TRACKS[this.currentCulture] || CULTURE_TRACKS.turkey;
    return list.length;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.onStateChange?.();
  }

  public async play(culture?: CultureKey) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (culture && culture !== this.currentCulture) {
      this.currentCulture = culture;
      this.currentTrackIndex = 0;
    }

    this.isPlaying = true;
    this.startTrack();
    this.onStateChange?.();
  }

  public pause() {
    this.isPlaying = false;
    this.clearTimers();
    this.stopDrones();
    this.onStateChange?.();
  }

  public togglePlay(culture?: CultureKey) {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play(culture);
    }
  }

  public switchCulture(culture: CultureKey) {
    this.currentCulture = culture;
    this.currentTrackIndex = 0;
    if (this.isPlaying) {
      this.startTrack();
    }
    this.onStateChange?.();
  }

  /**
   * Next Track button / manual skip:
   * Smoothly skips to the next composition in this culture's repertoire.
   */
  public nextTrack() {
    const list = CULTURE_TRACKS[this.currentCulture] || CULTURE_TRACKS.turkey;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % list.length;
    if (this.isPlaying) {
      this.startTrack();
    }
    this.onStateChange?.();
  }

  private clearTimers() {
    if (this.phraseTimerId) {
      window.clearTimeout(this.phraseTimerId);
      this.phraseTimerId = null;
    }
    if (this.trackAutoRotateTimerId) {
      window.clearTimeout(this.trackAutoRotateTimerId);
      this.trackAutoRotateTimerId = null;
    }
  }

  private startTrack() {
    this.clearTimers();
    this.stopDrones();
    this.chordIndex = 0;

    const track = this.getCurrentTrack();

    // Start harmonic drone and bass foundation
    this.startChordsForTrack(track);

    // Start evolving melodic phrase sequencer
    this.scheduleNextMelodicPhrase();

    // Auto-rotate track after 32 seconds so music naturally evolves and changes!
    this.trackAutoRotateTimerId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.nextTrack();
      }
    }, 32000);
  }

  private stopDrones() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const d of this.droneNodes) {
      try {
        d.gain.gain.setTargetAtTime(0.0001, now, 0.4);
        d.osc.stop(now + 0.5);
      } catch (e) {
        // ignore
      }
    }
    this.droneNodes = [];
  }

  private startChordsForTrack(track: TrackDefinition) {
    if (!this.ctx || !this.masterGain) return;
    const chord = track.chords[this.chordIndex % track.chords.length];

    // Root fundamental
    this.createDroneOsc(chord[0], 'triangle', 0.08, 300);
    // Fifth or harmonic fill
    if (chord[1]) {
      this.createDroneOsc(chord[1], 'sine', 0.05, 500);
    }
    // High shimmer
    if (chord[2]) {
      this.createDroneOsc(chord[2], 'sine', 0.03, 700);
    }
  }

  private createDroneOsc(freq: number, type: OscillatorType, maxGain: number, filterFreq?: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(maxGain, this.ctx.currentTime + 1.2);

    if (filterFreq) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.masterGain);
    osc.start();
    this.droneNodes.push({ osc, gain });
  }

  /**
   * Generative Melodic Phrase Sequencer:
   * Phrases evolve dynamically with changing motifs, rhythmic variations, and expressive ornamentation.
   */
  private scheduleNextMelodicPhrase() {
    if (!this.isPlaying || !this.ctx) return;

    const track = this.getCurrentTrack();
    const scale = track.scale;
    const beatSeconds = 60 / track.tempoBpm;

    // Harmonic chord advance every phrase
    this.chordIndex = (this.chordIndex + 1) % track.chords.length;

    // A phrase consists of 4 to 7 notes with varied note values (quarter, eighth, dotted)
    const noteCount = Math.floor(Math.random() * 4) + 4;
    let delay = 0.2;

    let prevNote = scale[Math.floor(scale.length / 2)];

    for (let i = 0; i < noteCount; i++) {
      // Stepwise melodic movement with occasional dramatic leap
      const stepChance = Math.random();
      let noteFreq: number;

      if (stepChance < 0.7) {
        // Stepwise motion (+/- 1 or 2 scale degrees)
        const curIdx = scale.indexOf(prevNote);
        const shift = Math.random() > 0.5 ? 1 : -1;
        const newIdx = Math.max(0, Math.min(scale.length - 1, curIdx + shift));
        noteFreq = scale[newIdx];
      } else {
        // Expressive leap to tonic or fifth
        noteFreq = scale[Math.floor(Math.random() * scale.length)];
      }
      prevNote = noteFreq;

      const durationMultiplier = Math.random() > 0.6 ? 1.5 : (Math.random() > 0.3 ? 1.0 : 0.65);
      const noteDuration = beatSeconds * durationMultiplier;
      const scheduledTime = delay;

      window.setTimeout(() => {
        if (this.isPlaying) {
          this.synthesizeNote(noteFreq, noteDuration, track.instrumentType);
        }
      }, scheduledTime * 1000);

      delay += noteDuration * 0.9;
    }

    // Breath pause between phrases
    const breathPause = beatSeconds * (Math.random() * 1.5 + 1.2);
    const totalPhraseMs = (delay + breathPause) * 1000;

    this.phraseTimerId = window.setTimeout(() => {
      this.scheduleNextMelodicPhrase();
    }, totalPhraseMs);
  }

  private synthesizeNote(
    freq: number,
    duration: number,
    instrument: TrackDefinition['instrumentType']
  ) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    switch (instrument) {
      case 'wind': {
        // Ney / Flute: Triangle wave, soft breath swell, micro-vibrato
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Breath vibrato LFO
        const vibrato = this.ctx.createOscillator();
        vibrato.frequency.setValueAtTime(5.4, now);
        const vibGain = this.ctx.createGain();
        vibGain.gain.setValueAtTime(freq * 0.016, now);
        vibrato.connect(vibGain);
        vibGain.connect(osc.frequency);
        vibrato.start(now + 0.1);
        vibrato.stop(now + duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.14);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        break;
      }

      case 'pluck': {
        // Ud / Santur / Lute / Lyre: fast attack, rich harmonic decay
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now);
        filter.frequency.exponentialRampToValueAtTime(450, now + duration);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.85);
        break;
      }

      case 'brass': {
        // Royal Brass / Horn: Sawtooth, warm filter envelope, proud attack
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(700, now + duration);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.16, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        break;
      }

      case 'organ': {
        // Church Organ: Rich polyphony feel with dual harmonizer
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.14, now + 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        break;
      }

      case 'accordion': {
        // French Accordion: Triangle wave + subtle tremolo detune
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.16, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        break;
      }

      case 'bell': {
        // Cathedral / Church Chimes / Celesta: Sine wave + bell transient
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(200, now);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.2);
        break;
      }

      case 'throat': {
        // Steppe throat harmonic portamento glide
        osc.type = 'sawtooth';
        const startPitch = freq * (Math.random() > 0.5 ? 1.06 : 0.94);
        osc.frequency.setValueAtTime(startPitch, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.16);

        filter.type = 'bandpass';
        filter.Q.setValueAtTime(8, now);
        filter.frequency.setValueAtTime(freq * 3, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.16, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        break;
      }

      case 'strings':
      default: {
        // Warm String Solo: Portamento and gentle rise
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1300, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.16, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        break;
      }
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.15);
  }
}

export const culturalAudio = new CulturalAudioEngine();
