import { create } from "zustand";
import { GameState, Player, Role, WordPair, GamePhase, SpecialRoleConfig, FalafelEffectType } from "@/types/game";
import { shuffleArray } from "@/lib/utils";

const defaultSpecialRoleConfig: SpecialRoleConfig = {
  goddess: false,
  lovers: false,
  meme: false,
  revenger: false,
  ghost: false,
  falafelVendor: false,
};

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
  // Special roles actions
  setSpecialRoleConfig: (config: Partial<SpecialRoleConfig>) => void;
  assignSpecialRoles: () => void;
  selectMrMeme: () => void;
  distributeFalafel: (targetId?: string) => void;
  triggerRevenger: (playerId: string) => void;
  executeRevenge: (targetId: string) => void;
  applyLoversElimination: (playerId: string) => void;
  resolveFalafelEffect: (playerId: string) => boolean;
  convertToGhost: (playerId: string) => void;
  processElimination: (playerId: string) => void;
  clearPendingEliminations: () => void;
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
    points: 0,
    specialRoles: [],
    isGhost: false,
  }));
};

// Helper to assign roles to players
const assignRolesToPlayers = (
  players: Player[],
  wordPair: WordPair,
  undercoverCount: number,
  mrWhiteCount: number
): Player[] => {
  const totalPlayers = players.length;
  const indices = shuffleArray(Array.from({ length: totalPlayers }, (_, i) => i));
  const undercoverIndices = new Set(indices.slice(0, undercoverCount));
  const mrWhiteIndices = new Set(indices.slice(undercoverCount, undercoverCount + mrWhiteCount));

  return players.map((player, idx) => {
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
      specialRoles: [],
      isGhost: false,
      loverId: undefined,
      hasFalafel: undefined,
    };
  });
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
  // Special roles state
  specialRoleConfig: { ...defaultSpecialRoleConfig },
  currentMrMeme: null,
  revengerPending: null,
  pendingEliminations: [],
  falafelVendorId: null,

  setPhase: (phase) => set({ phase }),

  initializePlayers: (count) => {
    const players = generatePlayers(count);
    set({ players, currentRound: 1 });
  },

  assignRoles: (wordPair, undercoverCount = 1, mrWhiteCount = 1) => {
    const { players } = get();
    const updatedPlayers = assignRolesToPlayers(players, wordPair, undercoverCount, mrWhiteCount);
    set({ players: updatedPlayers, wordPair, roleRevealStartIndex: 0 });
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
    const alivePlayers = players.filter((p) => p.isAlive && !p.isGhost);

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
      specialRoleConfig: { ...defaultSpecialRoleConfig },
      currentMrMeme: null,
      revengerPending: null,
      pendingEliminations: [],
      falafelVendorId: null,
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
    const alivePlayers = players.filter((p) => p.isAlive && !p.isGhost);
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

    // Preserve player names and points, reset game state
    const preservedPlayers = players.map((player) => ({
      ...player,
      role: "civilian" as Role,
      word: null,
      isAlive: true,
      hasGivenClue: false,
      specialRoles: [],
      isGhost: false,
      loverId: undefined,
      hasFalafel: undefined,
    }));

    const updatedPlayers = assignRolesToPlayers(preservedPlayers, wordPair, undercoverCount, mrWhiteCount);

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
      currentMrMeme: null,
      revengerPending: null,
      pendingEliminations: [],
      falafelVendorId: null,
    });

    // Re-assign special roles for the new game (using the preserved config)
    get().assignSpecialRoles();
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

  // Special roles actions
  setSpecialRoleConfig: (config) => {
    const { specialRoleConfig } = get();
    set({ specialRoleConfig: { ...specialRoleConfig, ...config } });
  },

  assignSpecialRoles: () => {
    const { players, specialRoleConfig } = get();
    const totalPlayers = players.length;
    let updatedPlayers = [...players];
    let usedIndices = new Set<number>();
    let falafelVendorId: string | null = null;

    // Assign Goddess of Justice
    if (specialRoleConfig.goddess) {
      const availableIndices = Array.from({ length: totalPlayers }, (_, i) => i).filter(i => !usedIndices.has(i));
      if (availableIndices.length > 0) {
        const goddessIndex = shuffleArray(availableIndices)[0];
        updatedPlayers[goddessIndex] = {
          ...updatedPlayers[goddessIndex],
          specialRoles: [...updatedPlayers[goddessIndex].specialRoles, 'goddess'],
        };
        usedIndices.add(goddessIndex);
      }
    }

    // Assign Lovers (2 players, requires 5+ players)
    if (specialRoleConfig.lovers && totalPlayers >= 5) {
      const availableIndices = Array.from({ length: totalPlayers }, (_, i) => i);
      const shuffledIndices = shuffleArray(availableIndices);
      if (shuffledIndices.length >= 2) {
        const lover1Index = shuffledIndices[0];
        const lover2Index = shuffledIndices[1];
        updatedPlayers[lover1Index] = {
          ...updatedPlayers[lover1Index],
          specialRoles: [...updatedPlayers[lover1Index].specialRoles, 'lover'],
          loverId: updatedPlayers[lover2Index].id,
        };
        updatedPlayers[lover2Index] = {
          ...updatedPlayers[lover2Index],
          specialRoles: [...updatedPlayers[lover2Index].specialRoles, 'lover'],
          loverId: updatedPlayers[lover1Index].id,
        };
      }
    }

    // Assign Revenger (requires 5+ players)
    if (specialRoleConfig.revenger && totalPlayers >= 5) {
      const availableIndices = Array.from({ length: totalPlayers }, (_, i) => i).filter(i => !usedIndices.has(i));
      if (availableIndices.length > 0) {
        const revengerIndex = shuffleArray(availableIndices)[0];
        updatedPlayers[revengerIndex] = {
          ...updatedPlayers[revengerIndex],
          specialRoles: [...updatedPlayers[revengerIndex].specialRoles, 'revenger'],
        };
        usedIndices.add(revengerIndex);
      }
    }

    // Assign Ghost
    if (specialRoleConfig.ghost) {
      const availableIndices = Array.from({ length: totalPlayers }, (_, i) => i).filter(i => !usedIndices.has(i));
      if (availableIndices.length > 0) {
        const ghostIndex = shuffleArray(availableIndices)[0];
        updatedPlayers[ghostIndex] = {
          ...updatedPlayers[ghostIndex],
          specialRoles: [...updatedPlayers[ghostIndex].specialRoles, 'ghost'],
        };
        usedIndices.add(ghostIndex);
      }
    }

    // Assign Falafel Vendor (requires 4+ players)
    if (specialRoleConfig.falafelVendor && totalPlayers >= 4) {
      const availableIndices = Array.from({ length: totalPlayers }, (_, i) => i).filter(i => !usedIndices.has(i));
      if (availableIndices.length > 0) {
        const falafelIndex = shuffleArray(availableIndices)[0];
        updatedPlayers[falafelIndex] = {
          ...updatedPlayers[falafelIndex],
          specialRoles: [...updatedPlayers[falafelIndex].specialRoles, 'falafelVendor'],
        };
        falafelVendorId = updatedPlayers[falafelIndex].id;
        usedIndices.add(falafelIndex);
      }
    }

    set({ players: updatedPlayers, falafelVendorId });
  },

  selectMrMeme: () => {
    const { players, specialRoleConfig } = get();
    if (!specialRoleConfig.meme) {
      set({ currentMrMeme: null });
      return;
    }

    const alivePlayers = players.filter((p) => p.isAlive && !p.isGhost);
    if (alivePlayers.length === 0) {
      set({ currentMrMeme: null });
      return;
    }

    const randomPlayer = shuffleArray([...alivePlayers])[0];
    set({ currentMrMeme: randomPlayer.id });
  },

  distributeFalafel: (targetId?: string) => {
    const { players, falafelVendorId, specialRoleConfig } = get();
    if (!specialRoleConfig.falafelVendor || !falafelVendorId) return;

    const vendor = players.find((p) => p.id === falafelVendorId);
    if (!vendor || !vendor.isAlive) return;

    // Random effect: 50/50 protect or sabotage (freshly randomized each round)
    const effectType: FalafelEffectType = Math.random() < 0.5 ? 'protect' : 'sabotage';

    // Update players: clear old falafel, add new if target specified
    const updatedPlayers: Player[] = players.map((p) => {
      // Clear previous falafel
      const clearedPlayer = { ...p, hasFalafel: undefined };

      // If this is the target, give them falafel
      if (targetId && p.id === targetId && p.isAlive && !p.isGhost) {
        return { ...clearedPlayer, hasFalafel: { playerId: p.id, type: effectType, used: false } };
      }

      return clearedPlayer;
    });

    set({ players: updatedPlayers });
  },

  triggerRevenger: (playerId) => {
    set({ revengerPending: playerId });
  },

  executeRevenge: (targetId) => {
    const { pendingEliminations } = get();
    set({
      pendingEliminations: [...pendingEliminations, targetId],
      revengerPending: null,
    });
  },

  applyLoversElimination: (playerId) => {
    const { players, specialRoleConfig } = get();
    if (!specialRoleConfig.lovers) return;

    const player = players.find((p) => p.id === playerId);
    if (!player || !player.specialRoles.includes('lover') || !player.loverId) return;

    const lover = players.find((p) => p.id === player.loverId);
    if (!lover || !lover.isAlive) return;

    // Eliminate the second Lover immediately
    const updatedPlayers = players.map((p) =>
      p.id === lover.id
        ? { ...p, isAlive: false }
        : p
    );

    // Store the lover as a secondary eliminated player (for reveal display)
    const { pendingEliminations } = get();

    set({
      players: updatedPlayers,
      pendingEliminations: [...pendingEliminations, lover.id],
    });

    // Handle chain effects for the second Lover:

    // If second Lover has Revenger role, trigger it
    if (lover.specialRoles.includes('revenger') && specialRoleConfig.revenger) {
      get().triggerRevenger(lover.id);
    }

    // If second Lover has Ghost role, convert them
    if (lover.specialRoles.includes('ghost') && specialRoleConfig.ghost) {
      get().convertToGhost(lover.id);
    }

    // Note: If second Lover is Mr. White, the UI should check pendingEliminations
    // and give them a guess chance. This is handled in RoleRevealScreen flow.
  },

  resolveFalafelEffect: (playerId) => {
    const { players } = get();
    const player = players.find((p) => p.id === playerId);

    if (!player || !player.hasFalafel || player.hasFalafel.used) {
      return false; // No protection
    }

    const effect = player.hasFalafel;

    // Mark falafel as used
    const updatedPlayers = players.map((p) =>
      p.id === playerId
        ? { ...p, hasFalafel: { ...effect, used: true } }
        : p
    );
    set({ players: updatedPlayers });

    if (effect.type === 'protect') {
      return true; // Protected, cancel elimination
    }

    // Sabotage does nothing special (player is eliminated anyway)
    return false;
  },

  convertToGhost: (playerId) => {
    const { players, specialRoleConfig } = get();
    if (!specialRoleConfig.ghost) return;

    const player = players.find((p) => p.id === playerId);
    if (!player || !player.specialRoles.includes('ghost')) return;

    const updatedPlayers = players.map((p) =>
      p.id === playerId
        ? { ...p, isGhost: true, isAlive: false }
        : p
    );

    set({ players: updatedPlayers });
  },

  processElimination: (playerId) => {
    const { players, specialRoleConfig } = get();
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    // Check falafel protection first
    const isProtected = get().resolveFalafelEffect(playerId);
    if (isProtected) {
      // Remove from pending eliminations
      const { pendingEliminations } = get();
      set({ pendingEliminations: pendingEliminations.filter((id) => id !== playerId) });
      return;
    }

    // Eliminate the player
    get().eliminatePlayer(playerId);

    // Check if player has Revenger role
    if (player.specialRoles.includes('revenger') && specialRoleConfig.revenger) {
      get().triggerRevenger(playerId);
    }

    // Check if player has Lover role
    if (player.specialRoles.includes('lover') && specialRoleConfig.lovers) {
      get().applyLoversElimination(playerId);
    }

    // Check if player has Ghost role
    if (player.specialRoles.includes('ghost') && specialRoleConfig.ghost) {
      get().convertToGhost(playerId);
    }
  },

  clearPendingEliminations: () => {
    set({ pendingEliminations: [] });
  },
}));
