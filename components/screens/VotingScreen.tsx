'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';

export default function VotingScreen() {
  const {
    players,
    setPhase,
    roundPlayerOrder,
    specialRoleConfig,
    processElimination,
  } = useGameStore();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showRedirectSelection, setShowRedirectSelection] = useState(false);
  const [protectedPlayerId, setProtectedPlayerId] = useState<string | null>(null);

  // Use the same order as discussion phase
  const alivePlayers = roundPlayerOrder.length > 0
    ? roundPlayerOrder
      .map(id => players.find(p => p.id === id))
      .filter((p): p is typeof players[0] => p !== undefined && p.isAlive && !p.isGhost)
    : players.filter(p => p.isAlive && !p.isGhost);

  // Ghost players for display
  const ghostVoters = players.filter(p => p.isGhost && specialRoleConfig.ghost);

  // Goddess of Justice for tie-breaking reminder
  const goddess = specialRoleConfig.goddess
    ? players.find(p => p.specialRoles.includes('goddess'))
    : null;
  const goddessIsAlive = goddess && goddess.isAlive && !goddess.isGhost;
  const goddessIsEliminated = goddess && (!goddess.isAlive || goddess.isGhost);

  const handleSelectPlayer = (playerId: string) => {
    if (showRedirectSelection) {
      // Don't allow selecting the protected player as redirect target
      if (playerId === protectedPlayerId) return;
      setSelectedPlayerId(playerId);
    } else {
      setSelectedPlayerId(playerId);
    }
  };

  const handleConfirmElimination = () => {
    if (!selectedPlayerId) return;

    const playerToEliminate = players.find(p => p.id === selectedPlayerId);
    const hasFalafel = playerToEliminate?.hasFalafel && !playerToEliminate.hasFalafel.used;
    const falafelType = playerToEliminate?.hasFalafel?.type;

    if (hasFalafel && falafelType === 'protect') {
      // Player is protected! Show redirect selection
      alert('🛡️ Falafel Protection! This player is saved!\n\nNow select the player with the second-highest votes.');
      setProtectedPlayerId(selectedPlayerId);
      setSelectedPlayerId(null);
      setShowRedirectSelection(true);

      // Mark falafel as used
      const updatedPlayers = players.map(p =>
        p.id === playerToEliminate.id && p.hasFalafel
          ? { ...p, hasFalafel: { ...p.hasFalafel, used: true } }
          : p
      );
      useGameStore.setState({ players: updatedPlayers });
      return;
    }

    if (hasFalafel && falafelType === 'sabotage') {
      // Sabotage - player is eliminated with extra message
      alert('💥 Falafel Sabotage! The falafel was poisoned!');

      // Mark falafel as used
      const updatedPlayers = players.map(p =>
        p.id === playerToEliminate.id && p.hasFalafel
          ? { ...p, hasFalafel: { ...p.hasFalafel, used: true } }
          : p
      );
      useGameStore.setState({ players: updatedPlayers });
    }

    // Normal elimination (or sabotage elimination)
    processElimination(selectedPlayerId);

    // Check for Revenger or Mr. White
    const { revengerPending } = useGameStore.getState();
    if (revengerPending) {
      setPhase('revenger');
    } else if (playerToEliminate?.role === 'mrwhite') {
      setPhase('mrwhite-guess');
    } else {
      setPhase('role-reveal');
    }
  };

  const handleConfirmRedirect = () => {
    if (!selectedPlayerId) return;

    const playerToEliminate = players.find(p => p.id === selectedPlayerId);
    processElimination(selectedPlayerId);

    // Check for Revenger or Mr. White
    const { revengerPending } = useGameStore.getState();
    if (revengerPending) {
      setPhase('revenger');
    } else if (playerToEliminate?.role === 'mrwhite') {
      setPhase('mrwhite-guess');
    } else {
      setPhase('role-reveal');
    }
  };

  const handleNoSecondHighest = () => {
    // No one is eliminated this round
    alert('No second-highest voted player. No one is eliminated this round!');
    handleSkipVote();
  };

  const handleSkipVote = () => {
    const updatedPlayers = players.map(p => ({ ...p, hasGivenClue: false }));
    useGameStore.setState({
      players: updatedPlayers,
      currentRound: useGameStore.getState().currentRound + 1,
      roundPlayerOrder: [],
      currentMrMeme: null,
    });

    if (specialRoleConfig.meme || specialRoleConfig.falafelVendor) {
      setPhase('round-start');
    } else {
      setPhase('discussion');
    }
  };

  // Get players eligible for redirect (everyone except the protected player)
  const redirectTargets = alivePlayers.filter(p => p.id !== protectedPlayerId);

  return (
    <div className="min-h-screen p-6 bg-base">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">{showRedirectSelection ? '🔄' : '🗳️'}</div>
          <h1 className="font-display text-3xl font-bold mb-2 text-ivory">
            {showRedirectSelection ? 'Select Second-Highest Votes' : 'Select Player to Eliminate'}
          </h1>
          <p className="text-ivory-dim">
            {showRedirectSelection
              ? 'The protected player is saved. Choose who had second-highest votes.'
              : 'Discuss and decide who to eliminate'}
          </p>
        </motion.div>

        {/* Protected Player Banner */}
        {showRedirectSelection && protectedPlayerId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-green-500/30 to-teal-500/30 border border-green-500/40">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🛡️</div>
                <div className="flex-1">
                  <p className="text-green-400 font-semibold mb-1">Falafel Protection Activated!</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{players.find(p => p.id === protectedPlayerId)?.avatar}</span>
                    <span className="text-ivory">{players.find(p => p.id === protectedPlayerId)?.name}</span>
                    <span className="text-green-400 text-sm">is safe</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Goddess Reminder */}
        {goddess && showRedirectSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <p className="text-ivory text-sm">
                    <strong>{goddess.name}</strong> breaks ties for second-highest votes
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Ghost Voters */}
        {ghostVoters.length > 0 && !showRedirectSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span>👻</span>
                <span className="text-ivory text-sm font-semibold">Ghost Voters</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ghostVoters.map(ghost => (
                  <div key={ghost.id} className="flex items-center gap-1 opacity-70">
                    <span className="text-lg">{ghost.avatar}</span>
                    <span className="text-ivory-dim text-xs">{ghost.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Goddess Eliminated Indicator (Separate Card) */}
        {goddessIsEliminated && !showRedirectSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3">
                <span className="text-xl">⚖️</span>
                <p className="text-purple-300 text-sm">
                  If a tie occurs, Goddess vote counts as 1
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Players Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
          {(showRedirectSelection ? redirectTargets : alivePlayers).map((player, index) => {
            const isSelected = selectedPlayerId === player.id;
            const hasFalafel = player.hasFalafel && !player.hasFalafel.used;

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  onClick={() => handleSelectPlayer(player.id)}
                  className={`
                    cursor-pointer transition-all duration-300 relative
                    ${isSelected ? 'ring-4 ring-accent bg-accent/20 border-accent/40' : 'hover:bg-surface-light/50'}
                  `}
                >
                  <div className="text-center relative">
                    <PlayerAvatar player={player} size="md" />

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-accent text-ivory rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg"
                      >
                        ✓
                      </motion.div>
                    )}

                    {hasFalafel && !showRedirectSelection && (
                      <div className="absolute -top-1 -left-1 text-xl" title="Has Falafel">
                        🧆
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Player Info */}
        {selectedPlayerId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-accent/20 to-accent-dark/20 border border-accent/30">
              <div className="text-center">
                <p className="text-ivory-soft mb-2">
                  {showRedirectSelection ? 'Redirect elimination to:' : 'Selected for elimination:'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl">
                    {players.find(p => p.id === selectedPlayerId)?.avatar}
                  </span>
                  <span className="text-2xl font-bold text-ivory">
                    {players.find(p => p.id === selectedPlayerId)?.name}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {showRedirectSelection ? (
            <>
              {selectedPlayerId ? (
                <Button
                  variant="danger"
                  size="lg"
                  fullWidth
                  onClick={handleConfirmRedirect}
                >
                  ⚡ Eliminate {players.find(p => p.id === selectedPlayerId)?.name}
                </Button>
              ) : (
                <Card>
                  <p className="text-center text-ivory-soft text-sm">
                    Select the player with second-highest votes
                  </p>
                </Card>
              )}
              <Button
                variant="secondary"
                fullWidth
                onClick={handleNoSecondHighest}
              >
                No Second-Highest (Skip Elimination)
              </Button>
            </>
          ) : (
            <>
              {selectedPlayerId ? (
                <Button
                  variant="danger"
                  size="lg"
                  fullWidth
                  onClick={handleConfirmElimination}
                >
                  ⚡ Eliminate {players.find(p => p.id === selectedPlayerId)?.name}
                </Button>
              ) : (
                <Card>
                  <p className="text-center text-ivory-soft text-sm">
                    Select a player above to eliminate them
                  </p>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="secondary"
                  onClick={handleSkipVote}
                >
                  Skip Vote
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedPlayerId(null)}
                  disabled={!selectedPlayerId}
                >
                  Clear Selection
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
