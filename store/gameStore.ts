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
  // Initial state
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

  // Actions
  setPhase: (phase) => set({ phase }),

  initializePlayers: (count) => {
    const players = generatePlayers(count);
    set({ players, currentRound: 1 });
  },

  assignRoles: (wordPair, undercoverCount = 1, mrWhiteCount = 1) => {
    const { players } = get();

    // For fresh games (started from SetupScreen), always start role reveal from Player 1
    const nextStartIndex = 0;

    // Use index-based random assignment to guarantee unbiased distribution
    const totalPlayers = players.length;
    const indices = shuffleArray(Array.from({ length: totalPlayers }, (_, i) => i));

    // Pick random indices for Undercover and Mr. White
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

    // Civilians win if ALL infiltrators are eliminated (both Undercover AND Mr. White)
    if (infiltratorsAlive === 0 && civiliansAlive > 0) {
      console.log("✓ Civilians win - all infiltrators eliminated");
      set({ winner: "civilians", phase: "victory" });
      return;
    }

    // Infiltrators win if only 1 civilian is left
    if (civiliansAlive === 1 && infiltratorsAlive > 0) {
      console.log("✓ Infiltrators win - only 1 civilian remains");
      set({ winner: "infiltrators", phase: "victory" });
      return;
    }

    // No victory condition met - game continues
    console.log(
      `Game continues - Civilians: ${civiliansAlive}, Infiltrators: ${infiltratorsAlive}`
    );
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

    // Ensure Mr. White is never first in the order
    // Keep shuffling until the first player is not Mr. White, or swap if needed
    if (shuffled.length > 1 && shuffled[0].role === "mrwhite") {
      // Find first non-Mr. White player and swap
      const nonWhiteIndex = shuffled.findIndex((p) => p.role !== "mrwhite");
      if (nonWhiteIndex !== -1) {
        [shuffled[0], shuffled[nonWhiteIndex]] = [shuffled[nonWhiteIndex], shuffled[0]];
      }
    }

    set({ roundPlayerOrder: shuffled.map((p) => p.id) });
  },

  startNextGame: (wordPair, undercoverCount = 1, mrWhiteCount = 1) => {
    const { players, gameNumber, roleRevealStartIndex } = get();

    // Rotate role reveal start index: Game 1 -> Player 1, Game 2 -> Player 2, etc.
    const nextStartIndex = (roleRevealStartIndex + 1) % players.length;

    // Reset players for new game (keep names and cumulative points but reset roles/status)
    const resetPlayers = players.map((player) => ({
      ...player,
      role: "civilian" as Role,
      word: null,
      isAlive: true,
      hasGivenClue: false,
    }));

    // Randomly pick indices for special roles to ensure unbiased distribution
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
    
    // Calculate points based on game outcome
    const updatedPlayers = players.map((player) => {
      let pointsEarned = 0;
      
      if (player.role === "civilian") {
        // Civilians: +1 point if all infiltrators are eliminated (civilians win)
        if (winner === "civilians") {
          pointsEarned = 1;
        }
      } else if (player.role === "undercover") {
        // Undercover: +2 points if at least one undercover survives (infiltrators win)
        if (winner === "infiltrators") {
          pointsEarned = 2;
        }
      } else if (player.role === "mrwhite") {
        // Mr. White: +3 points if survives OR guessed correctly when eliminated
        if (winner === "infiltrators" && player.isAlive) {
          // Mr. White survived till the end
          pointsEarned = 3;
        } else if (!player.isAlive && mrWhiteGuessedCorrectly) {
          // Mr. White was eliminated but guessed correctly
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
