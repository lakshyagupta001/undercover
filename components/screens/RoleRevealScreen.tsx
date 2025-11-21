'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

export default function RoleRevealScreen() {
  const { eliminatedPlayer, checkVictoryCondition, setPhase, currentRound, players } = useGameStore();

  if (!eliminatedPlayer) return null;

  const handleContinue = () => {
    // Check if game is over
    checkVictoryCondition();
    
    const winner = useGameStore.getState().winner;
    if (winner) {
      // Game over, victory screen will show
      return;
    }

    // Continue to next round
    const updatedPlayers = players.map(p => ({ ...p, hasGivenClue: false }));
    useGameStore.setState({ 
      players: updatedPlayers,
      currentRound: currentRound + 1 
    });
    setPhase('description-round');
  };

  const getRoleColor = (role: typeof eliminatedPlayer.role) => {
    switch (role) {
      case 'civilian':
        return 'from-blue-500 to-blue-700';
      case 'undercover':
        return 'from-red-500 to-red-700';
      case 'mrwhite':
        return 'from-gray-400 to-gray-600';
    }
  };

  const getRoleTitle = (role: typeof eliminatedPlayer.role) => {
    switch (role) {
      case 'civilian':
        return 'Civilian';
      case 'undercover':
        return 'Undercover Agent';
      case 'mrwhite':
        return 'Mr. White';
    }
  };

  const getRoleMessage = (role: typeof eliminatedPlayer.role) => {
    switch (role) {
      case 'civilian':
        return 'An innocent civilian was eliminated!';
      case 'undercover':
        return 'The Undercover Agent has been exposed!';
      case 'mrwhite':
        return 'Mr. White has been discovered!';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Eliminated Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-4">☠️</div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">
            Player Eliminated
          </h2>
          <p className="text-white/60">Their role has been revealed...</p>
        </motion.div>

        {/* Role Reveal Card */}
        <motion.div
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className={`
            bg-gradient-to-br ${getRoleColor(eliminatedPlayer.role)}
            rounded-3xl p-8 shadow-2xl mb-6
          `}
        >
          <div className="text-center">
            <div className="text-7xl mb-6 grayscale">{eliminatedPlayer.avatar}</div>
            <div className="bg-black/30 rounded-xl p-6 mb-4">
              <p className="text-sm text-white/70 mb-2">Role:</p>
              <p className="text-4xl font-bold text-white">{getRoleTitle(eliminatedPlayer.role)}</p>
            </div>
            {eliminatedPlayer.word && (
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-sm text-white/70 mb-1">Their Word:</p>
                <p className="text-2xl font-bold text-white">{eliminatedPlayer.word}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass rounded-2xl p-6 mb-6 text-center"
        >
          <p className="text-white/80">
            {getRoleMessage(eliminatedPlayer.role)}
          </p>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleContinue}
          >
            Continue Game →
          </Button>
        </motion.div>

        {/* Players Remaining */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-6 text-white/40 text-sm"
        >
          <p>{players.filter(p => p.isAlive).length} players remaining</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

