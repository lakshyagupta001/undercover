import { WordPair } from '@/types/game';

export async function generateWordPair(
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<WordPair> {
  console.log('=== generateWordPair called ===');
  console.log('Difficulty:', difficulty);

  const response = await fetch('/api/generate-words', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ difficulty }),
  });

  console.log('API response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API response not OK:', response.statusText, errorData);
    throw new Error(errorData.error || 'Failed to generate words from Gemini API');
  }

  const data = await response.json();
  console.log('API response data:', data);
  
  if (!data.wordPair) {
    throw new Error('Invalid response from API: missing wordPair');
  }
  
  return data.wordPair;
}

