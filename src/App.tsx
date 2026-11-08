import React, { useState, useEffect, useMemo } from 'react';
import { Leader, EraKey, UserRating } from './types';
import { INITIAL_LEADERS, ERAS, DIMENSIONS } from './data/leaders';
import {
  loadCustomLeaders,
  loadUserRatings,
  saveCustomLeader,
  saveUserRating,
  removeUserRating,
  calculateOverallScore,
  getEffectiveScores,
} from './utils/scoring';
import { Navbar, NavTab } from './components/Navbar';
import { LeaderCard } from './components/LeaderCard';
import { LeaderDetailModal } from './components/LeaderDetailModal';
import { ComparisonView } from './components/ComparisonView';
import { TierListView } from './components/TierListView';
import { SpecialCollections } from './components/SpecialCollections';
import { AddLeaderModal } from './components/AddLeaderModal';
import { GiantsView } from './components/GiantsView';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { culturalAudio, CultureKey } from './audio/culturalAudioEngine';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Swords,
  ChevronDown,
  Layers,
  Award,
  Flame,
} from 'lucide-react';

export default function App() {
  // Navigation State (defaults to 'giants' as requested by user!)
  const [activeTab, setActiveTab] = useState<NavTab>('giants');

  // Culture & Procedural AI Audio State
  const [currentCulture, setCurrentCulture] = useState<CultureKey>('turkey');

  // Leaders & Ratings State
  const [leaders, setLeaders] = useState<Leader[]>(() => {
    const custom = loadCustomLeaders();
    return [...custom, ...INITIAL_LEADERS];
  });
  const [userRatings, setUserRatings] = useState<Record<string, UserRating>>(() =>
    loadUserRatings()
  );

  // Active Modals & Selection
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Comparison List (Max 3)
  const [comparedLeaderIds, setComparedLeaderIds] = useState<string[]>([
    'caesar',
    'alexander-the-great',
    'napoleon',
  ]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<EraKey>('all');
  const [selectedCentury, setSelectedCentury] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('score-desc');

  // Century options derived from all leaders
  const availableCenturies = useMemo(() => {
    const set = new Set<string>();
    leaders.forEach((l) => set.add(l.century));
    return Array.from(set).sort();
  }, [leaders]);

  // Handle Save Rating
  const handleSaveRating = (rating: UserRating) => {
    saveUserRating(rating);
    setUserRatings((prev) => ({
      ...prev,
      [rating.leaderId]: rating,
    }));
  };

  // Handle Reset Rating
  const handleResetRating = (leaderId: string) => {
    removeUserRating(leaderId);
    setUserRatings((prev) => {
      const copy = { ...prev };
      delete copy[leaderId];
      return copy;
    });
  };

  // Handle Add Custom Leader
  const handleAddLeader = (newLeader: Leader) => {
    saveCustomLeader(newLeader);
    setLeaders((prev) => [newLeader, ...prev]);
    setSelectedLeader(newLeader);
  };

  // Toggle Comparison
  const handleToggleCompare = (leader: Leader) => {
    setComparedLeaderIds((prev) => {
      if (prev.includes(leader.id)) {
        return prev.filter((id) => id !== leader.id);
      }
      if (prev.length >= 3) {
        // Replace oldest or keep max 3
        return [...prev.slice(1), leader.id];
      }
      return [...prev, leader.id];
    });
  };

  const handleSelectDuelPreset = (ids: string[]) => {
    setComparedLeaderIds(ids);
    setActiveTab('compare');
  };

  // Filtered & Sorted Leaders
  const filteredLeaders = useMemo(() => {
    return leaders.filter((leader) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = leader.name.toLowerCase().includes(q);
        const matchesTitle = leader.title.toLowerCase().includes(q);
        const matchesCountry = leader.country.toLowerCase().includes(q);
        if (!matchesName && !matchesTitle && !matchesCountry) return false;
      }

      // Era
      if (selectedEra !== 'all' && leader.era !== selectedEra) {
        return false;
      }

      // Exact Century
      if (selectedCentury !== 'all' && leader.century !== selectedCentury) {
        return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'turkey' && leader.category !== 'turkey' && leader.countryCode !== 'TR') return false;
        if (selectedCategory === 'france' && leader.category !== 'france' && leader.countryCode !== 'FR') return false;
        if (selectedCategory === 'germany' && leader.category !== 'germany' && leader.countryCode !== 'DE') return false;
        if (selectedCategory === 'ancient' && leader.category !== 'ancient' && leader.era !== 'ancient') return false;
        if (selectedCategory === 'world' && leader.category !== 'world') return false;
      }

      return true;
    }).sort((a, b) => {
      const sa = getEffectiveScores(a, userRatings);
      const sb = getEffectiveScores(b, userRatings);

      if (sortBy === 'score-desc') return calculateOverallScore(sb) - calculateOverallScore(sa);
      if (sortBy === 'score-asc') return calculateOverallScore(sa) - calculateOverallScore(sb);
      if (sortBy === 'military-desc') return sb.military - sa.military;
      if (sortBy === 'economy-desc') return sb.economy - sa.economy;
      if (sortBy === 'societal-desc') return sb.societal - sa.societal;
      if (sortBy === 'diplomacy-desc') return sb.diplomacy - sa.diplomacy;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'tr');
      return 0;
    });
  }, [leaders, searchQuery, selectedEra, selectedCentury, selectedCategory, sortBy, userRatings]);

  const handleSelectCulture = (culture: CultureKey) => {
    setCurrentCulture(culture);
    culturalAudio.switchCulture(culture);
  };

  const handleSelectLeaderWithCulture = (leader: Leader | null) => {
    setSelectedLeader(leader);
    if (leader) {
      if (leader.category === 'turkey' || leader.countryCode === 'TR') {
        handleSelectCulture('turkey');
      } else if (leader.category === 'germany' || leader.countryCode === 'DE') {
        handleSelectCulture('germany');
      } else if (leader.category === 'france' || leader.countryCode === 'FR') {
        handleSelectCulture('france');
      } else if (leader.category === 'ancient' || leader.era === 'ancient') {
        handleSelectCulture('ancient');
      } else if (leader.id === 'genghis-khan' || leader.countryCode === 'MN') {
        handleSelectCulture('mongolia');
      } else {
        handleSelectCulture('world');
      }
    }
  };

  const comparedLeaders = useMemo(() => {
    return comparedLeaderIds
      .map((id) => leaders.find((l) => l.id === id))
      .filter((l): l is Leader => Boolean(l));
  }, [comparedLeaderIds, leaders]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-Zone Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        comparedCount={comparedLeaderIds.length}
      />

      {/* AI Procedural Cultural Audio Ambient Player Bar */}
      <AudioPlayerBar
        currentCulture={currentCulture}
        onSelectCulture={handleSelectCulture}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* TAB 0: DEWLER (THE GIANTS) - Real-time Crowdsourced Clash */}
        {activeTab === 'giants' && (
          <GiantsView
            allLeaders={leaders}
            onSelectLeader={handleSelectLeaderWithCulture}
            onSelectCulture={handleSelectCulture}
          />
        )}

        {/* TAB 1: CATALOG VIEW */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            {/* Hero Archival Banner */}
            <div className="relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-900 shadow-2xl">
              <div className="absolute inset-0">
                <img
                  src="/src/assets/images/historical_pantheon_hero_1794074512877.jpg"
                  alt="Pantheon Hall"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center brightness-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent" />
              </div>

              <div className="relative z-10 p-6 sm:p-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
                  <Award className="w-4 h-4" />
                  <span>Tarihsel Liderlik & Devlet İdaresi Arşivi</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-stone-100 tracking-tight text-balance leading-tight">
                  Tarihe Yön Veren Liderleri Puanlayın & Kıyaslayın
                </h1>

                <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
                  Sezar’dan Atatürk’e, Napolyon’dan Bismarck ve 13 Türk cumhurbaşkanına; liderleri 
                  <span className="text-amber-400 font-medium"> askeri, ekonomik, reform, diplomasi ve kriz yönetimi </span> 
                  eksenlerinde değerlendirin, kendi puanlarınızı kaydedip radar grafiklerinde karşılaştırın.
                </p>

                {/* Quick Action Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                  <button
                    onClick={() => {
                      const randomLeader = leaders[Math.floor(Math.random() * leaders.length)];
                      handleSelectLeaderWithCulture(randomLeader);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Rastgele Lider Puanla</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('giants')}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Devler Kapışması Ligi</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('compare')}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-lg transition-colors"
                  >
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    <span>Karşılaştırma Laboratuvarı ({comparedLeaderIds.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('collections')}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-lg transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                    <span>13 CB & Ülke Koleksiyonları</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter, Search & Century Segmented Controls */}
            <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
              {/* Row 1: Search + Country filter + Sort */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search */}
                <div className="md:col-span-5 relative">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Lider adı, unvan veya ülke ara (Örn: Atatürk, Napolyon, 20. yy)..."
                    className="w-full pl-10 pr-4 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-300"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Country / Category */}
                <div className="md:col-span-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setSelectedCategory(cat);
                      if (cat === 'turkey') handleSelectCulture('turkey');
                      else if (cat === 'france') handleSelectCulture('france');
                      else if (cat === 'germany') handleSelectCulture('germany');
                      else if (cat === 'ancient') handleSelectCulture('ancient');
                      else if (cat === 'world') handleSelectCulture('world');
                    }}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-stone-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="all">🌍 Tüm Ülkeler & Coğrafyalar</option>
                    <option value="turkey">🇹🇷 Türkiye (13 CB & Osmanlı)</option>
                    <option value="france">🇫🇷 Fransa (İhtilal & 5. Cumhuriyet)</option>
                    <option value="germany">🇩🇪 Almanya & Prusya</option>
                    <option value="ancient">🏛️ Roma & Antik Dünya</option>
                    <option value="world">👑 Diğer Dünya İmparatorlukları</option>
                  </select>
                </div>

                {/* Sort Option */}
                <div className="md:col-span-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-stone-300 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="score-desc">En Yüksek Genel Skor</option>
                    <option value="score-asc">En Düşük Genel Skor</option>
                    <option value="military-desc">⚔️ Askeri Dehaya Göre</option>
                    <option value="economy-desc">💰 Ekonomi Yönetimine Göre</option>
                    <option value="societal-desc">⚖️ Toplum & Reformlara Göre</option>
                    <option value="diplomacy-desc">🌐 Diplomasi Gücüne Göre</option>
                    <option value="name-asc">Lider Adı (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Era Tabs (Segmented control) + Exact Century Dropdown */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-3 border-t border-stone-800/80">
                {/* Era segmented buttons */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                  {ERAS.map((era) => {
                    const isActive = selectedEra === era.key;
                    return (
                      <button
                        key={era.key}
                        onClick={() => setSelectedEra(era.key)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                          isActive
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                            : 'bg-stone-950/60 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                        }`}
                      >
                        {era.label}
                      </button>
                    );
                  })}
                </div>

                {/* Specific Century Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-stone-400 whitespace-nowrap">
                    Belirli Yüzyıl:
                  </span>
                  <select
                    value={selectedCentury}
                    onChange={(e) => setSelectedCentury(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-300 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">Tüm Yüzyıllar</option>
                    <option value="21. yy">21. Yüzyıl (Çağdaş)</option>
                    <option value="20. yy">20. Yüzyıl (Sadece)</option>
                    <option value="19. yy">19. Yüzyıl (Sadece)</option>
                    <option value="18. yy">18. Yüzyıl (Sadece)</option>
                    <option value="16. yy">16. Yüzyıl (Sadece)</option>
                    <option value="15. yy">15. Yüzyıl (Sadece)</option>
                    <option value="13. yy">13. Yüzyıl (Sadece)</option>
                    <option value="12. yy">12. Yüzyıl (Sadece)</option>
                    <option value="2. yy">MS 2. Yüzyıl (Sadece)</option>
                    <option value="MÖ 1. yy">MÖ 1. Yüzyıl (Sadece)</option>
                    <option value="MÖ 4. yy">MÖ 4. Yüzyıl (Sadece)</option>
                    <option value="MÖ 5. yy">MÖ 5. Yüzyıl (Sadece)</option>
                  </select>

                  {(selectedEra !== 'all' || selectedCentury !== 'all' || selectedCategory !== 'all' || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedEra('all');
                        setSelectedCentury('all');
                        setSelectedCategory('all');
                        setSearchQuery('');
                      }}
                      className="p-1.5 text-xs text-stone-400 hover:text-amber-400 transition-colors"
                      title="Filtreleri Temizle"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Count & Subtext */}
            <div className="flex items-center justify-between text-xs text-stone-400 px-1">
              <div className="flex items-center gap-2">
                <span>{filteredLeaders.length} Lider Listeleniyor</span>
                <span aria-hidden="true" className="text-stone-700">·</span>
                <span>Kişisel puanlama ve radar grafiği için kartlara tıklayın</span>
              </div>
            </div>

            {/* Leaders Grid */}
            {filteredLeaders.length === 0 ? (
              <div className="p-16 text-center rounded-2xl bg-stone-900/40 border border-dashed border-stone-800">
                <Search className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <h3 className="text-base font-semibold text-stone-300">
                  Aradığınız kriterlere uygun lider bulunamadı
                </h3>
                <p className="text-xs text-stone-500 mt-1 mb-4">
                  Filtreleri sıfırlayabilir veya yukarıdaki "+ Yeni Lider Ekle" butonuyla yeni bir lider tanımlayabilirsiniz.
                </p>
                <button
                  onClick={() => {
                    setSelectedEra('all');
                    setSelectedCentury('all');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLeaders.map((leader) => (
                  <LeaderCard
                    key={leader.id}
                    leader={leader}
                    userRating={userRatings[leader.id]}
                    isCompared={comparedLeaderIds.includes(leader.id)}
                    onToggleCompare={handleToggleCompare}
                    onSelect={(l) => handleSelectLeaderWithCulture(l)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPARISON VIEW */}
        {activeTab === 'compare' && (
          <ComparisonView
            allLeaders={leaders}
            comparedLeaders={comparedLeaders}
            userRatings={userRatings}
            onRemoveLeader={(id) =>
              setComparedLeaderIds((prev) => prev.filter((i) => i !== id))
            }
            onAddLeader={(l) => {
              if (comparedLeaderIds.length < 3 && !comparedLeaderIds.includes(l.id)) {
                setComparedLeaderIds((prev) => [...prev, l.id]);
              }
            }}
            onSelectDuelPreset={handleSelectDuelPreset}
          />
        )}

        {/* TAB 3: TIER LIST VIEW */}
        {activeTab === 'tierlist' && (
          <TierListView
            leaders={leaders}
            userRatings={userRatings}
            onSelectLeader={(l) => handleSelectLeaderWithCulture(l)}
          />
        )}

        {/* TAB 4: SPECIAL COLLECTIONS */}
        {activeTab === 'collections' && (
          <SpecialCollections
            leaders={leaders}
            userRatings={userRatings}
            comparedIds={comparedLeaderIds}
            onToggleCompare={handleToggleCompare}
            onSelectLeader={(l) => handleSelectLeaderWithCulture(l)}
            onSelectCulture={handleSelectCulture}
          />
        )}
      </main>

      {/* Floating Compare Bar (if leaders selected and not in compare tab) */}
      {comparedLeaderIds.length > 0 && activeTab !== 'compare' && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3 p-2.5 pl-4 rounded-xl bg-stone-900 border border-amber-600/60 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
            <Swords className="w-4 h-4 text-amber-500" />
            <span>{comparedLeaderIds.length} Lider Seçildi</span>
          </div>
          <button
            onClick={() => setActiveTab('compare')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors"
          >
            Düello Görünümüne Git
          </button>
        </div>
      )}

      {/* Modals */}
      <LeaderDetailModal
        leader={selectedLeader}
        userRating={selectedLeader ? userRatings[selectedLeader.id] : undefined}
        onClose={() => setSelectedLeader(null)}
        onSaveRating={handleSaveRating}
        onResetRating={handleResetRating}
        isCompared={selectedLeader ? comparedLeaderIds.includes(selectedLeader.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      {isAddModalOpen && (
        <AddLeaderModal
          onClose={() => setIsAddModalOpen(false)}
          onAddLeader={handleAddLeader}
        />
      )}

      {/* Museum Editorial Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 mt-16 text-xs text-stone-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-stone-400 tracking-wider">
              PANTHEON
            </span>
            <span aria-hidden="true">·</span>
            <span>Tarihsel Liderlik & Devlet İdaresi Puanlama Arşivi</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>6 Değerlendirme Boyutu</span>
            <span aria-hidden="true">·</span>
            <span>36+ Seçkin Lider</span>
            <span aria-hidden="true">·</span>
            <span>Yerel Kayıt Desteği</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
