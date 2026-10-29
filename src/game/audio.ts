// Original synthesized ambience and effects. No audio files or network requests.
export class Soundscape {
  private context?: AudioContext;
  private master?: GainNode;
  private oscillators: OscillatorNode[] = [];
  private enabled = false;
  async enable(value: boolean) {
    this.enabled = value;
    if (!value) { if (this.master && this.context) this.master.gain.setTargetAtTime(0, this.context.currentTime, .15); return; }
    try {
      if (!this.context) {
        this.context = new AudioContext();
        this.master = this.context.createGain(); this.master.gain.value = 0; this.master.connect(this.context.destination);
        [65.41, 98, 130.81].forEach((frequency, i) => { const oscillator = this.context!.createOscillator(); const gain = this.context!.createGain(); oscillator.type = 'sine'; oscillator.frequency.value = frequency; gain.gain.value = .025 / (i + 1); oscillator.connect(gain); gain.connect(this.master!); oscillator.start(); this.oscillators.push(oscillator); });
      }
      await this.context.resume(); this.master!.gain.setTargetAtTime(.5, this.context.currentTime, .3);
    } catch { this.enabled = false; }
  }
  effect(kind: 'portal' | 'achievement' | 'ui' = 'ui') {
    if (!this.enabled || !this.context || !this.master) return;
    const now = this.context.currentTime;
    [0, ...(kind === 'achievement' ? [.12, .24] : [])].forEach((delay, i) => {
      const oscillator = this.context!.createOscillator(), gain = this.context!.createGain();
      oscillator.type = 'sine'; oscillator.frequency.setValueAtTime((kind === 'portal' ? 220 : 520) * Math.pow(1.25, i), now + delay); oscillator.frequency.exponentialRampToValueAtTime(kind === 'portal' ? 660 : 780 * Math.pow(1.25, i), now + delay + .25);
      gain.gain.setValueAtTime(0, now + delay); gain.gain.linearRampToValueAtTime(.08, now + delay + .015); gain.gain.exponentialRampToValueAtTime(.0001, now + delay + .35); oscillator.connect(gain); gain.connect(this.master!); oscillator.start(now + delay); oscillator.stop(now + delay + .4);
    });
  }
  suspend() { void this.context?.suspend(); }
  resume() { if (this.enabled) void this.context?.resume(); }
  dispose() { this.oscillators.forEach(o => o.stop()); void this.context?.close(); }
}
