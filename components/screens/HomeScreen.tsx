'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

interface HomeScreenProps {
  onShowRules: () => void;
}

export default function HomeScreen({ onShowRules }: HomeScreenProps) {
  const setPhase = useGameStore((state) => state.setPhase);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-8xl mb-6"
        >
          🎭
        </motion.div>
        
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          The Infiltrators
        </h1>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-white/80">
          & The Ghost
        </h2>
        
        <p className="text-xl text-white/70 max-w-md mx-auto">
          A game of deception, wordplay, and trust
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setPhase('setup')}
        >
          🎮 New Game
        </Button>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={onShowRules}
        >
          📖 How to Play
        </Button>

        <motion.div
          className="glass rounded-xl p-4 mt-4"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-center text-sm text-white/60 mb-2">Players Required</p>
          <p className="text-center text-2xl font-bold text-white">3 - 10</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-center text-white/40 text-sm"
      >
        <p>Pass a single device around</p>
        <p className="mt-1">Works fully offline</p>
      </motion.div>
    </div>
  );
}

