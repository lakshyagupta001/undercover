'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useGameStore } from '@/store/gameStore';

export default function PlayerNamesScreen() {
  const { players, setPhase, updatePlayerNames } = useGameStore();
  const [names, setNames] = useState<string[]>(
    players.map((_, i) => `Player ${i + 1}`)
  );

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...names];
    newNames[index] = name || `Player ${index + 1}`;
    setNames(newNames);
  };

  const handleContinue = () => {
    // Update player names in store
    updatePlayerNames(names);
    // Move to role assignment
    setPhase('role-assignment');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6"
      >
        <Button variant="secondary" onClick={() => setPhase('setup')}>
          ← Back
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <h1 className="font-display text-4xl font-bold text-center mb-2 text-white">
          Enter Player Names
        </h1>
        <p className="text-center text-white/60 mb-8">
          Customize names for all {players.length} players
        </p>

        <Card className="mb-6">
          <div className="space-y-4">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{player.avatar}</div>
                  <input
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    value={names[index]}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    maxLength={20}
                    className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-white/60 text-center">
              💡 Tip: Keep names short and easy to identify
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


