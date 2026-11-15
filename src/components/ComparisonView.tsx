import React from 'react';
import { Leader, UserRating } from '../types';
import { DIMENSIONS } from '../data/leaders';
import {
  calculateOverallScore,
  getEffectiveScores,
  getLeaderPopularityScore,
  getLeaderPopularityTier,
  getPopularityLeagueInfo,
  getTierForScore,
} from '../utils/scoring';
import { RadarChart, RadarDataset } from './RadarChart';
import { Swords, X, Trophy, Plus, Sparkles } from 'lucide-react';

interface ComparisonViewProps {
  allLeaders: Leader[];
  comparedLeaders: Leader[];
  userRatings: Record<string, UserRating>;
  onRemoveLeader: (leaderId: string) => void;
  onAddLeader: (leader: Leader) => void;
  onSelectDuelPreset: (leaderIds: string[]) => void;
}

const COLOR_PALETTES = [
  { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.20)', text: 'text-amber-400', border: 'border-amber-500' },
  { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.20)', text: 'text-cyan-400', border: 'border-cyan-500' },
  { stroke: '#f43f5e', fill: 'rgba(244, 63, 94, 0.20)', text: 'text-rose-400', border: 'border-rose-500' },
];

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  allLeaders,
  comparedLeaders,
  userRatings,
  onRemoveLeader,
  onAddLeader,
  onSelectDuelPreset,
}) => {
  // Preset duels for quick inspiration
  const presets = [
    { label: 'Antik Çağ Devleri', ids: ['caesar', 'alexander-the-great', 'octavius'] },
    { label: 'Avrupa’nın Mimarları', ids: ['napoleon', 'otto-von-bismarck', 'frederick-the-great'] },
    { label: '20. Yüzyıl Devlet Adamları', ids: ['ataturk', 'charles-de-gaulle', 'winston-churchill'] },
    { label: 'Fransız İhtilali & Güç', ids: ['maximilien-robespierre', 'georges-danton', 'napoleon'] },
    { label: 'Türkiye CB Dönüşümü', ids: ['ataturk', 'ismet-inonu', 'turgut-ozal'] },
  ];

  const datasets: RadarDataset[] = comparedLeaders.map((leader, idx) => {
    const scores = getEffectiveScores(leader, userRatings);
    const color = COLOR_PALETTES[idx % COLOR_PALETTES.length];
    return {
      label: leader.name,
      scores,
      strokeColor: color.stroke,
      fillColor: color.fill,
      strokeWidth: 2.5,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header & Quick Preset Bar */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase tracking-wider mb-1">
              <Swords className="w-4 h-4" />
              <span>Tarihsel Düello & Kıyaslama Laboratuvarı</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-100">
              Liderleri Karşılaştırın
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              En fazla 3 lider seçerek 6 boyuttaki skorlarını radar diyagramı ve kıyaslama matrisinde inceleyin.
            </p>
          </div>

          {/* Quick Duel Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-500">Örnek Düellolar:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onSelectDuelPreset(preset.ids)}
                className="px-2.5 py-1 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Leader Tags */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-800/80">
          {comparedLeaders.map((leader, idx) => {
            const color = COLOR_PALETTES[idx % COLOR_PALETTES.length];
            const scores = getEffectiveScores(leader, userRatings);
            const overall = calculateOverallScore(scores);

            return (
              <div
                key={leader.id}
                className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-xs"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color.stroke }}
                />
                <span className="font-semibold text-stone-200">{leader.name}</span>
                <span className="text-stone-500">({leader.country})</span>
                <span className={`font-mono font-bold ${color.text}`}>
                  {overall}
                </span>
                <button
                  onClick={() => onRemoveLeader(leader.id)}
                  className="p-1 text-stone-500 hover:text-stone-300 transition-colors"
                  title="Kaldır"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {comparedLeaders.length < 3 && (
            <div className="relative">
              <select
                onChange={(e) => {
                  const found = allLeaders.find((l) => l.id === e.target.value);
                  if (found) onAddLeader(found);
                  e.target.value = '';
                }}
                defaultValue=""
                className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-750 text-stone-300 rounded-lg border border-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="" disabled>
                  + Lider Ekle ({3 - comparedLeaders.length} boş yer)...
                </option>
                {allLeaders
                  .filter((l) => !comparedLeaders.some((cl) => cl.id === l.id))
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.flag} {l.name} ({l.country})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {comparedLeaders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-stone-900/50 border border-dashed border-stone-800">
          <Swords className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-300">
            Kıyaslama İçin Henüz Lider Seçilmedi
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
            Katalogdan lider kartlarındaki "Kıyasla" butonuna tıklayarak veya yukarıdaki hazır düellolardan birini seçerek başlayabilirsiniz.
          </p>
          <button
            onClick={() =>
              onSelectDuelPreset(['caesar', 'alexander-the-great', 'octavius'])
            }
            className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg transition-colors"
          >
            Örnek Düelloyu Başlat (Sezar vs İskender vs Octavius)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Overlay Radar Chart Box */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-stone-300 mb-2">
              Ortak Radar Profili
            </h3>
            <p className="text-xs text-stone-500 mb-4 text-center">
              Farklı liderlerin yönetim stillerinin örtüşen ve ayrışan eksenleri
            </p>
            <RadarChart datasets={datasets} size={320} showLabels={true} />
          </div>

          {/* Dimension Matrix Comparison */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
              <h3 className="text-base font-semibold text-stone-200">
                Boyut Bazında Kafa Kafaya Karşılaştırma
              </h3>

              {DIMENSIONS.map((dim) => {
                // Determine highest score in this dimension
                const scoresList = comparedLeaders.map((leader) => {
                  const s = getEffectiveScores(leader, userRatings);
                  return s[dim.key];
                });
                const maxVal = Math.max(...scoresList);

                return (
                  <div
                    key={dim.key}
                    className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-200">
                        {dim.label}
                      </span>
                      <span className="text-stone-500 text-[11px]">
                        {dim.description}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {comparedLeaders.map((leader, idx) => {
                        const scores = getEffectiveScores(leader, userRatings);
                        const val = scores[dim.key];
                        const color = COLOR_PALETTES[idx % COLOR_PALETTES.length];
                        const isLeaderInThisDim = val === maxVal && scoresList.length > 1;

                        return (
                          <div key={leader.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 text-stone-300">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: color.stroke }}
                                />
                                {leader.name}
                                {isLeaderInThisDim && (
                                  <Trophy className="w-3 h-3 text-amber-400 inline ml-1" />
                                )}
                              </span>
                              <span
                                className={`font-mono tabular-nums font-bold ${
                                  isLeaderInThisDim ? 'text-amber-400' : 'text-stone-400'
                                }`}
                              >
                                {val} / 100
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${val}%`,
                                  backgroundColor: color.stroke,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Verdict Banner */}
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
              <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                Genel Skor Sıralaması
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[...comparedLeaders]
                  .sort((a, b) => {
                    const sa = calculateOverallScore(getEffectiveScores(a, userRatings));
                    const sb = calculateOverallScore(getEffectiveScores(b, userRatings));
                    return sb - sa;
                  })
                  .map((leader, rank) => {
                    const scores = getEffectiveScores(leader, userRatings);
                    const overall = calculateOverallScore(scores);
                    const tier = getTierForScore(overall);
                    const popScore = getLeaderPopularityScore(leader);
                    const popLeague = getPopularityLeagueInfo(getLeaderPopularityTier(leader));

                    return (
                      <div
                        key={leader.id}
                        className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                            <span>#{rank + 1} Sıra</span>
                            <span
                              className="font-bold font-mono px-1.5 py-0.5 rounded text-[10px]"
                              style={{ color: tier.color, backgroundColor: tier.bgColor }}
                            >
                              {tier.tier}
                            </span>
                          </div>
                          <h5 className="font-semibold text-sm text-stone-200">
                            {leader.name}
                          </h5>
                          <span className="text-[11px] text-stone-400 block">
                            {leader.country}
                          </span>
                          <span className={`text-[10px] font-medium block mt-1 ${popLeague.textClass}`}>
                            {popLeague.icon} {popLeague.shortLabel} ({popScore})
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1 mt-3">
                          <span
                            className="text-2xl font-bold font-mono"
                            style={{ color: tier.color }}
                          >
                            {overall}
                          </span>
                          <span className="text-xs text-stone-500">/ 100</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
