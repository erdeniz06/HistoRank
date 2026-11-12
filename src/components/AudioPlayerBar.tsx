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
  Disc3,
  Radio,
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
    <div className="relative border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md px-4 sm:px-6 py-2 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Play/Pause + Next Track + Animated Vinyl/Wave Indicator */}
        <div className="flex items-center gap-2.5">
          {/* Play / Pause Button */}
          <button
            onClick={handleTogglePlay}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all shrink-0 ${
              isPlaying
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-500/30'
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

          {/* Next Song / Eser Değiştir Button */}
          <button
            onClick={handleNextTrack}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-400 border border-stone-800 transition-colors shrink-0"
            title="Sonraki Şarkıya / Temaya Geç (Makam & Beste Değişir)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Sound wave visualizer animation */}
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5 px-1">
              <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-2.5" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce h-3.5 delay-75" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-1.5 delay-150" />
              <span className="w-0.5 bg-amber-400 rounded-full animate-bounce h-3 delay-100" />
            </div>
          ) : (
            <Disc3 className="w-4 h-4 text-stone-600 hidden sm:block" />
          )}

          {/* Active Culture & Currently Playing Track Information */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">{activeProfile.flag}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-medium text-stone-200 truncate">
                <span className="text-amber-400 font-semibold truncate">
                  {isPlaying ? currentTrack.title : activeProfile.name}
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-[11px] text-stone-400 hidden md:inline truncate">
                  {isPlaying ? currentTrack.subTitle : activeProfile.scaleDescription}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                <span className="text-amber-500/80 font-mono">
                  Eser {trackIndex}/{totalTracks}
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentTrack.mood}</span>
                <span className="hidden lg:inline text-stone-600">· Otomatik Eser Akışı (~30s)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Switch Song Button + Cultural Selector Dropdown + Volume Slider */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Quick change button */}
          <button
            onClick={handleNextTrack}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-[11px] text-stone-300 hover:text-amber-400 transition-colors"
            title="Mevcut kültürün sonraki bestesine geç"
          >
            <Radio className="w-3 h-3 text-amber-500" />
            <span>Farklı Şarkı Çal</span>
          </button>

          {/* Culture Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-[11px] transition-colors"
            >
              <Music className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Ambiyans:</span>
              <span className="font-semibold">{activeProfile.flag} {activeProfile.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-64 rounded-xl bg-stone-900 border border-stone-800 shadow-2xl p-1.5 z-50 text-xs space-y-0.5"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500 border-b border-stone-800/80 mb-1">
                  Kültürel Ambiyans & Parça Seçin
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
