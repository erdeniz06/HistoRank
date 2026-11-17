import React, { useState } from 'react';
import { EraKey, Leader, LeaderScores } from '../types';
import { DIMENSIONS, ERAS } from '../data/leaders';
import { X, Plus, Shield, Coins, Scale, Globe, Crown, Hourglass } from 'lucide-react';

interface AddLeaderModalProps {
  onClose: () => void;
  onAddLeader: (leader: Leader) => void;
}

export const AddLeaderModal: React.FC<AddLeaderModalProps> = ({
  onClose,
  onAddLeader,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('United States');
  const [flag, setFlag] = useState('🇺🇸');
  const [century, setCentury] = useState('20th c.');
  const [era, setEra] = useState<EraKey>('20th');
  const [yearsActive, setYearsActive] = useState('');
  const [summary, setSummary] = useState('');
  const [famousQuote, setFamousQuote] = useState('');
  const [scores, setScores] = useState<LeaderScores>({
    military: 75,
    economy: 75,
    societal: 75,
    diplomacy: 75,
    leadership: 75,
    legacy: 75,
  });

  const handleScoreChange = (key: keyof LeaderScores, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newLeader: Leader = {
      id: `custom-${Date.now()}-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name: name.trim(),
      title: title.trim() || 'Historical Statesperson',
      country: country.trim() || 'World',
      countryCode: 'CUSTOM',
      flag: flag || '👑',
      century: century || '20th c.',
      era: era || '20th',
      yearsActive: yearsActive.trim() || 'Not specified',
      category: 'custom',
      defaultScores: scores,
      summary: summary.trim() || 'Historical figure added by user.',
      keyAchievements: ['Added by user for historical evaluation.'],
      controversies: ['Historical controversies to be evaluated by the user.'],
      famousQuote: famousQuote.trim() || undefined,
      isCustom: true,
    };

    onAddLeader(newLeader);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-stone-900 border border-stone-800 shadow-2xl p-6 text-stone-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-100">
              Add New Historical Figure
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Add any world or national political figure to the archive and score them
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Leader Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Charles de Gaulle, Abraham Lincoln..."
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Title / Office
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., President, Prime Minister, Roman Emperor..."
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Country, Flag & Era */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Country / Civilization
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States, France, Rome..."
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Flag / Emblem (Emoji)
              </label>
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="🇺🇸, 🇫🇷, 🇩🇪, 🏛️, 👑..."
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Era
              </label>
              <select
                value={era}
                onChange={(e) => setEra(e.target.value as EraKey)}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none"
              >
                {ERAS.filter((e) => e.key !== 'all').map((e) => (
                  <option key={e.key} value={e.key}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Century & Active Years */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Century
              </label>
              <input
                type="text"
                value={century}
                onChange={(e) => setCentury(e.target.value)}
                placeholder="e.g., 20th c., 19th c., 1st c. BCE..."
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Years in Power / Active
              </label>
              <input
                type="text"
                value={yearsActive}
                onChange={(e) => setYearsActive(e.target.value)}
                placeholder="e.g., 1989 – 1993"
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Historical Summary & Impact
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Core policies, historical context, and role..."
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Famous Quote (Optional)
            </label>
            <input
              type="text"
              value={famousQuote}
              onChange={(e) => setFamousQuote(e.target.value)}
              placeholder="e.g., The only thing we have to fear is fear itself."
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* 6 Dimension Sliders */}
          <div className="pt-3 border-t border-stone-800">
            <h4 className="text-xs font-semibold text-stone-300 mb-3">
              Initial Dimension Scores (0 – 100)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DIMENSIONS.map((dim) => (
                <div
                  key={dim.key}
                  className="p-2.5 rounded-lg bg-stone-950 border border-stone-800"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-300">{dim.shortLabel}</span>
                    <span className="font-mono font-bold text-amber-400">
                      {scores[dim.key]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores[dim.key]}
                    onChange={(e) =>
                      handleScoreChange(dim.key, parseInt(e.target.value, 10))
                    }
                    className="w-full h-1 bg-stone-800 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold text-xs rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Save Figure</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
