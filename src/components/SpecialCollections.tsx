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
      id: 'usa-presidents',
      culture: 'usa',
      title: 'United States: Presidents, Cabinet & Congress',
      subtitle: 'From Founding Fathers to Superpower Diplomacy & Modern Politics',
      description:
        'George Washington, Abraham Lincoln, FDR, JFK, Ronald Reagan, Barack Obama, Donald Trump, Henry Kissinger, George Marshall, Hillary Clinton, John McCain, and Bernie Sanders.',
      flag: '🇺🇸',
      icon: ShieldCheck,
      filterFn: (l) => l.category === 'usa' || l.countryCode === 'US',
    },
    {
      id: 'uk-premiers',
      culture: 'uk',
      title: 'United Kingdom: Crown, Downing Street & Parliament',
      subtitle: 'Monarchs, Prime Ministers, Chancellors & Reformers',
      description:
        'Winston Churchill, Margaret Thatcher, Clement Attlee, Elizabeth I, Queen Victoria, Aneurin Bevan, Ernest Bevin, William Wilberforce, Emmeline Pankhurst, Keir Starmer, and Rishi Sunak.',
      flag: '🇬🇧',
      icon: Crown,
      filterFn: (l) => l.category === 'uk' || l.countryCode === 'GB',
    },
    {
      id: 'germany-prussia',
      culture: 'germany',
      title: 'Germany & Prussia: Chancellors, Thinkers & Resistance',
      subtitle: 'From Frederick the Great and Bismarck to Modern Berlin',
      description:
        'Frederick the Great, Otto von Bismarck, Konrad Adenauer, Willy Brandt, Helmut Schmidt, Angela Merkel, Wolfgang Schäuble, Hans-Dietrich Genscher, Ursula von der Leyen, and Sophie Scholl.',
      flag: '🇩🇪',
      icon: ShieldCheck,
      filterFn: (l) => l.category === 'germany' || l.countryCode === 'DE',
    },
    {
      id: 'france-history',
      culture: 'france',
      title: 'France: Monarchy, Revolution, Empire & Fifth Republic',
      subtitle: 'From Charlemagne and Louis XIV to Napoleon and Macron',
      description:
        'Louis XIV, Marie Antoinette, Robespierre, Napoleon Bonaparte, Napoleon III, Charles de Gaulle, François Mitterrand, Emmanuel Macron, and Marine Le Pen.',
      flag: '🇫🇷',
      icon: Crown,
      filterFn: (l) => l.category === 'france' || l.countryCode === 'FR',
    },
    {
      id: 'turkey-presidents',
      culture: 'turkey',
      title: 'Turkey: Ottoman Empire & Modern Republic',
      subtitle: 'From Seljuks and Ottoman Sultans to Modern Turkish Politics',
      description:
        'Mustafa Kemal Atatürk, Mehmed the Conqueror, Suleiman the Magnificent, İsmet İnönü, Turgut Özal, Bülent Ecevit, Süleyman Demirel, Recep Tayyip Erdoğan, Ekrem İmamoğlu, and Özgür Özel.',
      flag: '🇹🇷',
      icon: Landmark,
      filterFn: (l) => l.category === 'turkey' || l.countryCode === 'TR',
    },
    {
      id: 'spain-monarchy',
      culture: 'spain',
      title: 'Spain: Global Monarchy & Modern Democracy',
      subtitle: 'From the Catholic Monarchs to Contemporary Politics',
      description:
        'Isabella I of Castile, Ferdinand II of Aragon, Philip II, Adolfo Suárez, Felipe González, and Pedro Sánchez.',
      flag: '🇪🇸',
      icon: Crown,
      filterFn: (l) => l.category === 'spain' || l.countryCode === 'ES',
    },
    {
      id: 'ancient-world',
      culture: 'ancient',
      title: 'Rome & the Classical World',
      subtitle: 'Republics, Emperors, Strategists, and Philosopher Kings',
      description:
        'Julius Caesar, Alexander the Great, Augustus, Trajan, Constantine the Great, Marcus Aurelius, and Pericles.',
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
                  {count} Figures
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
              Thematic National Collection
            </span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>{collectionLeaders.length} Figures Listed</span>
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
