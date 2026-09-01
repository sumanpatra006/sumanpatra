/**
 * Web Audio API synthesizer for Mimi the Cyber Cat
 * Generates adorable zero-latency dynamic feline meows and purrs!
 */

class MimiAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Synthesize a cute, high-tech feline meow with pitch modulation and resonance
   */
  public playMeow(variant: "standard" | "happy" | "purr" = "standard") {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (variant === "purr") {
        // Purr: Low frequency amplitude modulation
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(45, now);

        lfo.type = "sine";
        lfo.frequency.setValueAtTime(25, now); // 25Hz purr flutter

        lfoGain.gain.setValueAtTime(0.08, now);
        lfo.connect(lfoGain.gain);

        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);

        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 0.7);
        osc.stop(now + 0.7);
        return;
      }

      // Dynamic Meow Tone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const mainGain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      const baseFreq = variant === "happy" ? 640 : 540;

      // Pitch Envelope (Characteristic Meow inflection: up slightly, then swooping down)
      osc1.frequency.setValueAtTime(baseFreq * 0.8, now);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.12);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.42);

      osc2.frequency.setValueAtTime(baseFreq * 1.6, now);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.7, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.42);

      // Formant filter shaping
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1100, now);
      filter.frequency.linearRampToValueAtTime(1800, now + 0.15);
      filter.frequency.linearRampToValueAtTime(800, now + 0.42);
      filter.Q.value = 3.5;

      // Gain Envelope
      mainGain.gain.setValueAtTime(0.001, now);
      mainGain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      mainGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.46);
      osc2.stop(now + 0.46);
    } catch {
      // AudioContext blocked before first user gesture - fail silently
    }
  }
}

export const mimiAudio = new MimiAudioSynthesizer();
