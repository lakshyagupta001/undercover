import { WordPair } from '@/types/game';
import { getUniqueFallbackWordPair } from './fallbackWords';

// Track fallback mode state
let usingFallback = false;
let fallbackWarningShown = false;

export async function generateWordPair(
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<{ wordPair: WordPair; source: 'api' | 'fallback'; showWarning: boolean }> {

  // Try to fetch from API first
  try {
    const response = await fetch('/api/generate-words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ difficulty }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.wordPair) {
        // API worked! Reset fallback state if we were using it
        if (usingFallback) {
          usingFallback = false;
          fallbackWarningShown = false;
        }
        return {
          wordPair: data.wordPair,
          source: 'api',
          showWarning: false
        };
      }
    }

    // Check if it's a token/quota error
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || '';

    if (
      response.status === 429 || // Rate limit
      response.status === 402 || // Payment required
      errorMessage.toLowerCase().includes('quota') ||
      errorMessage.toLowerCase().includes('token') ||
      errorMessage.toLowerCase().includes('limit') ||
      errorMessage.toLowerCase().includes('exceeded') ||
      errorMessage.toLowerCase().includes('exhausted')
    ) {
      // Token exhaustion - switch to fallback mode
      const wasAlreadyFallback = usingFallback;
      usingFallback = true;

      const wordPair = getUniqueFallbackWordPair(difficulty);
      const showWarning = !wasAlreadyFallback && !fallbackWarningShown;

      if (showWarning) {
        fallbackWarningShown = true;
      }

      return {
        wordPair,
        source: 'fallback',
        showWarning
      };
    }

    // Other API error - still try fallback
    throw new Error(errorMessage || 'API error');

  } catch (error) {
    // Network error or API failure - use fallback
    const wasAlreadyFallback = usingFallback;
    usingFallback = true;

    const wordPair = getUniqueFallbackWordPair(difficulty);
    const showWarning = !wasAlreadyFallback && !fallbackWarningShown;

    if (showWarning) {
      fallbackWarningShown = true;
    }

    return {
      wordPair,
      source: 'fallback',
      showWarning
    };
  }
}
