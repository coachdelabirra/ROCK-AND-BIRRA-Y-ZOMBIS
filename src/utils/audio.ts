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

  // --- Dynamic Player Action Sound Effects ---

  /** Sonido de estática radiofónica / mapa CRT al abrir el mapa */
  public playMapStatic() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const dur = 0.22;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Crackly radio static noise
      data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.1 ? 0.8 : 1.5);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(2600, t + dur);
    filter.Q.value = 2.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);

    // Beep overlay
    const beep = this.ctx.createOscillator();
    const beepGain = this.ctx.createGain();
    beep.type = 'sine';
    beep.frequency.setValueAtTime(940, t);
    beepGain.gain.setValueAtTime(0.15, t);
    beepGain.gain.exponentialRampToValueAtTime(0.005, t + 0.08);

    beep.connect(beepGain);
    beepGain.connect(this.sfxGain);
    beep.start(t);
    beep.stop(t + 0.08);
  }

  /** Sonido metálico de chapitas de botella al recoger dinero / chapas */
  public playCapsPickup() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // 3 metallic tinkling frequencies simulating metal crown bottle caps
    const freqs = [
      [2450, 3100, 4200],
      [2800, 3600, 4900],
      [2200, 2900, 3900]
    ];

    freqs.forEach((chord, step) => {
      const delay = step * 0.045;
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + delay);

        gain.gain.setValueAtTime(0.18, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.09);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(t + delay);
        osc.stop(t + delay + 0.09);
      });
    });
  }

  /** Sonido de pisadas y crujido entre escombros */
  public playFootstepsRubble() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    [0, 0.14].forEach((offset) => {
      const bufSize = Math.floor(this.ctx!.sampleRate * 0.08);
      const buf = this.ctx!.createBuffer(1, bufSize, this.ctx!.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;

      const src = this.ctx!.createBufferSource();
      src.buffer = buf;

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 520;
      filter.Q.value = 1.2;

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0.28, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, t + offset + 0.08);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain!);

      src.start(t + offset);
    });
  }

  /** Sonido de abrir mochila / cremallera / hebilla */
  public playBackpack() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Rapid zipper sweeps
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(800, t);
    osc.frequency.linearRampToValueAtTime(2200, t + 0.08);
    osc.frequency.setValueAtTime(1200, t + 0.09);
    osc.frequency.linearRampToValueAtTime(2600, t + 0.16);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  /** Sonido de pizza crujiente encontrada */
  public playPizzaFound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Happy bright chord + crunch
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.28, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.25);
    });
  }

  /** Sonido de gruñido zombi hostil */
  public playZombieGrowl() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';

    osc.frequency.setValueAtTime(85, t);
    osc.frequency.linearRampToValueAtTime(55, t + 0.35);

    // Formant throat filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.setValueAtTime(450, t);
    filter.Q.value = 4.0;
    filter.gain.value = 12;

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  /** Sonido de apertura de caja fuerte secreta (mecanismo pesado) */
  public playSafeUnlock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Heavy tumbler clicks + latch release
    const clicks = [0, 0.08, 0.16, 0.26];
    clicks.forEach((timeOffset, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = idx === clicks.length - 1 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(idx === clicks.length - 1 ? 120 : 1600 + idx * 200, t + timeOffset);

      gain.gain.setValueAtTime(0.35, t + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.005, t + timeOffset + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + timeOffset);
      osc.stop(t + timeOffset + 0.06);
    });
  }

  /** Sonido de descanso reconfortante en el búnker */
  public playRestSigh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Warm Major 7th chord (C4, E4, G4, B4)
    const chord = [261.63, 329.63, 392.00, 493.88];
    chord.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t);
      osc.stop(t + 0.8);
    });
  }

  /** Sonido de fuego / explosión de Molotov (Punk) */
  public playMolotovWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const d = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) d[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.15);
    filter.frequency.exponentialRampToValueAtTime(600, t + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
  }

  /** Sonido de latigazo de cadena metálica (Motoquero) */
  public playChainWhip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.1);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.1);

    // Metal chain snap
    setTimeout(() => {
      if (!this.ctx || !this.sfxGain) return;
      const clank1 = this.ctx!.createOscillator();
      const clank2 = this.ctx!.createOscillator();
      const clankGain = this.ctx!.createGain();

      clank1.type = 'square';
      clank1.frequency.setValueAtTime(1750, this.ctx!.currentTime);
      clank2.type = 'sawtooth';
      clank2.frequency.setValueAtTime(2380, this.ctx!.currentTime);

      clankGain.gain.setValueAtTime(0.35, this.ctx!.currentTime);
      clankGain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + 0.09);

      clank1.connect(clankGain);
      clank2.connect(clankGain);
      clankGain.connect(this.sfxGain!);

      clank1.start(this.ctx!.currentTime);
      clank2.start(this.ctx!.currentTime);
      clank1.stop(this.ctx!.currentTime + 0.09);
      clank2.stop(this.ctx!.currentTime + 0.09);
    }, 70);
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
