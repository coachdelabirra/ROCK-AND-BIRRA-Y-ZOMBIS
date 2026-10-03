/**
 * Audio Engine for ROCK AND BIRRA AND PIZZA Y ZOMBIS
 * Implements Web Audio API synthesized chiptune FX, distorted rock chords,
 * bottle cap opening sounds, and dynamic garage rock backing tracks.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  public isMuted: boolean = false;
  public volume: number = 0.6;
  public isMusicPlaying: boolean = false;
  public currentStationIndex: number = 0;
  
  private musicInterval: number | null = null;
  private step: number = 0;

  public stations = [
    {
      id: 'rock-and-birra',
      name: 'Rock and Birra Radio 99.1 FM',
      genre: 'Garage Rock / Riffs Apocalípticos',
      bpm: 132,
      scale: [164.81, 196.00, 220.00, 246.94, 293.66, 329.63], // E minor pentatonic
      description: '"La radio oficial del Coach de la Birra. ¡Volumen hasta 11!"'
    },
    {
      id: 'punk-resistencia',
      name: 'Radio El Aullido 105.3 FM',
      genre: 'Punk Rock & Anarquía Cervecera',
      bpm: 160,
      scale: [220.00, 261.63, 293.66, 329.63, 392.00], // A minor fast
      description: '"Tres acordes, cero complejos, y pura birra helada."'
    },
    {
      id: 'coach-chill',
      name: 'El Búnker Stereo 95.7 FM',
      genre: 'Classic Hard Rock & Blues sucio',
      bpm: 110,
      scale: [146.83, 174.61, 196.00, 220.00, 261.63], // D minor blues
      description: '"Para cuando estás recargando fuerzas con pizza fría."'
    }
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // --- Retro Sound Effects ---

  public playBlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playConfirm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';

    osc.frequency.setValueAtTime(660, t);
    osc.frequency.setValueAtTime(990, t + 0.06);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  public playDamage() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(260, t);
    osc.frequency.linearRampToValueAtTime(110, t + 0.15);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playDodge() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';

    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.1);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  public playRockPowerChord(frequency = 164.81) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Power chord consists of Root + 5th + Octave
    const root = frequency;
    const fifth = frequency * 1.4983;
    const octave = frequency * 2;

    [root, fifth, octave].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      // Waveshaper distortion
      const shaper = this.ctx!.createWaveShaper();
      (shaper as unknown as { curve: Float32Array | null }).curve = this.makeDistortionCurve(30);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

      osc.connect(shaper);
      shaper.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  private makeDistortionCurve(amount = 20): Float32Array {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public playTriviaCorrect() {
    this.playRockPowerChord(220.00); // A Power Chord
    setTimeout(() => {
      if (this.isMuted || !this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);

        gain.gain.setValueAtTime(0.3, t + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.06 + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.15);
      });
    }, 150);
  }

  public playTriviaWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(130, t + 0.08);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  public playBeerSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    // 1. "Pssssht!" - White noise burst for the bottle cap opening
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Highpass filter for that pressurized hiss
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2500, t);

    const hissGain = this.ctx.createGain();
    hissGain.gain.setValueAtTime(0.6, t);
    hissGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    whiteNoise.connect(filter);
    filter.connect(hissGain);
    hissGain.connect(this.sfxGain);

    whiteNoise.start(t);

    // 2. Gulp bubbles
    setTimeout(() => {
      if (!this.ctx || !this.sfxGain) return;
      const gulps = [320, 280, 240];
      gulps.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.1);
        osc.frequency.exponentialRampToValueAtTime(freq - 40, this.ctx!.currentTime + idx * 0.1 + 0.08);

        g.gain.setValueAtTime(0.35, this.ctx!.currentTime + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + idx * 0.1 + 0.08);

        osc.connect(g);
        g.connect(this.sfxGain!);

        osc.start(this.ctx!.currentTime + idx * 0.1);
        osc.stop(this.ctx!.currentTime + idx * 0.1 + 0.08);
      });
    }, 180);
  }

  public playLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);

      gain.gain.setValueAtTime(0.3, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.15);
    });
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const notes = [392.00, 329.63, 261.63, 196.00];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + i * 0.2);

      gain.gain.setValueAtTime(0.35, t + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.2 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + i * 0.2);
      osc.stop(t + i * 0.2 + 0.35);
    });
  }

  // --- Interactive Radio Background Loop ---

  public startRadio(stationIndex?: number) {
    this.initContext();
    if (stationIndex !== undefined) {
      this.currentStationIndex = stationIndex % this.stations.length;
    }
    this.stopRadio();
    this.isMusicPlaying = true;

    const station = this.stations[this.currentStationIndex];
    const intervalMs = (60 / station.bpm / 2) * 1000; // 8th notes

    this.step = 0;
    this.musicInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx || !this.musicGain) return;
      this.playRadioStep(station);
      this.step = (this.step + 1) % 16;
    }, intervalMs);
  }

  public stopRadio() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }

  public nextStation(): number {
    this.currentStationIndex = (this.currentStationIndex + 1) % this.stations.length;
    if (this.isMusicPlaying) {
      this.playBlip();
      this.startRadio(this.currentStationIndex);
    }
    return this.currentStationIndex;
  }

  private playRadioStep(station: typeof this.stations[0]) {
    if (!this.ctx || !this.musicGain) return;
    const t = this.ctx.currentTime;

    // 1. Kick on 0, 4, 8, 12
    if (this.step % 4 === 0) {
      const kick = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(130, t);
      kick.frequency.exponentialRampToValueAtTime(35, t + 0.08);

      kickGain.gain.setValueAtTime(0.6, t);
      kickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      kick.connect(kickGain);
      kickGain.connect(this.musicGain);

      kick.start(t);
      kick.stop(t + 0.08);
    }

    // 2. Snare on 4, 12
    if (this.step % 8 === 4) {
      const snareNoise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.06, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      snareNoise.buffer = buffer;

      const snareGain = this.ctx.createGain();
      snareGain.gain.setValueAtTime(0.35, t);
      snareGain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

      snareNoise.connect(snareGain);
      snareGain.connect(this.musicGain);

      snareNoise.start(t);
    }

    // 3. Hi-hat on every odd 8th note
    if (this.step % 2 === 1) {
      const hat = this.ctx.createBufferSource();
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.02, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      hat.buffer = buf;

      const hatFilter = this.ctx.createBiquadFilter();
      hatFilter.type = 'highpass';
      hatFilter.frequency.value = 6000;

      const hatGain = this.ctx.createGain();
      hatGain.gain.setValueAtTime(0.12, t);
      hatGain.gain.exponentialRampToValueAtTime(0.01, t + 0.02);

      hat.connect(hatFilter);
      hatFilter.connect(hatGain);
      hatGain.connect(this.musicGain);
      hat.start(t);
    }

    // 4. Bassline / Guitar Riff (Driving garage rock pattern)
    const notePattern = [0, 0, 2, 0, 3, 2, 0, 4, 0, 0, 2, 0, 4, 3, 2, 1];
    const noteIndex = notePattern[this.step % notePattern.length] % station.scale.length;
    const freq = station.scale[noteIndex];

    const bass = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bass.type = this.step % 4 === 0 ? 'sawtooth' : 'triangle';
    bass.frequency.setValueAtTime(freq / 2, t); // lower octave for bass

    bassGain.gain.setValueAtTime(0.28, t);
    bassGain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    bass.connect(bassGain);
    bassGain.connect(this.musicGain);

    bass.start(t);
    bass.stop(t + 0.12);
  }
}

export const sound = new SoundEngine();
