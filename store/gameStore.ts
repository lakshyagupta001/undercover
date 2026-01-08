import { create } from "zustand";
import { GameState, Player, Role, WordPair, GamePhase } from "@/types/game";
import { shuffleArray } from "@/lib/utils";

interface GameStore extends GameState {
  // Actions
  setPhase: (phase: GamePhase) => void;
  initializePlayers: (count: number) => void;
  assignRoles: (
    wordPair: WordPair,
    undercoverCount?: number,
    mrWhiteCount?: number
  ) => void;
  eliminatePlayer: (playerId: string) => void;
  checkVictoryCondition: () => void;
  resetGame: () => void;
  updateSettings: (settings: Partial<GameState["settings"]>) => void;
  updatePlayerNames: (names: string[]) => void;
  setRoundPlayerOrder: () => void;
  startNextGame: (wordPair: WordPair, undercoverCount?: number, mrWhiteCount?: number) => void;
  setMrWhiteGuessResult: (correct: boolean) => void;
  calculateAndAwardPoints: () => void;
}

const avatars = ["👤", "👤", "👤", "👤", "👤", "👤", "👤", "👤", "👤", "👤"];

const generatePlayers = (count: number): Player[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i}`,
    name: `Player ${i + 1}`,
    role: "civilian" as Role,
    word: null,
    isAlive: true,
    hasGivenClue: false,
    avatar: avatars[i % avatars.length],
    points: 0, // Initialize with 0 points
  }));
};

export const useGameStore = create<GameStore>((set, get) => ({
  phase: "home",
  players: [],
  currentRound: 1,
  wordPair: null,
  eliminatedPlayer: null,
  winner: null,
  roundPlayerOrder: [],
  roleRevealStartIndex: 0,
  gameNumber: 1,
  mrWhiteGuessedCorrectly: false,
  settings: {
    difficulty: "medium",
  },

  setPhase: (phase) => set({ phase }),

  initializePlayers: (count) => {
    const players = generatePlayers(count);
    set({ players, currentRound: 1 });
  },

  assignRoles: (wordPair, undercoverCount = 1, mrWhiteCount = 1) => {
    const { players } = get();

    const nextStartIndex = 0;

    const totalPlayers = players.length;
    const indices = shuffleArray(Array.from({ length: totalPlayers }, (_, i) => i));

    const undercoverIndices = new Set(indices.slice(0, undercoverCount));
    const mrWhiteIndices = new Set(indices.slice(undercoverCount, undercoverCount + mrWhiteCount));

    const updatedPlayers = players.map((player, idx) => {
      let role: Role = 'civilian';
      let word: string | null = wordPair.civilian_word;

      if (undercoverIndices.has(idx)) {
        role = 'undercover';
        word = wordPair.undercover_word;
      } else if (mrWhiteIndices.has(idx)) {
        role = 'mrwhite';
        word = null;
      }

      return {
        ...player,
        role,
        word,
        isAlive: true,
        hasGivenClue: false,
      };
    });

    set({ players: updatedPlayers, wordPair, roleRevealStartIndex: nextStartIndex });
  },

  eliminatePlayer: (playerId) => {
    const { players } = get();
    const updatedPlayers = players.map((p) =>
      p.id === playerId ? { ...p, isAlive: false } : p
    );
    const eliminatedPlayer = players.find((p) => p.id === playerId) || null;
    set({ players: updatedPlayers, eliminatedPlayer });
  },

  checkVictoryCondition: () => {
    const { players } = get();
    const alivePlayers = players.filter((p) => p.isAlive);

    const undercoverAlive = alivePlayers.filter(
      (p) => p.role === "undercover"
    ).length;
    const mrWhiteAlive = alivePlayers.filter(
      (p) => p.role === "mrwhite"
    ).length;
    const civiliansAlive = alivePlayers.filter(
      (p) => p.role === "civilian"
    ).length;
    const infiltratorsAlive = undercoverAlive + mrWhiteAlive;

    if (infiltratorsAlive === 0 && civiliansAlive > 0) {
      set({ winner: "civilians", phase: "victory" });
      return;
    }

    if (civiliansAlive === 1 && infiltratorsAlive > 0) {
      set({ winner: "infiltrators", phase: "victory" });
      return;
    }
  },

  resetGame: () => {
    set({
      phase: "home",
      players: [],
      currentRound: 1,
      wordPair: null,
      eliminatedPlayer: null,
      winner: null,
      roundPlayerOrder: [],
      mrWhiteGuessedCorrectly: false,
      roleRevealStartIndex: 0,
      gameNumber: 1,
    });
  },

  updateSettings: (newSettings) => {
    const { settings } = get();
    set({ settings: { ...settings, ...newSettings } });
  },

  updatePlayerNames: (names) => {
    const { players } = get();
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      name: names[index] || player.name,
    }));
    set({ players: updatedPlayers });
  },

  setRoundPlayerOrder: () => {
    const { players } = get();
    const alivePlayers = players.filter((p) => p.isAlive);
    let shuffled = shuffleArray([...alivePlayers]);

    if (shuffled.length > 1 && shuffled[0].role === "mrwhite") {
      const nonWhiteIndex = shuffled.findIndex((p) => p.role !== "mrwhite");
      if (nonWhiteIndex !== -1) {
        [shuffled[0], shuffled[nonWhiteIndex]] = [shuffled[nonWhiteIndex], shuffled[0]];
      }
    }

    set({ roundPlayerOrder: shuffled.map((p) => p.id) });
  },

  startNextGame: (wordPair, undercoverCount = 1, mrWhiteCount = 1) => {
    const { players, gameNumber, roleRevealStartIndex } = get();

    const nextStartIndex = (roleRevealStartIndex + 1) % players.length;

    const resetPlayers = players.map((player) => ({
      ...player,
      role: "civilian" as Role,
      word: null,
      isAlive: true,
      hasGivenClue: false,
    }));

    const totalPlayers = players.length;
    const indices = shuffleArray(Array.from({ length: totalPlayers }, (_, i) => i));
    const undercoverIndices = new Set(indices.slice(0, undercoverCount));
    const mrWhiteIndices = new Set(indices.slice(undercoverCount, undercoverCount + mrWhiteCount));

    const updatedPlayers = resetPlayers.map((player, idx) => {
      let role: Role = 'civilian';
      let word: string | null = wordPair.civilian_word;

      if (undercoverIndices.has(idx)) {
        role = 'undercover';
        word = wordPair.undercover_word;
      } else if (mrWhiteIndices.has(idx)) {
        role = 'mrwhite';
        word = null;
      }

      return {
        ...player,
        role,
        word,
      };
    });

    set({
      players: updatedPlayers,
      wordPair,
      roleRevealStartIndex: nextStartIndex,
      gameNumber: gameNumber + 1,
      currentRound: 1,
      roundPlayerOrder: [],
      eliminatedPlayer: null,
      winner: null,
      mrWhiteGuessedCorrectly: false,
      phase: "role-assignment",
    });
  },

  setMrWhiteGuessResult: (correct: boolean) => {
    set({ mrWhiteGuessedCorrectly: correct });
  },

  calculateAndAwardPoints: () => {
    const { players, winner, mrWhiteGuessedCorrectly } = get();
    
    const updatedPlayers = players.map((player) => {
      let pointsEarned = 0;
      
      if (player.role === "civilian") {
        if (winner === "civilians") {
          pointsEarned = 1;
        }
      } else if (player.role === "undercover") {
        if (winner === "infiltrators") {
          pointsEarned = 2;
        }
      } else if (player.role === "mrwhite") {
        if (winner === "infiltrators" && player.isAlive) {
          pointsEarned = 3;
        } else if (!player.isAlive && mrWhiteGuessedCorrectly) {
          pointsEarned = 3;
        }
      }
      
      return {
        ...player,
        points: player.points + pointsEarned,
      };
    });
    
    set({ players: updatedPlayers });
  },
}));
