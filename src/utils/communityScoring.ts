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

// Curated "League of Giants" roster: strictly world-renowned, consequential sovereign Heads of State & Rulers.
// Cabinet ministers, grand viziers, field commanders without sovereign rule, local politicians, and non-state thinkers
// are intentionally excluded and evaluated on their own separate authority scale.
export const GIANTS_IDS = [
  // Antiquity & Classical World
  'caesar',
  'octavius',
  'alexander-the-great',
  'constantine-the-great',
  'marcus-aurelius',
  'trajan',
  'hadrian',
  'justinian-i',
  'pericles',
  'kleopatra-7',
  'ramses-2',
  'khufu-keops',
  'tutankhamun',
  // Medieval, Caliphates, Turkic & Steppe Empires
  'charlemagne',
  'genghis-khan',
  'kubilay-han',
  'emir-timur',
  'attila',
  'saladin',
  'sultan-alparslan',
  'hz-ebubekir',
  'hz-omer',
  'harun-resid',
  'sultan-baybars',
  'fatih-mehmed',
  'yavuz-sultan-selim',
  'suleiman-the-magnificent',
  'osman-gazi',
  'abdulhamid-2',
  // Early Modern & 19th-Century Monarchs / Nation-Builders
  'queen-elizabeth-1',
  'william-the-conqueror',
  'queen-victoria',
  'elizabeth-2',
  'louis-14',
  'napoleon',
  'napoleon-3',
  'peter-the-great',
  'ii-katerina',
  'ivan-the-terrible',
  'frederick-the-great',
  'otto-von-bismarck',
  'isabella-castile',
  // East & South Asia Emperors & Founding Statesmen
  'qin-shi-huang',
  'emperor-wu-han',
  'kangxi-emperor',
  'sun-yat-sen',
  'mao-zedong',
  'deng-xiaoping',
  'xi-jinping',
  'emperor-meiji',
  'tokugawa-ieyasu',
  'ashoka-the-great',
  'akbar-the-great',
  'jawaharlal-nehru',
  'narendra-modi',
  // United States Presidents
  'george-washington',
  'thomas-jefferson',
  'abraham-lincoln',
  'theodore-roosevelt',
  'franklin-d-roosevelt',
  'dwight-eisenhower',
  'john-f-kennedy',
  'ronald-reagan',
  'barack-obama',
  'donald-trump',
  // United Kingdom & France & Germany & Italy
  'winston-churchill',
  'clement-attlee',
  'margaret-thatcher',
  'tony-blair',
  'charles-de-gaulle',
  'emmanuel-macron',
  'konrad-adenauer',
  'willy-brandt',
  'angela-merkel',
  'adolf-hitler',
  'benito-mussolini',
  'giorgia-meloni',
  // Russia & USSR
  'vladimir-lenin',
  'josef-stalin',
  'nikita-khrushchev',
  'mikhail-gorbachev',
  'vladimir-putin',
  // Modern Turkey & World Titans
  'ataturk',
  'recep-tayyip-erdogan',
  'nelson-mandela',
  'fidel-castro',
  'ho-chi-minh',
  'shinzo-abe',
  'lula-da-silva',
  'volodymyr-zelenskyy',
  'cemal-abdunnasir',
  'ruhollah-khomeini',
  'david-ben-gurion',
  'josip-broz-tito',
  'saddam-hussein',
  'muammar-gaddafi',
];

export const GIANTS_ID_SET = new Set<string>(GIANTS_IDS);

export function isGiantLeader(leaderId: string): boolean {
  return GIANTS_ID_SET.has(leaderId);
}

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
  voterName = 'Member'
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
