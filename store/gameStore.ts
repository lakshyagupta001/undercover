import { create } from 'zustand';
import { GameState, Player, Role, WordPair, GamePhase } from '@/types/game';

interface GameStore extends GameState {
  // Actions
  setPhase: (phase: GamePhase) => void;
  initializePlayers: (count: number) => void;
  assignRoles: (wordPair: WordPair, undercoverCount?: number, mrWhiteCount?: number) => void;
  nextPlayer: () => void;
  setPlayerClueGiven: (playerId: string) => void;
  eliminatePlayer: (playerId: string) => void;
  checkVictoryCondition: () => void;
  resetGame: () => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  setWordPair: (wordPair: WordPair) => void;
  updatePlayerNames: (names: string[]) => void;
}

const avatars = ['👤', '👨', '👩', '🧑', '👴', '👵', '🧔', '👱', '🧓', '👨‍🦱'];

const generatePlayers = (count: number): Player[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i}`,
    name: `Player ${i + 1}`,
    role: 'civilian' as Role,
    word: null,
    isAlive: true,
    hasGivenClue: false,
    avatar: avatars[i % avatars.length],
  }));
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  phase: 'home',
  players: [],
  currentPlayerIndex: 0,
  currentRound: 1,
  wordPair: null,
  eliminatedPlayer: null,
  winner: null,
  settings: {
    difficulty: 'medium',
    soundEnabled: true,
    theme: 'dark',
  },

  // Actions
  setPhase: (phase) => set({ phase }),

  initializePlayers: (count) => {
    const players = generatePlayers(count);
    set({ players, currentPlayerIndex: 0, currentRound: 1 });
  },

  assignRoles: (wordPair, undercoverCount = 1, mrWhiteCount = 1) => {
    const { players } = get();
    const shuffledPlayers = shuffleArray(players);

    let undercoverAssigned = 0;
    let mrWhiteAssigned = 0;

    // Assign roles based on counts
    const updatedPlayers = shuffledPlayers.map((player, index) => {
      // Assign undercover roles first
      if (undercoverAssigned < undercoverCount) {
        undercoverAssigned++;
        return { ...player, role: 'undercover' as Role, word: wordPair.undercover_word_english };
      }
      // Then assign Mr. White roles
      else if (mrWhiteAssigned < mrWhiteCount) {
        mrWhiteAssigned++;
        return { ...player, role: 'mrwhite' as Role, word: null };
      }
      // Rest are civilians
      else {
        return { ...player, role: 'civilian' as Role, word: wordPair.civilian_word_hindi };
      }
    });

    set({ players: updatedPlayers, wordPair });
  },

  nextPlayer: () => {
    const { currentPlayerIndex, players } = get();
    const alivePlayers = players.filter(p => p.isAlive);
    const nextIndex = (currentPlayerIndex + 1) % alivePlayers.length;
    set({ currentPlayerIndex: nextIndex });
  },

  setPlayerClueGiven: (playerId) => {
    const { players } = get();
    const updatedPlayers = players.map(p =>
      p.id === playerId ? { ...p, hasGivenClue: true } : p
    );
    set({ players: updatedPlayers });
  },

  eliminatePlayer: (playerId) => {
    const { players } = get();
    const updatedPlayers = players.map(p =>
      p.id === playerId ? { ...p, isAlive: false } : p
    );
    const eliminatedPlayer = players.find(p => p.id === playerId) || null;
    set({ players: updatedPlayers, eliminatedPlayer });
  },

  checkVictoryCondition: () => {
    const { players } = get();
    const alivePlayers = players.filter(p => p.isAlive);
    
    const undercoverAlive = alivePlayers.filter(p => p.role === 'undercover').length;
    const mrWhiteAlive = alivePlayers.filter(p => p.role === 'mrwhite').length;
    const civiliansAlive = alivePlayers.filter(p => p.role === 'civilian').length;
    const infiltratorsAlive = undercoverAlive + mrWhiteAlive;

    // Civilians win if ALL infiltrators are eliminated
    if (infiltratorsAlive === 0) {
      set({ winner: 'civilians', phase: 'victory' });
      return;
    }

    // Infiltrators win if no civilians remain
    if (civiliansAlive === 0) {
      set({ winner: 'infiltrators', phase: 'victory' });
      return;
    }

    // Infiltrators win if they equal or outnumber civilians
    if (infiltratorsAlive >= civiliansAlive) {
      set({ winner: 'infiltrators', phase: 'victory' });
      return;
    }
  },

  resetGame: () => {
    set({
      phase: 'home',
      players: [],
      currentPlayerIndex: 0,
      currentRound: 1,
      wordPair: null,
      eliminatedPlayer: null,
      winner: null,
    });
  },

  updateSettings: (newSettings) => {
    const { settings } = get();
    set({ settings: { ...settings, ...newSettings } });
  },

  setWordPair: (wordPair) => {
    set({ wordPair });
  },

  updatePlayerNames: (names) => {
    const { players } = get();
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      name: names[index] || player.name,
    }));
    set({ players: updatedPlayers });
  },
}));

