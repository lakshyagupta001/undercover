'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useGameStore } from '@/store/gameStore';
import { generateWordPair } from '@/lib/wordGenerator';

export default function SetupScreen() {
  const [playerCount, setPlayerCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  // Role counts
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [mrWhiteCount, setMrWhiteCount] = useState(1);
  
  const { initializePlayers, assignRoles, setPhase, updateSettings } = useGameStore();

  const civilianCount = playerCount - undercoverCount - mrWhiteCount;

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
  };

  const handleStartGame = async () => {
    if (civilianCount < 1) {
      alert('You need at least 1 civilian!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Update difficulty setting
      updateSettings({ difficulty });
      
      // Initialize players
      initializePlayers(playerCount);
      
      // Generate word pair
      const wordPair = await generateWordPair(difficulty, apiKey || undefined);
      
      // Assign roles with custom counts
      assignRoles(wordPair, undercoverCount, mrWhiteCount);
      
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base">
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
        className="w-full max-w-lg"
      >
        <h1 className="font-display text-4xl font-bold text-center mb-8 text-ivory">
          Game Setup
        </h1>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-xl mb-4 text-ivory">Number of Players</h3>
            <div className="grid grid-cols-5 gap-2">
              {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
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

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg text-ivory">AI Word Generator</h3>
              <button
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-sm text-gold hover:text-gold-light transition-colors"
              >
                {showApiKeyInput ? 'Hide' : 'Configure'}
              </button>
            </div>
            
            {showApiKeyInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-3"
              >
                <input
                  type="password"
                  placeholder="Enter Gemini API Key (optional)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-base/50 border border-ivory/20 rounded-lg px-4 py-2 text-ivory placeholder-ivory-faint focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </motion.div>
            )}
            
            <p className="text-xs text-ivory-faint">
              {apiKey ? '✓ AI-generated words enabled' : 'Using fallback word list (offline mode)'}
            </p>
          </Card>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleStartGame}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Preparing Game...' : '🚀 Start Game'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

