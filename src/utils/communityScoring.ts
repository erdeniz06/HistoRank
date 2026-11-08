import { Leader, LeaderScores } from '../types';

export interface CommunityLeaderData {
  leaderId: string;
  entryCount: number; // 0 = symbolic baseline, >=1 = crowdsourced average
  scores: LeaderScores;
  lastUpdated: number;
  recentVotes: {
    timestamp: number;
    overall: number;
    scores: LeaderScores;
    voterName?: string;
  }[];
}

const GIANTS_STORAGE_KEY = 'pantheon_giants_community_scores_v2';

// The IDs of the true historical heavyweights for the "Devler" list
export const GIANTS_IDS = [
  'ataturk',
  'caesar',
  'alexander-the-great',
  'napoleon',
  'fatih-mehmed',
  'genghis-khan',
  'otto-von-bismarck',
  'octavius',
  'marcus-aurelius',
  'frederick-the-great',
  'abraham-lincoln',
  'winston-churchill',
  'charles-de-gaulle',
  'suleiman-the-magnificent',
  'saladin',
  'peter-the-great',
];

export function loadAllCommunityData(): Record<string, CommunityLeaderData> {
  try {
    const raw = localStorage.getItem(GIANTS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load community scores', e);
    return {};
  }
}

export function saveAllCommunityData(data: Record<string, CommunityLeaderData>): void {
  try {
    localStorage.setItem(GIANTS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save community scores', e);
  }
}

export function getLeaderCommunityData(
  leaderId: string,
  symbolicDefaultScores: LeaderScores
): CommunityLeaderData {
  const all = loadAllCommunityData();
  if (all[leaderId]) {
    return all[leaderId];
  }

  // Initial symbolic baseline (0 entries)
  return {
    leaderId,
    entryCount: 0,
    scores: { ...symbolicDefaultScores },
    lastUpdated: 0,
    recentVotes: [],
  };
}

/**
 * Submit an entry.
 * Critical user rule: "Hani 1 entry girildiği an o yeni ortalama olsun"
 * If entryCount === 0, the first entry directly becomes the 100% new live average!
 * For subsequent entries, it updates the running mathematical average.
 */
export function submitCommunityEntry(
  leaderId: string,
  symbolicDefaultScores: LeaderScores,
  newScores: LeaderScores,
  voterName = 'Kullanıcı'
): CommunityLeaderData {
  const all = loadAllCommunityData();
  const current = all[leaderId] || {
    leaderId,
    entryCount: 0,
    scores: { ...symbolicDefaultScores },
    lastUpdated: 0,
    recentVotes: [],
  };

  let updatedScores: LeaderScores;
  let newCount: number;

  if (current.entryCount === 0) {
    // 1st entry rule: That entry immediately becomes the new average!
    newCount = 1;
    updatedScores = { ...newScores };
  } else {
    // Running weighted average for entries >= 2
    newCount = current.entryCount + 1;
    const calc = (key: keyof LeaderScores) => {
      const sum = current.scores[key] * current.entryCount + newScores[key];
      return Math.round(sum / newCount);
    };

    updatedScores = {
      military: calc('military'),
      economy: calc('economy'),
      societal: calc('societal'),
      diplomacy: calc('diplomacy'),
      leadership: calc('leadership'),
      legacy: calc('legacy'),
    };
  }

  const overall = Math.round(
    (updatedScores.military +
      updatedScores.economy +
      updatedScores.societal +
      updatedScores.diplomacy +
      updatedScores.leadership +
      updatedScores.legacy) /
      6
  );

  const updatedEntry: CommunityLeaderData = {
    leaderId,
    entryCount: newCount,
    scores: updatedScores,
    lastUpdated: Date.now(),
    recentVotes: [
      {
        timestamp: Date.now(),
        overall,
        scores: newScores,
        voterName,
      },
      ...(current.recentVotes || []).slice(0, 9), // keep last 10 entries
    ],
  };

  all[leaderId] = updatedEntry;
  saveAllCommunityData(all);
  return updatedEntry;
}

export function resetCommunityData(leaderId?: string): void {
  if (leaderId) {
    const all = loadAllCommunityData();
    delete all[leaderId];
    saveAllCommunityData(all);
  } else {
    localStorage.removeItem(GIANTS_STORAGE_KEY);
  }
}
