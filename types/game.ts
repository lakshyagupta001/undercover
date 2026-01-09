export type Role = 'civilian' | 'undercover' | 'mrwhite';

export type SpecialRole = 'goddess' | 'lover' | 'meme' | 'revenger' | 'ghost' | 'falafelVendor';

export interface SpecialRoleConfig {
  goddess: boolean;
  lovers: boolean;
  meme: boolean;
  revenger: boolean;
  ghost: boolean;
  falafelVendor: boolean;
}

export type FalafelEffectType = 'protect' | 'sabotage';

export interface FalafelEffect {
  playerId: string;
  type: FalafelEffectType;
  used: boolean;
}

export type GamePhase =
  | 'home'
  | 'setup'
  | 'player-names'
  | 'role-assignment'
  | 'round-start'
  | 'discussion'
  | 'voting'
  | 'revenger'
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
  points: number;
  // Special roles
  specialRoles: SpecialRole[];
  loverId?: string;
  isGhost: boolean;
  hasFalafel?: FalafelEffect;
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
  // Special roles state
  specialRoleConfig: SpecialRoleConfig;
  currentMrMeme: string | null;
  revengerPending: string | null;
  pendingEliminations: string[];
  falafelVendorId: string | null;
}

