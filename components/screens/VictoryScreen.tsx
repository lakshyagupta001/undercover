'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';

export default function VictoryScreen() {
  const { winner, players, wordPair, resetGame } = useGameStore();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!winner) return null;

  const winners = players.filter(p =>
    winner === 'civilians' ? p.role === 'civilian' : p.role === 'undercover' || p.role === 'mrwhite'
  );

  const losers = players.filter(p =>
    winner === 'civilians' ? p.role !== 'civilian' : p.role === 'civilian'
  );

  const getVictoryMessage = () => {
    if (winner === 'civilians') {
      return {
        title: 'Civilians Victory! 🎉',
        subtitle: 'The infiltrators have been exposed!',
        icon: '🛡️',
        color: 'from-blue-500 to-blue-700',
      };
    } else {
      return {
        title: 'Infiltrators Victory! 🎭',
        subtitle: 'Deception and cunning prevail!',
        icon: '🎯',
        color: 'from-red-500 to-red-700',
      };
    }
  };

  const victory = getVictoryMessage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 overflow-y-auto">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Victory Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-8xl mb-4"
          >
            {victory.icon}
          </motion.div>
          
          <h1 className="font-display text-5xl font-bold mb-3 text-white">
            {victory.title}
          </h1>
          <p className="text-xl text-white/70">{victory.subtitle}</p>
        </motion.div>

        {/* Winners Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className={`bg-gradient-to-br ${victory.color}`}>
            <h3 className="font-display text-2xl font-bold text-white mb-4 text-center">
              🏆 Winners
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {winners.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <PlayerAvatar player={player} size="md" showRole />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* All Players Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <Card>
            <h3 className="font-semibold text-xl text-white mb-4 text-center">
              All Players & Roles
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  <div className="text-center">
                    <PlayerAvatar player={{ ...player, isAlive: true }} size="md" showRole />
                    {player.word && (
                      <div className="mt-2 text-sm text-white/60 break-words">
                        &quot;{player.word}&quot;
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Word Reveal */}
        {wordPair && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20">
              <h3 className="font-semibold text-xl text-white mb-4 text-center">
                📝 The Words
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-sm text-white/60 mb-2">Civilian Word (Hindi)</p>
                  <p className="text-2xl font-bold text-blue-400">{wordPair.civilian_word_hindi}</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-sm text-white/60 mb-2">Undercover Word (English)</p>
                  <p className="text-2xl font-bold text-red-400">{wordPair.undercover_word_english}</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-white/60">Relationship: {wordPair.relationship}</p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <Button variant="primary" size="lg" fullWidth onClick={resetGame}>
            🎮 Play Again
          </Button>
          <Button variant="secondary" size="lg" fullWidth onClick={resetGame}>
            🏠 Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

