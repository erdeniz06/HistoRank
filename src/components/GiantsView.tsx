import React, { useState, useMemo } from 'react';
import { Leader, LeaderScores } from '../types';
import { DIMENSIONS } from '../data/leaders';
import {
  GIANTS_IDS,
  CommunityLeaderData,
  loadAllCommunityData,
  submitCommunityEntry,
  resetCommunityData,
} from '../utils/communityScoring';
import {
  calculateOverallScore,
  getLeaderPopularityScore,
  getLeaderPopularityTier,
  getPopularityLeagueInfo,
  getTierForScore,
} from '../utils/scoring';
import { RadarChart, RadarDataset } from './RadarChart';
import {
  Flame,
  Swords,
  Trophy,
  Users,
  Vote,
  Sparkles,
  RotateCcw,
  Check,
  ChevronRight,
  TrendingUp,
  Sliders,
  Shield,
  Coins,
  Scale,
  Globe,
  Crown,
  Hourglass,
  X,
  AlertTriangle,
} from 'lucide-react';

interface GiantsViewProps {
  allLeaders: Leader[];
  onSelectLeader: (leader: Leader) => void;
  onSelectCulture?: (culture: any) => void;
}

export const GiantsView: React.FC<GiantsViewProps> = ({
  allLeaders,
  onSelectLeader,
}) => {
  // Filter only the designated heavyweight Giants
  const giants = allLeaders.filter((l) => GIANTS_IDS.includes(l.id));

  // Community data state
  const [communityData, setCommunityData] = useState<Record<string, CommunityLeaderData>>(
    () => loadAllCommunityData()
  );

  // Duel arena state
  const [duelFighter1Id, setDuelFighter1Id] = useState<string>('ataturk');
  const [duelFighter2Id, setDuelFighter2Id] = useState<string>('caesar');

  // Quick voting modal state
  const [votingLeader, setVotingLeader] = useState<Leader | null>(null);
  const [votingScores, setVotingScores] = useState<LeaderScores | null>(null);
  const [voterName, setVoterName] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [eraBand, setEraBand] = useState<'all' | 'ancient' | 'medieval' | 'early-modern' | 'modern'>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  const giantCountries = useMemo(() => {
    const map = new Map<string, { key: string; flag: string; label: string }>();
    for (const g of giants) {
      if (!map.has(g.category)) {
        map.set(g.category, { key: g.category, flag: g.flag, label: g.country });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [giants]);

  // Helper to get effective live community scores
  const getLeaderLiveScores = (leader: Leader): { scores: LeaderScores; entryCount: number; lastUpdated: number } => {
    const data = communityData[leader.id];
    if (data && data.entryCount > 0) {
      return {
        scores: data.scores,
        entryCount: data.entryCount,
        lastUpdated: data.lastUpdated,
      };
    }
    return {
      scores: leader.defaultScores,
      entryCount: 0,
      lastUpdated: 0,
    };
  };

  const matchesEraBand = (leader: Leader) => {
    if (eraBand === 'all') return true;
    if (eraBand === 'ancient') return leader.era === 'ancient';
    if (eraBand === 'medieval') return leader.era === 'early-medieval' || leader.era === 'medieval';
    if (eraBand === 'early-modern') return leader.era === 'early-modern' || leader.era === '19th';
    return leader.era === '20th' || leader.era === '21st';
  };

  // Sort giants by live crowdsourced overall score (tiebreak by global fame)
  const sortedGiants = [...giants]
    .filter(matchesEraBand)
    .filter((l) => countryFilter === 'all' || l.category === countryFilter)
    .sort((a, b) => {
      const scoreA = calculateOverallScore(getLeaderLiveScores(a).scores);
      const scoreB = calculateOverallScore(getLeaderLiveScores(b).scores);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return getLeaderPopularityScore(b) - getLeaderPopularityScore(a);
    });

  // Open Vote modal
  const handleOpenVote = (leader: Leader) => {
    const current = getLeaderLiveScores(leader);
    setVotingLeader(leader);
    setVotingScores({ ...current.scores });
  };

  // Submit Vote / Entry
  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!votingLeader || !votingScores) return;

    const updated = submitCommunityEntry(
      votingLeader.id,
      votingLeader.defaultScores,
      votingScores,
      voterName.trim() || 'Historian'
    );

    setCommunityData((prev) => ({
      ...prev,
      [votingLeader.id]: updated,
    }));

    const isFirst = updated.entryCount === 1;
    setSuccessNotice(
      isFirst
        ? `🔥 First entry submitted for ${votingLeader.name} and immediately set as the new live average!`
        : `✓ New entry recorded for ${votingLeader.name}; community average updated (Entry #${updated.entryCount})!`
    );

    setVotingLeader(null);
    setVotingScores(null);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  // Reset all community entries back to initial symbolic baseline
  const handleResetAll = () => {
    if (window.confirm('Reset all community ratings and return to the symbolic historical baseline scores?')) {
      resetCommunityData();
      setCommunityData({});
      setSuccessNotice('All ratings have been reset to the symbolic historical baseline.');
      setTimeout(() => setSuccessNotice(null), 3000);
    }
  };

  const fighter1 = giants.find((l) => l.id === duelFighter1Id) || giants[0];
  const fighter2 = giants.find((l) => l.id === duelFighter2Id) || giants[1];

  const f1Data = getLeaderLiveScores(fighter1);
  const f2Data = getLeaderLiveScores(fighter2);

  const f1Overall = calculateOverallScore(f1Data.scores);
  const f2Overall = calculateOverallScore(f2Data.scores);
  const f1Tier = getTierForScore(f1Overall);
  const f2Tier = getTierForScore(f2Overall);
  const f1PopScore = getLeaderPopularityScore(fighter1);
  const f1PopLeague = getPopularityLeagueInfo(getLeaderPopularityTier(fighter1));
  const f2PopScore = getLeaderPopularityScore(fighter2);
  const f2PopLeague = getPopularityLeagueInfo(getLeaderPopularityTier(fighter2));

  const duelDatasets: RadarDataset[] = [
    {
      label: fighter1.name,
      scores: f1Data.scores,
      strokeColor: '#f59e0b',
      fillColor: 'rgba(245, 158, 11, 0.22)',
      strokeWidth: 2.5,
    },
    {
      label: fighter2.name,
      scores: f2Data.scores,
      strokeColor: '#06b6d4',
      fillColor: 'rgba(6, 182, 212, 0.22)',
      strokeWidth: 2.5,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Marquee for GIANTS */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/30 border border-amber-600/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>League of Giants · Sovereign Heads of State & Global Icons</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-100 tracking-tight">
              History’s Highest-Stature Sovereign Rulers
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Entry here requires passing a dual bar: <strong className="text-emerald-400 font-semibold">Supreme Sovereign State Authority</strong> (emperors, monarchs, presidents, and prime ministers—never ministers or local officials) plus <strong className="text-amber-400 font-semibold">Global Historical Recognition</strong>.
              Cabinet ministers, generals, and thinkers are evaluated separately in the Tier List.
            </p>
          </div>

          {/* Quick Stats & Reset Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <button
              onClick={handleResetAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-950/80 hover:bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs transition-colors"
              title="Reset to symbolic baseline scores"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Scores</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successNotice && (
          <div className="relative z-10 mt-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}
      </div>

      {/* DUEL ARENA */}
      <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-0.5">
              <Swords className="w-4 h-4" />
              <span>Giants Duel Arena</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-100">
              Head-to-Head Live Showdown
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400">Quick Matchups:</span>
            <button
              onClick={() => { setDuelFighter1Id('ataturk'); setDuelFighter2Id('caesar'); }}
              className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors"
            >
              Atatürk vs Caesar
            </button>
            <button
              onClick={() => { setDuelFighter1Id('napoleon'); setDuelFighter2Id('alexander-the-great'); }}
              className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors"
            >
              Napoleon vs Alexander
            </button>
            <button
              onClick={() => { setDuelFighter1Id('winston-churchill'); setDuelFighter2Id('franklin-d-roosevelt'); }}
              className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors"
            >
              Churchill vs FDR
            </button>
            <button
              onClick={() => { setDuelFighter1Id('george-washington'); setDuelFighter2Id('abraham-lincoln'); }}
              className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors"
            >
              Washington vs Lincoln
            </button>
            <button
              onClick={() => { setDuelFighter1Id('fatih-mehmed'); setDuelFighter2Id('saladin'); }}
              className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors"
            >
              Mehmed II vs Saladin
            </button>
            <button
              onClick={() => { setDuelFighter1Id('queen-elizabeth-1'); setDuelFighter2Id('queen-victoria'); }}
              className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors"
            >
              Elizabeth I vs Victoria
            </button>
          </div>
        </div>

        {/* Fighters Head-to-Head Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Fighter 1 Card */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-stone-950/80 border border-amber-500/40 relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">
                1ST CORNER (LEADER)
              </span>
              <select
                value={duelFighter1Id}
                onChange={(e) => setDuelFighter1Id(e.target.value)}
                className="text-xs bg-stone-900 border border-stone-800 rounded px-2 py-1 text-stone-300 focus:outline-none"
              >
                {giants.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.flag} {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-stone-900 border border-amber-500/40 shrink-0 flex items-center justify-center text-2xl">
                {fighter1.flag}
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-stone-100 truncate">
                  {fighter1.name}
                </h3>
                <p className="text-xs text-stone-400 line-clamp-1">
                  {fighter1.country} · {fighter1.century}
                </p>
                <div className="flex items-center flex-wrap gap-2 mt-1.5">
                  <span className="text-2xl font-mono font-extrabold text-amber-400 tabular-nums">
                    {f1Overall}
                  </span>
                  <span className="text-xs text-stone-500">/ 100</span>
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                    style={{
                      color: f1Tier.color,
                      backgroundColor: f1Tier.bgColor,
                      borderColor: f1Tier.borderColor,
                    }}
                  >
                    {f1Tier.tier} TIER
                  </span>
                  <span className="text-[10px] text-stone-500">
                    ({f1Data.entryCount > 0 ? `${f1Data.entryCount} ${f1Data.entryCount === 1 ? 'Entry' : 'Entries'}` : 'Symbolic'})
                  </span>
                </div>
                <div className={`text-[10px] font-medium mt-1 ${f1PopLeague.textClass}`}>
                  {f1PopLeague.icon} {f1PopLeague.shortLabel} ({f1PopScore}/100)
                </div>
              </div>
            </div>

            {fighter1.controversies && fighter1.controversies.length > 0 && (
              <div className="bg-stone-900/80 p-2.5 rounded-lg border border-amber-950/40 text-[11px] space-y-1">
                <div className="flex items-center gap-1 font-semibold text-rose-400">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>Top 3 Controversies:</span>
                </div>
                {fighter1.controversies.slice(0, 3).map((c, idx) => (
                  <p key={idx} className="text-stone-300 leading-snug line-clamp-1">
                    <span className="font-mono text-rose-500 font-bold mr-1">{idx + 1}.</span>
                    {c}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={() => handleOpenVote(fighter1)}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-colors shadow-sm"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Rate {fighter1.name}</span>
            </button>
          </div>

          {/* VS Center Radar */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center py-2">
            <div className="text-center mb-1">
              <span className="font-cinzel text-2xl font-black text-stone-600 tracking-widest">
                VS
              </span>
            </div>
            <RadarChart datasets={duelDatasets} size={280} showLabels={true} />
          </div>

          {/* Fighter 2 Card */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-stone-950/80 border border-cyan-500/40 relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400">
                2ND CORNER (CHALLENGER)
              </span>
              <select
                value={duelFighter2Id}
                onChange={(e) => setDuelFighter2Id(e.target.value)}
                className="text-xs bg-stone-900 border border-stone-800 rounded px-2 py-1 text-stone-300 focus:outline-none"
              >
                {giants.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.flag} {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-stone-900 border border-cyan-500/40 shrink-0 flex items-center justify-center text-2xl">
                {fighter2.flag}
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-stone-100 truncate">
                  {fighter2.name}
                </h3>
                <p className="text-xs text-stone-400 line-clamp-1">
                  {fighter2.country} · {fighter2.century}
                </p>
                <div className="flex items-center flex-wrap gap-2 mt-1.5">
                  <span className="text-2xl font-mono font-extrabold text-cyan-400 tabular-nums">
                    {f2Overall}
                  </span>
                  <span className="text-xs text-stone-500">/ 100</span>
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                    style={{
                      color: f2Tier.color,
                      backgroundColor: f2Tier.bgColor,
                      borderColor: f2Tier.borderColor,
                    }}
                  >
                    {f2Tier.tier} TIER
                  </span>
                  <span className="text-[10px] text-stone-500">
                    ({f2Data.entryCount > 0 ? `${f2Data.entryCount} ${f2Data.entryCount === 1 ? 'Entry' : 'Entries'}` : 'Symbolic'})
                  </span>
                </div>
                <div className={`text-[10px] font-medium mt-1 ${f2PopLeague.textClass}`}>
                  {f2PopLeague.icon} {f2PopLeague.shortLabel} ({f2PopScore}/100)
                </div>
              </div>
            </div>

            {fighter2.controversies && fighter2.controversies.length > 0 && (
              <div className="bg-stone-900/80 p-2.5 rounded-lg border border-cyan-950/40 text-[11px] space-y-1">
                <div className="flex items-center gap-1 font-semibold text-rose-400">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>Top 3 Controversies:</span>
                </div>
                {fighter2.controversies.slice(0, 3).map((c, idx) => (
                  <p key={idx} className="text-stone-300 leading-snug line-clamp-1">
                    <span className="font-mono text-rose-500 font-bold mr-1">{idx + 1}.</span>
                    {c}
                  </p>
                ))}
              </div>
            )}

            <button
              onClick={() => handleOpenVote(fighter2)}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-stone-950 rounded-lg transition-colors shadow-sm"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Rate {fighter2.name}</span>
            </button>
          </div>
        </div>

        {/* 6 Dimension Duel Bar Rows */}
        <div className="pt-4 border-t border-stone-800/80 space-y-2.5">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
            Head-to-Head Difference Across 6 Dimensions
          </div>

          {DIMENSIONS.map((dim) => {
            const v1 = f1Data.scores[dim.key];
            const v2 = f2Data.scores[dim.key];
            const f1Wins = v1 >= v2;

            return (
              <div
                key={dim.key}
                className="p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/70 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 w-32 truncate">
                  <span className={`font-mono font-bold ${f1Wins ? 'text-amber-400' : 'text-stone-400'}`}>
                    {v1}
                  </span>
                  <span className="text-stone-300 truncate">{fighter1.name.split(' ')[0]}</span>
                </div>

                <div className="flex-1 px-4 flex flex-col items-center">
                  <span className="text-[11px] font-medium text-stone-400">{dim.shortLabel}</span>
                  <div className="w-full flex items-center gap-1 h-1.5 bg-stone-800 rounded-full overflow-hidden mt-1 max-w-xs">
                    <div
                      className="h-full bg-amber-500 rounded-l-full transition-all duration-300"
                      style={{ width: `${(v1 / (v1 + v2 || 1)) * 100}%` }}
                    />
                    <div
                      className="h-full bg-cyan-500 rounded-r-full transition-all duration-300"
                      style={{ width: `${(v2 / (v1 + v2 || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 w-32 truncate">
                  <span className="text-stone-300 truncate">{fighter2.name.split(' ')[0]}</span>
                  <span className={`font-mono font-bold ${!f1Wins ? 'text-cyan-400' : 'text-stone-400'}`}>
                    {v2}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LEAGUE OF GIANTS LEADERBOARD */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-100">
              League of Giants Leaderboard
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Strictly world-famous sovereign Heads of State & Rulers ({giants.length} titans). First community entry sets the live average immediately.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">🌐 All Countries</option>
              {giantCountries.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.flag} {c.label}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
              {[
                { key: 'all', label: 'All Eras' },
                { key: 'ancient', label: 'Ancient' },
                { key: 'medieval', label: 'Medieval' },
                { key: 'early-modern', label: '16th–19th c.' },
                { key: 'modern', label: '20th–21st c.' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setEraBand(item.key as any)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    eraBand === item.key ? 'bg-amber-500 text-stone-950 font-semibold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-stone-500 font-mono">
              {sortedGiants.length} Giants
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedGiants.map((leader, index) => {
            const { scores, entryCount } = getLeaderLiveScores(leader);
            const overall = calculateOverallScore(scores);
            const tier = getTierForScore(overall);
            const isFirstEntry = entryCount === 1;
            const popScore = getLeaderPopularityScore(leader);
            const popLeague = getPopularityLeagueInfo(getLeaderPopularityTier(leader));

            return (
              <div
                key={leader.id}
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Rank badge + Status */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-extrabold text-xs ${
                          index === 0
                            ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                            : index === 1
                            ? 'bg-stone-300 text-stone-950'
                            : index === 2
                            ? 'bg-amber-700 text-stone-100'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <span className="font-medium text-stone-400">
                        {leader.country} · {leader.century}
                      </span>
                    </div>

                    {/* Entry status badge */}
                    {entryCount === 0 ? (
                      <span className="text-[11px] text-stone-500 italic">
                        Symbolic (0 Entries)
                      </span>
                    ) : isFirstEntry ? (
                      <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        1st Entry Live Average!
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {entryCount}-Voter Average
                      </span>
                    )}
                  </div>

                  {/* Leader Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      onClick={() => onSelectLeader(leader)}
                      className="w-11 h-11 rounded-xl bg-stone-950 border border-stone-800 shrink-0 cursor-pointer flex items-center justify-center text-2xl hover:border-amber-500/50 transition-colors"
                    >
                      {leader.flag}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => onSelectLeader(leader)}
                        className="text-base font-bold text-stone-100 hover:text-amber-400 transition-colors truncate cursor-pointer"
                      >
                        {leader.name}
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
                        {leader.title}
                      </p>
                      <div className="text-[10px] font-medium mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="text-amber-400/90">
                          ★ World-Famous Sovereign Ruler
                        </span>
                        <span className="text-stone-600">·</span>
                        <span className={popLeague.textClass}>
                          {popLeague.icon} {popScore}/100 Fame
                        </span>
                      </div>

                      {/* Prominent Tier + Score Strip */}
                      <div
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border mt-2.5"
                        style={{
                          backgroundColor: tier.bgColor,
                          borderColor: tier.borderColor,
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-stone-950/70 border shrink-0"
                            style={{
                              color: tier.color,
                              borderColor: tier.borderColor,
                            }}
                          >
                            {tier.tier} TIER
                          </span>
                          <span className="text-[11px] font-medium text-stone-200 truncate">
                            {tier.label}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-0.5 shrink-0">
                          <span
                            className="text-2xl font-mono font-black tabular-nums leading-none"
                            style={{ color: tier.color }}
                          >
                            {overall}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">/100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6 Dimension Score Tiles */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {DIMENSIONS.map((dim) => {
                      const val = scores[dim.key];
                      return (
                        <div
                          key={dim.key}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-950/80 border border-stone-800/80"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-stone-400 truncate">{dim.shortLabel}</span>
                            <span className="text-xs font-mono font-extrabold text-stone-100 ml-1 tabular-nums">
                              {val}
                            </span>
                          </div>
                          <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{ width: `${val}%`, backgroundColor: dim.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Top 3 Controversies (Informational) */}
                  {leader.controversies && leader.controversies.length > 0 && (
                    <div className="mb-4 bg-stone-950/70 p-2.5 rounded-xl border border-rose-950/40 text-[11px]">
                      <div className="flex items-center gap-1.5 font-semibold text-rose-400 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>Top 3 Controversies:</span>
                      </div>
                      <ol className="space-y-1">
                        {leader.controversies.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-snug">
                            <span className="font-mono text-rose-500 font-bold shrink-0">{idx + 1}.</span>
                            <span className="text-stone-300 line-clamp-2">{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-stone-800">
                  <button
                    onClick={() => handleOpenVote(leader)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                  >
                    <Vote className="w-3.5 h-3.5" />
                    <span>Enter Rating & Set Average</span>
                  </button>

                  <button
                    onClick={() => {
                      if (duelFighter1Id === leader.id) {
                        setDuelFighter2Id(leader.id === 'ataturk' ? 'caesar' : 'ataturk');
                      } else {
                        setDuelFighter1Id(leader.id);
                      }
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-1 py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-lg transition-colors"
                    title="Send to Duel Arena"
                  >
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    <span>Duel</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK ENTRY VOTING MODAL */}
      {votingLeader && votingScores && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div
            className="relative w-full max-w-lg rounded-2xl bg-stone-900 border border-stone-800 p-6 text-stone-100 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-xs text-amber-500 font-semibold uppercase tracking-wider block">
                  Live Rating Entry
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-100">
                  {votingLeader.name}
                </h3>
              </div>
              <button
                onClick={() => { setVotingLeader(null); setVotingScores(null); }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEntry} className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                💡 <strong>Rule:</strong> If this is the first community entry for this figure, your scores immediately become the <strong>new live average</strong>!
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Your Name or Handle (Optional)
                </label>
                <input
                  type="text"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  placeholder="e.g. HistoryBuff, Alex, etc."
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 6 Sliders */}
              <div className="space-y-3 pt-2">
                {DIMENSIONS.map((dim) => (
                  <div
                    key={dim.key}
                    className="p-2.5 rounded-lg bg-stone-950 border border-stone-800"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-stone-300 font-medium">{dim.label}</span>
                      <span className="font-mono font-bold text-amber-400">
                        {votingScores[dim.key]} / 100
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={votingScores[dim.key]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setVotingScores((prev) => prev ? { ...prev, [dim.key]: val } : null);
                      }}
                      className="w-full h-1 bg-stone-800 rounded appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                ))}
              </div>

              {/* Calculated new average preview */}
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-400">Your Submitted Overall Average:</span>
                <span className="text-2xl font-mono font-extrabold text-amber-400">
                  {calculateOverallScore(votingScores)} / 100
                </span>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => { setVotingLeader(null); setVotingScores(null); }}
                  className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors shadow-md"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Update Average & Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
