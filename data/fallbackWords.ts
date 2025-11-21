import { WordPair } from '@/types/game';

export const fallbackWords: WordPair[] = [
  // Easy Level - English
  {
    civilian_word_hindi: 'Book',
    undercover_word_english: 'Novel',
    relationship: 'Both are reading materials, but one is general and one is specific',
  },
  {
    civilian_word_hindi: 'Tea',
    undercover_word_english: 'Coffee',
    relationship: 'Both are hot beverages',
  },
  {
    civilian_word_hindi: 'Dog',
    undercover_word_english: 'Cat',
    relationship: 'Both are common pets',
  },
  {
    civilian_word_hindi: 'Sun',
    undercover_word_english: 'Moon',
    relationship: 'Both are celestial bodies',
  },
  {
    civilian_word_hindi: 'Hot',
    undercover_word_english: 'Cold',
    relationship: 'Temperature opposites',
  },
  {
    civilian_word_hindi: 'Water',
    undercover_word_english: 'Juice',
    relationship: 'Both are liquids to drink',
  },
  {
    civilian_word_hindi: 'Bread',
    undercover_word_english: 'Toast',
    relationship: 'Both are baked goods',
  },
  {
    civilian_word_hindi: 'Flower',
    undercover_word_english: 'Rose',
    relationship: 'General vs specific flower',
  },
  {
    civilian_word_hindi: 'Tree',
    undercover_word_english: 'Forest',
    relationship: 'Single tree vs collection of trees',
  },
  {
    civilian_word_hindi: 'Rain',
    undercover_word_english: 'Storm',
    relationship: 'Both are weather phenomena',
  },

  // Medium Level - English
  {
    civilian_word_hindi: 'Doctor',
    undercover_word_english: 'Nurse',
    relationship: 'Both are medical professionals',
  },
  {
    civilian_word_hindi: 'Train',
    undercover_word_english: 'Metro',
    relationship: 'Both are rail transport systems',
  },
  {
    civilian_word_hindi: 'Television',
    undercover_word_english: 'Cinema',
    relationship: 'Both are visual entertainment mediums',
  },
  {
    civilian_word_hindi: 'Castle',
    undercover_word_english: 'Palace',
    relationship: 'Both are royal structures',
  },
  {
    civilian_word_hindi: 'River',
    undercover_word_english: 'Ocean',
    relationship: 'Both are water bodies',
  },
  {
    civilian_word_hindi: 'Airplane',
    undercover_word_english: 'Helicopter',
    relationship: 'Both are aircraft',
  },
  {
    civilian_word_hindi: 'Music',
    undercover_word_english: 'Song',
    relationship: 'General vs specific musical expression',
  },
  {
    civilian_word_hindi: 'Game',
    undercover_word_english: 'Match',
    relationship: 'General sport vs specific game event',
  },
  {
    civilian_word_hindi: 'Medicine',
    undercover_word_english: 'Pill',
    relationship: 'Both are medical treatments',
  },
  {
    civilian_word_hindi: 'Wedding',
    undercover_word_english: 'Marriage',
    relationship: 'Both are relationship celebrations',
  },

  // Hard Level - English
  {
    civilian_word_hindi: 'Justice',
    undercover_word_english: 'Fairness',
    relationship: 'Similar legal and moral concepts',
  },
  {
    civilian_word_hindi: 'Freedom',
    undercover_word_english: 'Liberty',
    relationship: 'Similar concepts of independence',
  },
  {
    civilian_word_hindi: 'Courage',
    undercover_word_english: 'Bravery',
    relationship: 'Same meaning - being brave',
  },
  {
    civilian_word_hindi: 'Knowledge',
    undercover_word_english: 'Wisdom',
    relationship: 'Information vs applied knowledge',
  },
  {
    civilian_word_hindi: 'Love',
    undercover_word_english: 'Romance',
    relationship: 'General love vs romantic love',
  },
  {
    civilian_word_hindi: 'Art',
    undercover_word_english: 'Painting',
    relationship: 'General art vs specific art form',
  },
  {
    civilian_word_hindi: 'Science',
    undercover_word_english: 'Physics',
    relationship: 'General science vs specific science',
  },
  {
    civilian_word_hindi: 'History',
    undercover_word_english: 'Heritage',
    relationship: 'Past events vs cultural legacy',
  },
  {
    civilian_word_hindi: 'Education',
    undercover_word_english: 'School',
    relationship: 'Process vs institution',
  },
  {
    civilian_word_hindi: 'Religion',
    undercover_word_english: 'Faith',
    relationship: 'Organized belief vs personal belief',
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

