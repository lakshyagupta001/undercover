import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

export function useSound() {
  const soundEnabled = useGameStore((state) => state.settings.soundEnabled);

  const playSound = useCallback((type: 'click' | 'success' | 'error' | 'reveal') => {
    if (!soundEnabled) return;

    // Web Audio API sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const frequencies = {
      click: 800,
      success: 1000,
      error: 400,
      reveal: 600,
    };

    oscillator.frequency.value = frequencies[type];
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [soundEnabled]);

  return { playSound };
}

