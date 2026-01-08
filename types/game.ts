export type Role = 'civilian' | 'undercover' | 'mrwhite';

export type GamePhase = 
  | 'home'
  | 'setup'
  | 'player-names'
  | 'role-assignment'
  | 'discussion'
  | 'voting'
  | 'mrwhite-guess'
  | 'role-reveal'
  | 'victory'
  | 'points';

export interface Player {
  id: string;
  name: string;
  role: Role;
  word: string | null;
  isAlive: boolean;
  hasGivenClue: boolean;
  avatar: string;
  points: number; // Cumulative points across games
}

export interface WordPair {
  civilian_word: string;
  undercover_word: string;
  relationship: string;
}

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentRound: number;
  wordPair: WordPair | null;
  settings: GameSettings;
  eliminatedPlayer: Player | null;
  winner: 'civilians' | 'infiltrators' | null;
  roundPlayerOrder: string[];
  roleRevealStartIndex: number;
  gameNumber: number;
  mrWhiteGuessedCorrectly: boolean;
}

