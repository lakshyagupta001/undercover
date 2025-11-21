import { useCallback } from 'react';

export function useVibrate() {
  const vibrate = useCallback((duration: number | number[] = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }, []);

  const vibratePattern = useCallback((pattern: 'short' | 'medium' | 'long' | 'error' | 'success') => {
    const patterns = {
      short: 50,
      medium: 100,
      long: 200,
      error: [100, 50, 100],
      success: [50, 100, 50],
    };

    vibrate(patterns[pattern]);
  }, [vibrate]);

  return { vibrate, vibratePattern };
}

