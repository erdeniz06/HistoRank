import React from 'react';
import { Leader, UserRating } from '../types';
import { calculateOverallScore, getEffectiveScores, getTierForScore } from '../utils/scoring';
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
  const hasUserScore = !!userRating;

  return (
    <div
      onClick={() => onSelect(leader)}
      className="group flex flex-col justify-between p-5 rounded-xl bg-stone-900/60 border border-stone-800/90 hover:border-amber-600/50 hover:bg-stone-900 transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Header Metadata */}
        <div className="flex items-center justify-between text-xs text-stone-400 mb-3">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <span className="text-base shrink-0">{leader.flag}</span>
            <span className="font-medium text-stone-300 truncate">{leader.country}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="shrink-0">{leader.century}</span>
          </div>

          <span
            className="text-[11px] font-mono font-bold tracking-wider shrink-0 ml-2"
            style={{ color: tier.color }}
          >
            {tier.tier} · {overallScore}
          </span>
        </div>

        {/* Name & Title */}
        <div className="mb-2.5">
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
                <span className="text-amber-400 font-medium">Puanlandı</span>
              </>
            )}
            {leader.isCustom && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-400">Özel</span>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3.5">
          {leader.summary}
        </p>

        {/* Compact 6-Dimension Scores */}
        <div className="grid grid-cols-3 gap-x-3 gap-y-1 py-2.5 border-t border-stone-800/70 text-[11px]">
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} className="flex items-center justify-between">
              <span className="text-stone-500 truncate">{dim.shortLabel}</span>
              <span className="font-mono tabular-nums font-semibold text-stone-300 ml-1">
                {scores[dim.key]}
              </span>
            </div>
          ))}
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
