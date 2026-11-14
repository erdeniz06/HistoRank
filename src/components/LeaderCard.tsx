import React from 'react';
import { Leader, UserRating } from '../types';
import { calculateOverallScore, getEffectiveScores, getLeaderTierSubtitle, getTierForScore } from '../utils/scoring';
import { DIMENSIONS } from '../data/leaders';
import { Check, Plus } from 'lucide-react';

interface LeaderCardProps {
  leader: Leader;
  userRating?: UserRating;
  isCompared: boolean;
  onToggleCompare: (leader: Leader) => void;
  onSelect: (leader: Leader) => void;
}

export const LeaderCard: React.FC<LeaderCardProps> = ({
  leader,
  userRating,
  isCompared,
  onToggleCompare,
  onSelect,
}) => {
  const scores = getEffectiveScores(leader, userRating ? { [leader.id]: userRating } : {});
  const overallScore = calculateOverallScore(scores);
  const tier = getTierForScore(overallScore);
  const tierSubtitle = getLeaderTierSubtitle(leader, scores, tier.tier);
  const hasUserScore = !!userRating;

  return (
    <div
      onClick={() => onSelect(leader)}
      className="group flex flex-col justify-between p-5 rounded-xl bg-stone-900/60 border border-stone-800/90 hover:border-amber-600/50 hover:bg-stone-900 transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Header Metadata */}
        <div className="flex items-center justify-between text-xs text-stone-400 mb-2.5">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <span className="text-base shrink-0">{leader.flag}</span>
            <span className="font-medium text-stone-300 truncate">{leader.country}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="shrink-0">{leader.century}</span>
          </div>
          <span className="text-[11px] font-mono text-stone-500 shrink-0 ml-2">
            {leader.yearsActive}
          </span>
        </div>

        {/* Name & Title */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-stone-100 group-hover:text-amber-400 transition-colors truncate">
            {leader.name}
          </h3>
          <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
            {leader.title}
          </p>
          {(hasUserScore || leader.isCustom) && (
            <div className="flex items-center gap-2 text-[11px] mt-1">
              {hasUserScore && (
                <span className="text-amber-400 font-semibold">✓ Sizin Puanınız Aktif</span>
              )}
              {leader.isCustom && (
                <span className="text-cyan-400 font-medium">Özel Eklendi</span>
              )}
            </div>
          )}
        </div>

        {/* High-Visibility Tier & Overall Score Strip */}
        <div
          className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border mb-3"
          style={{
            backgroundColor: tier.bgColor,
            borderColor: tier.borderColor,
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="px-2 py-0.5 rounded-md text-xs font-extrabold tracking-wider uppercase shrink-0 bg-stone-950/70 border"
              style={{
                color: tier.color,
                borderColor: tier.borderColor,
              }}
            >
              {tier.tier} TIER
            </span>
            <span className="text-[11px] font-medium text-stone-200 truncate">
              {tierSubtitle}
            </span>
          </div>

          <div className="flex items-baseline gap-0.5 shrink-0">
            <span
              className="text-2xl font-mono font-black tabular-nums leading-none"
              style={{ color: tier.color }}
            >
              {overallScore}
            </span>
            <span className="text-[11px] font-mono text-stone-400">/100</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3">
          {leader.summary}
        </p>

        {/* High-Visibility 6-Dimension Score Tiles */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {DIMENSIONS.map((dim) => {
            const val = scores[dim.key];
            return (
              <div
                key={dim.key}
                className="px-2 py-1.5 rounded-lg bg-stone-950/80 border border-stone-800/80"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] text-stone-400 truncate">{dim.shortLabel}</span>
                  <span className="text-xs font-mono tabular-nums font-extrabold text-stone-100">
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

        {/* Clean 3 Controversies List */}
        {leader.controversies && leader.controversies.length > 0 && (
          <div className="pt-2.5 border-t border-stone-800/70 mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-400/90 mb-1.5">
              Tartışmalı 3 Konu
            </div>
            <ol className="space-y-1 text-[11px]">
              {leader.controversies.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="font-mono text-rose-500/80 font-bold shrink-0">{idx + 1}.</span>
                  <span className="text-stone-400 line-clamp-1">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-800/70">
        <span className="text-xs text-stone-400 group-hover:text-amber-400 transition-colors font-medium">
          Puanla & İncele →
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(leader);
          }}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            isCompared
              ? 'bg-amber-500 text-stone-950 font-semibold'
              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white'
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
  );
};
