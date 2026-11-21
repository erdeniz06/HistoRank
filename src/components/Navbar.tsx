import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, Plus, Search, X } from 'lucide-react';
import { Leader, UserRating } from '../types';
import { calculateOverallScore, getEffectiveScores, getTierForScore } from '../utils/scoring';

export type NavTab = 'portals' | 'global' | 'tierlist' | 'giants' | 'compare';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  comparedCount: number;
  leaders: Leader[];
  userRatings: Record<string, UserRating>;
  onSelectLeader: (leader: Leader) => void;
  showCountryBackButton?: boolean;
  onBackFromCountry?: () => void;
}

function normalizeSearchText(str: string): string {
  return str
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/é|è|ê/g, 'e')
    .replace(/á|à|â/g, 'a')
    .replace(/í|ì|î/g, 'i')
    .replace(/ó|ò|ô/g, 'o')
    .replace(/ú|ù|û/g, 'u')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ś/g, 's')
    .replace(/ź|ż/g, 'z');
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  comparedCount,
  leaders,
  userRatings,
  onSelectLeader,
  showCountryBackButton,
  onBackFromCountry,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    const q = normalizeSearchText(query.trim());
    if (!q) return [];
    return leaders
      .filter((l) => {
        const hay = normalizeSearchText(
          `${l.name} ${l.originalName || ''} ${l.country} ${l.title} ${l.century}`
        );
        return hay.includes(q);
      })
      .slice(0, 8);
  }, [query, leaders]);

  const handlePickLeader = (leader: Leader) => {
    onSelectLeader(leader);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-3 sm:gap-5 px-4 sm:px-6 py-3">
        {/* Top-left Back Button (when inside a country) + Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          {showCountryBackButton && onBackFromCountry && (
            <button
              type="button"
              onClick={onBackFromCountry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-colors shrink-0"
              title="Back to all countries"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.75]" />
              <span>Back</span>
            </button>
          )}
          <button
            onClick={() => onSelectTab('portals')}
            className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <span className="font-cinzel text-lg sm:text-xl font-extrabold tracking-widest text-stone-100 group-hover:text-amber-400 transition-colors">
              HISTORANK
            </span>
          </button>
        </div>

        {/* Global Top Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 min-w-[200px] max-w-md order-3 md:order-2 w-full md:w-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsOpen(false);
                } else if (e.key === 'Enter' && searchResults.length > 0) {
                  e.preventDefault();
                  handlePickLeader(searchResults[0]);
                }
              }}
              placeholder="Search leaders... (Caesar, Napoleon, Lincoln, Atatürk...)"
              className="w-full pl-8 pr-8 py-1.5 text-xs bg-stone-900/90 border border-stone-800 rounded-lg text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500/80 transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-200"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Autocomplete Dropdown */}
          {isOpen && query.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl bg-stone-900 border border-stone-800 shadow-2xl overflow-hidden z-50">
              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-xs text-stone-500">
                  No figures found matching "{query}".
                </div>
              ) : (
                <div className="divide-y divide-stone-800/70 max-h-80 overflow-y-auto">
                  {searchResults.map((leader) => {
                    const score = calculateOverallScore(getEffectiveScores(leader, userRatings));
                    const tier = getTierForScore(score);
                    return (
                      <button
                        key={leader.id}
                        type="button"
                        onClick={() => handlePickLeader(leader)}
                        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-stone-800/80 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{leader.flag}</span>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-stone-100 truncate">
                              {leader.name}
                            </div>
                            <div className="text-[11px] text-stone-400 truncate">
                              {leader.country} · {leader.century}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="text-[10px] font-extrabold px-1.5 py-0.5 rounded border"
                            style={{
                              color: tier.color,
                              backgroundColor: tier.bgColor,
                              borderColor: tier.borderColor,
                            }}
                          >
                            {tier.tier} TIER
                          </span>
                          <span
                            className="text-sm font-mono font-black tabular-nums"
                            style={{ color: tier.color }}
                          >
                            {score}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clean 4-Tab Nav */}
        <nav className="flex items-center gap-4 sm:gap-5 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar py-1 order-2 md:order-3">
          <button
            onClick={() => onSelectTab('portals')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'portals'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            By Country
          </button>

          <button
            onClick={() => onSelectTab('global')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'global'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Global Rankings
          </button>

          <button
            onClick={() => onSelectTab('tierlist')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'tierlist'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Tier List
          </button>

          <button
            onClick={() => onSelectTab('giants')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'giants'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            League of Giants
          </button>

          <button
            onClick={() => onSelectTab('compare')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>Compare</span>
            {comparedCount > 0 && (
              <span className="text-[10px] font-mono text-amber-400">
                ({comparedCount})
              </span>
            )}
          </button>
        </nav>

        {/* Primary Action */}
        <div className="flex items-center shrink-0 order-4">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Figure</span>
          </button>
        </div>
      </div>
    </header>
  );
};
