import React, { useState, useMemo, useEffect } from 'react';
import { Leader, UserRating, EraKey, GeographicRegion } from '../types';
import { calculateOverallScore, getEffectiveScores } from '../utils/scoring';
import { ERAS } from '../data/leaders';
import { CultureKey } from '../audio/culturalAudioEngine';
import { LeaderCard } from './LeaderCard';
import { ArrowLeft, Filter, Search } from 'lucide-react';

interface CountryPortalViewProps {
  allLeaders: Leader[];
  userRatings: Record<string, UserRating>;
  comparedLeaders: Leader[];
  onToggleCompare: (leader: Leader) => void;
  onSelectLeader: (leader: Leader) => void;
  onSelectCulture: (culture: CultureKey) => void;
  activeCountry?: string | null;
  onChangeCountry?: (key: string | null) => void;
}

interface CountryHubDef {
  key: string;
  name: string;
  shortName: string;
  flag: string;
  culture: CultureKey;
  regions: ('europe' | 'asia' | 'americas' | 'africa')[];
  subtitle: string;
  subCategories: { key: string; label: string }[];
}

const COUNTRY_HUBS: CountryHubDef[] = [
  {
    key: 'turkey',
    name: 'Türkiye & Türk Tarihi',
    shortName: 'Türkiye',
    flag: '🇹🇷',
    culture: 'turkey',
    regions: ['asia', 'europe'],
    subtitle: 'Eski Türkler, Selçuklu, 36 Padişah, İttihatçılar, 13 CB, Başbakanlar ve Partiler',
    subCategories: [
      { key: 'all', label: 'Tüm Türk Tarihi' },
      { key: 'turkic-seljuk', label: 'Eski Türkler & Selçuklu' },
      { key: 'ottoman-sultan', label: 'Osmanlı Padişahları' },
      { key: 'ottoman-late', label: 'İttihatçılar & Son Sadrazamlar' },
      { key: 'tr-president', label: 'Cumhurbaşkanları' },
      { key: 'tr-pm', label: 'Başbakanlar' },
      { key: 'tr-minister', label: 'Cumhuriyet Bakanları' },
      { key: 'tr-party', label: 'Parti Liderleri' },
      { key: 'tr-actor', label: 'Siyasi & Tarihsel Aktörler' },
    ],
  },
  {
    key: 'germany',
    name: 'Almanya',
    shortName: 'Almanya',
    flag: '🇩🇪',
    culture: 'germany',
    regions: ['europe'],
    subtitle: 'Şansölyeler, Prusya ve Güncel Liderler (Merz, Scholz, Weidel...)',
    subCategories: [
      { key: 'all', label: 'Tümü' },
      { key: 'de-chancellor', label: 'Şansölyeler & Hükümdarlar' },
      { key: 'de-party', label: 'Güncel Siyasetçiler' },
    ],
  },
  {
    key: 'france',
    name: 'Fransa',
    shortName: 'Fransa',
    flag: '🇫🇷',
    culture: 'france',
    regions: ['europe'],
    subtitle: 'Napolyon, İhtilal, De Gaulle ve Güncel Siyasetçiler',
    subCategories: [
      { key: 'all', label: 'Tümü' },
      { key: 'fr-leader', label: 'Tarihsel Liderler' },
      { key: 'fr-party', label: 'Güncel Siyasetçiler' },
    ],
  },
  {
    key: 'uk',
    name: 'İngiltere (Birleşik Krallık)',
    shortName: 'İngiltere',
    flag: '🇬🇧',
    culture: 'uk',
    regions: ['europe'],
    subtitle: 'Krallar, Son 25 Yılın Başbakanları ve Güncel Siyasetçiler',
    subCategories: [
      { key: 'all', label: 'Tümü' },
      { key: 'uk-monarch', label: 'Krallar & Kraliçeler' },
      { key: 'uk-pm', label: 'Başbakanlar' },
      { key: 'uk-party', label: 'Güncel Siyasetçiler' },
    ],
  },
  {
    key: 'usa',
    name: 'ABD',
    shortName: 'ABD',
    flag: '🇺🇸',
    culture: 'usa',
    regions: ['americas'],
    subtitle: 'Washington’dan Trump’a Başkanlar ve Kongre Liderleri',
    subCategories: [
      { key: 'all', label: 'Tümü' },
      { key: 'us-president', label: 'ABD Başkanları' },
      { key: 'us-party', label: 'Kongre & Parti Liderleri' },
    ],
  },
  {
    key: 'russia',
    name: 'Rusya & SSCB',
    shortName: 'Rusya & SSCB',
    flag: '🇷🇺',
    culture: 'ussr',
    regions: ['europe', 'asia'],
    subtitle: 'Büyük Petro, Çariçeler (II. Katerina, Yelizaveta), SSCB Liderleri ve Putin',
    subCategories: [
      { key: 'all', label: 'Tümü' },
      { key: 'ussr-leader', label: 'SSCB Dönemi (1917–1991)' },
      { key: 'ru-leader', label: 'Rusya Çarlığı & Federasyonu' },
    ],
  },
  {
    key: 'china',
    name: 'Çin',
    shortName: 'Çin',
    flag: '🇨🇳',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Qin Shi Huang, Taizong, Sun Yat-sen, Mao, Deng Xiaoping, Xi Jinping',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'spain',
    name: 'İspanya',
    shortName: 'İspanya',
    flag: '🇪🇸',
    culture: 'spain',
    regions: ['europe'],
    subtitle: 'İspanya Monarkları ve Önde Gelen Güncel Siyasetçiler',
    subCategories: [
      { key: 'all', label: 'Tümü' },
      { key: 'es-monarch', label: 'Monarklar' },
      { key: 'es-party', label: 'Güncel Siyasetçiler' },
    ],
  },
  {
    key: 'italy',
    name: 'İtalya',
    shortName: 'İtalya',
    flag: '🇮🇹',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Meloni, Schlein, Salvini, Conte, Mario Draghi',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'poland',
    name: 'Polonya',
    shortName: 'Polonya',
    flag: '🇵🇱',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Tusk, Kaczyński, Duda, Trzaskowski, Hołownia',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'belgium',
    name: 'Belçika',
    shortName: 'Belçika',
    flag: '🇧🇪',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'De Wever, De Croo, Magnette, Bouchez, Charles Michel',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'netherlands',
    name: 'Hollanda',
    shortName: 'Hollanda',
    flag: '🇳🇱',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Wilders, Schoof, Rutte, Timmermans, Omtzigt, Yeşilgöz',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'cuba',
    name: 'Küba',
    shortName: 'Küba',
    flag: '🇨🇺',
    culture: 'world',
    regions: ['americas'],
    subtitle: 'José Martí, Fidel Castro, Ernesto "Che" Guevara, Raúl Castro',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'vietnam',
    name: 'Vietnam',
    shortName: 'Vietnam',
    flag: '🇻🇳',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Ho Chi Minh ve General Võ Nguyên Giáp',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'yugoslavia',
    name: 'Yugoslavya / Balkanlar',
    shortName: 'Yugoslavya',
    flag: '🇷🇸',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Josip Broz Tito',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'mongolia',
    name: 'Moğolistan',
    shortName: 'Moğolistan',
    flag: '🇲🇳',
    culture: 'mongolia',
    regions: ['asia'],
    subtitle: 'Cengiz Han ve Kubilay Han',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'egypt',
    name: 'Mısır & Eyyubiler',
    shortName: 'Mısır & Eyyubi',
    flag: '🇪🇬',
    culture: 'world',
    regions: ['asia', 'africa'],
    subtitle: 'Selahaddin Eyyubi ve Cemal Abdünnasır',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'iraq',
    name: 'Irak',
    shortName: 'Irak',
    flag: '🇮🇶',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Saddam Hüseyin',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'iran',
    name: 'İran',
    shortName: 'İran',
    flag: '🇮🇷',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Emir Kebir, Rıza Şah, Pehlevi, Musaddık, Humeyni, Hamaney, Hatemi, Ruhani, Süleymani',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'syria',
    name: 'Suriye',
    shortName: 'Suriye',
    flag: '🇸🇾',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Hafız Esad',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'saudi-arabia',
    name: 'Suudi Arabistan',
    shortName: 'S. Arabistan',
    flag: '🇸🇦',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Kral Faysal bin Abdülaziz',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'palestine',
    name: 'Filistin',
    shortName: 'Filistin',
    flag: '🇵🇸',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Yaser Arafat',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'libya',
    name: 'Libya',
    shortName: 'Libya',
    flag: '🇱🇾',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Muammer Kaddafi',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'burkina-faso',
    name: 'Burkina Faso',
    shortName: 'Burkina Faso',
    flag: '🇧🇫',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Thomas Sankara',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'ghana',
    name: 'Gana',
    shortName: 'Gana',
    flag: '🇬🇭',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Kwame Nkrumah',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'tanzania',
    name: 'Tanzanya',
    shortName: 'Tanzanya',
    flag: '🇹🇿',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Julius Nyerere',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'south-africa',
    name: 'Güney Afrika',
    shortName: 'Güney Afrika',
    flag: '🇿🇦',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Nelson Mandela',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'botswana',
    name: 'Botsvana',
    shortName: 'Botsvana',
    flag: '🇧🇼',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Seretse Khama',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'azerbaijan',
    name: 'Azerbaycan',
    shortName: 'Azerbaycan',
    flag: '🇦🇿',
    culture: 'turkey',
    regions: ['asia', 'europe'],
    subtitle: 'Resulzade, Ebülfez Elçibey, Haydar Aliyev ve İlham Aliyev',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'armenia',
    name: 'Ermenistan',
    shortName: 'Ermenistan',
    flag: '🇦🇲',
    culture: 'world',
    regions: ['asia', 'europe'],
    subtitle: 'Aram Manukyan, Levon Ter-Petrosyan ve Nikol Paşinyan',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'georgia',
    name: 'Gürcistan',
    shortName: 'Gürcistan',
    flag: '🇬🇪',
    culture: 'world',
    regions: ['asia', 'europe'],
    subtitle: 'Gamsakhurdia, Şevardnadze, Saakaşvili, İvanişvili, Zurabişvili',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'greece',
    name: 'Yunanistan',
    shortName: 'Yunanistan',
    flag: '🇬🇷',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Kolokotronis, Kapodistrias, Venizelos, Miçotakis, Çipras, Androulakis',
    subCategories: [
      { key: 'all', label: 'Tümü' },
      { key: 'gr-history', label: 'Bağımsızlık & Tarih' },
      { key: 'gr-current', label: 'Güncel Siyasetçiler' },
    ],
  },
  {
    key: 'serbia',
    name: 'Sırbistan',
    shortName: 'Sırbistan',
    flag: '🇷🇸',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Karayorgi (Karađorđe), Zoran Đinđić, Aleksandar Vučić',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'bosnia',
    name: 'Bosna-Hersek',
    shortName: 'Bosna-Hersek',
    flag: '🇧🇦',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Alija Izetbegović (Bilge Kral) ve Denis Bećirović',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'croatia',
    name: 'Hırvatistan',
    shortName: 'Hırvatistan',
    flag: '🇭🇷',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Franjo Tuđman, Andrej Plenković, Zoran Milanović',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'bulgaria',
    name: 'Bulgaristan',
    shortName: 'Bulgaristan',
    flag: '🇧🇬',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Vasil Levski, Boyko Borisov, Rumen Radev',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'romania',
    name: 'Romanya',
    shortName: 'Romanya',
    flag: '🇷🇴',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Alexandru Ioan Cuza, Çavuşesku, Marcel Ciolacu',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'albania',
    name: 'Arnavutluk',
    shortName: 'Arnavutluk',
    flag: '🇦🇱',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'İskender Bey, İsmail Kemali, Enver Hoca, Edi Rama',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'north-macedonia',
    name: 'Kuzey Makedonya',
    shortName: 'K. Makedonya',
    flag: '🇲🇰',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Kiro Gligorov ve Hristijan Mickoski',
    subCategories: [{ key: 'all', label: 'Tümü' }],
  },
  {
    key: 'islamic',
    name: 'İslam Tarihi & Halifeler',
    shortName: 'İslam Tarihi',
    flag: '☪️',
    culture: 'world',
    regions: ['asia', 'africa', 'europe'],
    subtitle: 'Hulefâ-yi Râşidîn (Dört Halife), Emeviler, Endülüs, Abbasiler ve Büyük Komutanlar',
    subCategories: [
      { key: 'all', label: 'Tümü' },
      { key: 'rashidun', label: 'Dört Halife (Râşidîn)' },
      { key: 'umayyad', label: 'Emeviler & Endülüs' },
      { key: 'abbasid', label: 'Abbasiler' },
      { key: 'islamic-commander', label: 'İslam Komutanları & Memlükler' },
    ],
  },
  {
    key: 'ancient',
    name: 'Antik Roma & Yunan',
    shortName: 'Antik Dünya',
    flag: '🏛️',
    culture: 'ancient',
    regions: ['europe', 'asia', 'africa'],
    subtitle: 'Sezar, Cicero, Mark Antony, Roma İmparatorları, Büyük İskender',
    subCategories: [
      { key: 'all', label: 'Tümü' },
      { key: 'ancient-rome', label: 'Roma' },
      { key: 'ancient-greece', label: 'Yunan & Makedonya' },
    ],
  },
];

// Continents (+ All)
const CONTINENT_OPTIONS: { key: GeographicRegion; label: string }[] = [
  { key: 'all', label: 'Tüm Kıtalar' },
  { key: 'europe', label: 'Avrupa' },
  { key: 'asia', label: 'Asya' },
  { key: 'americas', label: 'Amerika' },
  { key: 'africa', label: 'Afrika' },
];

export const CountryPortalView: React.FC<CountryPortalViewProps> = ({
  allLeaders,
  userRatings,
  comparedLeaders,
  onToggleCompare,
  onSelectLeader,
  onSelectCulture,
  activeCountry: controlledCountry,
  onChangeCountry,
}) => {
  const [internalCountry, setInternalCountry] = useState<string | null>(null);
  const activeCountry = controlledCountry !== undefined ? controlledCountry : internalCountry;
  const setCountry = (key: string | null) => {
    if (onChangeCountry) {
      onChangeCountry(key);
    } else {
      setInternalCountry(key);
    }
  };

  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<EraKey>('all');
  const [selectedRegion, setSelectedRegion] = useState<GeographicRegion>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'overall' | 'chronological' | 'military' | 'economy' | 'societal' | 'diplomacy' | 'leadership'
  >('overall');

  useEffect(() => {
    setActiveSubCategory('all');
    setSelectedEra('all');
    setSearchQuery('');
  }, [activeCountry]);

  const currentHub = COUNTRY_HUBS.find((h) => h.key === activeCountry) || null;

  const handleSelectCountry = (hub: CountryHubDef) => {
    setCountry(hub.key);
    setActiveSubCategory('all');
    setSelectedEra('all');
    onSelectCulture(hub.culture);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPortals = () => {
    setCountry(null);
    setActiveSubCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleHubs = useMemo(() => {
    if (selectedRegion === 'all') return COUNTRY_HUBS;
    return COUNTRY_HUBS.filter((hub) => hub.regions.includes(selectedRegion));
  }, [selectedRegion]);

  const filteredLeaders = useMemo(() => {
    return allLeaders.filter((leader) => {
      if (activeCountry && leader.category !== activeCountry) {
        return false;
      }

      if (activeSubCategory !== 'all' && leader.subCategory !== activeSubCategory) {
        return false;
      }

      if (!activeCountry && selectedRegion !== 'all') {
        const matchesRegionsArray = leader.regions?.includes(selectedRegion);
        const matchesPrimaryRegion = leader.region === selectedRegion;
        if (!matchesRegionsArray && !matchesPrimaryRegion) {
          return false;
        }
      }

      if (selectedEra !== 'all') {
        if (selectedEra === 'early-medieval') {
          const centuries = ['5. yy', '6. yy', '7. yy', '8. yy', '9. yy', '10. yy'];
          const matchesCentury = centuries.some((c) => leader.century.includes(c));
          if (!matchesCentury && leader.era !== 'early-medieval') {
            return false;
          }
        } else if (leader.era !== selectedEra) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${leader.name} ${leader.originalName || ''} ${leader.title} ${leader.country} ${leader.century}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [allLeaders, activeCountry, activeSubCategory, selectedEra, selectedRegion, searchQuery]);

  const sortedLeaders = useMemo(() => {
    return [...filteredLeaders].sort((a, b) => {
      const scoresA = getEffectiveScores(a, userRatings);
      const scoresB = getEffectiveScores(b, userRatings);

      if (sortBy === 'chronological') {
        return (a.yearsActive || '').localeCompare(b.yearsActive || '');
      }
      if (sortBy === 'overall') {
        return calculateOverallScore(scoresB) - calculateOverallScore(scoresA);
      }
      return scoresB[sortBy] - scoresA[sortBy];
    });
  }, [filteredLeaders, userRatings, sortBy]);

  const hubCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const hub of COUNTRY_HUBS) {
      counts[hub.key] = allLeaders.filter((l) => l.category === hub.key).length;
    }
    return counts;
  }, [allLeaders]);

  const comparedIdSet = useMemo(
    () => new Set(comparedLeaders.map((c) => c.id)),
    [comparedLeaders]
  );

  return (
    <div className="space-y-8">
      {/* MODE 1: COUNTRY DIRECTORY */}
      {!activeCountry && (
        <div className="space-y-6">
          {/* Clean Intro Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-800/70 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight">
                Ülkeler & Tarihsel Liderler
              </h1>
              <p className="text-sm text-stone-400 mt-1">
                Kıta, ülke veya dönem seçerek doğrudan ilgili liderlerin sıralamasına odaklanın.
              </p>
            </div>
            <div className="text-xs text-stone-400 font-mono shrink-0">
              {allLeaders.length} Lider · {COUNTRY_HUBS.length} Bölüm
            </div>
          </div>

          {/* Clean Compact Filter Bar: Continent (Europe/Asia/Americas only) + Era */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
            {/* Continents */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-xs text-stone-500 mr-1 shrink-0">Kıta:</span>
              {CONTINENT_OPTIONS.map((reg) => (
                <button
                  key={reg.key}
                  onClick={() => setSelectedRegion(reg.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedRegion === reg.key
                      ? 'bg-amber-500 text-stone-950 font-semibold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>

            {/* Era Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 shrink-0">Dönem:</span>
              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value as EraKey)}
                className="px-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
              >
                {ERAS.map((era) => (
                  <option key={era.key} value={era.key}>
                    {era.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="overall">En Yüksek Puan</option>
                <option value="chronological">Kronolojik</option>
                <option value="military">Askeri</option>
                <option value="economy">Ekonomi</option>
                <option value="societal">Toplum & Hukuk</option>
                <option value="diplomacy">Diplomasi</option>
                <option value="leadership">Liderlik</option>
              </select>
            </div>
          </div>

          {/* Compact Country Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            {visibleHubs.map((hub) => {
              const count = hubCounts[hub.key] || 0;
              return (
                <button
                  key={hub.key}
                  type="button"
                  onClick={() => handleSelectCountry(hub)}
                  title={hub.subtitle}
                  className="group text-left px-3.5 py-2.5 rounded-xl bg-stone-900/60 border border-stone-800/80 hover:border-amber-500/50 hover:bg-stone-900 transition-colors flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0">{hub.flag}</span>
                    <span className="text-xs font-semibold text-stone-100 group-hover:text-amber-400 transition-colors truncate">
                      {hub.shortName}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 group-hover:text-stone-300 shrink-0 tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: FOCUSED COUNTRY VIEW */}
      {activeCountry && currentHub && (
        <div className="space-y-5">
          {/* Top-left High-Contrast Back Button + Breadcrumb */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToPortals}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-extrabold rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20 transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.75]" />
                <span>Geri Dön · Tüm Ülkeler</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
                <button
                  type="button"
                  onClick={handleBackToPortals}
                  className="hover:text-amber-400 transition-colors"
                >
                  Ülkeler
                </button>
                <span className="text-stone-600">/</span>
                <span className="text-stone-200 font-medium">
                  {currentHub.flag} {currentHub.shortName}
                </span>
              </div>
            </div>

            <select
              value={activeCountry}
              onChange={(e) => {
                const target = COUNTRY_HUBS.find((h) => h.key === e.target.value);
                if (target) handleSelectCountry(target);
              }}
              className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              {COUNTRY_HUBS.map((h) => (
                <option key={h.key} value={h.key}>
                  {h.flag} {h.shortName} ({hubCounts[h.key] || 0})
                </option>
              ))}
            </select>
          </div>

          <div className="p-5 rounded-xl bg-stone-900/70 border border-stone-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentHub.flag}</span>
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                    {currentHub.name}
                  </h1>
                  <p className="text-xs text-stone-400 mt-0.5">{currentHub.subtitle}</p>
                </div>
              </div>
            </div>

            {currentHub.subCategories.length > 1 && (
              <div className="flex items-center gap-5 border-t border-stone-800/80 mt-4 pt-3 overflow-x-auto no-scrollbar text-xs font-medium">
                {currentHub.subCategories.map((sub) => {
                  const isSelected = activeSubCategory === sub.key;
                  const count = allLeaders.filter((l) => {
                    if (l.category !== currentHub.key) return false;
                    if (sub.key === 'all') return true;
                    return l.subCategory === sub.key;
                  }).length;

                  return (
                    <button
                      key={sub.key}
                      onClick={() => setActiveSubCategory(sub.key)}
                      className={`whitespace-nowrap pb-1.5 transition-colors ${
                        isSelected
                          ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {sub.label} ({count})
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`${currentHub.shortName} içinde ara...`}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value as EraKey)}
                className="bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none"
              >
                {ERAS.map((e) => (
                  <option key={e.key} value={e.key}>
                    {e.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none"
              >
                <option value="overall">Genel Puan</option>
                <option value="chronological">Kronolojik</option>
                <option value="military">Askeri</option>
                <option value="economy">Ekonomi</option>
                <option value="societal">Toplum & Hukuk</option>
                <option value="diplomacy">Diplomasi</option>
                <option value="leadership">Liderlik</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* LEADER LISTING */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>
            <strong className="text-stone-200">{sortedLeaders.length}</strong> Lider Listeleniyor
            {activeCountry && currentHub ? ` · ${currentHub.name}` : ''}
          </span>
        </div>

        {sortedLeaders.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-stone-900/40 border border-stone-800 text-stone-400 space-y-3">
            <Filter className="w-7 h-7 text-stone-600 mx-auto" />
            <p className="text-sm">Seçilen kriterlere uygun lider bulunamadı.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedEra('all');
                setActiveSubCategory('all');
                setSelectedRegion('all');
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedLeaders.map((leader) => (
              <LeaderCard
                key={leader.id}
                leader={leader}
                userRating={userRatings[leader.id]}
                isCompared={comparedIdSet.has(leader.id)}
                onToggleCompare={onToggleCompare}
                onSelect={onSelectLeader}
              />
            ))}
          </div>
        )}

        {activeCountry && (
          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={handleBackToPortals}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-500/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Tüm Ülkelere Geri Dön</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
