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
  | 'ancient'
  | 'medieval'
  | 'early-modern'
  | '19th'
  | '20th'
  | '21st';

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
  | 'ancient';

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
  category: 'world' | 'turkey' | 'france' | 'germany' | 'ancient' | 'custom';
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
