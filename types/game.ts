export type Role = 'civilian' | 'undercover' | 'mrwhite';

export type GamePhase = 
  | 'home'
  | 'setup'
  | 'player-names'
  | 'role-assignment'
  | 'description-round'
  | 'discussion'
  | 'voting'
  | 'role-reveal'
  | 'victory';

export interface Player {
  id: string;
  name: string;
  role: Role;
  word: string | null;
  isAlive: boolean;
  hasGivenClue: boolean;
  avatar: string;
}

export interface WordPair {
  civilian_word_hindi: string;
  undercover_word_english: string;
  relationship: string;
}

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  soundEnabled: boolean;
  theme: 'light' | 'dark';
}

export interface VoteResult {
  playerId: string;
  votes: number;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  currentRound: number;
  wordPair: WordPair | null;
  settings: GameSettings;
  eliminatedPlayer: Player | null;
  winner: 'civilians' | 'infiltrators' | null;
}

