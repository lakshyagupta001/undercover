'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useGameStore } from '@/store/gameStore';

export default function RoleAssignmentScreen() {
  const { players, setPhase, roleRevealStartIndex, specialRoleConfig } = useGameStore();
  const [revealIndex, setRevealIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showWord, setShowWord] = useState(false);

  // Create the role reveal order: starts from roleRevealStartIndex and wraps around
  const roleRevealOrder = useMemo(() => {
    const order: number[] = [];
    for (let i = 0; i < players.length; i++) {
      order.push((roleRevealStartIndex + i) % players.length);
    }
    return order;
  }, [players.length, roleRevealStartIndex]);

  // Current player based on reveal order
  const currentPlayerArrayIndex = roleRevealOrder[revealIndex];
  const currentPlayer = players[currentPlayerArrayIndex];
  const isLastPlayer = revealIndex === players.length - 1;

  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  }, [revealIndex]);

  const handleReveal = () => {
    setIsRevealing(true);
    setShowWord(true);
    // No auto-hide timer - player must manually tap to continue
  };

  const handleNext = () => {
    setIsRevealing(false);
    setShowWord(false);

    if (isLastPlayer) {
      // All players have seen their roles
      // Go to round-start if special roles need announcements, else discussion
      if (specialRoleConfig.meme || specialRoleConfig.falafelVendor) {
        setPhase('round-start');
      } else {
        setPhase('discussion');
      }
    } else {
      setRevealIndex(revealIndex + 1);
    }
  };

  if (!currentPlayer) return null;

  // Get special role display for current player
  const getSpecialRoleHint = () => {
    const roles = currentPlayer.specialRoles;
    if (roles.length === 0) return null;

    const hints: string[] = [];
    if (roles.includes('goddess')) hints.push('⚖️ Goddess of Justice - You break vote ties!');
    if (roles.includes('lover')) {
      const lover = players.find(p => p.id === currentPlayer.loverId);
      if (lover) hints.push(`💖 Lover - You share fate with ${lover.name}!`);
    }
    if (roles.includes('revenger')) hints.push('🔥 Revenger - Choose another to eliminate when you die!');
    if (roles.includes('ghost')) hints.push('👻 Ghost - You can vote even after elimination!');
    if (roles.includes('falafelVendor')) hints.push('🧆 Falafel Vendor - You give random effects!');

    return hints;
  };

  const specialHints = getSpecialRoleHint();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 no-select bg-base">
      <AnimatePresence mode="wait">
        {!isRevealing ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center max-w-md"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              {currentPlayer.avatar}
            </motion.div>

            <h2 className="font-display text-3xl font-bold mb-4 text-ivory">
              {currentPlayer.name}
            </h2>

            <div className="glass rounded-2xl p-6 mb-6 border border-ivory/10">
              <p className="text-ivory-soft mb-4">
                Tap below to view your role privately
              </p>
              <p className="text-sm text-ivory-dim">
                Make sure no one else is looking!
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleReveal}
            >
              👀 View My Role
            </Button>

            <div className="mt-6 text-ivory-faint text-sm">
              Player {revealIndex + 1} of {players.length}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="revealing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center max-w-md w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className={`
                bg-gradient-to-br from-surface-light to-surface-dark
                rounded-3xl p-8 mb-6 shadow-2xl border border-ivory/10
              `}
            >
              <div className="text-6xl mb-4">{currentPlayer.avatar}</div>

              <AnimatePresence>
                {showWord && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-base/50 rounded-xl p-6 backdrop-blur-sm border border-ivory/10">
                      <p className="text-ivory-soft text-sm mb-2">Your Word:</p>
                      {currentPlayer.word ? (
                        <p className="text-4xl font-bold text-gold break-words">
                          {currentPlayer.word}
                        </p>
                      ) : (
                        <div>
                          <p className="text-3xl font-bold text-gold mb-2">❓</p>
                          <p className="text-ivory-soft text-2xl">
                            You have no word!  😏 <br /> 🐻‍❄️ MR. WHITE 🐻‍❄️
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Special Role Hints */}
                    {specialHints && specialHints.length > 0 && (
                      <div className="bg-accent/20 rounded-xl p-4 border border-accent/30">
                        <p className="text-ivory-soft text-sm mb-2">✨ Special Role:</p>
                        {specialHints.map((hint, i) => (
                          <p key={i} className="text-ivory text-sm">
                            {hint}
                          </p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="glass rounded-xl p-4 mb-6 border border-ivory/10">
              <p className="text-ivory-soft text-sm">
                {showWord ? 'Memorize your word, then pass the device' : 'Tap to hide and continue'}
              </p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleNext}
            >
              {showWord ? '🔒 Hide & Pass Device' : `➡️ ${isLastPlayer ? 'Start Game' : 'Next Player'}`}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-6 right-6">
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((revealIndex + 1) / players.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
