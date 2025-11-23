'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';
import { shuffleArray } from '@/lib/utils';

export default function VictoryScreen() {
  const { winner, players, wordPair, resetGame } = useGameStore();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);
  const [randomizedPlayers, setRandomizedPlayers] = useState(players);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Randomize player order for display
    setRandomizedPlayers(shuffleArray(players));

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [players]);

  if (!winner) return null;

  const winners = randomizedPlayers.filter(p =>
    winner === 'civilians' ? p.role === 'civilian' : p.role === 'undercover' || p.role === 'mrwhite'
  );

  const losers = randomizedPlayers.filter(p =>
    winner === 'civilians' ? p.role !== 'civilian' : p.role === 'civilian'
  );

  const getVictoryMessage = () => {
    if (winner === 'civilians') {
      return {
        title: 'Civilians Victory! 🎉',
        subtitle: 'The infiltrators have been exposed!',
        icon: '🛡️',
        color: 'from-civilian to-civilian-dark',
      };
    } else {
      return {
        title: 'Infiltrators Victory! 🎭',
        subtitle: 'Deception and cunning prevail!',
        icon: '🎯',
        color: 'from-accent to-accent-dark',
      };
    }
  };

  const victory = getVictoryMessage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 overflow-y-auto bg-base">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#9A1B1B', '#C2A469', '#4A6FA5', '#F5F5F5', '#2B2E32']}
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
          
          <h1 className="font-display text-5xl font-bold mb-3 text-ivory">
            {victory.title}
          </h1>
          <p className="text-xl text-ivory-soft">{victory.subtitle}</p>
        </motion.div>

        {/* Winners Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className={`bg-gradient-to-br ${victory.color} border-none`}>
            <h3 className="font-display text-2xl font-bold text-ivory mb-4 text-center">
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
            <h3 className="font-semibold text-xl text-ivory mb-4 text-center">
              All Players & Roles
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {randomizedPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                >
                  <div className="text-center">
                    <PlayerAvatar player={{ ...player, isAlive: true }} size="md" showRole />
                    {player.word && (
                      <div className="mt-2 text-sm text-ivory-dim break-words">
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
            <Card className="bg-gradient-to-r from-accent/20 to-gold/20 border border-gold/20">
              <h3 className="font-semibold text-xl text-ivory mb-4 text-center">
                📝 The Words
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 text-center border border-civilian/30">
                  <p className="text-sm text-ivory-dim mb-2">Civilian Word</p>
                  <p className="text-2xl font-bold text-civilian">{wordPair.civilian_word}</p>
                </div>
                <div className="glass rounded-xl p-4 text-center border border-accent/30">
                  <p className="text-sm text-ivory-dim mb-2">Undercover Word</p>
                  <p className="text-2xl font-bold text-accent">{wordPair.undercover_word}</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-ivory-dim">Relationship: {wordPair.relationship}</p>
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

