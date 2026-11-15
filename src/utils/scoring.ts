import { Leader, LeaderScores, TierConfig, TierLevel, UserRating } from '../types';
import { TIERS } from '../data/leaders';
export { getLeaderTierSubtitle } from './leaderEpithets';
export {
  POPULARITY_LEAGUES,
  getLeaderPopularityScore,
  getLeaderPopularityTier,
  getPopularityLeagueInfo,
} from './popularity';

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

/**
 * İktidara / egemen devlet yürütmesine (hükümdar, devlet başkanı, başbakan, bakan,
 * başkan yardımcısı, ordu/donanma başkomutanı) hiç geçememiş olan muhalefet liderleri,
 * düşünürler, azizler/teologlar ve parti/belediye/meclis figürleri.
 */
export const NON_RULER_IDS = new Set<string>([
  // Türkiye muhalefet / parti / belediye / örgüt
  'kemal-kilicdaroglu',
  'ozgur-ozel',
  'umit-ozdag',
  'muharrem-ince',
  'fatih-erbakan',
  'erkan-bas',
  'musavat-dervisoglu',
  'dem-parti-liderleri',
  'selahattin-demirtas',
  'figen-yuksekdag',
  'leyla-zana',
  'sirri-sureyya-onder',
  'pervin-buldan',
  'mithat-sancar',
  'abdullah-ocalan',
  'ahmet-turk',
  'ekrem-imamoglu',
  'mansur-yavas',
  'yakup-cemil',
  'kuscubasi-esref',
  'ahmet-riza-bey',

  // Fransa muhalefet
  'marine-le-pen',
  'jordan-bardella',
  'jean-luc-melenchon',
  'eric-zemmour',

  // Almanya muhalefet & Marksist / SPD düşünürler
  'alice-weidel',
  'sahra-wagenknecht',
  'heidi-reichinnek',
  'karl-marx',
  'friedrich-engels',
  'rosa-luxemburg',
  'karl-liebknecht',
  'august-bebel',
  'karl-kautsky',
  'eduard-bernstein',
  'clara-zetkin',
  'bertolt-brecht',

  // İngiltere muhalefet
  'kemi-badenoch',
  'nigel-farage',
  'ed-davey',
  'jeremy-corbyn',

  // ABD Kongre / Vali / Muhalefet (Başkan / VP / Kabine olmamış isimler)
  'hakeem-jeffries',
  'mike-johnson',
  'paul-ryan',
  'gavin-newsom',
  'bernie-sanders',
  'alexandria-ocasio-cortez',
  'rand-paul',
  'nikki-haley',
  'ron-desantis',

  // Avrupa diğer muhalefet / belediye / meclis
  'alberto-feijoo',
  'santiago-abascal',
  'isabel-diaz-ayuso',
  'elly-schlein',
  'nikos-androulakis',
  'bart-de-wever',
  'paul-magnette',
  'georges-louis-bouchez',
  'geert-wilders',
  'pieter-omtzigt',
  'rafal-trzaskowski',
  'szymon-holownia',

  // Hristiyanlık Tarihi düşünür/azizler & diğer bağımsızlık önderleri / devlet-dışı aktörler
  'st-paul',
  'st-augustine',
  'st-benedict',
  'st-francis-assisi',
  'st-thomas-aquinas',
  'martin-luther',
  'mahatma-gandhi',
  'jose-marti',
  'vasil-levski',
  'sheikh-ahmed-yassin',
  'abdel-aziz-al-rantisi',
  'khaled-mashal',
  'mohammed-deif',
]);

export function getLeaderPowerRole(leader: Leader): 'ruler' | 'non-ruler' {
  if (leader.powerRole) return leader.powerRole;
  if (NON_RULER_IDS.has(leader.id)) return 'non-ruler';
  if (leader.subCategory === 'de-thinker' || leader.subCategory === 'christian-thinker') {
    return 'non-ruler';
  }
  return 'ruler';
}

export function getPowerRoleLabel(leader: Leader): string {
  const role = getLeaderPowerRole(leader);
  if (role === 'ruler') {
    return 'Devlet Yönetimi / İktidar';
  }
  if (leader.subCategory === 'christian-thinker') {
    return 'Dini Önder / Teolog';
  }
  if (leader.subCategory === 'de-thinker' || leader.id === 'mahatma-gandhi' || leader.id === 'jose-marti') {
    return 'Fikir & Hareket Önderi';
  }
  return 'Muhalefet / İktidar Dışı';
}

