import React from 'react';
import { Plus } from 'lucide-react';

export type NavTab = 'giants' | 'catalog' | 'compare' | 'tierlist' | 'collections';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  comparedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  comparedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand title, one line wordmark */}
        <button
          onClick={() => onSelectTab('giants')}
          className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="font-cinzel text-xl font-extrabold tracking-widest text-stone-100 group-hover:text-amber-400 transition-colors">
            PANTHEON
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 hidden sm:inline">
            ARCHIVE
          </span>
        </button>

        {/* Zone 2: 5 nav links, single-line text links */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onSelectTab('giants')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'giants'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>Tarihin Devleri</span>
            <span className="px-1.5 py-0.2 text-[9px] font-mono bg-amber-500/20 text-amber-400 font-bold rounded">
              Canlı
            </span>
          </button>

          <button
            onClick={() => onSelectTab('catalog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'catalog'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Lider Kataloğu
          </button>

          <button
            onClick={() => onSelectTab('compare')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'compare'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>Kıyaslama / Düello</span>
            {comparedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono bg-amber-500 text-stone-950 font-bold rounded-full">
                {comparedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('tierlist')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'tierlist'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Tier List
          </button>

          <button
            onClick={() => onSelectTab('collections')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'collections'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Özel Koleksiyonlar
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Yeni Lider Ekle</span>
            <span className="sm:hidden">Ekle</span>
          </button>
        </div>
      </div>
    </header>
  );
};
