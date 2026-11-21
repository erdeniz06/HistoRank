import React, { useState, useMemo, useEffect } from 'react';
import { Leader, LeaderboardScope, UserRating, EraKey, GeographicRegion } from '../types';
import {
  calculateOverallScore,
  getEffectiveScores,
  getLeaderPopularityScore,
  getTierForScore,
  matchesLeaderboardScope,
} from '../utils/scoring';
import { ERAS } from '../data/leaders';
import { CultureKey } from '../audio/culturalAudioEngine';
import { LeaderCard } from './LeaderCard';
import { ArrowLeft, ChevronRight, Filter, Search } from 'lucide-react';

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
    key: 'usa',
    name: 'United States',
    shortName: 'USA',
    flag: '🇺🇸',
    culture: 'usa',
    regions: ['americas'],
    subtitle: 'Washington, Lincoln, FDR, Kennedy, Kissinger, Marshall, Hillary Clinton, Colin Powell, Jerome Powell, McCain, Sanders, JD Vance, Rubio',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'us-president', label: 'US Presidents' },
      { key: 'us-party', label: 'Cabinet, Congress, Judiciary, Governors & Opposition' },
    ],
  },
  {
    key: 'uk',
    name: 'United Kingdom',
    shortName: 'UK',
    flag: '🇬🇧',
    culture: 'uk',
    regions: ['europe'],
    subtitle: 'Monarchs, Churchill, Thatcher, Attlee, Chamberlain, Bevan, Bevin, Cook, Pankhurst, Wilberforce, Osborne, Starmer, Sunak, Farage',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'uk-monarch', label: 'Kings, Queens & Commanders' },
      { key: 'uk-pm', label: 'Prime Ministers' },
      { key: 'uk-party', label: 'Cabinet Ministers, Opposition & Reformers' },
    ],
  },
  {
    key: 'germany',
    name: 'Germany',
    shortName: 'Germany',
    flag: '🇩🇪',
    culture: 'germany',
    regions: ['europe'],
    subtitle: 'Frederick the Great, Bismarck, Adenauer, Brandt, Schmidt, Merkel, Schäuble, Genscher, Von der Leyen, Steinmeier, Weizsäcker, Cem Özdemir, Scholl',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'de-chancellor', label: 'Chancellors, Presidents & Monarchs' },
      { key: 'de-thinker', label: 'Marxists, SPD Pioneers, Resistance & Brecht' },
      { key: 'de-party', label: 'Cabinet Ministers, State & Opposition Leaders' },
    ],
  },
  {
    key: 'france',
    name: 'France',
    shortName: 'France',
    flag: '🇫🇷',
    culture: 'france',
    regions: ['europe'],
    subtitle: 'Clovis, Charlemagne, Joan of Arc, Louis XIV, Louis XVI, Marie Antoinette, Napoleon I/II/III, De Gaulle, Mitterrand, Macron, Le Pen',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'fr-leader', label: 'Kings, Queens, Emperors & Presidents' },
      { key: 'fr-party', label: 'Contemporary & Opposition Politicians' },
    ],
  },
  {
    key: 'russia',
    name: 'Russia & USSR',
    shortName: 'Russia & USSR',
    flag: '🇷🇺',
    culture: 'ussr',
    regions: ['europe', 'asia'],
    subtitle: 'Nevsky, Ivan the Terrible, Peter the Great, Catherine the Great, Kutuzov, Alexander II, Lenin, Trotsky, Stalin, Zhukov, Gorbachev, Putin, Navalny',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'ussr-leader', label: 'Soviet Era (1917–1991)' },
      { key: 'ru-leader', label: 'Tsardom, Empire & Federation' },
    ],
  },
  {
    key: 'china',
    name: 'China',
    shortName: 'China',
    flag: '🇨🇳',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Qin Shi Huang, Han Wudi, Taizong, Wu Zetian, Zheng He, Hongwu, Kangxi, Qianlong, Sun Yat-sen, Mao, Deng, Xi Jinping',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'japan',
    name: 'Japan',
    shortName: 'Japan',
    flag: '🇯🇵',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Minamoto, Nobunaga, Tokugawa, Emperor Meiji, Itō, Saigō, Ryōma, Admiral Tōgō, Hirohito, Yoshida, Koizumi, Shinzo Abe',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'jp-meiji', label: 'Shogunate & Meiji Reforms' },
      { key: 'jp-modern', label: '20th c. – Modern Prime Ministers' },
    ],
  },
  {
    key: 'india',
    name: 'India',
    shortName: 'India',
    flag: '🇮🇳',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Chandragupta, Ashoka the Great, Akbar, Aurangzeb, Shivaji, Gandhi, Ambedkar, Patel, Nehru, Indira Gandhi, Manmohan Singh, Modi',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'italy',
    name: 'Italy',
    shortName: 'Italy',
    flag: '🇮🇹',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Medici, Machiavelli, Cavour, Garibaldi, Mazzini, Mussolini, De Gasperi, Gramsci, Berlinguer, Aldo Moro, Draghi, Meloni',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'spain',
    name: 'Spain',
    shortName: 'Spain',
    flag: '🇪🇸',
    culture: 'spain',
    regions: ['europe'],
    subtitle: 'El Cid, Isabella & Ferdinand, Charles V, Philip II & V, Azaña, Franco, Adolfo Suárez, Felipe González, Pedro Sánchez',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'es-monarch', label: 'Monarchs & Historical Commanders' },
      { key: 'es-party', label: 'Republic, Dictatorship & Modern Politics' },
    ],
  },
  {
    key: 'ukraine',
    name: 'Ukraine',
    shortName: 'Ukraine',
    flag: '🇺🇦',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Volodymyr the Great, Bohdan Khmelnytsky, Kuchma, Tymoshenko, Poroshenko, and Volodymyr Zelenskyy',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'brazil',
    name: 'Brazil',
    shortName: 'Brazil',
    flag: '🇧🇷',
    culture: 'world',
    regions: ['americas'],
    subtitle: 'Pedro I & II, Getúlio Vargas, Kubitschek, Cardoso, Dilma Rousseff, Bolsonaro, and Lula da Silva',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'ancient',
    name: 'Ancient Rome & Greece',
    shortName: 'Ancient World',
    flag: '🏛️',
    culture: 'ancient',
    regions: ['europe', 'asia', 'africa'],
    subtitle: 'Caesar, Augustus, Trajan, Constantine, Theodosius I, Antoninus Pius, Aurelian, Heraclius, Alexander the Great',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'ancient-rome', label: 'Rome & Eastern Rome' },
      { key: 'ancient-greece', label: 'Greece & Macedonia' },
    ],
  },
  {
    key: 'christianity',
    name: 'Christian History & Church Leaders',
    shortName: 'Christian History',
    flag: '✝️',
    culture: 'europe',
    regions: ['europe', 'asia', 'africa'],
    subtitle: 'St. Paul, St. Augustine, St. Benedict, Thomas Aquinas, St. Francis, Popes, Martin Luther, John Calvin',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'christian-thinker', label: 'Saints, Theologians & Reformers' },
      { key: 'christian-pope', label: 'Popes & Ecclesiastical Rulers' },
    ],
  },
  {
    key: 'islamic',
    name: 'Islamic History & Caliphs',
    shortName: 'Islamic History',
    flag: '☪️',
    culture: 'world',
    regions: ['asia', 'africa', 'europe'],
    subtitle: 'Rashidun Caliphate (4+1 Caliphs), Umayyads, Al-Andalus, Abbasids & Commanders',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'rashidun', label: 'Rashidun Caliphs & Hejaz' },
      { key: 'umayyad', label: 'Umayyads & Al-Andalus' },
      { key: 'abbasid', label: 'Abbasids' },
      { key: 'islamic-commander', label: 'Islamic Commanders & Mamluks' },
    ],
  },
  {
    key: 'turkey',
    name: 'Turkey & Turkic History',
    shortName: 'Turkey',
    flag: '🇹🇷',
    culture: 'turkey',
    regions: ['asia', 'europe'],
    subtitle: 'Ancient Turks, Seljuks, Ottoman Sultans & Admirals, Independence Pashas (Karabekir, Cebesoy, Rauf, Refet, Fevzi Çakmak), Presidents & PMs',
    subCategories: [
      { key: 'all', label: 'All Turkish History' },
      { key: 'turkic-seljuk', label: 'Ancient Turks & Seljuks' },
      { key: 'ottoman-sultan', label: 'Ottoman Sultans' },
      { key: 'ottoman-commander', label: 'Ottoman Commanders & Admirals' },
      { key: 'ottoman-late', label: 'CUP & Late Grand Viziers' },
      { key: 'tr-president', label: 'Presidents' },
      { key: 'tr-pm', label: 'Prime Ministers' },
      { key: 'tr-minister', label: 'Republican Ministers' },
      { key: 'tr-party', label: 'Party Leaders' },
      { key: 'tr-actor', label: 'Commanders, Pashas & Historical Actors' },
    ],
  },
  {
    key: 'poland',
    name: 'Poland',
    shortName: 'Poland',
    flag: '🇵🇱',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Casimir the Great, King Sobieski, Marshal Piłsudski, Lech Wałęsa, Tusk, Kaczyński, Duda, Trzaskowski',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'belgium',
    name: 'Belgium',
    shortName: 'Belgium',
    flag: '🇧🇪',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'De Wever, De Croo, Magnette, Bouchez, Charles Michel',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'netherlands',
    name: 'Netherlands',
    shortName: 'Netherlands',
    flag: '🇳🇱',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'William the Silent, Johan de Witt, Thorbecke, Rutte, Wilders, Schoof, Timmermans, Yeşilgöz',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'cuba',
    name: 'Cuba',
    shortName: 'Cuba',
    flag: '🇨🇺',
    culture: 'world',
    regions: ['americas'],
    subtitle: 'José Martí, Fidel Castro, Ernesto "Che" Guevara, Raúl Castro',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'vietnam',
    name: 'Vietnam',
    shortName: 'Vietnam',
    flag: '🇻🇳',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Ho Chi Minh and General Võ Nguyên Giáp',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'north-korea',
    name: 'North Korea',
    shortName: 'North Korea',
    flag: '🇰🇵',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Kim Il-sung, Kim Jong-il & Kim Jong-un (Three Generations of the Kim Dynasty)',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'cambodia',
    name: 'Cambodia',
    shortName: 'Cambodia',
    flag: '🇰🇭',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Pol Pot (Khmer Rouge & the Killing Fields)',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'yugoslavia',
    name: 'Yugoslavia / Balkans',
    shortName: 'Yugoslavia',
    flag: '🇷🇸',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Josip Broz Tito',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'mongolia',
    name: 'Mongolia',
    shortName: 'Mongolia',
    flag: '🇲🇳',
    culture: 'mongolia',
    regions: ['asia'],
    subtitle: 'Genghis Khan and Kublai Khan',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'egypt',
    name: 'Egypt (Pharaohs, Ayyubids & Modern)',
    shortName: 'Egypt & Pharaohs',
    flag: '🇪🇬',
    culture: 'world',
    regions: ['africa', 'asia'],
    subtitle: 'Narmer, Khufu, Hatshepsut, Thutmose III, Ramesses II, Cleopatra, Saladin, Muhammad Ali, Nasser',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'eg-pharaoh', label: 'Ancient Egyptian Pharaohs' },
      { key: 'eg-leader', label: 'Ayyubids & Modern Egypt' },
    ],
  },
  {
    key: 'iraq',
    name: 'Iraq',
    shortName: 'Iraq',
    flag: '🇮🇶',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Saddam Hussein',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'iran',
    name: 'Iran',
    shortName: 'Iran',
    flag: '🇮🇷',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Amir Kabir, Pahlavis, Mosaddegh, Khomeini, Khamenei, Soleimani, Bagheri, Salami, Hajizadeh, Zahedi, Shirazi, Chamran',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'me-leader', label: 'Shahs & Political Leaders' },
      { key: 'ir-commander', label: 'Iranian Commanders' },
    ],
  },
  {
    key: 'syria',
    name: 'Syria',
    shortName: 'Syria',
    flag: '🇸🇾',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Shukri al-Quwatli, Hafez al-Assad, and Bashar al-Assad',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'saudi-arabia',
    name: 'Saudi Arabia',
    shortName: 'Saudi Arabia',
    flag: '🇸🇦',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'King Faisal bin Abdulaziz',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'palestine',
    name: 'Palestine',
    shortName: 'Palestine',
    flag: '🇵🇸',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Yasser Arafat, Sheikh Ahmed Yassin, Rantisi, Khaled Mashal, Ismail Haniyeh, Yahya Sinwar, Mohammed Deif',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'me-leader', label: 'PLO & Palestinian Authority' },
      { key: 'ps-hamas', label: 'Hamas Leaders' },
    ],
  },
  {
    key: 'israel',
    name: 'Israel',
    shortName: 'Israel',
    flag: '🇮🇱',
    culture: 'world',
    regions: ['asia'],
    subtitle: 'Ben-Gurion, Golda Meir, Begin, Rabin, Peres, Sharon, Netanyahu, Lapid, Gantz',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'libya',
    name: 'Libya',
    shortName: 'Libya',
    flag: '🇱🇾',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Muammar Gaddafi',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'burkina-faso',
    name: 'Burkina Faso',
    shortName: 'Burkina Faso',
    flag: '🇧🇫',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Thomas Sankara',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'ghana',
    name: 'Ghana',
    shortName: 'Ghana',
    flag: '🇬🇭',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Kwame Nkrumah',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'tanzania',
    name: 'Tanzania',
    shortName: 'Tanzania',
    flag: '🇹🇿',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Julius Nyerere',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'south-africa',
    name: 'South Africa',
    shortName: 'South Africa',
    flag: '🇿🇦',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Nelson Mandela',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'botswana',
    name: 'Botswana',
    shortName: 'Botswana',
    flag: '🇧🇼',
    culture: 'world',
    regions: ['africa'],
    subtitle: 'Seretse Khama',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'azerbaijan',
    name: 'Azerbaijan',
    shortName: 'Azerbaijan',
    flag: '🇦🇿',
    culture: 'turkey',
    regions: ['asia', 'europe'],
    subtitle: 'Rasulzade, Abulfaz Elchibey, Heydar Aliyev, and Ilham Aliyev',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'armenia',
    name: 'Armenia',
    shortName: 'Armenia',
    flag: '🇦🇲',
    culture: 'world',
    regions: ['asia', 'europe'],
    subtitle: 'Aram Manukian, Levon Ter-Petrosyan, and Nikol Pashinyan',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'georgia',
    name: 'Georgia',
    shortName: 'Georgia',
    flag: '🇬🇪',
    culture: 'world',
    regions: ['asia', 'europe'],
    subtitle: 'Gamsakhurdia, Shevardnadze, Saakashvili, Ivanishvili, Zourabichvili',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'greece',
    name: 'Greece',
    shortName: 'Greece',
    flag: '🇬🇷',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Kolokotronis, Kapodistrias, Venizelos, Mitsotakis, Tsipras, Androulakis',
    subCategories: [
      { key: 'all', label: 'All' },
      { key: 'gr-history', label: 'Independence & History' },
      { key: 'gr-current', label: 'Contemporary Politicians' },
    ],
  },
  {
    key: 'serbia',
    name: 'Serbia',
    shortName: 'Serbia',
    flag: '🇷🇸',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Karađorđe, Zoran Đinđić, Aleksandar Vučić',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'bosnia',
    name: 'Bosnia & Herzegovina',
    shortName: 'Bosnia',
    flag: '🇧🇦',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Alija Izetbegović and Denis Bećirović',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'croatia',
    name: 'Croatia',
    shortName: 'Croatia',
    flag: '🇭🇷',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Franjo Tuđman, Andrej Plenković, Zoran Milanović',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'bulgaria',
    name: 'Bulgaria',
    shortName: 'Bulgaria',
    flag: '🇧🇬',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Vasil Levski, Boyko Borisov, Rumen Radev',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'romania',
    name: 'Romania',
    shortName: 'Romania',
    flag: '🇷🇴',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Alexandru Ioan Cuza, Ceaușescu, Marcel Ciolacu',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'albania',
    name: 'Albania',
    shortName: 'Albania',
    flag: '🇦🇱',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Skanderbeg, Ismail Qemali, Enver Hoxha, Edi Rama',
    subCategories: [{ key: 'all', label: 'All' }],
  },
  {
    key: 'north-macedonia',
    name: 'North Macedonia',
    shortName: 'N. Macedonia',
    flag: '🇲🇰',
    culture: 'europe',
    regions: ['europe'],
    subtitle: 'Kiro Gligorov and Hristijan Mickoski',
    subCategories: [{ key: 'all', label: 'All' }],
  },
];

// Continents (+ All)
const CONTINENT_OPTIONS: { key: GeographicRegion; label: string }[] = [
  { key: 'all', label: 'All Continents' },
  { key: 'europe', label: 'Europe' },
  { key: 'asia', label: 'Asia' },
  { key: 'americas', label: 'Americas' },
  { key: 'africa', label: 'Africa' },
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
  const [scope, setScope] = useState<LeaderboardScope>('famous-rulers');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'overall' | 'popularity' | 'chronological' | 'military' | 'economy' | 'societal' | 'diplomacy' | 'leadership'
  >('overall');

  useEffect(() => {
    setActiveSubCategory('all');
    setSelectedEra('all');
    setSearchQuery('');
  }, [activeCountry]);

  const currentHub = COUNTRY_HUBS.find((h) => h.key === activeCountry) || null;

  const handleSelectCountry = (hub: CountryHubDef) => {
    const hasMatchInCurrentScope = allLeaders.some(
      (l) => l.category === hub.key && matchesLeaderboardScope(l, scope)
    );
    if (!hasMatchInCurrentScope && scope === 'famous-rulers') {
      const hasLesser = allLeaders.some(
        (l) => l.category === hub.key && matchesLeaderboardScope(l, 'lesser-known-rulers')
      );
      if (hasLesser) {
        setScope('lesser-known-rulers');
      }
    }
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
    const byRegion =
      selectedRegion === 'all'
        ? COUNTRY_HUBS
        : COUNTRY_HUBS.filter((hub) => hub.regions.includes(selectedRegion));
    if (!searchQuery.trim() || activeCountry) return byRegion;
    const q = searchQuery.trim().toLowerCase();
    return byRegion.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.shortName.toLowerCase().includes(q) ||
        h.subtitle.toLowerCase().includes(q)
    );
  }, [selectedRegion, searchQuery, activeCountry]);

  // Precompute top ranked leaders per country under the active scope (for Directory ranking cards)
  const countryDirectoryData = useMemo(() => {
    const map: Record<
      string,
      { topLeaders: Leader[]; scopedCount: number; famousCount: number; lesserCount: number; allCount: number }
    > = {};

    for (const hub of COUNTRY_HUBS) {
      const inCountry = allLeaders.filter((l) => l.category === hub.key);
      const famousCount = inCountry.filter((l) => matchesLeaderboardScope(l, 'famous-rulers')).length;
      const lesserCount = inCountry.filter((l) => matchesLeaderboardScope(l, 'lesser-known-rulers')).length;
      const scoped = inCountry
        .filter((l) => matchesLeaderboardScope(l, scope))
        .sort((a, b) => {
          const sa = calculateOverallScore(getEffectiveScores(a, userRatings));
          const sb = calculateOverallScore(getEffectiveScores(b, userRatings));
          if (sb !== sa) return sb - sa;
          return getLeaderPopularityScore(b) - getLeaderPopularityScore(a);
        });

      map[hub.key] = {
        topLeaders: scoped.slice(0, 3),
        scopedCount: scoped.length,
        famousCount,
        lesserCount,
        allCount: inCountry.length,
      };
    }

    return map;
  }, [allLeaders, scope, userRatings]);

  // Base filtered list in focused Country view BEFORE scope split (so tab counts remain accurate)
  const baseCountryLeaders = useMemo(() => {
    if (!activeCountry) return [];
    return allLeaders.filter((leader) => {
      if (leader.category !== activeCountry) return false;

      if (activeSubCategory !== 'all' && leader.subCategory !== activeSubCategory) {
        return false;
      }

      if (selectedEra !== 'all') {
        if (selectedEra === 'early-medieval') {
          const centuries = ['5th c.', '6th c.', '7th c.', '8th c.', '9th c.', '10th c.', '5. yy', '6. yy', '7. yy', '8. yy', '9. yy', '10. yy'];
          const matchesCentury = centuries.some((c) => leader.century.includes(c));
          if (!matchesCentury && leader.era !== 'early-medieval') {
            return false;
          }
        } else if (leader.era !== selectedEra) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const norm = (s: string) =>
          s
            .toLowerCase()
            .replace(/[ş]/g, 's')
            .replace(/[ç]/g, 'c')
            .replace(/[ğ]/g, 'g')
            .replace(/[ıİ]/g, 'i')
            .replace(/[ö]/g, 'o')
            .replace(/[ü]/g, 'u')
            .replace(/[äáàâ]/g, 'a')
            .replace(/[éèê]/g, 'e');
        const q = norm(searchQuery.trim());
        const text = norm(`${leader.name} ${leader.originalName || ''} ${leader.title} ${leader.country} ${leader.century}`);
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [allLeaders, activeCountry, activeSubCategory, selectedEra, searchQuery]);

  const scopeCounts = useMemo(() => {
    let famous = 0;
    let lesser = 0;
    for (const l of baseCountryLeaders) {
      if (matchesLeaderboardScope(l, 'famous-rulers')) famous++;
      else if (matchesLeaderboardScope(l, 'lesser-known-rulers')) lesser++;
    }
    return { famous, lesser, all: baseCountryLeaders.length };
  }, [baseCountryLeaders]);

  const sortedLeaders = useMemo(() => {
    const scoped = baseCountryLeaders.filter((l) => matchesLeaderboardScope(l, scope));
    return [...scoped].sort((a, b) => {
      const scoresA = getEffectiveScores(a, userRatings);
      const scoresB = getEffectiveScores(b, userRatings);

      if (sortBy === 'popularity') {
        const diff = getLeaderPopularityScore(b) - getLeaderPopularityScore(a);
        if (diff !== 0) return diff;
        return calculateOverallScore(scoresB) - calculateOverallScore(scoresA);
      }
      if (sortBy === 'chronological') {
        return (a.yearsActive || '').localeCompare(b.yearsActive || '');
      }
      if (sortBy === 'overall') {
        const diff = calculateOverallScore(scoresB) - calculateOverallScore(scoresA);
        if (diff !== 0) return diff;
        return getLeaderPopularityScore(b) - getLeaderPopularityScore(a);
      }
      return scoresB[sortBy] - scoresA[sortBy];
    });
  }, [baseCountryLeaders, scope, userRatings, sortBy]);

  const comparedIdSet = useMemo(
    () => new Set(comparedLeaders.map((c) => c.id)),
    [comparedLeaders]
  );

  return (
    <div className="space-y-8">
      {/* MODE 1: RANKINGS BY COUNTRY (PRIMARY DIRECTORY WITH FLAGS) */}
      {!activeCountry && (
        <div className="space-y-6">
          {/* Clean Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-800/70 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight">
                Rankings by Country
              </h1>
              <p className="text-sm text-stone-400 mt-1">
                Explore each nation’s ranked historical leaders with flags. Rulers are divided into Famous vs. Lesser-Known; non-rulers only appear in All (Everyone).
              </p>
            </div>
            <div className="text-xs text-stone-400 font-mono shrink-0">
              {COUNTRY_HUBS.length} Countries & Eras · {allLeaders.length} Figures
            </div>
          </div>

          {/* Single Clean Control Bar: Scope + Continents + Country Search */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* 3-Tab Scope Selector */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-900 rounded-xl border border-stone-800 text-xs">
                <button
                  type="button"
                  onClick={() => setScope('famous-rulers')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    scope === 'famous-rulers'
                      ? 'bg-amber-500 text-stone-950 font-semibold'
                      : 'text-stone-300 hover:text-amber-300'
                  }`}
                >
                  ⭐ Famous Rulers
                </button>
                <button
                  type="button"
                  onClick={() => setScope('lesser-known-rulers')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    scope === 'lesser-known-rulers'
                      ? 'bg-emerald-500 text-stone-950 font-semibold'
                      : 'text-stone-300 hover:text-emerald-300'
                  }`}
                >
                  🏛️ Lesser-Known Rulers
                </button>
                <button
                  type="button"
                  onClick={() => setScope('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    scope === 'all'
                      ? 'bg-sky-500 text-stone-950 font-semibold'
                      : 'text-stone-300 hover:text-sky-300'
                  }`}
                >
                  🌐 All (Everyone)
                </button>
              </div>

              {/* Filter Countries Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find country (USA, Turkey, France...)"
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Continents */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs text-stone-500 mr-1 shrink-0">Continent:</span>
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
          </div>

          {/* Country Ranking Cards with Flags & Top 3 Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleHubs.map((hub) => {
              const data = countryDirectoryData[hub.key];
              const top = data?.topLeaders || [];

              return (
                <button
                  key={hub.key}
                  type="button"
                  onClick={() => handleSelectCountry(hub)}
                  className="group text-left p-4 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/60 hover:bg-stone-900 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    {/* Flag & Country Title Row */}
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-3xl shrink-0" aria-hidden="true">{hub.flag}</span>
                        <div className="min-w-0">
                          <h2 className="text-sm font-bold text-stone-100 group-hover:text-amber-400 transition-colors truncate">
                            {hub.name}
                          </h2>
                          <span className="text-[11px] text-stone-400 block">
                            {data?.famousCount || 0} Famous · {data?.lesserCount || 0} Lesser-Known
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 shrink-0 transition-colors" />
                    </div>

                    {/* Top 3 Ranked Preview inside Card */}
                    <div className="mt-3 space-y-1.5">
                      {top.length === 0 ? (
                        <div className="text-[11px] text-stone-500 italic py-2">
                          0 figures in this filter — click to inspect national rulers
                        </div>
                      ) : (
                        top.map((leader, idx) => {
                          const score = calculateOverallScore(getEffectiveScores(leader, userRatings));
                          const tier = getTierForScore(score);
                          return (
                            <div
                              key={leader.id}
                              className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-stone-950/70 border border-stone-800/60 text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`font-mono font-bold text-[11px] w-4 shrink-0 ${
                                    idx === 0
                                      ? 'text-amber-400'
                                      : idx === 1
                                      ? 'text-stone-300'
                                      : 'text-amber-700'
                                  }`}
                                >
                                  #{idx + 1}
                                </span>
                                <span className="text-sm shrink-0" aria-hidden="true">{leader.flag}</span>
                                <span className="text-stone-200 font-medium truncate">
                                  {leader.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span
                                  className="text-[10px] font-extrabold px-1.5 py-0.5 rounded border"
                                  style={{
                                    color: tier.color,
                                    backgroundColor: tier.bgColor,
                                    borderColor: tier.borderColor,
                                  }}
                                >
                                  {tier.tier}
                                </span>
                                <span className="font-mono font-bold text-stone-200 tabular-nums w-6 text-right">
                                  {score}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] font-medium text-stone-400 group-hover:text-amber-400 transition-colors flex items-center justify-between pt-1">
                    <span>Open Full Ranking</span>
                    <span className="font-mono text-stone-500">{data?.scopedCount || 0} shown</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: FOCUSED COUNTRY RANKING VIEW */}
      {activeCountry && currentHub && (
        <div className="space-y-5">
          {/* Top Back Button + Country Switcher with Flags */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToPortals}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-extrabold rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/20 transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.75]" />
                <span>All Countries</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
                <span>/</span>
                <span className="text-stone-200 font-semibold">
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
                  {h.flag} {h.name} ({countryDirectoryData[h.key]?.allCount || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Country Flag Banner + Optional Subcategories */}
          <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800">
            <div className="flex items-center gap-4">
              <span className="text-4xl sm:text-5xl shrink-0" aria-hidden="true">{currentHub.flag}</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
                  {currentHub.name} — Historical Ranking
                </h1>
                <p className="text-xs text-stone-400 mt-0.5">{currentHub.subtitle}</p>
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

          {/* Clean 3-Tab Scope Selector + Search/Era/Sort */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-900 rounded-xl border border-stone-800 text-xs w-fit">
              <button
                type="button"
                onClick={() => setScope('famous-rulers')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  scope === 'famous-rulers'
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:text-amber-300'
                }`}
              >
                ⭐ Famous Rulers ({scopeCounts.famous})
              </button>
              <button
                type="button"
                onClick={() => setScope('lesser-known-rulers')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  scope === 'lesser-known-rulers'
                    ? 'bg-emerald-500 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:text-emerald-300'
                }`}
              >
                🏛️ Lesser-Known Rulers ({scopeCounts.lesser})
              </button>
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  scope === 'all'
                    ? 'bg-sky-500 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:text-sky-300'
                }`}
              >
                🌐 All — Everyone ({scopeCounts.all})
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="relative min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${currentHub.shortName}...`}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

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
                <option value="overall">Highest Score</option>
                <option value="popularity">Most Famous</option>
                <option value="chronological">Chronological</option>
                <option value="military">Military</option>
                <option value="economy">Economy</option>
                <option value="societal">Society & Law</option>
                <option value="diplomacy">Diplomacy</option>
                <option value="leadership">Leadership</option>
              </select>
            </div>
          </div>

          {/* Country Ranked Leader Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>
                Showing <strong className="text-stone-200">{sortedLeaders.length}</strong> ranked figures in {currentHub.flag} {currentHub.name}
              </span>
            </div>

            {sortedLeaders.length === 0 ? (
              <div className="p-12 text-center rounded-xl bg-stone-900/40 border border-stone-800 text-stone-400 space-y-3">
                <Filter className="w-7 h-7 text-stone-600 mx-auto" />
                <p className="text-sm">No figures in this category/filter.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedEra('all');
                    setActiveSubCategory('all');
                    setScope('all');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors"
                >
                  Show Everyone in {currentHub.shortName}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedLeaders.map((leader, idx) => (
                  <div key={leader.id} className="relative">
                    <div className="absolute -top-2 -left-2 z-10 px-2 py-0.5 rounded-md bg-stone-950 border border-stone-700 font-mono text-[11px] font-extrabold text-amber-400 shadow">
                      #{idx + 1}
                    </div>
                    <LeaderCard
                      leader={leader}
                      userRating={userRatings[leader.id]}
                      isCompared={comparedIdSet.has(leader.id)}
                      onToggleCompare={onToggleCompare}
                      onSelect={onSelectLeader}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={handleBackToPortals}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-500/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Back to All Countries</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

