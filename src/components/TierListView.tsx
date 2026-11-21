import React, { useState, useMemo } from 'react';
import { Leader, LeaderboardScope, TierLevel, UserRating } from '../types';
import { TIERS } from '../data/leaders';
import {
  calculateOverallScore,
  getEffectiveScores,
  getLeaderPopularityScore,
  getLeaderTierSubtitle,
  getSimpleStatusLabel,
  getTierForScore,
  matchesLeaderboardScope,
} from '../utils/scoring';

interface TierListViewProps {
  leaders: Leader[];
  userRatings: Record<string, UserRating>;
  onSelectLeader: (leader: Leader) => void;
}

const COUNTRY_OPTIONS = [
  { key: 'all', label: '🌐 All Countries' },
  { key: 'usa', label: '🇺🇸 United States' },
  { key: 'uk', label: '🇬🇧 United Kingdom' },
  { key: 'germany', label: '🇩🇪 Germany' },
  { key: 'france', label: '🇫🇷 France' },
  { key: 'russia', label: '🇷🇺 Russia & USSR' },
  { key: 'turkey', label: '🇹🇷 Turkey & Turkic History' },
  { key: 'china', label: '🇨🇳 China' },
  { key: 'japan', label: '🇯🇵 Japan' },
  { key: 'india', label: '🇮🇳 India' },
  { key: 'italy', label: '🇮🇹 Italy' },
  { key: 'spain', label: '🇪🇸 Spain' },
  { key: 'ancient', label: '🏛️ Ancient Rome & Greece' },
  { key: 'islamic', label: '☪️ Islamic History' },
  { key: 'christianity', label: '✝️ Christian History' },
  { key: 'egypt', label: '🇪🇬 Egypt & Pharaohs' },
  { key: 'iran', label: '🇮🇷 Iran' },
  { key: 'israel', label: '🇮🇱 Israel' },
  { key: 'palestine', label: '🇵🇸 Palestine' },
  { key: 'ukraine', label: '🇺🇦 Ukraine' },
  { key: 'brazil', label: '🇧🇷 Brazil' },
  { key: 'poland', label: '🇵🇱 Poland' },
  { key: 'netherlands', label: '🇳🇱 Netherlands' },
  { key: 'belgium', label: '🇧🇪 Belgium' },
  { key: 'greece', label: '🇬🇷 Greece' },
  { key: 'mongolia', label: '🇲🇳 Mongolia' },
  { key: 'cuba', label: '🇨🇺 Cuba' },
  { key: 'vietnam', label: '🇻🇳 Vietnam' },
  { key: 'north-korea', label: '🇰🇵 North Korea' },
  { key: 'south-africa', label: '🇿🇦 South Africa' },
  { key: 'azerbaijan', label: '🇦🇿 Azerbaijan' },
  { key: 'iraq', label: '🇮🇶 Iraq' },
  { key: 'syria', label: '🇸🇾 Syria' },
  { key: 'saudi-arabia', label: '🇸🇦 Saudi Arabia' },
  { key: 'libya', label: '🇱🇾 Libya' },
  { key: 'yugoslavia', label: '🇷🇸 Yugoslavia' },
];

export const TierListView: React.FC<TierListViewProps> = ({
  leaders,
  userRatings,
  onSelectLeader,
}) => {
  const [useUserRatings, setUseUserRatings] = useState<boolean>(true);
  const [scope, setScope] = useState<LeaderboardScope>('famous-rulers');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const countryFilteredLeaders = useMemo(() => {
    if (selectedCountry === 'all') return leaders;
    return leaders.filter((l) => l.category === selectedCountry);
  }, [leaders, selectedCountry]);

  const scopeCounts = useMemo(() => {
    let famous = 0;
    let lesser = 0;
    for (const l of countryFilteredLeaders) {
      if (matchesLeaderboardScope(l, 'famous-rulers')) famous++;
      else if (matchesLeaderboardScope(l, 'lesser-known-rulers')) lesser++;
    }
    return {
      famous,
      lesser,
      all: countryFilteredLeaders.length,
    };
  }, [countryFilteredLeaders]);

  const visibleLeaders = useMemo(() => {
    return countryFilteredLeaders.filter((l) => matchesLeaderboardScope(l, scope));
  }, [countryFilteredLeaders, scope]);

  const buckets = useMemo(() => {
    const map: Record<TierLevel, Leader[]> = { S: [], A: [], B: [], C: [], D: [] };
    visibleLeaders.forEach((leader) => {
      const scores = getEffectiveScores(leader, userRatings, useUserRatings);
      const overall = calculateOverallScore(scores);
      const tier = getTierForScore(overall);
      map[tier.tier].push(leader);
    });
    (Object.keys(map) as TierLevel[]).forEach((t) => {
      map[t].sort((a, b) => {
        const sa = calculateOverallScore(getEffectiveScores(a, userRatings, useUserRatings));
        const sb = calculateOverallScore(getEffectiveScores(b, userRatings, useUserRatings));
        if (sb !== sa) return sb - sa;
        return getLeaderPopularityScore(b) - getLeaderPopularityScore(a);
      });
    });
    return map;
  }, [visibleLeaders, userRatings, useUserRatings]);

  return (
    <div className="space-y-6">
      {/* Clean Single Control Panel */}
      <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
              Historical Tier List
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Rulers are separated into <strong className="text-amber-300">Famous Rulers</strong> vs. <strong className="text-stone-200">Lesser-Known Rulers</strong>. Non-rulers only appear in <strong className="text-sky-300">All (Everyone)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Country Filter with Flags */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Score Source Switch */}
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setUseUserRatings(true)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  useUserRatings
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                My Ratings
              </button>
              <button
                type="button"
                onClick={() => setUseUserRatings(false)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  !useUserRatings
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Consensus
              </button>
            </div>
          </div>
        </div>

        {/* Clean 3-Button Scope Bar */}
        <div className="pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs">
            <button
              type="button"
              onClick={() => setScope('famous-rulers')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
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
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
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
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                scope === 'all'
                  ? 'bg-sky-500 text-stone-950 font-semibold'
                  : 'text-stone-300 hover:text-sky-300'
              }`}
            >
              🌐 All — Everyone ({scopeCounts.all})
            </button>
          </div>

          <span className="text-xs font-mono text-stone-400">
            Showing {visibleLeaders.length} Figures
          </span>
        </div>
      </div>

      {/* Single Clean S–D Tier Table */}
      <div className="space-y-3.5">
        {TIERS.map((tierConfig) => {
          const leadersInTier = buckets[tierConfig.tier];

          return (
            <div
              key={tierConfig.tier}
              className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden flex flex-col md:flex-row items-stretch"
            >
              <div
                className="w-full md:w-36 p-4 flex md:flex-col items-center justify-between md:justify-center text-center shrink-0 border-b md:border-b-0 md:border-r border-stone-800"
                style={{ backgroundColor: tierConfig.bgColor }}
              >
                <div
                  className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight"
                  style={{ color: tierConfig.color }}
                >
                  {tierConfig.tier} TIER
                </div>
                <div className="text-xs font-bold text-stone-200 uppercase tracking-wider mt-1">
                  {tierConfig.minScore}+ Pts
                </div>
                <div className="text-[11px] text-stone-300 max-w-[115px] hidden md:block mt-1 leading-tight">
                  {tierConfig.label}
                </div>
              </div>

              <div className="flex-1 p-4 min-h-[84px] flex items-center">
                {leadersInTier.length === 0 ? (
                  <div className="text-xs text-stone-600 italic py-2">
                    No figures in this tier under current selection.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {leadersInTier.map((leader) => {
                      const scores = getEffectiveScores(leader, userRatings, useUserRatings);
                      const overall = calculateOverallScore(scores);
                      const tierSubtitle = getLeaderTierSubtitle(leader, scores, tierConfig.tier);
                      const statusLabel = getSimpleStatusLabel(leader);

                      return (
                        <div
                          key={leader.id}
                          onClick={() => onSelectLeader(leader)}
                          className="group flex items-center gap-2.5 pl-3 pr-2 py-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/60 cursor-pointer transition-colors"
                          title={`${leader.name} — ${overall}/100 (${tierSubtitle}) · ${statusLabel}`}
                        >
                          <span className="text-xl shrink-0" aria-hidden="true">{leader.flag}</span>

                          <div className="min-w-0 max-w-[160px]">
                            <h4 className="text-xs font-semibold text-stone-100 group-hover:text-amber-400 transition-colors truncate">
                              {leader.name}
                            </h4>
                            <div className="text-[10px] text-stone-400 truncate">
                              {leader.country}
                            </div>
                          </div>

                          <div
                            className="ml-1 px-2 py-1 rounded-lg font-mono font-extrabold text-xs tabular-nums shrink-0 border"
                            style={{
                              color: tierConfig.color,
                              backgroundColor: tierConfig.bgColor,
                              borderColor: tierConfig.borderColor,
                            }}
                          >
                            {overall}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
