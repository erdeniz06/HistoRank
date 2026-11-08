import React, { useState, useEffect } from 'react';
import { culturalAudio, CULTURES, CultureKey } from '../audio/culturalAudioEngine';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Radio,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface AudioPlayerBarProps {
  currentCulture: CultureKey;
  onSelectCulture: (c: CultureKey) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentCulture,
  onSelectCulture,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(culturalAudio.getIsPlaying());
  const [volume, setVolume] = useState<number>(culturalAudio.getVolume());
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    culturalAudio.setListener(() => {
      setIsPlaying(culturalAudio.getIsPlaying());
      setVolume(culturalAudio.getVolume());
    });
  }, []);

  const activeProfile =
    CULTURES.find((c) => c.key === currentCulture) || CULTURES[0];

  const handleTogglePlay = () => {
    culturalAudio.togglePlay(currentCulture);
  };

  const handleCultureChange = (key: CultureKey) => {
    onSelectCulture(key);
    culturalAudio.switchCulture(key);
    setIsDropdownOpen(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    culturalAudio.setVolume(val);
  };

  return (
    <div className="relative border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md px-4 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Play button + animated soundwave indicator */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all shrink-0 ${
              isPlaying
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
            }`}
            title={isPlaying ? 'Müziği Duraklat' : 'Kültürel Ambiyans Müziğini Başlat'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Sound wave visualizer animation */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3.5 px-1">
              <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-2.5" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce h-3.5 delay-75" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-1.5 delay-150" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce h-3 delay-100" />
            </div>
          )}

          {/* Active Culture Details */}
          <div className="flex items-center gap-2">
            <span className="text-base">{activeProfile.flag}</span>
            <div>
              <div className="flex items-center gap-1.5 font-medium text-stone-200">
                <span className="text-amber-400 font-semibold">{activeProfile.name}</span>
                <span className="text-stone-600 hidden sm:inline">·</span>
                <span className="text-[11px] text-stone-400 hidden sm:inline">
                  {activeProfile.scaleDescription}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 hidden md:block">
                {activeProfile.instruments} · (Üretken Algoritmik Sentez)
              </p>
            </div>
          </div>
        </div>

        {/* Right: Cultural Selector Dropdown + Volume Slider */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Culture Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-[11px] transition-colors"
            >
              <Music className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Ambiyans Değiştir:</span>
              <span className="font-semibold">{activeProfile.flag} {activeProfile.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-64 rounded-xl bg-stone-900 border border-stone-800 shadow-2xl p-1.5 z-50 text-xs space-y-0.5"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500 border-b border-stone-800/80 mb-1">
                  Kültürel Ambiyans Seçin
                </div>
                {CULTURES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => handleCultureChange(c.key)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      c.key === currentCulture
                        ? 'bg-amber-500/15 text-amber-400 font-semibold'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-500">{c.scaleDescription.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5 text-stone-400">
            <button
              onClick={() => {
                if (volume > 0) {
                  culturalAudio.setVolume(0);
                } else {
                  culturalAudio.setVolume(0.5);
                }
              }}
              className="hover:text-stone-200 transition-colors"
              title={volume === 0 ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-14 sm:w-20 h-1 bg-stone-800 rounded appearance-none cursor-pointer accent-amber-500"
              title={`Ses: %${Math.round(volume * 100)}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
