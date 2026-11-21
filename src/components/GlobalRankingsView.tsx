import React, { useState, useMemo } from 'react';
import { EraKey, GeographicRegion, Leader, LeaderboardScope, UserRating } from '../types';
import { ERAS, DIMENSIONS } from '../data/leaders';
import {
  calculateOverallScore,
  getEffectiveScores,
  getLeaderPopularityScore,
  getSimpleStatusLabel,
  getTierForScore,
  hasLeaderGoverned,
  isFamousRuler,
  matchesLeaderboardScope,
} from '../utils/scoring';
import { Check, LayoutGrid, ListOrdered, Plus, Search } from 'lucide-react';
import { LeaderCard } from './LeaderCard';

interface GlobalRankingsViewProps {
  leaders: Leader[];
  userRatings: Record<string, UserRating>;
  comparedLeaders: Leader[];
  onToggleCompare: (leader: Leader) => void;
  onSelectLeader: (leader: Leader) => void;
}

const normalizeText = (s: string) =>
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

export const GlobalRankingsView: React.FC<GlobalRankingsViewProps> = ({
  leaders,
  userRatings,
  comparedLeaders,
  onToggleCompare,
  onSelectLeader,
}) => {
  const [scope, setScope] = useState<LeaderboardScope>('famous-rulers');
  const [useUserRatings, setUseUserRatings] = useState<boolean>(true);
  const [selectedRegion, setSelectedRegion] = useState<GeographicRegion>('all');
  const [selectedEra, setSelectedEra] = useState<EraKey>('all');
  const [sortBy, setSortBy] = useState<
    'overall' | 'popularity' | 'military' | 'economy' | 'societal' | 'diplomacy' | 'leadership' | 'legacy'
  >('overall');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [visibleLimit, setVisibleLimit] = useState<number>(60);

  const comparedIdSet = useMemo(
    () => new Set(comparedLeaders.map((c) => c.id)),
    [comparedLeaders]
  );

  // Base filters (region, era, search) before scope split so tab counts are exact
  const baseFiltered = useMemo(() => {
    const q = normalizeText(searchQuery.trim());
    return leaders.filter((leader) => {
      if (selectedRegion !== 'all') {
        const matchesArr = leader.regions?.includes(selectedRegion);
        const matchesPrimary = leader.region === selectedRegion;
        if (!matchesArr && !matchesPrimary) return false;
      }

      if (selectedEra !== 'all') {
        if (selectedEra === 'early-medieval') {
          const centuries = ['5th c.', '6th c.', '7th c.', '8th c.', '9th c.', '10th c.', '5. yy', '6. yy', '7. yy', '8. yy', '9. yy', '10. yy'];
          const matchesCentury = centuries.some((c) => leader.century.includes(c));
          if (!matchesCentury && leader.era !== 'early-medieval') return false;
        } else if (leader.era !== selectedEra) {
          return false;
        }
      }

      if (q) {
        const hay = normalizeText(
          `${leader.name} ${leader.originalName || ''} ${leader.country} ${leader.title} ${leader.century}`
        );
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [leaders, selectedRegion, selectedEra, searchQuery]);

  const scopeCounts = useMemo(() => {
    let famous = 0;
    let lesser = 0;
    for (const l of baseFiltered) {
      if (matchesLeaderboardScope(l, 'famous-rulers')) famous++;
      else if (matchesLeaderboardScope(l, 'lesser-known-rulers')) lesser++;
    }
    return { famous, lesser, all: baseFiltered.length };
  }, [baseFiltered]);

  const rankedLeaders = useMemo(() => {
    const scoped = baseFiltered.filter((l) => matchesLeaderboardScope(l, scope));
    return [...scoped].sort((a, b) => {
      const scoresA = getEffectiveScores(a, userRatings, useUserRatings);
      const scoresB = getEffectiveScores(b, userRatings, useUserRatings);

      if (sortBy === 'popularity') {
        const diff = getLeaderPopularityScore(b) - getLeaderPopularityScore(a);
        if (diff !== 0) return diff;
        return calculateOverallScore(scoresB) - calculateOverallScore(scoresA);
      }
      if (sortBy === 'overall') {
        const diff = calculateOverallScore(scoresB) - calculateOverallScore(scoresA);
        if (diff !== 0) return diff;
        return getLeaderPopularityScore(b) - getLeaderPopularityScore(a);
      }
      const dimDiff = scoresB[sortBy] - scoresA[sortBy];
      if (dimDiff !== 0) return dimDiff;
      return calculateOverallScore(scoresB) - calculateOverallScore(scoresA);
    });
  }, [baseFiltered, scope, userRatings, useUserRatings, sortBy]);

  const displayedLeaders = rankedLeaders.slice(0, visibleLimit);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
              Global World Rankings
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Worldwide leaderboard across every country and era. Rulers are divided into Famous vs. Lesser-Known; non-rulers appear only in All (Everyone).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Ratings Source */}
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setUseUserRatings(true)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  useUserRatings ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                My Ratings
              </button>
              <button
                type="button"
                onClick={() => setUseUserRatings(false)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  !useUserRatings ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                Consensus
              </button>
            </div>

            {/* Table vs Cards Toggle */}
            <div className="flex items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-stone-700 text-white font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-stone-700 text-white font-semibold' : 'text-stone-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3-Tab Scope + Filter Row */}
        <div className="pt-3 border-t border-stone-800/80 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs w-fit">
            <button
              type="button"
              onClick={() => { setScope('famous-rulers'); setVisibleLimit(60); }}
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
              onClick={() => { setScope('lesser-known-rulers'); setVisibleLimit(60); }}
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
              onClick={() => { setScope('all'); setVisibleLimit(60); }}
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
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleLimit(60); }}
                placeholder="Search leader or country..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => { setSelectedRegion(e.target.value as GeographicRegion); setVisibleLimit(60); }}
              className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">🌐 All Continents</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="americas">Americas</option>
              <option value="africa">Africa</option>
            </select>

            <select
              value={selectedEra}
              onChange={(e) => { setSelectedEra(e.target.value as EraKey); setVisibleLimit(60); }}
              className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
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
              className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="overall">Sort: Overall Score</option>
              <option value="popularity">Sort: Global Fame</option>
              <option value="military">Sort: Military</option>
              <option value="economy">Sort: Economy</option>
              <option value="societal">Sort: Society & Law</option>
              <option value="diplomacy">Sort: Diplomacy</option>
              <option value="leadership">Sort: Leadership</option>
              <option value="legacy">Sort: Historical Legacy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-400">
        <span>
          Showing <strong className="text-stone-200">{displayedLeaders.length}</strong> of{' '}
          <strong className="text-stone-200">{rankedLeaders.length}</strong> ranked figures worldwide
        </span>
      </div>

      {/* Empty State */}
      {rankedLeaders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-stone-900/50 border border-stone-800 text-xs text-stone-400">
          No figures matched the selected filters.
        </div>
      ) : viewMode === 'table' ? (
        /* Clean Global Leaderboard Table */
        <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/70 text-[11px] uppercase tracking-wider text-stone-400">
                  <th className="py-3 pl-4 pr-2 w-14">Rank</th>
                  <th className="py-3 px-3">Leader & Title</th>
                  <th className="py-3 px-3 hidden sm:table-cell">Country</th>
                  <th className="py-3 px-2 hidden md:table-cell text-center">Era</th>
                  {DIMENSIONS.map((d) => (
                    <th key={d.key} className="py-3 px-2 hidden xl:table-cell text-center" title={d.label}>
                      {d.shortLabel}
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center">Score</th>
                  <th className="py-3 pl-2 pr-4 text-right">Compare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/70 text-xs">
                {displayedLeaders.map((leader, idx) => {
                  const scores = getEffectiveScores(leader, userRatings, useUserRatings);
                  const overall = calculateOverallScore(scores);
                  const tier = getTierForScore(overall);
                  const governed = hasLeaderGoverned(leader);
                  const famous = isFamousRuler(leader);
                  const isCompared = comparedIdSet.has(leader.id);

                  return (
                    <tr
                      key={leader.id}
                      onClick={() => onSelectLeader(leader)}
                      className="group hover:bg-stone-800/50 transition-colors cursor-pointer"
                    >
                      {/* Global Rank */}
                      <td className="py-3 pl-4 pr-2 font-mono font-extrabold">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-7 rounded-lg text-xs ${
                            idx === 0
                              ? 'bg-amber-500 text-stone-950'
                              : idx === 1
                              ? 'bg-stone-300 text-stone-950'
                              : idx === 2
                              ? 'bg-amber-700 text-stone-100'
                              : 'text-stone-400 bg-stone-950 border border-stone-800'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                      </td>

                      {/* Flag + Name + Role */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl shrink-0" aria-hidden="true">{leader.flag}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-stone-100 group-hover:text-amber-400 transition-colors truncate max-w-[240px] sm:max-w-[300px]">
                              {leader.name}
                            </div>
                            <div className="text-[11px] text-stone-400 truncate max-w-[240px] sm:max-w-[320px]">
                              {leader.title}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                              <span
                                className={
                                  !governed ? 'text-sky-400' : famous ? 'text-amber-400' : 'text-emerald-400'
                                }
                              >
                                ● {getSimpleStatusLabel(leader)}
                              </span>
                              <span className="sm:hidden text-stone-500">· {leader.country}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Country */}
                      <td className="py-3 px-3 hidden sm:table-cell text-stone-300 whitespace-nowrap">
                        <span className="mr-1.5">{leader.flag}</span>
                        <span>{leader.country}</span>
                      </td>

                      {/* Century */}
                      <td className="py-3 px-2 hidden md:table-cell text-center text-stone-400 font-mono text-[11px] whitespace-nowrap">
                        {leader.century}
                      </td>

                      {/* 6 Dimension Columns on XL screens */}
                      {DIMENSIONS.map((d) => (
                        <td key={d.key} className="py-3 px-2 hidden xl:table-cell text-center font-mono text-stone-300 tabular-nums">
                          {scores[d.key]}
                        </td>
                      ))}

                      {/* Tier + Overall Score */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
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
                          <span
                            className="text-sm font-mono font-black tabular-nums"
                            style={{ color: tier.color }}
                          >
                            {overall}
                          </span>
                        </div>
                      </td>

                      {/* Compare Action */}
                      <td className="py-3 pl-2 pr-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCompare(leader);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                            isCompared
                              ? 'bg-amber-500 text-stone-950 font-semibold'
                              : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                          }`}
                        >
                          {isCompared ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          <span>{isCompared ? 'Added' : 'Compare'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedLeaders.map((leader, idx) => (
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

      {/* Load More / Show All */}
      {rankedLeaders.length > displayedLeaders.length && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setVisibleLimit((prev) => prev + 60)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-500/50 transition-colors"
          >
            Load 60 More ({rankedLeaders.length - displayedLeaders.length} remaining)
          </button>
          <button
            type="button"
            onClick={() => setVisibleLimit(rankedLeaders.length)}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-stone-950 hover:bg-stone-900 text-amber-400 border border-stone-800 transition-colors"
          >
            Show All ({rankedLeaders.length})
          </button>
        </div>
      )}
    </div>
  );
};
