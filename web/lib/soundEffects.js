// Lightweight Web Audio API Synthesizer (Works 100% offline with zero assets)

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTone(freq, type = "sine", duration = 0.15, gainVal = 0.15) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay restriction
    }
  }

  playGuess() {
    this.playTone(340, "triangle", 0.12, 0.15);
  }

  playClueUnlock() {
    this.playTone(523.25, "sine", 0.15, 0.15);
    setTimeout(() => this.playTone(659.25, "sine", 0.25, 0.2), 120);
  }

  playWin() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, "triangle", 0.35, 0.2), i * 140);
    });
  }

  playLoss() {
    const notes = [350, 310, 270, 220];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, "sawtooth", 0.25, 0.12), i * 150);
    });
  }
}

export const sounds = new SoundFX();
