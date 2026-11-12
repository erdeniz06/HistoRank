import React, { useState, useMemo } from 'react';
import { Leader, UserRating, EraKey, GeographicRegion } from '../types';
import { calculateOverallScore, getEffectiveScores, getTierForScore } from '../utils/scoring';
import { DIMENSIONS, ERAS } from '../data/leaders';
import { CultureKey } from '../audio/culturalAudioEngine';
import {
  Search,
  Filter,
  ArrowUpDown,
  Check,
  Plus,
  AlertTriangle,
  ChevronRight,
  Globe2,
  Calendar,
  Layers,
  MapPin,
  Sparkles,
  ArrowLeft,
  Crown,
  Building2,
  Award,
  Vote,
} from 'lucide-react';

interface CountryPortalViewProps {
  allLeaders: Leader[];
  userRatings: Record<string, UserRating>;
  comparedLeaders: Leader[];
  onToggleCompare: (leader: Leader) => void;
  onSelectLeader: (leader: Leader) => void;
  onSelectCulture: (culture: CultureKey) => void;
  initialCountry?: string;
}

interface CountryHubDef {
  key: string;
  name: string;
  shortName: string;
  flag: string;
  culture: CultureKey;
  region: GeographicRegion;
  description: string;
  subCategories: { key: string; label: string; countHint?: number }[];
}

const COUNTRY_HUBS: CountryHubDef[] = [
  {
    key: 'turkey',
    name: 'Türkiye & Osmanlı Tarihi',
    shortName: 'Türkiye',
    flag: '🇹🇷',
    culture: 'turkey',
    region: 'mediterranean',
    description: 'Osman Gazi’den günümüze 36 Osmanlı padişahı, 13 cumhurbaşkanı, başbakanlar ve güncel parti liderleri.',
    subCategories: [
      { key: 'all', label: 'Tüm Türk Liderleri' },
      { key: 'ottoman-sultan', label: '36 Osmanlı Padişahı' },
      { key: 'tr-president', label: 'Cumhurbaşkanları (13 CB)' },
      { key: 'tr-pm', label: 'Tarihsel Başbakanlar' },
      { key: 'tr-party', label: 'Mevcut 4 Büyük Parti' },
    ],
  },
  {
    key: 'uk',
    name: 'Birleşik Krallık & İngiltere',
    shortName: 'İngiltere',
    flag: '🇬🇧',
    culture: 'uk',
    region: 'europe',
    description: 'Fatih William’dan III. Charles’a İngiltere monarkları, son 20 yılın başbakanları ve güncel Avam Kamarası parti liderleri.',
    subCategories: [
      { key: 'all', label: 'Tüm Britanya Liderleri' },
      { key: 'uk-monarch', label: 'İngiltere Kralları & Kraliçeleri' },
      { key: 'uk-pm', label: 'Tarihsel & Modern Başbakanlar' },
      { key: 'uk-party', label: 'Mevcut 4 Büyük Parti Lideri' },
    ],
  },
  {
    key: 'usa',
    name: 'Amerika Birleşik Devletleri',
    shortName: 'ABD',
    flag: '🇺🇸',
    culture: 'usa',
    region: 'americas',
    description: 'George Washington’dan Roosevelt ve Trump’a ABD başkanları ile Kongre’nin mevcut iki partili liderleri.',
    subCategories: [
      { key: 'all', label: 'Tüm ABD Liderleri' },
      { key: 'us-president', label: 'ABD Başkanları' },
      { key: 'us-party', label: 'Mevcut Kongre & Parti Liderleri' },
    ],
  },
  {
    key: 'germany',
    name: 'Almanya & Prusya',
    shortName: 'Almanya',
    flag: '🇩🇪',
    culture: 'germany',
    region: 'europe',
    description: 'Otto von Bismarck’tan Helmut Kohl, Merkel ve Scholz’a Alman şansölyeleri ile Bundestag’ın 4 büyük parti lideri.',
    subCategories: [
      { key: 'all', label: 'Tüm Alman Liderleri' },
      { key: 'de-chancellor', label: 'Almanya Şansölyeleri' },
      { key: 'de-party', label: 'Mevcut 4 Büyük Parti (Scholz, Merz, Weidel, Habeck)' },
    ],
  },
  {
    key: 'spain',
    name: 'İspanya Krallığı & Siyaseti',
    shortName: 'İspanya',
    flag: '🇪🇸',
    culture: 'spain',
    region: 'europe',
    description: 'Katolik İsabella ve II. Felipe gibi küresel imparatorluk hükümdarları ile günümüz İspanya’sının 4 büyük partisi.',
    subCategories: [
      { key: 'all', label: 'Tüm İspanyol Liderleri' },
      { key: 'es-monarch', label: 'Tarihsel Monarklar' },
      { key: 'es-party', label: 'Mevcut 4 Büyük Parti (Sánchez, Feijóo, Abascal, Díaz)' },
    ],
  },
  {
    key: 'france',
    name: 'Fransa Cumhuriyeti & İhtilal',
    shortName: 'Fransa',
    flag: '🇫🇷',
    culture: 'france',
    region: 'europe',
    description: 'Napolyon, Robespierre ve De Gaulle’den günümüz Fransız Ulusal Meclisi’nin 4 büyük siyasi kutbuna.',
    subCategories: [
      { key: 'all', label: 'Tüm Fransız Liderleri' },
      { key: 'fr-leader', label: 'İhtilal & Cumhurbaşkanları' },
      { key: 'fr-party', label: 'Mevcut 4 Büyük Parti (Macron, Bardella, Mélenchon)' },
    ],
  },
  {
    key: 'ancient',
    name: 'Antik Roma & Klasik Dünya',
    shortName: 'Antik Roma',
    flag: '🏛️',
    culture: 'ancient',
    region: 'mediterranean',
    description: 'Julius Caesar, Augustus, Marcus Aurelius, Büyük İskender ve Pericles gibi çağ açan antik dehalar.',
    subCategories: [
      { key: 'all', label: 'Tüm Antik Liderler' },
      { key: 'ancient-rome', label: 'Roma İmparatorları' },
      { key: 'ancient-greece', label: 'Antik Yunan & Makedonya' },
    ],
  },
  {
    key: 'world',
    name: 'Dünya Tarihi & Bozkır İkonları',
    shortName: 'Dünya',
    flag: '🌍',
    culture: 'world',
    region: 'world',
    description: 'Cengiz Han, Selahaddin Eyyubi ve Vladimir Lenin gibi kıtaları ve çağları derinden sarsan evrensel liderler.',
    subCategories: [
      { key: 'all', label: 'Tüm Dünya Figürleri' },
      { key: 'world-icon', label: 'Tarihsel Kurucu İkonlar' },
    ],
  },
];

const REGION_OPTIONS: { key: GeographicRegion; label: string; icon: string }[] = [
  { key: 'all', label: 'Tüm Coğrafyalar', icon: '🌍' },
  { key: 'europe', label: 'Avrupa Kıtası', icon: '🏰' },
  { key: 'mediterranean', label: 'Akdeniz & Anadolu', icon: '🏛️' },
  { key: 'americas', label: 'Amerika Kıtası', icon: '🦅' },
  { key: 'asia', label: 'Asya & Bozkır', icon: '🐎' },
];

export const CountryPortalView: React.FC<CountryPortalViewProps> = ({
  allLeaders,
  userRatings,
  comparedLeaders,
  onToggleCompare,
  onSelectLeader,
  onSelectCulture,
  initialCountry,
}) => {
  // Navigation & Filter States
  const [activeCountry, setActiveCountry] = useState<string | null>(initialCountry || null);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<EraKey>('all');
  const [selectedRegion, setSelectedRegion] = useState<GeographicRegion>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<
    'overall' | 'chronological' | 'military' | 'economy' | 'societal' | 'diplomacy' | 'leadership'
  >('overall');

  // Find active country profile
  const currentHub = COUNTRY_HUBS.find((h) => h.key === activeCountry) || null;

  // Handle selecting a country portal
  const handleSelectCountry = (hub: CountryHubDef) => {
    setActiveCountry(hub.key);
    setActiveSubCategory('all');
    setSelectedEra('all');
    onSelectCulture(hub.culture);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Reset to top portal directory
  const handleBackToPortals = () => {
    setActiveCountry(null);
    setActiveSubCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  // Filtered leaders based on country, subcategory, era, region, search
  const filteredLeaders = useMemo(() => {
    return allLeaders.filter((leader) => {
      // Country Filter
      if (activeCountry) {
        if (activeCountry === 'turkey') {
          if (leader.category !== 'turkey') return false;
        } else if (activeCountry === 'uk') {
          if (leader.category !== 'uk') return false;
        } else if (activeCountry === 'usa') {
          if (leader.category !== 'usa') return false;
        } else if (activeCountry === 'germany') {
          if (leader.category !== 'germany') return false;
        } else if (activeCountry === 'france') {
          if (leader.category !== 'france') return false;
        } else if (activeCountry === 'spain') {
          if (leader.category !== 'spain') return false;
        } else if (activeCountry === 'ancient') {
          if (leader.category !== 'ancient') return false;
        } else if (activeCountry === 'world') {
          if (leader.category !== 'world') return false;
        }
      }

      // SubCategory Filter (e.g. Ottoman Sultans, Presidents, Party Leaders)
      if (activeSubCategory !== 'all') {
        if (leader.subCategory !== activeSubCategory) {
          return false;
        }
      }

      // Region Filter (when outside single country)
      if (!activeCountry && selectedRegion !== 'all') {
        if (leader.region !== selectedRegion) {
          // Fallback heuristic based on category
          if (selectedRegion === 'europe' && !['uk', 'germany', 'france', 'spain'].includes(leader.category)) {
            return false;
          }
          if (selectedRegion === 'mediterranean' && !['turkey', 'ancient'].includes(leader.category)) {
            return false;
          }
          if (selectedRegion === 'americas' && leader.category !== 'usa') {
            return false;
          }
        }
      }

      // Era Filter
      if (selectedEra !== 'all') {
        if (selectedEra === 'early-medieval') {
          // MS 5. yy - 10. yy
          const centuries = ['5. yy', '6. yy', '7. yy', '8. yy', '9. yy', '10. yy'];
          const matchesCentury = centuries.some((c) => leader.century.includes(c));
          if (!matchesCentury && leader.era !== 'early-medieval') {
            return false;
          }
        } else if (leader.era !== selectedEra) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = leader.name.toLowerCase().includes(q);
        const matchesTitle = leader.title.toLowerCase().includes(q);
        const matchesCountry = leader.country.toLowerCase().includes(q);
        const matchesCentury = leader.century.toLowerCase().includes(q);
        if (!matchesName && !matchesTitle && !matchesCountry && !matchesCentury) {
          return false;
        }
      }

      return true;
    });
  }, [allLeaders, activeCountry, activeSubCategory, selectedEra, selectedRegion, searchQuery]);

  // Sort filtered leaders
  const sortedLeaders = useMemo(() => {
    return [...filteredLeaders].sort((a, b) => {
      const scoresA = getEffectiveScores(a, userRatings);
      const scoresB = getEffectiveScores(b, userRatings);

      if (sortBy === 'chronological') {
        // Approximate chronological sort
        return (a.yearsActive || '').localeCompare(b.yearsActive || '');
      }

      if (sortBy === 'overall') {
        return calculateOverallScore(scoresB) - calculateOverallScore(scoresA);
      }

      return scoresB[sortBy] - scoresA[sortBy];
    });
  }, [filteredLeaders, userRatings, sortBy]);

  // Helper count badges per hub
  const hubCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const hub of COUNTRY_HUBS) {
      counts[hub.key] = allLeaders.filter((l) => l.category === hub.key).length;
    }
    return counts;
  }, [allLeaders]);

  return (
    <div className="space-y-8">
      {/* ====================================================
          MODE 1: NO COUNTRY SELECTED -> TOP PORTAL DIRECTORY
          ==================================================== */}
      {!activeCountry && (
        <div className="space-y-8">
          {/* Hero Header: Clean & Typographic */}
          <div className="border-b border-stone-800/80 pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-500 uppercase mb-1.5">
                  <Globe2 className="w-3.5 h-3.5" />
                  <span>ÜLKE & MEDENİYET PORTALLARI</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight">
                  Tarihsel Atlas & Ulusal Liderler Sıralaması
                </h1>
                <p className="text-sm text-stone-400 mt-1 max-w-3xl leading-relaxed">
                  İstediğiniz ülkeyi veya medeniyeti seçerek doğrudan o ülkenin lider sıralamasına odaklanın.
                  Osmanlı’nın 36 padişahı, Britanya monarkları, ABD başkanları, Almanya şansölyeleri ve 6 ülkenin en büyük 4 partisinin liderleri tek bir çatı altında.
                </p>
              </div>

              {/* Total Leaders Summary Stamp */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300 shrink-0 self-start md:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-stone-200">{allLeaders.length} Lider Kayıtlı</span>
                <span className="text-stone-600">·</span>
                <span className="text-stone-400">8 Medeniyet</span>
              </div>
            </div>
          </div>

          {/* Quick Filter Strip 1: Bölgesel Filtreler */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-stone-500">
                Bölgesel Odak
              </span>
              <span className="text-[11px] text-stone-500">Coğrafyaya Göre Daralt</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {REGION_OPTIONS.map((reg) => (
                <button
                  key={reg.key}
                  onClick={() => setSelectedRegion(reg.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedRegion === reg.key
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 font-semibold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  <span>{reg.icon}</span>
                  <span>{reg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filter Strip 2: Dönemsel Tercihler (Erken Orta Çağ MS 5-10. yy dahil) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-stone-500">
                Dönemsel Aralık (Çağ Filtresi)
              </span>
              <span className="text-[11px] text-stone-500">
                {selectedEra !== 'all' ? ERAS.find((e) => e.key === selectedEra)?.label : 'Tüm Çağlar'}
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {ERAS.map((era) => (
                <button
                  key={era.key}
                  onClick={() => setSelectedEra(era.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedEra === era.key
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 font-semibold'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                  title={era.description}
                >
                  {era.label}
                </button>
              ))}
            </div>
          </div>

          {/* The 8 Main Country / Civilisation Portals Grid */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-serif font-bold text-stone-200">
              Ulusal ve Tarihsel Portallar
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COUNTRY_HUBS.map((hub) => {
                const count = hubCounts[hub.key] || 0;
                return (
                  <div
                    key={hub.key}
                    onClick={() => handleSelectCountry(hub)}
                    className="group p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-900 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-black/50 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header: Flag + Leader Count */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{hub.flag}</span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-stone-800 text-amber-400 border border-stone-700">
                          {count} Lider
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
                        {hub.name}
                      </h3>
                      <p className="text-xs text-stone-400 mt-1.5 line-clamp-3 leading-relaxed">
                        {hub.description}
                      </p>
                    </div>

                    {/* Card Footer: Sub-categories preview + CTA */}
                    <div className="mt-5 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-stone-500">
                        {hub.subCategories.length - 1} Alt Kategori
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 group-hover:text-amber-400 font-semibold text-xs">
                        <span>Sayfayı Aç</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          MODE 2: SPECIFIC COUNTRY SELECTED -> FOCUSED WORKSPACE
          ==================================================== */}
      {activeCountry && currentHub && (
        <div className="space-y-6">
          {/* Back Button & Country Bar Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900/90 to-stone-950 border border-stone-800 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <button
                  onClick={handleBackToPortals}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors shrink-0"
                  title="Tüm Ülke Portallarına Geri Dön"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Tüm Portallar</span>
                </button>

                <div className="h-6 w-px bg-stone-800 hidden sm:block" />

                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{currentHub.flag}</span>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 flex items-center gap-2">
                      <span>{currentHub.name}</span>
                    </h1>
                    <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
                      {currentHub.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Country Switcher Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 hidden md:inline">Ülke Değiştir:</span>
                <select
                  value={activeCountry}
                  onChange={(e) => {
                    const target = COUNTRY_HUBS.find((h) => h.key === e.target.value);
                    if (target) handleSelectCountry(target);
                  }}
                  className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
                >
                  {COUNTRY_HUBS.map((h) => (
                    <option key={h.key} value={h.key}>
                      {h.flag} {h.shortName} ({hubCounts[h.key] || 0})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub-Category Navigation Tabs (Underline Clean Style, NO PILLS) */}
            <div className="flex items-center gap-4 sm:gap-6 border-t border-stone-800/80 mt-5 pt-3 overflow-x-auto no-scrollbar text-xs font-medium">
              {currentHub.subCategories.map((sub) => {
                const isSelected = activeSubCategory === sub.key;
                // Count leaders in this subcategory
                const count = allLeaders.filter((l) => {
                  if (l.category !== currentHub.key) return false;
                  if (sub.key === 'all') return true;
                  return l.subCategory === sub.key;
                }).length;

                return (
                  <button
                    key={sub.key}
                    onClick={() => setActiveSubCategory(sub.key)}
                    className={`whitespace-nowrap pb-2 transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>{sub.label}</span>
                    <span className="text-[10px] text-stone-500 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search, Era & Sort Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-stone-900/60 border border-stone-800/80 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`${currentHub.shortName} liderlerinde ara...`}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
              {/* Era Selector within Country */}
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 hidden sm:inline">Dönem:</span>
                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value as EraKey)}
                  className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-stone-300 focus:outline-none"
                >
                  {ERAS.map((e) => (
                    <option key={e.key} value={e.key}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 hidden sm:inline">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-stone-300 focus:outline-none"
                >
                  <option value="overall">Genel Puan (En Yüksek)</option>
                  <option value="chronological">Tarihsel Kronoloji</option>
                  <option value="military">Askeri Deha</option>
                  <option value="economy">Ekonomi Yönetimi</option>
                  <option value="societal">Toplumsal Reform</option>
                  <option value="diplomacy">Dış Politika & Diplomasi</option>
                  <option value="leadership">Liderlik & Karizma</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          LEADER RESULTS LIST (Clean, Uncluttered, Ranked)
          ==================================================== */}
      <div className="space-y-4">
        {/* Results Count & Current Filter Summary */}
        <div className="flex items-center justify-between text-xs text-stone-400 px-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-200">
              {sortedLeaders.length} Lider Listeleniyor
            </span>
            {activeCountry && (
              <>
                <span className="text-stone-600">·</span>
                <span className="text-amber-400 font-medium">{currentHub?.name}</span>
              </>
            )}
            {activeSubCategory !== 'all' && (
              <>
                <span className="text-stone-600">·</span>
                <span className="text-stone-300">
                  {currentHub?.subCategories.find((s) => s.key === activeSubCategory)?.label}
                </span>
              </>
            )}
            {selectedEra !== 'all' && (
              <>
                <span className="text-stone-600">·</span>
                <span className="text-cyan-400">
                  {ERAS.find((e) => e.key === selectedEra)?.label}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Empty State */}
        {sortedLeaders.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-400 space-y-3">
            <Filter className="w-8 h-8 text-stone-600 mx-auto" />
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
        )}

        {/* Leader Cards Grid: 1 or 2 Columns for High Readability and Zero-Pill Clarity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedLeaders.map((leader, index) => {
            const scores = getEffectiveScores(leader, userRatings);
            const overall = calculateOverallScore(scores);
            const tier = getTierForScore(overall);
            const isCompared = comparedLeaders.some((c) => c.id === leader.id);
            const hasUserScore = !!userRatings[leader.id];

            return (
              <div
                key={leader.id}
                onClick={() => onSelectLeader(leader)}
                className="group p-5 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-600/50 hover:bg-stone-900/80 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Meta Line: Rank # + Country Flag + Century (NO PILLS) */}
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="font-mono text-stone-500 font-bold">#{index + 1}</span>
                      <span className="text-base">{leader.flag}</span>
                      <span>{leader.country}</span>
                      <span aria-hidden="true" className="text-stone-600">·</span>
                      <span>{leader.century}</span>
                    </div>

                    {/* Tier badge */}
                    <div
                      className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: tier.bgColor,
                        color: tier.color,
                        border: `1px solid ${tier.borderColor}`,
                      }}
                    >
                      {tier.tier}-KATEGORİ
                    </div>
                  </div>

                  {/* Leader Avatar & Title Header */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-800 border border-stone-700/80 shrink-0">
                      {leader.avatarUrl ? (
                        <img
                          src={leader.avatarUrl}
                          alt={leader.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-cinzel font-bold text-lg text-stone-400">
                          {leader.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-stone-100 group-hover:text-amber-400 transition-colors truncate">
                        {leader.name}
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
                        {leader.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                        <span>{leader.yearsActive}</span>
                        {hasUserScore && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-400 font-medium">Özel Puanınız Var</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Leader Summary */}
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3">
                    {leader.summary}
                  </p>

                  {/* 6 Dimension Sparklines */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/80 text-[11px]">
                    {DIMENSIONS.map((dim) => (
                      <div key={dim.key} className="flex items-center justify-between">
                        <span className="text-stone-500 truncate">{dim.shortLabel}</span>
                        <span className="font-mono font-semibold text-stone-300 ml-1">
                          {scores[dim.key]}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* En Tartışmalı 3 Konusu - Bilgilendirme Amaçlı */}
                  {leader.controversies && leader.controversies.length > 0 && (
                    <div className="mt-3 bg-stone-950/70 p-2.5 rounded-xl border border-rose-950/40 text-[11px]">
                      <div className="flex items-center gap-1.5 font-semibold text-rose-400 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>En Tartışmalı 3 Konusu (Bilgilendirme)</span>
                      </div>
                      <ol className="space-y-1">
                        {leader.controversies.slice(0, 3).map((c, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="font-mono text-rose-500 font-bold shrink-0">{idx + 1}.</span>
                            <span className="text-stone-300 line-clamp-2">{c}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                {/* Card Footer: Overall Score + Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider">
                      Genel Skor:
                    </span>
                    <span
                      className="text-xl font-bold font-mono"
                      style={{ color: tier.color }}
                    >
                      {overall}
                    </span>
                    <span className="text-xs text-stone-500">/ 100</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompare(leader);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        isCompared
                          ? 'bg-amber-600 text-stone-950 font-semibold'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                      }`}
                      title={isCompared ? 'Kıyaslamadan çıkar' : 'Kıyaslamaya ekle'}
                    >
                      {isCompared ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Seçildi</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Kıyasla</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
