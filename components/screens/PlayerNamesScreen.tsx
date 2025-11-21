'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useGameStore } from '@/store/gameStore';

export default function PlayerNamesScreen() {
  const { players, setPhase, updatePlayerNames } = useGameStore();
  const [names, setNames] = useState<string[]>(
    players.map(() => '')
  );

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...names];
    newNames[index] = name;
    setNames(newNames);
  };

  const handleContinue = () => {
    // Use custom names or default to Player X
    const finalNames = names.map((name, i) => name.trim() || `Player ${i + 1}`);
    // Update player names in store
    updatePlayerNames(finalNames);
    // Move to role assignment
    setPhase('role-assignment');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button variant="secondary" onClick={() => setPhase('setup')}>
          ← Back
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto flex-1"
      >
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-2 text-white">
          Enter Player Names
        </h1>
        <p className="text-center text-white/60 mb-6 sm:mb-8">
          Customize names for all {players.length} players (optional)
        </p>

        <Card className="mb-6">
          <div className="space-y-3 sm:space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-2xl sm:text-3xl flex-shrink-0">{player.avatar}</div>
                  <input
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    value={names[index]}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    maxLength={20}
                    className="flex-1 bg-black/30 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm sm:text-base"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
            <p className="text-xs sm:text-sm text-white/60 text-center">
              💡 Tip: Leave blank to use default names (Player 1, Player 2, etc.)
            </p>
          </div>
        </Card>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleContinue}
        >
          Continue to Game →
        </Button>
      </motion.div>
    </div>
  );
}


