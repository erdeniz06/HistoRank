import React, { useState } from 'react';
import { Leader, TierLevel, UserRating } from '../types';
import { TIERS, ERAS } from '../data/leaders';
import { calculateOverallScore, getEffectiveScores, getLeaderTierSubtitle, getTierForScore } from '../utils/scoring';
import { SlidersHorizontal, Layers, Sparkles } from 'lucide-react';

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

  // Filter leaders
  const filteredLeaders = leaders.filter((leader) => {
    if (selectedFilterCategory !== 'all' && leader.category !== selectedFilterCategory) {
      return false;
    }
    if (selectedFilterEra !== 'all' && leader.era !== selectedFilterEra) {
      return false;
    }
    return true;
  });

  // Group leaders by Tier
  const tierBuckets: Record<TierLevel, Leader[]> = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  };

  filteredLeaders.forEach((leader) => {
    const scores = getEffectiveScores(leader, userRatings, useUserRatings);
    const overall = calculateOverallScore(scores);
    const tier = getTierForScore(overall);
    tierBuckets[tier.tier].push(leader);
  });

  // Sort within each tier descending by score
  (Object.keys(tierBuckets) as TierLevel[]).forEach((t) => {
    tierBuckets[t].sort((a, b) => {
      const sa = calculateOverallScore(getEffectiveScores(a, userRatings, useUserRatings));
      const sb = calculateOverallScore(getEffectiveScores(b, userRatings, useUserRatings));
      return sb - sa;
    });
  });

  return (
    <div className="space-y-6">
      {/* Control Strip */}
      <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-100">
            Tarihsel Seviye Tablosu (Tier List)
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Liderlerin 6 eksendeki ortalama puanlarına göre S-D kademeleri
          </p>
        </div>

        {/* Filters & Mode Switch */}
        <div className="flex flex-wrap items-center gap-3">
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
              Benim Puanlarım
            </button>
            <button
              onClick={() => setUseUserRatings(false)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                !useUserRatings
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Konsensüs Puanları
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={selectedFilterCategory}
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-300 focus:outline-none"
          >
            <option value="all">Tüm Milletler & Ülkeler</option>
            <option value="turkey">🇹🇷 Türkiye & Türk Tarihi</option>
            <option value="germany">🇩🇪 Almanya</option>
            <option value="france">🇫🇷 Fransa</option>
            <option value="uk">🇬🇧 İngiltere</option>
            <option value="usa">🇺🇸 ABD</option>
            <option value="russia">🇷🇺 Rusya & SSCB</option>
            <option value="china">🇨🇳 Çin</option>
            <option value="japan">🇯🇵 Japonya</option>
            <option value="spain">🇪🇸 İspanya</option>
            <option value="italy">🇮🇹 İtalya</option>
            <option value="poland">🇵🇱 Polonya</option>
            <option value="belgium">🇧🇪 Belçika</option>
            <option value="netherlands">🇳🇱 Hollanda</option>
            <option value="cuba">🇨🇺 Küba</option>
            <option value="vietnam">🇻🇳 Vietnam</option>
            <option value="north-korea">🇰🇵 Kuzey Kore</option>
            <option value="cambodia">🇰🇭 Kamboçya</option>
            <option value="yugoslavia">🇷🇸 Yugoslavya</option>
            <option value="mongolia">🇲🇳 Moğolistan</option>
            <option value="egypt">🇪🇬 Mısır & Eyyubiler</option>
            <option value="iraq">🇮🇶 Irak</option>
            <option value="iran">🇮🇷 İran</option>
            <option value="syria">🇸🇾 Suriye</option>
            <option value="saudi-arabia">🇸🇦 Suudi Arabistan</option>
            <option value="palestine">🇵🇸 Filistin</option>
            <option value="israel">🇮🇱 İsrail</option>
            <option value="libya">🇱🇾 Libya</option>
            <option value="burkina-faso">🇧🇫 Burkina Faso</option>
            <option value="ghana">🇬🇭 Gana</option>
            <option value="tanzania">🇹🇿 Tanzanya</option>
            <option value="south-africa">🇿🇦 Güney Afrika</option>
            <option value="botswana">🇧🇼 Botsvana</option>
            <option value="azerbaijan">🇦🇿 Azerbaycan</option>
            <option value="armenia">🇦🇲 Ermenistan</option>
            <option value="georgia">🇬🇪 Gürcistan</option>
            <option value="greece">🇬🇷 Yunanistan</option>
            <option value="serbia">🇷🇸 Sırbistan</option>
            <option value="bosnia">🇧🇦 Bosna-Hersek</option>
            <option value="croatia">🇭🇷 Hırvatistan</option>
            <option value="bulgaria">🇧🇬 Bulgaristan</option>
            <option value="romania">🇷🇴 Romanya</option>
            <option value="albania">🇦🇱 Arnavutluk</option>
            <option value="north-macedonia">🇲🇰 Kuzey Makedonya</option>
            <option value="islamic">☪️ İslam Tarihi & Halifeler</option>
            <option value="ancient">🏛️ Antik Roma & Yunan</option>
          </select>

          {/* Era Filter */}
          <select
            value={selectedFilterEra}
            onChange={(e) => setSelectedFilterEra(e.target.value)}
            className="px-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-300 focus:outline-none"
          >
            <option value="all">Tüm Yüzyıllar / Dönemler</option>
            <option value="ancient">Antik Çağ</option>
            <option value="early-medieval">Erken Orta Çağ (MS 5.-10. yy)</option>
            <option value="medieval">Yüksek & Geç Orta Çağ</option>
            <option value="early-modern">Yeni Çağ</option>
            <option value="19th">19. Yüzyıl</option>
            <option value="20th">20. Yüzyıl</option>
            <option value="21st">21. Yüzyıl</option>
          </select>
        </div>
      </div>

      {/* Tiers Rows */}
      <div className="space-y-4">
        {TIERS.map((tierConfig) => {
          const leadersInTier = tierBuckets[tierConfig.tier];

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
                  {tierConfig.minScore}+ Puan
                </div>
                <div className="text-[11px] text-stone-300 max-w-[120px] hidden md:block mt-1 leading-tight">
                  {tierConfig.label}
                </div>
              </div>

              {/* Right Leader Grid */}
              <div className="flex-1 p-4 min-h-[100px] flex items-center">
                {leadersInTier.length === 0 ? (
                  <div className="text-xs text-stone-600 italic py-2">
                    Bu seviyede henüz lider bulunmuyor (filtrelere göre veya puanlama sonrası güncellenir).
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {leadersInTier.map((leader) => {
                      const scores = getEffectiveScores(leader, userRatings, useUserRatings);
                      const overall = calculateOverallScore(scores);
                      const tierSubtitle = getLeaderTierSubtitle(leader, scores, tierConfig.tier);

                      return (
                        <div
                          key={leader.id}
                          onClick={() => onSelectLeader(leader)}
                          className="group flex items-center gap-2.5 pl-3 pr-2 py-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/60 cursor-pointer transition-colors"
                          title={`${leader.name} - ${overall}/100 Puan (${tierConfig.tier} Tier · ${tierSubtitle})`}
                        >
                          <span className="text-lg shrink-0">{leader.flag}</span>

                          <div className="min-w-0 max-w-[140px]">
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
