const SFX = {
  correct: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3',
  wrong:   'https://assets.mixkit.co/active_storage/sfx/959/959-preview.mp3',
  tick:    'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
  spin:    'https://assets.mixkit.co/active_storage/sfx/441/441-preview.mp3',
  fanfare: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
};

class SoundService {
  private static instance: SoundService;
  private audioCache: Map<string, HTMLAudioElement> = new Map();

  private constructor() {
    // Preload sounds
    Object.entries(SFX).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.load();
      this.audioCache.set(key, audio);
    });
  }

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  public play(name: keyof typeof SFX, volume = 0.5, loop = false) {
    const audio = this.audioCache.get(name);
    if (audio) {
      audio.currentTime = 0;
      audio.volume = volume;
      audio.loop = loop;
      audio.play().catch(() => {
        // Autoplay policy might block initial play without interaction
      });
    }
  }

  public stop(name: keyof typeof SFX) {
    const audio = this.audioCache.get(name);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
}

export const soundService = SoundService.getInstance();
