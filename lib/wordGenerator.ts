import { WordPair } from '@/types/game';
import { getRandomWordPair } from '@/data/fallbackWords';

export async function generateWordPair(
  difficulty: 'easy' | 'medium' | 'hard',
  apiKey?: string
): Promise<WordPair> {
  // If no API key or offline, use fallback
  if (!apiKey) {
    return getRandomWordPair(difficulty);
  }

  try {
    const response = await fetch('/api/generate-words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ difficulty, apiKey }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate words');
    }

    const data = await response.json();
    return data.wordPair;
  } catch (error) {
    console.error('Error generating words with AI, using fallback:', error);
    return getRandomWordPair(difficulty);
  }
}

