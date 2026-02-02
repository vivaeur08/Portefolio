class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }
  
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
  
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.log('Sound error:', e);
    }
  }
  
  match() {
    this.playTone(523, 0.15, 'sine', 0.2); // C5
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.2), 50); // E5
    setTimeout(() => this.playTone(784, 0.15, 'sine', 0.2), 100); // G5
  }
  
  swap() {
    this.playTone(440, 0.1, 'sine', 0.15);
  }
  
  combo(level: number) {
    const baseFreq = 400 + level * 50;
    this.playTone(baseFreq, 0.2, 'sine', 0.25);
    setTimeout(() => this.playTone(baseFreq * 1.25, 0.2, 'sine', 0.25), 100);
  }
  
  levelComplete() {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.3), i * 150);
    });
  }
  
  buttonClick() {
    this.playTone(600, 0.05, 'sine', 0.1);
  }
  
  error() {
    this.playTone(200, 0.2, 'square', 0.15);
  }
  
  reward() {
    this.playTone(880, 0.15, 'sine', 0.25);
    setTimeout(() => this.playTone(988, 0.15, 'sine', 0.25), 100);
    setTimeout(() => this.playTone(1175, 0.3, 'sine', 0.25), 200);
  }
}

export const soundManager = new SoundManager();
