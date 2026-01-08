'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';

export default function GameScreen() {
  const { players, currentRound, setPhase, roundPlayerOrder, setRoundPlayerOrder } = useGameStore();
  
  // Set player order once when entering discussion (start of a new round)
  // The order persists through discussion and voting phases
  useEffect(() => {
    if (roundPlayerOrder.length === 0) {
      setRoundPlayerOrder();
    }
  }, [roundPlayerOrder.length, setRoundPlayerOrder]);
  
  // Get players in the stored order, ensuring Mr. White is never first
  const alivePlayers = roundPlayerOrder.length > 0
    ? roundPlayerOrder
        .map(id => players.find(p => p.id === id))
        .filter((p): p is typeof players[0] => p !== undefined && p.isAlive)
    : players.filter(p => p.isAlive);
  
  const allPlayersGaveClues = alivePlayers.every(p => p.hasGivenClue);

  const handleStartVoting = () => {
    setPhase('voting');
  };

  return (
    <div className="min-h-screen p-6 bg-base">
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

        {/* Game Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-ivory">{alivePlayers.length}</p>
                <p className="text-sm text-ivory-dim">Players Alive</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gold">{currentRound}</p>
                <p className="text-sm text-ivory-dim">Current Round</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-ivory">
                  {alivePlayers.filter(p => p.hasGivenClue).length}/{alivePlayers.length}
                </p>
                <p className="text-sm text-ivory-dim">Words Given</p>
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

        {/* Players Grid - Consistent Order Throughout Round */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
          {alivePlayers.map((player, index) => {
            const handleToggleClue = () => {
              if (!player.isAlive) return;
              const updatedPlayers = players.map(p =>
                p.id === player.id ? { ...p, hasGivenClue: !p.hasGivenClue } : p
              );
              useGameStore.setState({ players: updatedPlayers });
            };

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`
                    ${player.hasGivenClue ? 'bg-success/10 border-success/30' : ''}
                    ${player.isAlive ? 'cursor-pointer hover:bg-surface-light/50' : 'opacity-50'}
                  `}
                  onClick={handleToggleClue}
                >
                  <div className="text-center">
                    <PlayerAvatar player={player} size="md" />
                    {player.isAlive && player.hasGivenClue && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2 text-success-light text-2xl"
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {!allPlayersGaveClues && (
            <Card>
              <p className="text-center text-ivory-soft text-sm">
                Players give their one-word clues verbally. Tap each player to mark them as done.
              </p>
            </Card>
          )}
          
          {allPlayersGaveClues && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card>
                <div className="text-center">
                  <div className="text-4xl mb-3">💭</div>
                  <h3 className="font-semibold text-lg mb-2 text-ivory">
                    All Clues Given!
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
            </motion.div>
          )}
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
