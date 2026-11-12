export type DimensionKey =
  | 'military'
  | 'economy'
  | 'societal'
  | 'diplomacy'
  | 'leadership'
  | 'legacy';

export interface DimensionInfo {
  key: DimensionKey;
  label: string;
  shortLabel: string;
  description: string;
  iconName: string;
  color: string;
}

export type EraKey =
  | 'all'
  | 'ancient'        // MÖ 3000 – MS 500
  | 'early-medieval'  // MS 5. yy – 10. yy (Erken Orta Çağ)
  | 'medieval'        // 11. yy – 15. yy (Yüksek & Geç Orta Çağ)
  | 'early-modern'   // 16. yy – 18. yy (Yeni Çağ)
  | '19th'           // 19. Yüzyıl (1801 - 1900)
  | '20th'           // 20. Yüzyıl (1901 - 2000)
  | '21st';          // 21. Yüzyıl & Günümüz

export interface EraInfo {
  key: EraKey;
  label: string;
  description: string;
  centuries: string[];
}

export type LeaderCategory =
  | 'all'
  | 'world'
  | 'turkey'
  | 'france'
  | 'germany'
  | 'uk'
  | 'usa'
  | 'spain'
  | 'ancient';

export type GeographicRegion =
  | 'all'
  | 'europe'
  | 'asia'
  | 'americas'
  | 'mediterranean'
  | 'world';

export type SubCategoryKey =
  | 'all'
  | 'ottoman-sultan'
  | 'tr-president'
  | 'tr-pm'
  | 'tr-party'
  | 'uk-monarch'
  | 'uk-pm'
  | 'uk-party'
  | 'us-president'
  | 'us-party'
  | 'de-chancellor'
  | 'de-party'
  | 'fr-leader'
  | 'fr-party'
  | 'es-monarch'
  | 'es-party'
  | 'ancient-rome'
  | 'ancient-greece'
  | 'world-icon';

export interface LeaderScores {
  military: number;
  economy: number;
  societal: number;
  diplomacy: number;
  leadership: number;
  legacy: number;
}

export interface Leader {
  id: string;
  name: string;
  originalName?: string;
  title: string;
  country: string;
  countryCode: string;
  flag: string;
  century: string;
  era: EraKey;
  yearsActive: string;
  avatarUrl?: string;
  category: 'world' | 'turkey' | 'france' | 'germany' | 'uk' | 'usa' | 'spain' | 'ancient' | 'custom';
  subCategory?: SubCategoryKey;
  region?: GeographicRegion;
  defaultScores: LeaderScores;
  summary: string;
  keyAchievements: string[];
  controversies: string[];
  famousQuote?: string;
  isCustom?: boolean;
}

export interface UserRating {
  leaderId: string;
  scores: LeaderScores;
  notes?: string;
  updatedAt: number;
}

export type TierLevel = 'S' | 'A' | 'B' | 'C' | 'D';

export interface TierConfig {
  tier: TierLevel;
  label: string;
  minScore: number;
  color: string;
  bgColor: string;
  borderColor: string;
}
