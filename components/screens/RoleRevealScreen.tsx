'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';

export default function RoleRevealScreen() {
  const {
    eliminatedPlayer,
    checkVictoryCondition,
    setPhase,
    currentRound,
    players,
    specialRoleConfig,
    pendingEliminations,
    clearPendingEliminations,
    processElimination,
    revengerPending,
  } = useGameStore();

  const [processedEliminations, setProcessedEliminations] = useState<string[]>([]);
  const [showLoversReveal, setShowLoversReveal] = useState(false);
  const [showGhostReveal, setShowGhostReveal] = useState(false);
  const [showFalafelReveal, setShowFalafelReveal] = useState(false);

  // Process pending eliminations
  useEffect(() => {
    if (pendingEliminations.length > 0 && processedEliminations.length < pendingEliminations.length) {
      const nextElimId = pendingEliminations[processedEliminations.length];
      const player = players.find(p => p.id === nextElimId);

      if (player) {
        // Check for special effects
        if (player.specialRoles.includes('lover') && specialRoleConfig.lovers) {
          setShowLoversReveal(true);
        }
        if (player.specialRoles.includes('ghost') && specialRoleConfig.ghost) {
          setShowGhostReveal(true);
        }
        if (player.hasFalafel && !player.hasFalafel.used) {
          setShowFalafelReveal(true);
        }
      }

      setProcessedEliminations(prev => [...prev, nextElimId]);
    }
  }, [pendingEliminations, processedEliminations, players, specialRoleConfig]);

  if (!eliminatedPlayer) return null;

  // Find Lover partner if applicable (was also eliminated)
  const loverPartner = eliminatedPlayer.loverId
    ? players.find(p => p.id === eliminatedPlayer.loverId)
    : null;

  // Check if lover partner was eliminated and is Mr. White (needs guess chance)
  const loverIsMrWhite = loverPartner && !loverPartner.isAlive && loverPartner.role === 'mrwhite';

  // Check if eliminated player became a ghost
  const becameGhost = eliminatedPlayer.specialRoles.includes('ghost') && specialRoleConfig.ghost;

  // Check if lover partner became a ghost
  const loverBecameGhost = loverPartner && !loverPartner.isAlive &&
    loverPartner.specialRoles.includes('ghost') && specialRoleConfig.ghost;

  const handleContinue = () => {
    // Check for revenger (either primary eliminated or their Lover)
    if (revengerPending) {
      setPhase('revenger');
      return;
    }

    // Check if Lover partner is Mr. White and needs a guess
    if (loverIsMrWhite) {
      // Set the lover as the eliminated player for Mr. White guess screen
      useGameStore.setState({ eliminatedPlayer: loverPartner });
      setPhase('mrwhite-guess');
      return;
    }

    // Clear pending eliminations
    clearPendingEliminations();

    // Check if game is over
    checkVictoryCondition();

    const winner = useGameStore.getState().winner;
    if (winner) {
      return;
    }

    // Continue to next round
    const updatedPlayers = players.map(p => ({ ...p, hasGivenClue: false }));
    useGameStore.setState({
      players: updatedPlayers,
      currentRound: currentRound + 1,
      roundPlayerOrder: [],
      currentMrMeme: null,
    });

    // Go to round-start if special roles need announcements
    if (specialRoleConfig.meme || specialRoleConfig.falafelVendor) {
      setPhase('round-start');
    } else {
      setPhase('discussion');
    }
  };

  const getRoleColor = (role: typeof eliminatedPlayer.role) => {
    switch (role) {
      case 'civilian':
        return 'from-civilian to-civilian-dark';
      case 'undercover':
        return 'from-accent to-accent-dark';
      case 'mrwhite':
        return 'from-gold to-gold-dark';
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="max-w-md w-full py-8"
      >
        {/* Eliminated Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-4">☠️</div>
          <h2 className="font-display text-3xl font-bold text-ivory mb-2">
            Player Eliminated
          </h2>
          <p className="text-ivory-dim">Their role has been revealed...</p>
        </motion.div>

        {/* Role Reveal Card */}
        <motion.div
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className={`
            bg-gradient-to-br ${getRoleColor(eliminatedPlayer.role)}
            rounded-3xl p-8 shadow-2xl mb-6 border border-ivory/10
          `}
        >
          <div className="text-center">
            <div className="text-7xl mb-6 grayscale">{eliminatedPlayer.avatar}</div>
            <p className="text-xl font-semibold text-ivory mb-2">{eliminatedPlayer.name}</p>
            <div className="bg-base/40 rounded-xl p-6 mb-4 backdrop-blur-sm">
              <p className="text-sm text-ivory-soft mb-2">Role:</p>
              <p className="text-4xl font-bold text-ivory">{getRoleTitle(eliminatedPlayer.role)}</p>
            </div>

            {/* Special Roles Badges */}
            {eliminatedPlayer.specialRoles.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {eliminatedPlayer.specialRoles.map(sr => (
                  <span key={sr} className="bg-base/30 px-3 py-1 rounded-full text-sm text-ivory-soft">
                    {sr === 'goddess' && '⚖️ Goddess'}
                    {sr === 'lover' && '💖 Lover'}
                    {sr === 'revenger' && '🔥 Revenger'}
                    {sr === 'ghost' && '👻 Ghost'}
                    {sr === 'falafelVendor' && '🧆 Falafel Vendor'}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass rounded-2xl p-6 mb-6 text-center border border-ivory/10"
        >
          <p className="text-ivory-soft">
            {getRoleMessage(eliminatedPlayer.role)}
          </p>
        </motion.div>

        {/* Lovers Chain Elimination */}
        {loverPartner && !loverPartner.isAlive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30">
              <div className="flex items-center gap-4">
                <div className="text-3xl">💔</div>
                <div>
                  <p className="text-ivory font-semibold">Lovers Eliminated!</p>
                  <p className="text-ivory-dim text-sm">
                    {loverPartner.name} was their Lover and is also eliminated!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Ghost Transformation */}
        {becameGhost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <div className="flex items-center gap-4">
                <div className="text-3xl">👻</div>
                <div>
                  <p className="text-ivory font-semibold">Ghost Awakens!</p>
                  <p className="text-ivory-dim text-sm">
                    {eliminatedPlayer.name} becomes a Ghost and can still vote!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleContinue}
          >
            {revengerPending
              ? '🔥 Revenger\'s Turn'
              : 'Continue Game →'
            }
          </Button>
        </motion.div>

        {/* Players Remaining */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-6 text-ivory-faint text-sm"
        >
          <p>{players.filter(p => p.isAlive && !p.isGhost).length} players remaining</p>
          {players.filter(p => p.isGhost).length > 0 && (
            <p className="text-purple-400">{players.filter(p => p.isGhost).length} ghost(s) watching</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
