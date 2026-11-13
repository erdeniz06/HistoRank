import React, { useState, useEffect } from 'react';
import { culturalAudio, CULTURES, CultureKey } from '../audio/culturalAudioEngine';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  SkipForward,
  ChevronDown,
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
  const [, setTick] = useState<number>(0);

  useEffect(() => {
    culturalAudio.setListener(() => {
      setIsPlaying(culturalAudio.getIsPlaying());
      setVolume(culturalAudio.getVolume());
      setTick((t) => t + 1);
    });
  }, []);

  const activeProfile =
    CULTURES.find((c) => c.key === currentCulture) || CULTURES[0];

  const currentTrack = culturalAudio.getCurrentTrack();
  const trackIndex = culturalAudio.getCurrentTrackIndex() + 1;
  const totalTracks = culturalAudio.getTotalTracksForCulture();

  const handleTogglePlay = () => {
    culturalAudio.togglePlay(currentCulture);
  };

  const handleNextTrack = () => {
    culturalAudio.nextTrack();
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
    <div className="relative border-b border-stone-800/60 bg-stone-950/80 px-4 sm:px-6 py-1.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        {/* Left: Play/Pause + Next + Active Track */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors shrink-0 ${
              isPlaying
                ? 'bg-amber-500 text-stone-950'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
            }`}
            title={isPlaying ? 'Duraklat' : 'Kültürel Müziği Başlat'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNextTrack}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 transition-colors shrink-0"
            title="Sonraki Beste"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm shrink-0">{activeProfile.flag}</span>
            <span className="text-stone-200 font-medium truncate">
              {isPlaying ? currentTrack.title : activeProfile.name}
            </span>
            <span className="text-stone-600 hidden sm:inline">·</span>
            <span className="text-[11px] text-stone-500 hidden sm:inline truncate">
              Eser {trackIndex}/{totalTracks}
            </span>
          </div>
        </div>

        {/* Right: Culture Selector + Volume */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-[11px] transition-colors"
            >
              <Music className="w-3 h-3 text-amber-500" />
              <span className="font-medium">{activeProfile.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-64 rounded-xl bg-stone-900 border border-stone-800 shadow-2xl p-1.5 z-50 text-xs space-y-0.5"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                {CULTURES.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => handleCultureChange(c.key)}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      c.key === currentCulture
                        ? 'bg-amber-500/15 text-amber-400 font-semibold'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-stone-400">
            <button
              onClick={() => culturalAudio.setVolume(volume > 0 ? 0 : 0.5)}
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
              className="w-14 sm:w-16 h-1 bg-stone-800 rounded appearance-none cursor-pointer accent-amber-500"
              title={`Ses: %${Math.round(volume * 100)}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
