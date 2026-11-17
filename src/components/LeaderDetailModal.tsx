import React, { useState, useEffect } from 'react';
import { Leader, LeaderScores, UserRating } from '../types';
import { DIMENSIONS } from '../data/leaders';
import {
  calculateOverallScore,
  getEffectiveScores,
  getLeaderPopularityScore,
  getLeaderPopularityTier,
  getLeaderPowerRole,
  getLeaderTierSubtitle,
  getPopularityLeagueInfo,
  getPowerRoleLabel,
  getTierForScore,
  removeUserRating,
  saveUserRating,
} from '../utils/scoring';
import { RadarChart } from './RadarChart';
import {
  X,
  RotateCcw,
  Save,
  Sparkles,
  Award,
  AlertTriangle,
  Quote,
  Shield,
  Coins,
  Scale,
  Globe,
  Crown,
  Hourglass,
  Layers
} from 'lucide-react';

interface LeaderDetailModalProps {
  leader: Leader | null;
  userRating?: UserRating;
  onClose: () => void;
  onSaveRating: (rating: UserRating) => void;
  onResetRating: (leaderId: string) => void;
  isCompared: boolean;
  onToggleCompare: (leader: Leader) => void;
}

export const LeaderDetailModal: React.FC<LeaderDetailModalProps> = ({
  leader,
  userRating,
  onClose,
  onSaveRating,
  onResetRating,
  isCompared,
  onToggleCompare,
}) => {
  if (!leader) return null;

  const [currentScores, setCurrentScores] = useState<LeaderScores>({
    ...getEffectiveScores(leader, userRating ? { [leader.id]: userRating } : {})
  });
  const [userNotes, setUserNotes] = useState<string>(userRating?.notes || '');
  const [showConsensusOverlay, setShowConsensusOverlay] = useState<boolean>(true);
  const [aiCritique, setAiCritique] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    setCurrentScores({
      ...getEffectiveScores(leader, userRating ? { [leader.id]: userRating } : {})
    });
    setUserNotes(userRating?.notes || '');
    setAiCritique(null);
    setSaveSuccess(false);
  }, [leader, userRating]);

  const overallScore = calculateOverallScore(currentScores);
  const tier = getTierForScore(overallScore);
  const tierSubtitle = getLeaderTierSubtitle(leader, currentScores, tier.tier);
  const defaultOverallScore = calculateOverallScore(leader.defaultScores);

  const handleSliderChange = (key: keyof LeaderScores, val: number) => {
    setCurrentScores((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSave = () => {
    const rating: UserRating = {
      leaderId: leader.id,
      scores: currentScores,
      notes: userNotes.trim() ? userNotes.trim() : undefined,
      updatedAt: Date.now(),
    };
    onSaveRating(rating);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    setCurrentScores({ ...leader.defaultScores });
    setUserNotes('');
    onResetRating(leader.id);
  };

  const handleRequestAiCritique = async () => {
    setIsLoadingAi(true);
    setAiCritique(null);
    try {
      const res = await fetch('/api/historical-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaderName: leader.name,
          scores: currentScores,
          userNotes: userNotes,
        }),
      });
      const data = await res.json();
      setAiCritique(data.critique);
    } catch (err) {
      console.error(err);
      setAiCritique(
        `Your scores for ${leader.name} (Military: ${currentScores.military}, Economy: ${currentScores.economy}, Reform: ${currentScores.societal}) align closely with modern historiographical debates over this figure's legacy.`
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Icon mapping
  const getDimensionIcon = (name: string) => {
    switch (name) {
      case 'Shield': return <Shield className="w-4 h-4 text-red-400" />;
      case 'Coins': return <Coins className="w-4 h-4 text-amber-400" />;
      case 'Scale': return <Scale className="w-4 h-4 text-blue-400" />;
      case 'Globe': return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'Crown': return <Crown className="w-4 h-4 text-purple-400" />;
      case 'Hourglass': return <Hourglass className="w-4 h-4 text-orange-400" />;
      default: return <Award className="w-4 h-4 text-stone-400" />;
    }
  };

  const datasets = [
    {
      label: 'Your Rating',
      scores: currentScores,
      strokeColor: '#f59e0b', // amber-500
      fillColor: 'rgba(245, 158, 11, 0.25)',
      strokeWidth: 2.5,
    },
    ...(showConsensusOverlay
      ? [
          {
            label: 'Historical Consensus',
            scores: leader.defaultScores,
            strokeColor: '#38bdf8', // sky-400
            fillColor: 'rgba(56, 189, 248, 0.12)',
            strokeWidth: 1.5,
          },
        ]
      : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-stone-900 border border-stone-800 shadow-2xl overflow-hidden text-stone-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/70">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="text-lg">{leader.flag}</span>
            <span className="font-medium text-stone-200">{leader.country}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>{leader.century}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>{leader.yearsActive}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleCompare(leader)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isCompared
                  ? 'bg-amber-600 text-stone-950 font-semibold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Remove from Compare' : 'Add to Compare'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Hero Profile Block */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0 bg-stone-950 border border-stone-800 flex items-center justify-center text-4xl shadow-inner">
              {leader.flag}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-3 mb-1">
                <h2 className="text-2xl lg:text-3xl font-serif font-bold text-stone-100 tracking-tight">
                  {leader.name}
                </h2>
                {leader.originalName && leader.originalName !== leader.name && (
                  <span className="text-sm text-stone-400 italic">
                    ({leader.originalName})
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <p className="text-sm font-medium text-amber-500">
                  {leader.title}
                </p>
                <span className="text-stone-600" aria-hidden="true">·</span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                    getLeaderPowerRole(leader) === 'ruler' ? 'text-emerald-400' : 'text-sky-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      getLeaderPowerRole(leader) === 'ruler' ? 'bg-emerald-400' : 'bg-sky-400'
                    }`}
                  />
                  {getPowerRoleLabel(leader)}
                </span>
              </div>
              <p className="text-sm text-stone-300 leading-relaxed max-w-2xl">
                {leader.summary}
              </p>

              {leader.famousQuote && (
                <div className="mt-3.5 p-3 rounded-lg bg-stone-950/60 border border-stone-800/80 flex items-start gap-2.5">
                  <Quote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs italic text-stone-300 leading-normal">
                    "{leader.famousQuote}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Scoring Matrix & Radar Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-stone-800">
            {/* Left Column: 6 Dimension Sliders */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-stone-200">
                    Score Across 6 Dimensions
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Adjust sliders to customize your evaluation (0 – 100)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded transition-colors"
                    title="Reset to consensus scores"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Sliders list */}
              <div className="space-y-4">
                {DIMENSIONS.map((dim) => {
                  const val = currentScores[dim.key];
                  const defaultVal = leader.defaultScores[dim.key];
                  const diff = val - defaultVal;

                  return (
                    <div
                      key={dim.key}
                      className="p-3.5 rounded-xl bg-stone-950/50 border border-stone-800/80 hover:border-stone-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {getDimensionIcon(dim.iconName)}
                          <span className="text-sm font-medium text-stone-200">
                            {dim.label}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          {diff !== 0 && (
                            <span
                              className={`text-[11px] font-mono font-medium ${
                                diff > 0 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {diff > 0 ? `+${diff}` : diff}
                            </span>
                          )}
                          <span className="text-base font-bold font-mono tabular-nums text-amber-400">
                            {val}
                          </span>
                          <span className="text-xs text-stone-500">/100</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-400 mb-2 leading-relaxed">
                        {dim.description}
                      </p>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={val}
                        onChange={(e) =>
                          handleSliderChange(dim.key, parseInt(e.target.value, 10))
                        }
                        className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>

              {/* User Note Textarea */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-medium text-stone-300">
                  Personal Historical Notes & Commentary (Optional)
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Your personal assessment on their policies, successes, or failures..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs text-stone-200 bg-stone-950/70 border border-stone-800 rounded-lg focus:outline-none focus:border-amber-500 resize-none placeholder:text-stone-600"
                />
              </div>

              {/* Save Button Row */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-stone-500">
                  {saveSuccess && (
                    <span className="text-emerald-400 font-medium">
                      ✓ Your rating has been saved locally!
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-xs rounded-lg transition-colors shadow-md shadow-amber-950/30"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save My Rating</span>
                </button>
              </div>
            </div>

            {/* Right Column: Radar Chart & Tier & AI Analysis */}
            <div className="lg:col-span-5 flex flex-col items-center space-y-6 bg-stone-950/40 p-5 rounded-2xl border border-stone-800/80">
              {/* Overall Score Badge */}
              <div className="w-full flex items-center justify-between p-3.5 rounded-xl bg-stone-900 border border-stone-800">
                <div>
                  <span className="text-xs text-stone-400 block">Calculated Overall Score</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span
                      className="text-3xl font-extrabold font-mono tabular-nums"
                      style={{ color: tier.color }}
                    >
                      {overallScore}
                    </span>
                    <span className="text-xs text-stone-500">/ 100</span>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className="inline-block px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase mb-0.5"
                    style={{
                      backgroundColor: tier.bgColor,
                      color: tier.color,
                      border: `1px solid ${tier.borderColor}`,
                    }}
                  >
                    {tier.tier} TIER
                  </div>
                  <span className="text-[11px] text-stone-400 block">
                    {tierSubtitle}
                  </span>
                </div>
              </div>

              {/* Popularity / Global Recognition Strip (Separate from Merit Score) */}
              {(() => {
                const popScore = getLeaderPopularityScore(leader);
                const popLeague = getPopularityLeagueInfo(getLeaderPopularityTier(leader));
                return (
                  <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-900/70 border border-stone-800/80 text-xs">
                    <div className="min-w-0">
                      <span className="text-[11px] text-stone-400 block">
                        Global Recognition & Fame League
                      </span>
                      <span className={`font-semibold ${popLeague.textClass}`}>
                        {popLeague.icon} {popLeague.label}
                      </span>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="text-lg font-mono font-extrabold text-stone-100 tabular-nums">
                        {popScore}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">/100</span>
                    </div>
                  </div>
                );
              })()}

              {/* Radar Chart */}
              <div className="relative py-2">
                <RadarChart datasets={datasets} size={280} showLabels={true} />
              </div>

              {/* Overlay Toggle */}
              <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showConsensusOverlay}
                  onChange={(e) => setShowConsensusOverlay(e.target.checked)}
                  className="rounded border-stone-700 text-amber-500 focus:ring-0 accent-amber-500"
                />
                <span>Compare with Historical Consensus (Blue Line)</span>
              </label>

              {/* AI Historian Button & Response Container */}
              <div className="w-full pt-4 border-t border-stone-800">
                <button
                  onClick={handleRequestAiCritique}
                  disabled={isLoadingAi}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 font-medium text-xs rounded-xl transition-all border border-stone-700/80 hover:border-amber-600/50 disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {isLoadingAi
                      ? 'Preparing Historian Critique...'
                      : 'Get Historian Evaluation'}
                  </span>
                </button>

                {aiCritique && (
                  <div className="mt-4 p-4 rounded-xl bg-stone-900 border border-amber-900/40 text-xs text-stone-300 leading-relaxed space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Historical Evaluation & Scholar Report</span>
                    </div>
                    <p className="whitespace-pre-line text-stone-300">
                      {aiCritique}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Historical Achievements & Controversies Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-800">
            {/* Achievements */}
            <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800/80">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-3">
                <Award className="w-4 h-4" />
                <span>Key Historical Achievements & Reforms</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-300">
                {leader.keyAchievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Controversies */}
            <div className="p-4 rounded-xl bg-stone-950/60 border border-rose-950/40">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-3">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Top 3 Historical Controversies</span>
              </div>
              <ol className="space-y-2.5 text-xs text-stone-300">
                {leader.controversies.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="font-mono text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-1.5 py-0.5 rounded shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-stone-300">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
