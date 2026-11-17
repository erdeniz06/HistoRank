import React, { useState, useMemo } from 'react';
import { Leader, PopularityTier, TierLevel, UserRating } from '../types';
import { TIERS } from '../data/leaders';
import {
  POPULARITY_LEAGUES,
  calculateOverallScore,
  getEffectiveScores,
  getLeaderPopularityScore,
  getLeaderPopularityTier,
  getLeaderPowerRole,
  getLeaderTierSubtitle,
  getPopularityLeagueInfo,
  getTierForScore,
} from '../utils/scoring';

interface TierListViewProps {
  leaders: Leader[];
  userRatings: Record<string, UserRating>;
  onSelectLeader: (leader: Leader) => void;
}

export const TierListView: React.FC<TierListViewProps> = ({
  leaders,
  userRatings,
  onSelectLeader,
}) => {
  const [useUserRatings, setUseUserRatings] = useState<boolean>(true);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [selectedFilterEra, setSelectedFilterEra] = useState<string>('all');
  const [powerFilter, setPowerFilter] = useState<'all' | 'ruler' | 'non-ruler'>('all');
  const [popularityFilter, setPopularityFilter] = useState<'all' | PopularityTier>('all');
  const [separateByPopularity, setSeparateByPopularity] = useState<boolean>(true);

  // Filter leaders before popularity filter so we can show counts
  const baseFilteredLeaders = useMemo(() => {
    return leaders.filter((leader) => {
      if (selectedFilterCategory !== 'all' && leader.category !== selectedFilterCategory) {
        return false;
      }
      if (selectedFilterEra !== 'all' && leader.era !== selectedFilterEra) {
        return false;
      }
      if (powerFilter !== 'all' && getLeaderPowerRole(leader) !== powerFilter) {
        return false;
      }
      return true;
    });
  }, [leaders, selectedFilterCategory, selectedFilterEra, powerFilter]);

  const popularityCounts = useMemo(() => {
    const counts: Record<'all' | PopularityTier, number> = {
      all: baseFilteredLeaders.length,
      'global-icon': 0,
      international: 0,
      national: 0,
      niche: 0,
    };
    for (const l of baseFilteredLeaders) {
      counts[getLeaderPopularityTier(l)]++;
    }
    return counts;
  }, [baseFilteredLeaders]);

  const filteredLeaders = useMemo(() => {
    if (popularityFilter === 'all') return baseFilteredLeaders;
    return baseFilteredLeaders.filter((l) => getLeaderPopularityTier(l) === popularityFilter);
  }, [baseFilteredLeaders, popularityFilter]);

  const buildTierBuckets = (subset: Leader[]) => {
    const buckets: Record<TierLevel, Leader[]> = {
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
    };
    subset.forEach((leader) => {
      const scores = getEffectiveScores(leader, userRatings, useUserRatings);
      const overall = calculateOverallScore(scores);
      const tier = getTierForScore(overall);
      buckets[tier.tier].push(leader);
    });
    (Object.keys(buckets) as TierLevel[]).forEach((t) => {
      buckets[t].sort((a, b) => {
        const sa = calculateOverallScore(getEffectiveScores(a, userRatings, useUserRatings));
        const sb = calculateOverallScore(getEffectiveScores(b, userRatings, useUserRatings));
        if (sb !== sa) return sb - sa;
        return getLeaderPopularityScore(b) - getLeaderPopularityScore(a);
      });
    });
    return buckets;
  };

  const renderTierRows = (
    buckets: Record<TierLevel, Leader[]>,
    hideEmptyRows: boolean
  ) => (
    <div className="space-y-3.5">
      {TIERS.map((tierConfig) => {
        const leadersInTier = buckets[tierConfig.tier];
        if (hideEmptyRows && leadersInTier.length === 0) {
          return null;
        }

        return (
          <div
            key={tierConfig.tier}
            className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden flex flex-col md:flex-row items-stretch"
          >
            {/* Left Tier Header Banner */}
            <div
              className="w-full md:w-40 p-4 flex md:flex-col items-center justify-between md:justify-center text-center shrink-0 border-b md:border-b-0 md:border-r border-stone-800"
              style={{ backgroundColor: tierConfig.bgColor }}
            >
              <div
                className="text-4xl font-extrabold font-serif tracking-tight"
                style={{ color: tierConfig.color }}
              >
                {tierConfig.tier} TIER
              </div>
              <div className="text-xs font-bold text-stone-200 uppercase tracking-wider mt-1">
                {tierConfig.minScore}+ Pts
              </div>
              <div className="text-[11px] text-stone-300 max-w-[120px] hidden md:block mt-1 leading-tight">
                {tierConfig.label}
              </div>
            </div>

            {/* Right Leader Grid */}
            <div className="flex-1 p-4 min-h-[92px] flex items-center">
              {leadersInTier.length === 0 ? (
                <div className="text-xs text-stone-600 italic py-2">
                  No figures in this tier yet under current filters.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {leadersInTier.map((leader) => {
                    const scores = getEffectiveScores(leader, userRatings, useUserRatings);
                    const overall = calculateOverallScore(scores);
                    const tierSubtitle = getLeaderTierSubtitle(leader, scores, tierConfig.tier);
                    const popScore = getLeaderPopularityScore(leader);
                    const popLeague = getPopularityLeagueInfo(getLeaderPopularityTier(leader));

                    return (
                      <div
                        key={leader.id}
                        onClick={() => onSelectLeader(leader)}
                        className="group flex items-center gap-2.5 pl-3 pr-2 py-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/60 cursor-pointer transition-colors"
                        title={`${leader.name} — ${overall}/100 (${tierConfig.tier} Tier · ${tierSubtitle}) · Recognition: ${popScore}/100 (${popLeague.shortLabel})`}
                      >
                        <span className="text-lg shrink-0">{leader.flag}</span>

                        <div className="min-w-0 max-w-[150px]">
                          <h4 className="text-xs font-semibold text-stone-100 group-hover:text-amber-400 transition-colors truncate">
                            {leader.name}
                          </h4>
                          <div className="text-[10px] text-stone-400 truncate flex items-center gap-1">
                            <span className="truncate">{leader.country}</span>
                            <span className="text-stone-600">·</span>
                            <span className="shrink-0" title={popLeague.label}>
                              {popLeague.icon} {popScore}
                            </span>
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
  );

  const isSeparatedMode = separateByPopularity && popularityFilter === 'all';

  return (
    <div className="space-y-6">
      {/* Control Strip */}
      <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-100">
              Historical Tier List
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Ranked S–D by 6 governance dimensions and separated into distinct Global Recognition leagues.
            </p>
          </div>

          {/* Filters & Mode Switch */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mode toggle */}
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
              <button
                onClick={() => setUseUserRatings(true)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  useUserRatings
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                My Ratings
              </button>
              <button
                onClick={() => setUseUserRatings(false)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  !useUserRatings
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Consensus Scores
              </button>
            </div>

            {/* Power Role Filter */}
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setPowerFilter('all')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  powerFilter === 'all'
                    ? 'bg-stone-700 text-white font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setPowerFilter('ruler')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  powerFilter === 'ruler'
                    ? 'bg-emerald-500 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-emerald-300'
                }`}
              >
                Rulers & Executives
              </button>
              <button
                type="button"
                onClick={() => setPowerFilter('non-ruler')}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  powerFilter === 'non-ruler'
                    ? 'bg-sky-500 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-sky-300'
                }`}
              >
                Opposition & Thinkers
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={selectedFilterCategory}
              onChange={(e) => setSelectedFilterCategory(e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-300 focus:outline-none"
            >
              <option value="all">All Nations & Categories</option>
              <option value="usa">🇺🇸 United States</option>
              <option value="uk">🇬🇧 United Kingdom</option>
              <option value="germany">🇩🇪 Germany</option>
              <option value="france">🇫🇷 France</option>
              <option value="russia">🇷🇺 Russia & USSR</option>
              <option value="china">🇨🇳 China</option>
              <option value="japan">🇯🇵 Japan</option>
              <option value="india">🇮🇳 India</option>
              <option value="italy">🇮🇹 Italy</option>
              <option value="spain">🇪🇸 Spain</option>
              <option value="ukraine">🇺🇦 Ukraine</option>
              <option value="brazil">🇧🇷 Brazil</option>
              <option value="ancient">🏛️ Ancient Rome & Greece</option>
              <option value="christianity">✝️ Christian History</option>
              <option value="islamic">☪️ Islamic History & Caliphs</option>
              <option value="turkey">🇹🇷 Turkey & Turkic History</option>
              <option value="poland">🇵🇱 Poland</option>
              <option value="belgium">🇧🇪 Belgium</option>
              <option value="netherlands">🇳🇱 Netherlands</option>
              <option value="cuba">🇨🇺 Cuba</option>
              <option value="vietnam">🇻🇳 Vietnam</option>
              <option value="north-korea">🇰🇵 North Korea</option>
              <option value="cambodia">🇰🇭 Cambodia</option>
              <option value="yugoslavia">🇷🇸 Yugoslavia</option>
              <option value="mongolia">🇲🇳 Mongolia</option>
              <option value="egypt">🇪🇬 Egypt & Pharaohs</option>
              <option value="iraq">🇮🇶 Iraq</option>
              <option value="iran">🇮🇷 Iran</option>
              <option value="syria">🇸🇾 Syria</option>
              <option value="saudi-arabia">🇸🇦 Saudi Arabia</option>
              <option value="palestine">🇵🇸 Palestine</option>
              <option value="israel">🇮🇱 Israel</option>
              <option value="libya">🇱🇾 Libya</option>
              <option value="burkina-faso">🇧🇫 Burkina Faso</option>
              <option value="ghana">🇬🇭 Ghana</option>
              <option value="tanzania">🇹🇿 Tanzania</option>
              <option value="south-africa">🇿🇦 South Africa</option>
              <option value="botswana">🇧🇼 Botswana</option>
              <option value="azerbaijan">🇦🇿 Azerbaijan</option>
              <option value="armenia">🇦🇲 Armenia</option>
              <option value="georgia">🇬🇪 Georgia</option>
              <option value="greece">🇬🇷 Greece</option>
              <option value="serbia">🇷🇸 Serbia</option>
              <option value="bosnia">🇧🇦 Bosnia & Herzegovina</option>
              <option value="croatia">🇭🇷 Croatia</option>
              <option value="bulgaria">🇧🇬 Bulgaria</option>
              <option value="romania">🇷🇴 Romania</option>
              <option value="albania">🇦🇱 Albania</option>
              <option value="north-macedonia">🇲🇰 North Macedonia</option>
            </select>

            {/* Era Filter */}
            <select
              value={selectedFilterEra}
              onChange={(e) => setSelectedFilterEra(e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-300 focus:outline-none"
            >
              <option value="all">All Eras & Centuries</option>
              <option value="ancient">Ancient Era</option>
              <option value="early-medieval">Early Middle Ages (5th–10th c.)</option>
              <option value="medieval">High & Late Middle Ages</option>
              <option value="early-modern">Early Modern (16th–18th c.)</option>
              <option value="19th">19th Century</option>
              <option value="20th">20th Century</option>
              <option value="21st">21st Century</option>
            </select>
          </div>
        </div>

        {/* Popularity League Strip + Separation Toggle */}
        <div className="pt-3.5 border-t border-stone-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-stone-400 mr-1">
              Recognition League:
            </span>
            <button
              type="button"
              onClick={() => setPopularityFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                popularityFilter === 'all'
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-semibold'
                  : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              All Leagues ({popularityCounts.all})
            </button>
            {POPULARITY_LEAGUES.map((league) => (
              <button
                key={league.key}
                type="button"
                onClick={() => setPopularityFilter(league.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  popularityFilter === league.key
                    ? `${league.bgClass} ${league.textClass} ${league.borderClass} font-semibold`
                    : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
                }`}
                title={league.description}
              >
                {league.icon} {league.shortLabel} ({popularityCounts[league.key]})
              </button>
            ))}
          </div>

          {/* Toggle between Separated Leagues (default) and Unified Table */}
          {popularityFilter === 'all' && (
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs w-fit shrink-0">
              <button
                type="button"
                onClick={() => setSeparateByPopularity(true)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  separateByPopularity
                    ? 'bg-amber-500 text-stone-950 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Separate by Recognition
              </button>
              <button
                type="button"
                onClick={() => setSeparateByPopularity(false)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  !separateByPopularity
                    ? 'bg-stone-700 text-white font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Unified Table
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tiers Content */}
      {isSeparatedMode ? (
        <div className="space-y-8">
          {POPULARITY_LEAGUES.map((league) => {
            const leagueLeaders = filteredLeaders.filter(
              (l) => getLeaderPopularityTier(l) === league.key
            );
            if (leagueLeaders.length === 0) return null;
            const buckets = buildTierBuckets(leagueLeaders);

            return (
              <section key={league.key} className="space-y-3">
                <div
                  className={`p-4 rounded-2xl border ${league.bgClass} ${league.borderClass} flex flex-col sm:flex-row sm:items-center justify-between gap-2`}
                >
                  <div>
                    <h3 className={`text-base sm:text-lg font-serif font-bold flex items-center gap-2 ${league.textClass}`}>
                      <span>{league.icon}</span>
                      <span>{league.label}</span>
                    </h3>
                    <p className="text-xs text-stone-300/90 mt-0.5">{league.description}</p>
                  </div>
                  <div className="text-xs font-mono text-stone-200 bg-stone-950/70 px-3 py-1.5 rounded-lg border border-stone-800 shrink-0 self-start sm:self-center">
                    {leagueLeaders.length} Figures · {league.minScore}+ Fame
                  </div>
                </div>

                {renderTierRows(buckets, true)}
              </section>
            );
          })}

          {filteredLeaders.length === 0 && (
            <div className="p-10 text-center rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-400">
              No figures matched the selected filters.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {popularityFilter !== 'all' && (() => {
            const activeLeague = getPopularityLeagueInfo(popularityFilter);
            return (
              <div
                className={`p-4 rounded-2xl border ${activeLeague.bgClass} ${activeLeague.borderClass} flex flex-col sm:flex-row sm:items-center justify-between gap-2`}
              >
                <div>
                  <h3 className={`text-base font-serif font-bold flex items-center gap-2 ${activeLeague.textClass}`}>
                    <span>{activeLeague.icon}</span>
                    <span>{activeLeague.label}</span>
                  </h3>
                  <p className="text-xs text-stone-300/90 mt-0.5">{activeLeague.description}</p>
                </div>
                <span className="text-xs font-mono text-stone-200 bg-stone-950/70 px-3 py-1.5 rounded-lg border border-stone-800 shrink-0">
                  {filteredLeaders.length} Figures
                </span>
              </div>
            );
          })()}

          {renderTierRows(buildTierBuckets(filteredLeaders), false)}
        </div>
      )}
    </div>
  );
};

