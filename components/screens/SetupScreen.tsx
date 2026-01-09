'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useGameStore } from '@/store/gameStore';
import { generateWordPair } from '@/lib/wordGenerator';
import { SpecialRoleConfig } from '@/types/game';

interface SpecialRoleOption {
  key: keyof SpecialRoleConfig;
  icon: string;
  name: string;
  description: string;
  minPlayers: number;
}

const specialRoleOptions: SpecialRoleOption[] = [
  { key: 'goddess', icon: '⚖️', name: 'Goddess of Justice', description: 'Breaks vote ties', minPlayers: 3 },
  { key: 'lovers', icon: '💖', name: 'Lovers', description: 'Linked fate pair', minPlayers: 5 },
  { key: 'meme', icon: '😂', name: 'Mr. Meme', description: 'Gestures only', minPlayers: 3 },
  { key: 'revenger', icon: '🔥', name: 'Revenger', description: 'Revenge on death', minPlayers: 5 },
  { key: 'ghost', icon: '👻', name: 'Ghost', description: 'Vote after death', minPlayers: 3 },
  { key: 'falafelVendor', icon: '🧆', name: 'Falafel Vendor', description: 'Random effects', minPlayers: 4 },
];

export default function SetupScreen() {
  const [playerCount, setPlayerCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isLoading, setIsLoading] = useState(false);

  // Role counts
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [mrWhiteCount, setMrWhiteCount] = useState(1);

  // Special roles
  const [specialRoles, setSpecialRoles] = useState<SpecialRoleConfig>({
    goddess: false,
    lovers: false,
    meme: false,
    revenger: false,
    ghost: false,
    falafelVendor: false,
  });

  const { initializePlayers, assignRoles, setPhase, updateSettings, setSpecialRoleConfig, assignSpecialRoles } = useGameStore();

  const civilianCount = playerCount - undercoverCount - mrWhiteCount;

  const toggleSpecialRole = (role: keyof SpecialRoleConfig) => {
    const option = specialRoleOptions.find(r => r.key === role);
    if (option && playerCount < option.minPlayers && !specialRoles[role]) {
      return; // Can't enable if player count is too low
    }
    setSpecialRoles(prev => ({ ...prev, [role]: !prev[role] }));
  };

  const getSpecialRoleErrors = (): string[] => {
    const errors: string[] = [];
    specialRoleOptions.forEach(option => {
      if (specialRoles[option.key] && playerCount < option.minPlayers) {
        errors.push(`${option.name} requires ${option.minPlayers}+ players`);
      }
    });
    return errors;
  };

  const specialRoleErrors = getSpecialRoleErrors();

  const adjustRoleCount = (role: 'undercover' | 'mrwhite', change: number) => {
    if (role === 'undercover') {
      const newCount = Math.max(0, Math.min(playerCount - 1, undercoverCount + change));
      if (newCount + mrWhiteCount < playerCount) {
        setUndercoverCount(newCount);
      }
    } else {
      const newCount = Math.max(0, Math.min(playerCount - 1, mrWhiteCount + change));
      if (undercoverCount + newCount < playerCount) {
        setMrWhiteCount(newCount);
      }
    }
  };

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    // Adjust roles if they exceed new player count
    const maxInfiltrators = count - 1; // At least 1 civilian
    if (undercoverCount + mrWhiteCount >= count) {
      setUndercoverCount(Math.min(1, maxInfiltrators));
      setMrWhiteCount(Math.min(1, maxInfiltrators - undercoverCount));
    }
    // Disable special roles that require more players
    const updatedSpecialRoles = { ...specialRoles };
    specialRoleOptions.forEach(option => {
      if (count < option.minPlayers) {
        updatedSpecialRoles[option.key] = false;
      }
    });
    setSpecialRoles(updatedSpecialRoles);
  };

  const handleStartGame = async () => {
    if (civilianCount < 1) {
      alert('You need at least 1 civilian!');
      return;
    }

    if (specialRoleErrors.length > 0) {
      alert(specialRoleErrors.join('\n'));
      return;
    }

    setIsLoading(true);

    try {
      // Update difficulty setting
      updateSettings({ difficulty });

      // Set special role config
      setSpecialRoleConfig(specialRoles);

      // Initialize players
      initializePlayers(playerCount);

      // Generate word pair with fallback support
      const result = await generateWordPair(difficulty);

      // Show warning if switching to fallback mode for the first time
      if (result.showWarning) {
        alert('⚠️ API tokens exhausted! Using offline word pairs. Add a new API key in .env.local to restore AI-generated words.');
      }

      // Assign core roles
      assignRoles(result.wordPair, undercoverCount, mrWhiteCount);

      // Assign special roles
      assignSpecialRoles();

      // Move to player names phase
      setPhase('player-names');
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6"
      >
        <Button variant="secondary" onClick={() => useGameStore.getState().setPhase('home')}>
          ← Back
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg py-16"
      >
        <h1 className="font-display text-4xl font-bold text-center mb-8 text-ivory">
          Game Setup
        </h1>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-xl mb-4 text-ivory">Number of Players</h3>
            <div className="grid grid-cols-5 gap-2">
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePlayerCountChange(num)}
                  className={`
                    py-3 rounded-lg font-semibold transition-all duration-200
                    ${playerCount === num
                      ? 'bg-gradient-primary text-ivory shadow-lg scale-105 border border-accent-light/30'
                      : 'glass text-ivory-dim hover:text-ivory hover:bg-surface-light/50 border border-ivory/5'
                    }
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-xl mb-4 text-ivory">Configure Roles</h3>

            {/* Civilians */}
            <div className="mb-4 p-4 glass rounded-xl border border-ivory/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-civilian flex items-center justify-center text-ivory font-bold">
                    {civilianCount}
                  </div>
                  <div>
                    <p className="text-ivory font-semibold">Civilians</p>
                    <p className="text-xs text-ivory-dim">Find the infiltrators</p>
                  </div>
                </div>
                <div className="text-civilian font-bold text-xl">
                  {civilianCount}
                </div>
              </div>
            </div>

            {/* Undercover */}
            <div className="mb-4 p-4 glass rounded-xl border border-ivory/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-undercover flex items-center justify-center text-ivory font-bold">
                    {undercoverCount}
                  </div>
                  <div>
                    <p className="text-ivory font-semibold">Undercover</p>
                    <p className="text-xs text-ivory-dim">Blend in and survive</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustRoleCount('undercover', -1)}
                    disabled={undercoverCount === 0}
                    className="w-8 h-8 rounded-lg bg-accent/20 text-accent-light hover:bg-accent/30 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-colors"
                  >
                    −
                  </button>
                  <div className="w-12 text-center text-accent font-bold text-xl">
                    {undercoverCount}
                  </div>
                  <button
                    onClick={() => adjustRoleCount('undercover', 1)}
                    disabled={undercoverCount + mrWhiteCount >= playerCount - 1}
                    className="w-8 h-8 rounded-lg bg-success/20 text-success-light hover:bg-success/30 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Mr. White */}
            <div className="mb-4 p-4 glass rounded-xl border border-ivory/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-mrwhite flex items-center justify-center text-base font-bold">
                    {mrWhiteCount}
                  </div>
                  <div>
                    <p className="text-ivory font-semibold">Mr. White</p>
                    <p className="text-xs text-ivory-dim">No word, pure skill</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustRoleCount('mrwhite', -1)}
                    disabled={mrWhiteCount === 0}
                    className="w-8 h-8 rounded-lg bg-accent/20 text-accent-light hover:bg-accent/30 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-colors"
                  >
                    −
                  </button>
                  <div className="w-12 text-center text-gold font-bold text-xl">
                    {mrWhiteCount}
                  </div>
                  <button
                    onClick={() => adjustRoleCount('mrwhite', 1)}
                    disabled={undercoverCount + mrWhiteCount >= playerCount - 1}
                    className="w-8 h-8 rounded-lg bg-success/20 text-success-light hover:bg-success/30 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="pt-4 border-t border-ivory/10">
              <div className="flex justify-between text-sm text-ivory-dim">
                <span>Total Players:</span>
                <span className={civilianCount < 1 ? 'text-accent' : 'text-success-light'}>
                  {civilianCount + undercoverCount + mrWhiteCount} / {playerCount}
                </span>
              </div>
              {civilianCount < 1 && (
                <p className="text-accent text-xs mt-2">⚠️ Need at least 1 civilian!</p>
              )}
            </div>
          </Card>

          {/* Special Roles */}
          <Card>
            <h3 className="font-semibold text-xl mb-4 text-ivory">✨ Special Roles</h3>
            <p className="text-ivory-dim text-sm mb-4">Enable optional roles for extra fun!</p>

            <div className="grid grid-cols-2 gap-3">
              {specialRoleOptions.map((option) => {
                const isEnabled = specialRoles[option.key];
                const isDisabled = playerCount < option.minPlayers;

                return (
                  <button
                    key={option.key}
                    onClick={() => toggleSpecialRole(option.key)}
                    disabled={isDisabled && !isEnabled}
                    className={`
                      p-3 rounded-xl text-left transition-all duration-200 border
                      ${isEnabled
                        ? 'bg-gradient-to-r from-accent/30 to-gold/20 border-accent/40 shadow-lg'
                        : isDisabled
                          ? 'glass border-ivory/5 opacity-40 cursor-not-allowed'
                          : 'glass border-ivory/5 hover:border-accent/30 hover:bg-surface-light/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{option.icon}</span>
                      <span className={`font-semibold text-sm ${isEnabled ? 'text-ivory' : 'text-ivory-dim'}`}>
                        {option.name}
                      </span>
                    </div>
                    <p className="text-xs text-ivory-dim">{option.description}</p>
                    {isDisabled && (
                      <p className="text-xs text-accent mt-1">{option.minPlayers}+ players</p>
                    )}
                  </button>
                );
              })}
            </div>

            {specialRoleErrors.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-accent/20 border border-accent/30">
                {specialRoleErrors.map((error, i) => (
                  <p key={i} className="text-accent text-xs">⚠️ {error}</p>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="font-semibold text-xl mb-4 text-ivory">Difficulty Level</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`
                    py-4 rounded-lg font-semibold capitalize transition-all duration-200
                    ${difficulty === level
                      ? 'bg-gradient-primary text-ivory shadow-lg scale-105 border border-accent-light/30'
                      : 'glass text-ivory-dim hover:text-ivory hover:bg-surface-light/50 border border-ivory/5'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-ivory-dim">
              <p>• Easy: Common everyday words</p>
              <p>• Medium: Moderately familiar concepts</p>
              <p>• Hard: Abstract or similar meanings</p>
            </div>
          </Card>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleStartGame}
            disabled={isLoading || civilianCount < 1 || specialRoleErrors.length > 0}
          >
            {isLoading ? '⏳ Preparing Game...' : '🚀 Start Game'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
