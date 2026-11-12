import React from 'react';
import { Leader, UserRating } from '../types';
import { calculateOverallScore, getEffectiveScores, getTierForScore } from '../utils/scoring';
import { DIMENSIONS } from '../data/leaders';
import { AlertTriangle, BarChart3, Check, Plus, Star } from 'lucide-react';

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
      className="group relative flex flex-col justify-between p-5 rounded-xl bg-stone-900/70 border border-stone-800 hover:border-amber-700/60 transition-all duration-200 cursor-pointer hover:shadow-xl hover:shadow-black/40"
    >
      <div>
        {/* Top Header Row: Country Flag + Era / Century metadata (NO PILLS, clean text) */}
        <div className="flex items-center justify-between text-xs text-stone-400 mb-2.5">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-base">{leader.flag}</span>
            <span>{leader.country}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>{leader.century}</span>
          </div>

          {/* Tier indicator: Clean typographic stamp */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold tracking-wider uppercase"
            style={{
              backgroundColor: tier.bgColor,
              color: tier.color,
              border: `1px solid ${tier.borderColor}`,
            }}
          >
            <span>{tier.tier}-KATEGORİ</span>
          </div>
        </div>

        {/* Leader Portrait / Avatar + Name Lockup */}
        <div className="flex items-start gap-3.5 mb-3.5">
          <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-800 border border-stone-700/80">
            {leader.avatarUrl ? (
              <img
                src={leader.avatarUrl}
                alt={leader.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-950 text-stone-400 font-cinzel text-xl font-bold">
                {leader.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-stone-100 group-hover:text-amber-400 transition-colors truncate">
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
                  <span className="text-amber-400/90 font-medium">Özel Puanınız</span>
                </>
              )}
              {leader.isCustom && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-400">Özel Eklenen</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Leader Summary preview */}
        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-4">
          {leader.summary}
        </p>

        {/* 6 Dimension Mini Bar Sparklines */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-3 border-t border-stone-800/80 mb-4">
          {DIMENSIONS.map((dim) => {
            const val = scores[dim.key];
            return (
              <div key={dim.key} className="flex items-center justify-between text-[11px]">
                <span className="text-stone-400 truncate">{dim.shortLabel}</span>
                <span className="font-mono tabular-nums font-semibold text-stone-300 ml-1">
                  {val}
                </span>
              </div>
            );
          })}
        </div>

        {/* En Tartışmalı 3 Konusu - Bilgilendirme Amaçlı */}
        {leader.controversies && leader.controversies.length > 0 && (
          <div className="pt-3 border-t border-stone-800/80 mb-3 bg-stone-950/40 p-2.5 rounded-lg border border-rose-950/30">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>En Tartışmalı 3 Konusu (Bilgilendirme)</span>
            </div>
            <ol className="space-y-1.5 text-[11px]">
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

      {/* Card Footer: Overall Score + Compare Button */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-800/80">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[11px] text-stone-400 uppercase tracking-wider">Genel Skor:</span>
          <span
            className="text-xl font-bold font-mono tabular-nums"
            style={{ color: tier.color }}
          >
            {overallScore}
          </span>
          <span className="text-xs text-stone-500">/100</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCompare(leader);
          }}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            isCompared
              ? 'bg-amber-600 text-stone-950 font-semibold'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
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
