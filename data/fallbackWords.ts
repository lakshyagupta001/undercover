import { WordPair } from '@/types/game';

export const fallbackWords: WordPair[] = [
  // Easy Level
  {
    civilian_word_hindi: 'किताब',
    undercover_word_english: 'Novel',
    relationship: 'Both are reading materials, but one is general and one is specific',
  },
  {
    civilian_word_hindi: 'चाय',
    undercover_word_english: 'Coffee',
    relationship: 'Both are hot beverages',
  },
  {
    civilian_word_hindi: 'कुत्ता',
    undercover_word_english: 'Cat',
    relationship: 'Both are common pets',
  },
  {
    civilian_word_hindi: 'सूरज',
    undercover_word_english: 'Moon',
    relationship: 'Both are celestial bodies',
  },
  {
    civilian_word_hindi: 'गर्मी',
    undercover_word_english: 'Summer',
    relationship: 'Related to hot weather',
  },
  {
    civilian_word_hindi: 'पानी',
    undercover_word_english: 'Juice',
    relationship: 'Both are liquids to drink',
  },
  {
    civilian_word_hindi: 'रोटी',
    undercover_word_english: 'Bread',
    relationship: 'Both are staple foods made from flour',
  },
  {
    civilian_word_hindi: 'फूल',
    undercover_word_english: 'Rose',
    relationship: 'General vs specific flower',
  },
  {
    civilian_word_hindi: 'पेड़',
    undercover_word_english: 'Forest',
    relationship: 'Single tree vs collection of trees',
  },
  {
    civilian_word_hindi: 'बारिश',
    undercover_word_english: 'Storm',
    relationship: 'Both are weather phenomena',
  },

  // Medium Level
  {
    civilian_word_hindi: 'डॉक्टर',
    undercover_word_english: 'Nurse',
    relationship: 'Both are medical professionals',
  },
  {
    civilian_word_hindi: 'रेलगाड़ी',
    undercover_word_english: 'Metro',
    relationship: 'Both are rail transport systems',
  },
  {
    civilian_word_hindi: 'टेलीविज़न',
    undercover_word_english: 'Cinema',
    relationship: 'Both are visual entertainment mediums',
  },
  {
    civilian_word_hindi: 'किला',
    undercover_word_english: 'Palace',
    relationship: 'Both are historical royal structures',
  },
  {
    civilian_word_hindi: 'नदी',
    undercover_word_english: 'Ocean',
    relationship: 'Both are water bodies',
  },
  {
    civilian_word_hindi: 'हवाई जहाज',
    undercover_word_english: 'Helicopter',
    relationship: 'Both are aircraft',
  },
  {
    civilian_word_hindi: 'संगीत',
    undercover_word_english: 'Song',
    relationship: 'General vs specific musical expression',
  },
  {
    civilian_word_hindi: 'खेल',
    undercover_word_english: 'Match',
    relationship: 'General sport vs specific game event',
  },
  {
    civilian_word_hindi: 'दवा',
    undercover_word_english: 'Injection',
    relationship: 'Both are medical treatments',
  },
  {
    civilian_word_hindi: 'शादी',
    undercover_word_english: 'Anniversary',
    relationship: 'Both are relationship celebrations',
  },

  // Hard Level
  {
    civilian_word_hindi: 'न्याय',
    undercover_word_english: 'Justice',
    relationship: 'Same concept in different languages',
  },
  {
    civilian_word_hindi: 'स्वतंत्रता',
    undercover_word_english: 'Liberty',
    relationship: 'Similar concepts of freedom',
  },
  {
    civilian_word_hindi: 'साहस',
    undercover_word_english: 'Bravery',
    relationship: 'Same meaning - courage',
  },
  {
    civilian_word_hindi: 'ज्ञान',
    undercover_word_english: 'Wisdom',
    relationship: 'Knowledge vs applied knowledge',
  },
  {
    civilian_word_hindi: 'प्रेम',
    undercover_word_english: 'Romance',
    relationship: 'Love vs romantic love',
  },
  {
    civilian_word_hindi: 'कला',
    undercover_word_english: 'Painting',
    relationship: 'General art vs specific art form',
  },
  {
    civilian_word_hindi: 'विज्ञान',
    undercover_word_english: 'Physics',
    relationship: 'General science vs specific science',
  },
  {
    civilian_word_hindi: 'इतिहास',
    undercover_word_english: 'Heritage',
    relationship: 'History vs cultural legacy',
  },
  {
    civilian_word_hindi: 'शिक्षा',
    undercover_word_english: 'University',
    relationship: 'Education vs institution',
  },
  {
    civilian_word_hindi: 'धर्म',
    undercover_word_english: 'Spirituality',
    relationship: 'Religion vs spiritual practice',
  },
];

export const getRandomWordPair = (difficulty?: 'easy' | 'medium' | 'hard'): WordPair => {
  let filteredWords = fallbackWords;
  
  if (difficulty === 'easy') {
    filteredWords = fallbackWords.slice(0, 10);
  } else if (difficulty === 'medium') {
    filteredWords = fallbackWords.slice(10, 20);
  } else if (difficulty === 'hard') {
    filteredWords = fallbackWords.slice(20, 30);
  }

  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex];
};

