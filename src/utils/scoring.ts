import { Leader, LeaderScores, TierConfig, TierLevel, UserRating } from '../types';
import { TIERS } from '../data/leaders';

const RATINGS_STORAGE_KEY = 'pantheon_user_ratings_v1';
const CUSTOM_LEADERS_KEY = 'pantheon_custom_leaders_v1';

export function calculateOverallScore(scores: LeaderScores): number {
  const sum =
    scores.military +
    scores.economy +
    scores.societal +
    scores.diplomacy +
    scores.leadership +
    scores.legacy;
  return Math.round(sum / 6);
}

export function getTierForScore(score: number): TierConfig {
  for (const tier of TIERS) {
    if (score >= tier.minScore) {
      return tier;
    }
  }
  return TIERS[TIERS.length - 1];
}

export function getEffectiveScores(
  leader: Leader,
  userRatings: Record<string, UserRating>,
  preferUser = true
): LeaderScores {
  if (preferUser && userRatings[leader.id]) {
    return userRatings[leader.id].scores;
  }
  return leader.defaultScores;
}

export function loadUserRatings(): Record<string, UserRating> {
  try {
    const raw = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user ratings', e);
    return {};
  }
}

export function saveUserRating(rating: UserRating): void {
  try {
    const current = loadUserRatings();
    current[rating.leaderId] = rating;
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save user rating', e);
  }
}

export function removeUserRating(leaderId: string): void {
  try {
    const current = loadUserRatings();
    delete current[leaderId];
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to remove rating', e);
  }
}

export function loadCustomLeaders(): Leader[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LEADERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom leaders', e);
    return [];
  }
}

export function saveCustomLeader(leader: Leader): void {
  try {
    const current = loadCustomLeaders();
    const updated = [leader, ...current.filter((l) => l.id !== leader.id)];
    localStorage.setItem(CUSTOM_LEADERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom leader', e);
  }
}
