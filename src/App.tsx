import React, { useState, useMemo, useEffect } from 'react';
import { Leader, UserRating } from './types';
import { INITIAL_LEADERS } from './data/leaders';
import {
  loadCustomLeaders,
  loadUserRatings,
  saveCustomLeader,
  saveUserRating,
  removeUserRating,
} from './utils/scoring';
import { Navbar, NavTab } from './components/Navbar';
import { LeaderDetailModal } from './components/LeaderDetailModal';
import { ComparisonView } from './components/ComparisonView';
import { TierListView } from './components/TierListView';
import { AddLeaderModal } from './components/AddLeaderModal';
import { GiantsView } from './components/GiantsView';
import { CountryPortalView } from './components/CountryPortalView';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { culturalAudio, CultureKey } from './audio/culturalAudioEngine';
import { Swords } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('portals');
  const [activeCountry, setActiveCountry] = useState<string | null>(() => {
    const match = window.location.hash.match(/^#country=([a-z0-9-]+)$/);
    return match ? match[1] : null;
  });
  const [currentCulture, setCurrentCulture] = useState<CultureKey>('world');

  useEffect(() => {
    const onPopState = () => {
      const match = window.location.hash.match(/^#country=([a-z0-9-]+)$/);
      setActiveCountry(match ? match[1] : null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleChangeCountry = (countryKey: string | null) => {
    setActiveCountry(countryKey);
    const targetHash = countryKey ? `#country=${countryKey}` : '#countries';
    if (window.location.hash !== targetHash) {
      window.history.pushState({ country: countryKey }, '', targetHash);
    }
  };

  const handleSelectNavTab = (tab: NavTab) => {
    if (tab === 'portals' && activeCountry !== null) {
      handleChangeCountry(null);
    }
    setActiveTab(tab);
  };

  const [leaders, setLeaders] = useState<Leader[]>(() => {
    const custom = loadCustomLeaders();
    return [...custom, ...INITIAL_LEADERS];
  });
  const [userRatings, setUserRatings] = useState<Record<string, UserRating>>(() =>
    loadUserRatings()
  );

  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [comparedLeaderIds, setComparedLeaderIds] = useState<string[]>([
    'caesar',
    'alexander-the-great',
    'napoleon',
  ]);

  const handleSaveRating = (rating: UserRating) => {
    saveUserRating(rating);
    setUserRatings((prev) => ({
      ...prev,
      [rating.leaderId]: rating,
    }));
  };

  const handleResetRating = (leaderId: string) => {
    removeUserRating(leaderId);
    setUserRatings((prev) => {
      const copy = { ...prev };
      delete copy[leaderId];
      return copy;
    });
  };

  const handleAddLeader = (newLeader: Leader) => {
    saveCustomLeader(newLeader);
    setLeaders((prev) => [newLeader, ...prev]);
    setSelectedLeader(newLeader);
  };

  const handleToggleCompare = (leader: Leader) => {
    setComparedLeaderIds((prev) => {
      if (prev.includes(leader.id)) {
        return prev.filter((id) => id !== leader.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), leader.id];
      }
      return [...prev, leader.id];
    });
  };

  const handleSelectDuelPreset = (ids: string[]) => {
    setComparedLeaderIds(ids);
    setActiveTab('compare');
  };

  const handleSelectCulture = (culture: CultureKey) => {
    setCurrentCulture(culture);
    culturalAudio.switchCulture(culture);
  };

  const handleSelectLeaderWithCulture = (leader: Leader | null) => {
    setSelectedLeader(leader);
    if (!leader) return;

    if (leader.category === 'turkey' || leader.category === 'azerbaijan' || leader.countryCode === 'TR' || leader.countryCode === 'TR-HIST' || leader.countryCode === 'AZ') {
      if (leader.subCategory === 'turkic-seljuk') {
        handleSelectCulture('turkic');
      } else {
        handleSelectCulture('turkey');
      }
    } else if (leader.category === 'russia' || leader.countryCode === 'SU' || leader.countryCode === 'RU') {
      handleSelectCulture('ussr');
    } else if (leader.category === 'uk' || leader.countryCode === 'GB') {
      handleSelectCulture('uk');
    } else if (leader.category === 'usa' || leader.countryCode === 'US') {
      handleSelectCulture('usa');
    } else if (leader.category === 'germany' || leader.countryCode === 'DE') {
      handleSelectCulture('germany');
    } else if (leader.category === 'france' || leader.countryCode === 'FR') {
      handleSelectCulture('france');
    } else if (leader.category === 'spain' || leader.countryCode === 'ES') {
      handleSelectCulture('spain');
    } else if (
      [
        'belgium',
        'netherlands',
        'italy',
        'poland',
        'yugoslavia',
        'greece',
        'serbia',
        'bosnia',
        'croatia',
        'bulgaria',
        'romania',
        'albania',
        'north-macedonia',
        'ukraine',
        'christianity',
      ].includes(leader.category)
    ) {
      handleSelectCulture('europe');
    } else if (leader.category === 'ancient' || leader.era === 'ancient') {
      handleSelectCulture('ancient');
    } else if (leader.category === 'mongolia' || leader.countryCode === 'MN') {
      handleSelectCulture('mongolia');
    } else {
      handleSelectCulture('world');
    }
  };

  const comparedLeaders = useMemo(() => {
    return comparedLeaderIds
      .map((id) => leaders.find((l) => l.id === id))
      .filter((l): l is Leader => Boolean(l));
  }, [comparedLeaderIds, leaders]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectNavTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        comparedCount={comparedLeaderIds.length}
        leaders={leaders}
        userRatings={userRatings}
        onSelectLeader={(l) => handleSelectLeaderWithCulture(l)}
        showCountryBackButton={activeTab === 'portals' && activeCountry !== null}
        onBackFromCountry={() => {
          handleChangeCountry(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <AudioPlayerBar
        currentCulture={currentCulture}
        onSelectCulture={handleSelectCulture}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'portals' && (
          <CountryPortalView
            allLeaders={leaders}
            userRatings={userRatings}
            comparedLeaders={comparedLeaders}
            onToggleCompare={handleToggleCompare}
            onSelectLeader={handleSelectLeaderWithCulture}
            onSelectCulture={handleSelectCulture}
            activeCountry={activeCountry}
            onChangeCountry={handleChangeCountry}
          />
        )}

        {activeTab === 'giants' && (
          <GiantsView
            allLeaders={leaders}
            onSelectLeader={handleSelectLeaderWithCulture}
            onSelectCulture={handleSelectCulture}
          />
        )}

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

        {activeTab === 'tierlist' && (
          <TierListView
            leaders={leaders}
            userRatings={userRatings}
            onSelectLeader={(l) => handleSelectLeaderWithCulture(l)}
          />
        )}
      </main>

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
            Kıyaslamaya Git
          </button>
        </div>
      )}

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

      <footer className="border-t border-stone-800/80 bg-stone-950 mt-14 text-xs text-stone-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-bold text-stone-400 tracking-wider">
              PANTHEON
            </span>
            <span aria-hidden="true">·</span>
            <span>Tarihsel Liderlik & Devlet İdaresi Puanlama Arşivi</span>
          </div>

          <div className="flex items-center gap-3 text-stone-400">
            <span>6 Değerlendirme Boyutu</span>
            <span aria-hidden="true">·</span>
            <span>{leaders.length} Lider</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
