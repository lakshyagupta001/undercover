import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { WordPair } from '@/types/game';
import { getRandomWordPair } from '@/data/fallbackWords';

export async function POST(request: NextRequest) {
  try {
    const { difficulty, apiKey } = await request.json();

    // Validate inputs
    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    // Type assertion after validation
    const validDifficulty = difficulty as 'easy' | 'medium' | 'hard';

    // Use environment variable or provided API key
    const geminiApiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!geminiApiKey) {
      // Fallback to local words
      const wordPair = getRandomWordPair(validDifficulty);
      return NextResponse.json({ wordPair });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const difficultyPrompts: Record<'easy' | 'medium' | 'hard', string> = {
      easy: 'common, everyday objects and concepts that everyone knows',
      medium: 'moderately familiar concepts requiring some thought',
      hard: 'abstract concepts, similar meanings, or subtle differences',
    };

    const prompt = `Generate a word pair for an Undercover party game with ${difficultyPrompts[validDifficulty]} difficulty.

Rules:
1. BOTH words must be in the SAME language (either both Hindi in Devanagari script OR both English)
2. The words should be related but different enough to create interesting gameplay
3. Words must be appropriate for all ages (no obscene, political, violent, or sensitive content)
4. Difficulty: ${validDifficulty}

Return ONLY a valid JSON object with this exact structure (no markdown, no additional text):
{
  "civilian_word_hindi": "word in same language",
  "undercover_word_english": "related word in same language",
  "relationship": "brief description of how they relate"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let wordPair: WordPair;
    try {
      // Remove any markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      wordPair = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse AI response, using fallback:', parseError);
      wordPair = getRandomWordPair(validDifficulty);
    }

    // Validate the structure
    if (
      !wordPair.civilian_word_hindi ||
      !wordPair.undercover_word_english ||
      !wordPair.relationship
    ) {
      throw new Error('Invalid word pair structure');
    }

    return NextResponse.json({ wordPair });
  } catch (error) {
    console.error('Error in generate-words API:', error);
    
    // Fallback to local words on error
    const { difficulty } = await request.json();
    const wordPair = getRandomWordPair(difficulty || 'medium');
    
    return NextResponse.json({ wordPair });
  }
}

