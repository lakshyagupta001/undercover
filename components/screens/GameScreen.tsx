'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export default function GameScreen() {
  const {
    players,
    currentRound,
    setPhase,
    roundPlayerOrder,
    setRoundPlayerOrder,
    currentMrMeme,
    specialRoleConfig,
  } = useGameStore();

  // Set player order once when entering discussion
  useEffect(() => {
    if (roundPlayerOrder.length === 0) {
      setRoundPlayerOrder();
    }
  }, [roundPlayerOrder.length, setRoundPlayerOrder]);

  // Get players in the stored order (excluding ghosts)
  const alivePlayers = roundPlayerOrder.length > 0
    ? roundPlayerOrder
      .map(id => players.find(p => p.id === id))
      .filter((p): p is typeof players[0] => p !== undefined && p.isAlive && !p.isGhost)
    : players.filter(p => p.isAlive && !p.isGhost);

  const mrMemePlayer = currentMrMeme ? players.find(p => p.id === currentMrMeme) : null;

  // Goddess of Justice logic
  const goddess = specialRoleConfig.goddess
    ? players.find(p => p.specialRoles.includes('goddess'))
    : null;
  const goddessIsAlive = goddess && goddess.isAlive && !goddess.isGhost;

  const handleStartVoting = () => {
    setPhase('voting');
  };

  return (
    <div className="min-h-screen p-6 bg-base overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2 text-ivory">
            Round {currentRound}
          </h1>
          <p className="text-ivory-dim">Discussion Phase</p>
        </motion.div>

        {/* Mr. Meme Alert */}
        {specialRoleConfig.meme && mrMemePlayer && mrMemePlayer.isAlive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
              <div className="flex items-center gap-4">
                <div className="text-3xl">😂</div>
                <div className="flex-1">
                  <p className="text-ivory font-semibold">
                    {mrMemePlayer.name} is Mr. Meme!
                  </p>
                  <p className="text-ivory-dim text-sm">
                    Must use gestures only - no speaking!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Goddess of Justice Alert (when ALIVE) */}
        {specialRoleConfig.goddess && goddessIsAlive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <div className="flex items-center gap-4">
                <div className="text-3xl">⚖️</div>
                <div className="flex-1">
                  <p className="text-ivory font-semibold">
                    Goddess of Justice is Active
                  </p>
                  <p className="text-purple-300 text-sm">
                    If a tie occurs, Goddess vote counts as 2
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Game Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-ivory">{alivePlayers.length}</p>
                <p className="text-sm text-ivory-dim">Players Alive</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gold">{currentRound}</p>
                <p className="text-sm text-ivory-dim">Current Round</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-accent/20 to-gold/10 border border-accent/20">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🗣️</div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-ivory">
                  Discussion Round
                </h3>
                <p className="text-ivory-soft text-sm mb-2">
                  Each player says <strong>ONE word</strong> related to their secret word, then discuss who seems suspicious.
                </p>
                <p className="text-ivory-dim text-xs">
                  • Civilians: Be specific but not obvious<br />
                  • Undercover: Your word is related but different<br />
                  • Mr. White: Listen carefully and blend in!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Players Grid - NO checkmark, purely informational */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
          {alivePlayers.map((player, index) => {
            const isMrMeme = currentMrMeme === player.id;

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`
                    ${isMrMeme ? 'ring-2 ring-yellow-500/50' : ''}
                  `}
                >
                  <div className="text-center relative">
                    <PlayerAvatar player={player} size="md" />
                    {isMrMeme && (
                      <div className="absolute -top-1 -left-1 text-lg">😂</div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-3">💭</div>
              <h3 className="font-semibold text-lg mb-2 text-ivory">
                Ready to Vote?
              </h3>
              <p className="text-ivory-soft text-sm">
                Discuss who seems suspicious, then proceed to voting.
              </p>
            </div>
          </Card>

          <Button
            variant="danger"
            size="lg"
            fullWidth
            onClick={handleStartVoting}
          >
            🗳️ Start Voting
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button
            variant="secondary"
            onClick={() => {
              if (confirm('Are you sure you want to quit?')) {
                useGameStore.getState().resetGame();
              }
            }}
          >
            Quit Game
          </Button>
          <Button
            variant="secondary"
            onClick={handleStartVoting}
          >
            Skip to Voting
          </Button>
        </div>
      </div>
    </div>
  );
}
