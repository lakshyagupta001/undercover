import { WordPair } from '@/types/game';

export async function generateWordPair(
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<WordPair> {
  const response = await fetch('/api/generate-words', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ difficulty }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate words from Gemini API');
  }

  const data = await response.json();
  
  if (!data.wordPair) {
    throw new Error('Invalid response from API: missing wordPair');
  }
  
  return data.wordPair;
}

