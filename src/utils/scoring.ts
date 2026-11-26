import { AuthorityTier, Leader, LeaderboardScope, LeaderScores, TierConfig, TierLevel, UserRating } from '../types';
import { TIERS } from '../data/leaders';
import { getLeaderPopularityScore } from './popularity';
export { getLeaderTierSubtitle } from './leaderEpithets';
export {
  POPULARITY_LEAGUES,
  getLeaderPopularityScore,
  getLeaderPopularityTier,
  getPopularityLeagueInfo,
} from './popularity';
export { GIANTS_IDS, GIANTS_ID_SET, isGiantLeader } from './communityScoring';

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
  'jean-jaures',

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
  'adolf-eichmann',

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
  'john-calvin',
  'sakamoto-ryoma',
  'zeki-velidi-togan',
  'mahatma-gandhi',
  'jose-marti',
  'vasil-levski',
  'sheikh-ahmed-yassin',
  'abdel-aziz-al-rantisi',
  'khaled-mashal',
  'mohammed-deif',
  'andrei-sakharov',
]);

/**
 * Cabinet ministers, grand viziers/chief ministers serving under a monarch,
 * vice presidents, judges, central bank chairs, and field commanders/admirals
 * who held high executive or military office below the sovereign Head of State/Government.
 */
export const CABINET_OR_COMMANDER_IDS = new Set<string>([
  // Turkey — Pure Republican Cabinet Ministers & Party Coalition Deputies
  'hasan-ali-yucel',
  'mahmut-esat-bozkurt',
  'tevfik-rustu-aras',
  'numan-menemencioglu',
  'sukru-kaya',
  'fatin-rustu-zorlu',
  'kemal-dervis',
  'ismail-cem',
  'ali-babacan',
  'meral-aksener',
  'devlet-bahceli',
  'alparslan-turkes',
  // Turkey — War of Independence Pashas, Marshals & Military Chiefs
  'fevzi-cakmak',
  'kazim-karabekir',
  'ali-fuat-cebesoy',
  'refet-bele',
  'nurettin-pasa',
  'fahrettin-altay',
  'cevat-cobanli',
  'faruk-gurler',
  'muhsin-batur',
  'memduh-tagmac',
  'cemal-madanoglu',
  'esref-bitlis',
  // Ottoman & Seljuk / Göktürk Grand Viziers, Viziers & Commanders
  'barbaros-hayreddin-pasa',
  'piri-reis',
  'turgut-reis',
  'kilic-ali-pasa',
  'sokullu-mehmed-pasa',
  'pargali-ibrahim-pasa',
  'koprulu-mehmed-pasa',
  'cezayirli-gazi-hasan-pasa',
  'gazi-osman-pasa',
  'mithat-pasa',
  'enver-pasa',
  'cemal-pasa',
  'talat-pasa',
  'mahmud-sevket-pasa',
  'said-halim-pasa',
  'damat-ferid-pasa',
  'ali-kemal',
  'ahmed-tevfik-pasa',
  'nizamulmulk',
  'vezir-tonyukuk',
  'kul-tigin',
  // United States — Cabinet Secretaries, Vice Presidents, Judiciary, Fed & Commanders
  'benjamin-franklin',
  'alexander-hamilton',
  'henry-kissinger',
  'hillary-clinton',
  'george-marshall',
  'colin-powell',
  'condoleezza-rice',
  'robert-mcnamara',
  'antony-blinken',
  'marco-rubio',
  'janet-yellen',
  'jerome-powell',
  'j-edgar-hoover',
  'john-marshall',
  'ruth-bader-ginsburg',
  'jd-vance',
  'kamala-harris',
  'mike-pence',
  'dick-cheney',
  'al-gore',
  'pete-buttigieg',
  'tulsi-gabbard',
  'robert-f-kennedy-jr',
  'douglas-macarthur',
  // United Kingdom — Cabinet Ministers, Deputy PMs, Naval Admirals & Regional First Ministers
  'horatio-nelson',
  'rachel-reeves',
  'tony-benn',
  'aneurin-bevan',
  'ernest-bevin',
  'robin-cook',
  'david-lammy',
  'angela-rayner',
  'yvette-cooper',
  'george-osborne',
  'jeremy-hunt',
  'kwasi-kwarteng',
  'michael-heseltine',
  'kenneth-clarke',
  'suella-braverman',
  'priti-patel',
  'jacob-rees-mogg',
  'nick-clegg',
  'nicola-sturgeon',
  'alex-salmond',
  // Germany — Cabinet Ministers, Vice Chancellors & Regional Minister-Presidents
  'robert-habeck',
  'boris-pistorius',
  'christian-lindner',
  'markus-soder',
  'franz-josef-strauss',
  'joschka-fischer',
  'annalena-baerbock',
  'oskar-lafontaine',
  'wolfgang-schauble',
  'hans-dietrich-genscher',
  'ursula-von-der-leyen',
  'egon-bahr',
  'cem-ozdemir',
  'karl-lauterbach',
  'nancy-faeser',
  'lars-klingbeil',
  'matthias-erzberger',
  'walther-rathenau',
  'joseph-goebbels',
  'hermann-goring',
  // France, Italy & Spain — Chief Ministers, Cabinet Ministers & Generals
  'cardinal-richelieu',
  'georges-danton',
  'marquis-de-lafayette',
  'joan-of-arc',
  'jean-monnet',
  'simone-veil',
  'emile-vandervelde',
  'paul-hymans',
  'bruno-retailleau',
  'giuseppe-garibaldi',
  'matteo-salvini',
  'yolanda-diaz',
  'pablo-iglesias-turrion',
  // Russia, USSR, China, Japan, India, Cuba, Vietnam, Israel, Iran & Islamic Commanders
  'leon-trotsky',
  'georgy-zhukov',
  'lavrentiy-beria',
  'mikhail-kutuzov',
  'zheng-he',
  'okubo-toshimichi',
  'saigo-takamori',
  'togo-heihachiro',
  'sardar-patel',
  'bhimrao-ambedkar',
  'che-guevara',
  'vo-nguyen-giap',
  'moshe-dayan',
  'benny-gantz',
  'amir-kabir',
  'qasem-soleimani',
  'mohammad-bagheri',
  'hossein-salami',
  'amir-ali-hajizadeh',
  'mohammad-reza-zahedi',
  'ali-sayyad-shirazi',
  'hassan-tehrani-moghaddam',
  'mostafa-chamran',
  'halid-bin-velid',
  'tarik-bin-ziyad',
  // Western Classical, Early Modern & WWII Field Generals, Marshals & Chief Diplomats
  'william-wallace',
  'hannibal-barca',
  'belisarius',
  'duke-of-marlborough',
  'charles-maurice-de-talleyrand',
  'klemens-von-metternich',
  'helmuth-von-moltke',
  'robert-e-lee',
  'william-tecumseh-sherman',
  'george-patton',
  'bernard-montgomery',
  'erwin-rommel',
]);

export function getLeaderAuthorityTier(leader: Leader): AuthorityTier {
  if (CABINET_OR_COMMANDER_IDS.has(leader.id)) {
    return 'cabinet';
  }
  if (leader.subCategory === 'ottoman-commander' || leader.subCategory === 'ir-commander') {
    return 'cabinet';
  }
  if (leader.subCategory === 'islamic-commander' && leader.id !== 'sultan-baybars') {
    return 'cabinet';
  }
  if (
    NON_RULER_IDS.has(leader.id) ||
    leader.powerRole === 'non-ruler' ||
    leader.subCategory === 'de-thinker' ||
    leader.subCategory === 'christian-thinker'
  ) {
    return 'opposition';
  }
  return 'sovereign';
}

export function getAuthorityTierLabel(leader: Leader): string {
  const tier = getLeaderAuthorityTier(leader);
  if (tier === 'sovereign') {
    return 'Head of State / Ruler';
  }
  if (tier === 'cabinet') {
    return 'Minister / Commander';
  }
  if (leader.subCategory === 'christian-thinker') {
    return 'Religious Leader / Theologian';
  }
  if (
    leader.subCategory === 'de-thinker' ||
    leader.id === 'mahatma-gandhi' ||
    leader.id === 'jose-marti' ||
    leader.id === 'sakamoto-ryoma'
  ) {
    return 'Thinker & Movement Leader';
  }
  return 'Opposition / Non-Executive';
}

export const FAMOUS_RULER_MIN_SCORE = 80;

export function hasLeaderGoverned(leader: Leader): boolean {
  return getLeaderAuthorityTier(leader) !== 'opposition';
}

export function isFamousRuler(leader: Leader): boolean {
  return hasLeaderGoverned(leader) && getLeaderPopularityScore(leader) >= FAMOUS_RULER_MIN_SCORE;
}

export function matchesLeaderboardScope(leader: Leader, scope: LeaderboardScope): boolean {
  if (scope === 'all') return true;
  if (!hasLeaderGoverned(leader)) return false;
  const pop = getLeaderPopularityScore(leader);
  if (scope === 'famous-rulers') return pop >= FAMOUS_RULER_MIN_SCORE;
  return pop < FAMOUS_RULER_MIN_SCORE;
}

export function getSimpleStatusLabel(leader: Leader): string {
  const tier = getLeaderAuthorityTier(leader);
  if (tier === 'opposition') {
    if (leader.subCategory === 'christian-thinker') return 'Religious / Theologian (Non-Ruler)';
    if (
      leader.subCategory === 'de-thinker' ||
      leader.id === 'mahatma-gandhi' ||
      leader.id === 'jose-marti' ||
      leader.id === 'sakamoto-ryoma'
    ) {
      return 'Thinker / Movement (Non-Ruler)';
    }
    return 'Opposition / Non-Ruler';
  }
  const famous = getLeaderPopularityScore(leader) >= FAMOUS_RULER_MIN_SCORE;
  if (tier === 'sovereign') {
    return famous ? 'World-Famous Ruler' : 'National / Lesser-Known Ruler';
  }
  return famous ? 'Famous Minister / Commander' : 'Minister / Commander';
}

export function getLeaderPowerRole(leader: Leader): 'ruler' | 'non-ruler' {
  if (leader.powerRole) return leader.powerRole;
  if (NON_RULER_IDS.has(leader.id)) return 'non-ruler';
  if (leader.subCategory === 'de-thinker' || leader.subCategory === 'christian-thinker') {
    return 'non-ruler';
  }
  return 'ruler';
}

export function getPowerRoleLabel(leader: Leader): string {
  return getSimpleStatusLabel(leader);
}

