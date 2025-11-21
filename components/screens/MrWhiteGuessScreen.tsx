'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useGameStore } from '@/store/gameStore';

export default function MrWhiteGuessScreen() {
  const { eliminatedPlayer, wordPair, setPhase, players, currentRound } = useGameStore();
  const [guess, setGuess] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!eliminatedPlayer || eliminatedPlayer.role !== 'mrwhite') return null;

  const handleSubmitGuess = () => {
    if (!guess.trim()) {
      alert('Please enter your guess!');
      return;
    }

    const civilianWord = wordPair?.civilian_word_hindi?.toLowerCase().trim();
    const userGuess = guess.toLowerCase().trim();
    
    const correct = civilianWord === userGuess;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      // Mr. White guessed correctly - Infiltrators win!
      setTimeout(() => {
        useGameStore.setState({ winner: 'infiltrators' });
        setPhase('victory');
      }, 3000);
    } else {
      // Wrong guess - continue to normal role reveal
      setTimeout(() => {
        setPhase('role-reveal');
      }, 3000);
    }
  };

  const handleSkip = () => {
    setPhase('role-reveal');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="max-w-md w-full"
      >
        {!showResult ? (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="text-6xl mb-4">👻</div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">
                Mr. White&apos;s Last Chance!
              </h1>
              <p className="text-white/60">
                Guess the civilian word to win
              </p>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <Card className="bg-gradient-to-r from-gray-600/20 to-gray-400/20">
                <p className="text-white/80 text-center mb-4">
                  You&apos;ve been discovered, but you have ONE chance to guess the civilian word!
                </p>
                <p className="text-white/60 text-sm text-center">
                  If you guess correctly, the infiltrators win the game!
                </p>
              </Card>
            </motion.div>

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <Card>
                <label className="block text-white/70 text-sm mb-2">
                  Enter your guess:
                </label>
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Type the civilian word..."
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white text-lg placeholder-white/40 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitGuess()}
                />
              </Card>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSubmitGuess}
                disabled={!guess.trim()}
              >
                Submit Guess
              </Button>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleSkip}
              >
                Skip (Accept Defeat)
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            {/* Result */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {isCorrect ? (
                <>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-8xl mb-6"
                  >
                    🎉
                  </motion.div>
                  <h2 className="font-display text-4xl font-bold text-green-400 mb-4">
                    Correct!
                  </h2>
                  <Card className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 mb-6">
                    <p className="text-white/90 text-lg mb-2">
                      The civilian word was: <span className="font-bold">{wordPair?.civilian_word_hindi}</span>
                    </p>
                    <p className="text-white/70">
                      Mr. White has won! Infiltrators Victory!
                    </p>
                  </Card>
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ 
                      scale: [1, 0.9, 1],
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-8xl mb-6"
                  >
                    ❌
                  </motion.div>
                  <h2 className="font-display text-4xl font-bold text-red-400 mb-4">
                    Wrong!
                  </h2>
                  <Card className="bg-gradient-to-r from-red-600/20 to-orange-600/20 mb-6">
                    <p className="text-white/90 text-lg mb-2">
                      Your guess: <span className="font-bold">{guess}</span>
                    </p>
                    <p className="text-white/90 text-lg mb-2">
                      Correct word: <span className="font-bold">{wordPair?.civilian_word_hindi}</span>
                    </p>
                    <p className="text-white/70">
                      Better luck next time!
                    </p>
                  </Card>
                </>
              )}
              <div className="text-white/60 text-sm">
                {isCorrect ? 'Proceeding to victory screen...' : 'Continuing game...'}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}

