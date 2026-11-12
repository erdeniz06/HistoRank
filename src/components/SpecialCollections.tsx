import React from 'react';
import { Leader, UserRating } from '../types';
import { LeaderCard } from './LeaderCard';
import { CultureKey } from '../audio/culturalAudioEngine';
import { Flag, Landmark, ShieldCheck, Crown, BookOpen } from 'lucide-react';

interface SpecialCollectionsProps {
  leaders: Leader[];
  userRatings: Record<string, UserRating>;
  comparedIds: string[];
  onToggleCompare: (leader: Leader) => void;
  onSelectLeader: (leader: Leader) => void;
  onSelectCulture?: (culture: CultureKey) => void;
}

interface CollectionDef {
  id: string;
  culture: CultureKey;
  title: string;
  subtitle: string;
  description: string;
  flag: string;
  icon: any;
  filterFn: (leader: Leader) => boolean;
}

export const SpecialCollections: React.FC<SpecialCollectionsProps> = ({
  leaders,
  userRatings,
  comparedIds,
  onToggleCompare,
  onSelectLeader,
  onSelectCulture,
}) => {
  const collections: CollectionDef[] = [
    {
      id: 'turkey-presidents',
      culture: 'turkey',
      title: 'Türkiye Siyaseti: CB’ler, Başbakanlar & Güncel Liderler',
      subtitle: 'Cumhuriyetin kuruluşundan 13. CB’ye, Erbakan, Ecevit, Menderes, İmamoğlu ve Türkeş',
      description:
        'Mustafa Kemal Atatürk, İsmet İnönü, Turgut Özal, Süleyman Demirel, Recep Tayyip Erdoğan; efsane başbakanlar Necmettin Erbakan, Bülent Ecevit, Adnan Menderes, Tansu Çiller; güncel liderler Ekrem İmamoğlu, Mansur Yavaş, Kemal Kılıçdaroğlu, Devlet Bahçeli.',
      flag: '🇹🇷',
      icon: Landmark,
      filterFn: (l) => l.category === 'turkey' || l.countryCode === 'TR',
    },
    {
      id: 'uk-premiers',
      culture: 'uk',
      title: 'Birleşik Krallık: 10 Downing Street Başbakanları',
      subtitle: 'Son 25 yılın tüm başbakanları, Thatcher, Churchill & Tudor Çağı',
      description:
        'Keir Starmer, Rishi Sunak, Liz Truss, Boris Johnson, Theresa May, David Cameron, Gordon Brown, Tony Blair; efsanevi Margaret Thatcher ("Demir Leydi"), Winston Churchill ve Kraliçe I. Elizabeth.',
      flag: '🇬🇧',
      icon: Crown,
      filterFn: (l) => l.category === 'uk' || l.countryCode === 'GB',
    },
    {
      id: 'usa-presidents',
      culture: 'usa',
      title: 'Amerika Birleşik Devletleri: Beyaz Saray Başkanları',
      subtitle: 'Kurucu Babalardan Soğuk Savaş ve Modern Süper Güce',
      description:
        'Donald Trump, Joe Biden, Barack Obama, George W. Bush, Bill Clinton, Ronald Reagan, John F. Kennedy (JFK), Franklin D. Roosevelt (FDR), Abraham Lincoln ve George Washington.',
      flag: '🇺🇸',
      icon: ShieldCheck,
      filterFn: (l) => l.category === 'usa' || l.countryCode === 'US',
    },
    {
      id: 'france-history',
      culture: 'france',
      title: 'Fransa: İhtilal, İmparatorluk & Beşinci Cumhuriyet',
      subtitle: 'Giyotinden Élysée Sarayı’na Fransız Siyasi Tarihi',
      description:
        'Robespierre ve Danton’un ihtilal ateşi, Napolyon’un imparatorluk vizyonu, De Gaulle’ün cumhuriyet inşası, Macron ve Le Pen ile modern Fransız kutuplaşması.',
      flag: '🇫🇷',
      icon: Crown,
      filterFn: (l) => l.category === 'france' || l.countryCode === 'FR',
    },
    {
      id: 'germany-prussia',
      culture: 'germany',
      title: 'Almanya & Prusya: Demir Şansölyelerden Birleşmeye',
      subtitle: 'Kıta Avrupası’nın Güç Merkezinde Hükmedenler',
      description:
        'Büyük Friedrich’in aydın mutlakiyeti, Bismarck’ın kan ve demir diplomasisi, Hitler’in karanlık totaliter felaketi, Willy Brandt’ın barış atılımı, Helmut Kohl ve Angela Merkel.',
      flag: '🇩🇪',
      icon: ShieldCheck,
      filterFn: (l) => l.category === 'germany' || l.countryCode === 'DE',
    },
    {
      id: 'spain-monarchy',
      culture: 'spain',
      title: 'İspanya: Küresel Monarşi & Modern Siyaset',
      subtitle: 'Katolik Krallardan 4 Büyük Partinin Liderlerine',
      description:
        'I. İsabella’nın birleşik İspanya’sı, II. Felipe’nin cihan imparatorluğu, Pedro Sánchez, Alberto Feijóo, Santiago Abascal ve Yolanda Díaz.',
      flag: '🇪🇸',
      icon: Crown,
      filterFn: (l) => l.category === 'spain' || l.countryCode === 'ES',
    },
    {
      id: 'ancient-world',
      culture: 'ancient',
      title: 'Roma & Antik Dünyanın Fatihleri',
      subtitle: 'Cumhuriyetler, İmparatorluklar ve Felsefi Krallar',
      description:
        'Julius Caesar, Büyük İskender, ilk imparator Caesar Augustus (Octavius), Stoacı filozof-imparator Marcus Aurelius ve Atina demokrasisinin mimarı Perikles.',
      flag: '🏛️',
      icon: BookOpen,
      filterFn: (l) => l.category === 'ancient' || l.era === 'ancient',
    },
  ];

  const [activeCollectionId, setActiveCollectionId] = React.useState<string>(collections[0].id);
  const activeCol = collections.find((c) => c.id === activeCollectionId) || collections[0];
  const collectionLeaders = leaders.filter(activeCol.filterFn);

  const handleSelectCollection = (col: CollectionDef) => {
    setActiveCollectionId(col.id);
    onSelectCulture?.(col.culture);
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {collections.map((col) => {
          const isActive = col.id === activeCollectionId;
          const count = leaders.filter(col.filterFn).length;

          return (
            <button
              key={col.id}
              onClick={() => handleSelectCollection(col)}
              className={`p-4 rounded-xl text-left transition-all border ${
                isActive
                  ? 'bg-stone-900 border-amber-500/80 shadow-lg shadow-amber-950/20'
                  : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{col.flag}</span>
                <span className="text-xs font-mono font-medium text-stone-500">
                  {count} Lider
                </span>
              </div>
              <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-amber-400' : 'text-stone-200'}`}>
                {col.title.split(':')[0]}
              </h3>
              <p className="text-xs text-stone-400 line-clamp-1 mt-1">
                {col.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Collection Banner */}
      <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
            <span className="text-lg">{activeCol.flag}</span>
            <span className="font-semibold uppercase tracking-wider text-amber-500">
              Tematik Ulusal Koleksiyon
            </span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>{collectionLeaders.length} Lider Listelendi</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-100">
            {activeCol.title}
          </h2>
          <p className="text-xs text-stone-400 max-w-2xl mt-1.5 leading-relaxed">
            {activeCol.description}
          </p>
        </div>
      </div>

      {/* Grid of leaders in this collection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {collectionLeaders.map((leader) => (
          <LeaderCard
            key={leader.id}
            leader={leader}
            userRating={userRatings[leader.id]}
            isCompared={comparedIds.includes(leader.id)}
            onToggleCompare={onToggleCompare}
            onSelect={onSelectLeader}
          />
        ))}
      </div>
    </div>
  );
};
