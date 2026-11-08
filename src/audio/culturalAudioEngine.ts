/**
 * Procedural Web Audio Engine for Cultural Ambient Music
 * Generates continuously evolving, authentic modal music for Turkey, Germany, France, Rome/Ancient, Steppe/Mongolia, and World.
 */

export type CultureKey = 'turkey' | 'germany' | 'france' | 'ancient' | 'mongolia' | 'world';

export interface CultureAudioProfile {
  key: CultureKey;
  name: string;
  instruments: string;
  scaleDescription: string;
  flag: string;
}

export const CULTURES: CultureAudioProfile[] = [
  {
    key: 'turkey',
    name: 'Türk & Osmanlı Tınıları',
    instruments: 'Ney Nefesi, Ud Mızrabı & Kudüm Ritmi',
    scaleDescription: 'Hicaz & Nihavend Makamı',
    flag: '🇹🇷',
  },
  {
    key: 'germany',
    name: 'Alman Barok & Klasik',
    instruments: 'Barok Kilise Orgu, Çello & Pirinç Nefesliler',
    scaleDescription: 'Bach Tarzı Kontrpuan & Polifoni',
    flag: '🇩🇪',
  },
  {
    key: 'france',
    name: 'Fransız Romantizm & İhtilal',
    instruments: 'Akordeon, Pastoral Flüt & Arp Tınıları',
    scaleDescription: 'Debussy & Satie Modalleri',
    flag: '🇫🇷',
  },
  {
    key: 'ancient',
    name: 'Roma & Antik Lir',
    instruments: 'Antik Kithara, Aulos Flütü & Bronz Gong',
    scaleDescription: 'Arkaik Dorik & Frig Modu',
    flag: '🏛️',
  },
  {
    key: 'mongolia',
    name: 'Bozkır & Moğol Destanı',
    instruments: 'Hömey (Gırtlak Müziği) & Kılkopuz',
    scaleDescription: 'Pentatonik Bozkır Ezgisi & Doğan Ton',
    flag: '🇲🇳',
  },
  {
    key: 'world',
    name: 'Evrensel Tarihsel Senfoni',
    instruments: 'Yaylı Sazlar & Anıtsal Çanlar',
    scaleDescription: 'Epik Senfonik Armoni',
    flag: '🌍',
  },
];

// Note frequencies in Hz
const NOTES: Record<string, number> = {
  // Octave 2
  D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, B2: 123.47,
  // Octave 3
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, 'F#3': 185.0, G3: 196.0, Ab3: 207.65, A3: 220.0, Bb3: 233.08, B3: 246.94,
  // Octave 4
  C4: 261.63, 'C#4': 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, 'F#4': 369.99, G4: 392.0, Ab4: 415.3, A4: 440.0, Bb4: 466.16, B4: 493.88,
  // Octave 5
  C5: 523.25, 'C#5': 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, 'F#5': 739.99, G5: 783.99, A5: 880.0,
};

class CulturalAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentCulture: CultureKey = 'turkey';
  private isPlaying: boolean = false;
  private volume: number = 0.55;
  private timerId: number | null = null;
  private droneNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private onStateChange: (() => void) | null = null;

  public init() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;
    this.ctx = new AudioCtxClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public setListener(cb: () => void) {
    this.onStateChange = cb;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentCulture(): CultureKey {
    return this.currentCulture;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.onStateChange?.();
  }

  public async play(culture?: CultureKey) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (culture && culture !== this.currentCulture) {
      this.currentCulture = culture;
    }

    this.isPlaying = true;
    this.stopDrones();
    this.startDroneForCulture(this.currentCulture);
    this.scheduleNextPhrase();
    this.onStateChange?.();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.stopDrones();
    this.onStateChange?.();
  }

  public togglePlay(culture?: CultureKey) {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play(culture);
    }
  }

  public switchCulture(culture: CultureKey) {
    this.currentCulture = culture;
    if (this.isPlaying) {
      // Smooth crossfade
      this.stopDrones();
      this.startDroneForCulture(this.currentCulture);
    }
    this.onStateChange?.();
  }

  private stopDrones() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (const d of this.droneNodes) {
      try {
        d.gain.gain.setTargetAtTime(0.0001, now, 0.5);
        d.osc.stop(now + 0.6);
      } catch (e) {
        // ignore already stopped
      }
    }
    this.droneNodes = [];
  }

  private startDroneForCulture(culture: CultureKey) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (culture === 'turkey') {
      // Turkish Ney / Tanbur fundamental drone in D
      this.createDroneOsc(NOTES.D3, 'sine', 0.12, 1.2);
      this.createDroneOsc(NOTES.A3, 'triangle', 0.06, 1.5);
      this.createDroneOsc(NOTES.D4, 'sine', 0.04, 2.0);
    } else if (culture === 'germany') {
      // German Church organ pedal note & warm fifth
      this.createDroneOsc(NOTES.D2, 'sawtooth', 0.04, 300); // filtered below
      this.createDroneOsc(NOTES.A2, 'triangle', 0.06, 2.0);
    } else if (culture === 'france') {
      // French impressionist warm pad (F major 7th / D minor 9th root)
      this.createDroneOsc(NOTES.F3, 'sine', 0.08, 1.5);
      this.createDroneOsc(NOTES.C4, 'triangle', 0.05, 1.8);
    } else if (culture === 'ancient') {
      // Ancient Greco-Roman Dorian lyre root & fifth
      this.createDroneOsc(NOTES.D3, 'triangle', 0.09, 1.0);
      this.createDroneOsc(NOTES.A3, 'sine', 0.06, 1.2);
    } else if (culture === 'mongolia') {
      // Steppe throat-singing overtone drone (Deep D2 + vocal formant sweep)
      this.createOvertoneDrone(NOTES.D2);
    } else {
      // World orchestral fifth
      this.createDroneOsc(NOTES.D3, 'sine', 0.08, 1.5);
      this.createDroneOsc(NOTES.A3, 'triangle', 0.05, 1.5);
    }
  }

  private createDroneOsc(freq: number, type: OscillatorType, maxGain: number, filterFreq?: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(maxGain, this.ctx.currentTime + 1.5);

    if (filterFreq) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq > 20 ? filterFreq : 800, this.ctx.currentTime);
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.masterGain);
    osc.start();
    this.droneNodes.push({ osc, gain });
  }

  private createOvertoneDrone(fundamentalFreq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(fundamentalFreq, this.ctx.currentTime);

    // Resonant bandpass filter to simulate throat singing harmonic resonance
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(12, this.ctx.currentTime);
    filter.frequency.setValueAtTime(fundamentalFreq * 6, this.ctx.currentTime);

    // LFO to slowly sweep harmonic overtone
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(fundamentalFreq * 4, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start();

    this.droneNodes.push({ osc, gain });
  }

  /**
   * Generative Phrase Sequencer:
   * Chooses notes probabilistically based on the culture's modal scale,
   * creates humanized timing, expressive micro-vibrato, and realistic instrument timbres.
   */
  private scheduleNextPhrase() {
    if (!this.isPlaying || !this.ctx) return;

    const scale = this.getScaleForCulture(this.currentCulture);
    const phraseLength = Math.floor(Math.random() * 4) + 3; // 3 to 6 notes in a melodic breath
    let delay = 0.2;

    for (let i = 0; i < phraseLength; i++) {
      const noteFreq = scale[Math.floor(Math.random() * scale.length)];
      const duration = (Math.random() * 0.8 + 0.6); // 0.6s to 1.4s
      const noteDelay = delay;

      window.setTimeout(() => {
        if (this.isPlaying) {
          this.playNote(noteFreq, duration, this.currentCulture);
        }
      }, noteDelay * 1000);

      delay += duration * 0.85;
    }

    // Pause between phrases (breathing space like authentic classical/makam improvisation)
    const restDuration = Math.random() * 1.8 + 1.2;
    const totalPhraseTime = (delay + restDuration) * 1000;

    this.timerId = window.setTimeout(() => {
      this.scheduleNextPhrase();
    }, totalPhraseTime);
  }

  private getScaleForCulture(culture: CultureKey): number[] {
    switch (culture) {
      case 'turkey':
        // Hicaz & Nihavend Makam
        return [
          NOTES.D4, NOTES.Eb4, NOTES['F#4'], NOTES.G4,
          NOTES.A4, NOTES.Bb4, NOTES.C5, NOTES.D5,
          NOTES.A3, NOTES.G3,
        ];
      case 'germany':
        // D Harmonic Minor & G Major Bach organ scale
        return [
          NOTES.D4, NOTES.E4, NOTES.F4, NOTES.G4,
          NOTES.A4, NOTES.Bb4, NOTES['C#5'], NOTES.D5,
          NOTES.F3, NOTES.A3,
        ];
      case 'france':
        // French Impressionist Whole-Tone / Modal minor 9th (Debussy/Satie)
        return [
          NOTES.D4, NOTES.E4, NOTES.F4, NOTES.A4,
          NOTES.B4, NOTES.C5, NOTES.E5, NOTES.F5,
        ];
      case 'ancient':
        // Archaic Greek Dorian mode on D
        return [
          NOTES.D4, NOTES.E4, NOTES.F4, NOTES.G4,
          NOTES.A4, NOTES.B4, NOTES.C5, NOTES.D5,
        ];
      case 'mongolia':
        // Steppe Pentatonic scale (D - F - G - A - C)
        return [
          NOTES.D3, NOTES.F3, NOTES.G3, NOTES.A3,
          NOTES.C4, NOTES.D4, NOTES.F4, NOTES.G4,
          NOTES.A4,
        ];
      case 'world':
      default:
        // Universal majestic pentatonic
        return [
          NOTES.D4, NOTES.F4, NOTES.G4, NOTES.A4,
          NOTES.C5, NOTES.D5,
        ];
    }
  }

  private playNote(freq: number, duration: number, culture: CultureKey) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Instrument Timbre synthesis per culture:
    if (culture === 'turkey') {
      // 50% chance Ney flute, 50% chance Oud pluck
      const isNey = Math.random() > 0.45;
      if (isNey) {
        // Ney Flute: soft sine/triangle with subtle vibrato
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Breath vibrato LFO
        const vibrato = this.ctx.createOscillator();
        vibrato.frequency.setValueAtTime(5.2, now);
        const vibGain = this.ctx.createGain();
        vibGain.gain.setValueAtTime(freq * 0.015, now);
        vibrato.connect(vibGain);
        vibGain.connect(osc.frequency);
        vibrato.start(now);
        vibrato.stop(now + duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.18); // breath swell
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      } else {
        // Oud Pluck: sharp attack, rich decaying harmonics
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + duration);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.9);
      }
    } else if (culture === 'germany') {
      // German Church Organ / Brass Horn
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    } else if (culture === 'france') {
      // French Accordion / Flute: Triangle wave with light tremolo
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    } else if (culture === 'ancient') {
      // Roman Lyre / Kithara pluck
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + duration);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);
    } else if (culture === 'mongolia') {
      // Horsehead fiddle (Morin Khuur): Sawtooth with smooth slide
      osc.type = 'sawtooth';
      const prevFreq = freq * (Math.random() > 0.5 ? 1.05 : 0.95);
      osc.frequency.setValueAtTime(prevFreq, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.15); // portamento slide!

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    } else {
      // Classical Strings
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }
}

export const culturalAudio = new CulturalAudioEngine();
