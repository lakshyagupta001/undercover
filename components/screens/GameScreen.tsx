'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';

export default function GameScreen() {
  const { players, currentRound, phase, setPhase } = useGameStore();
  
  const alivePlayers = players.filter(p => p.isAlive);
  const allPlayersGaveClues = alivePlayers.every(p => p.hasGivenClue);

  const handleStartVoting = () => {
    setPhase('voting');
  };

  const handleNextRound = () => {
    // Reset clue status for next round
    const updatedPlayers = players.map(p => ({ ...p, hasGivenClue: false }));
    useGameStore.setState({ players: updatedPlayers, currentRound: currentRound + 1 });
    setPhase('description-round');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2 text-white">
            Round {currentRound}
          </h1>
          <p className="text-white/60">
            {phase === 'description-round' ? 'Description Phase' : 'Discussion Phase'}
          </p>
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
                <p className="text-2xl font-bold text-white">{alivePlayers.length}</p>
                <p className="text-sm text-white/60">Players Alive</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{currentRound}</p>
                <p className="text-sm text-white/60">Current Round</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {alivePlayers.filter(p => p.hasGivenClue).length}/{alivePlayers.length}
                </p>
                <p className="text-sm text-white/60">Clues Given</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Instructions */}
        {phase === 'description-round' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💬</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">
                    Description Round
                  </h3>
                  <p className="text-white/70 text-sm mb-2">
                    Each player must give ONE clue about their word verbally, in turn.
                  </p>
                  <p className="text-white/60 text-xs">
                    • Civilians: Be specific but not obvious<br />
                    • Undercover: Your word is related but different<br />
                    • Mr. White: Listen and blend in!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Players Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
          {players.map((player, index) => {
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
                    ${player.hasGivenClue ? 'bg-green-500/10 border-green-500/30' : ''}
                    ${player.isAlive ? 'cursor-pointer hover:bg-white/10' : 'opacity-50'}
                  `}
                  onClick={handleToggleClue}
                >
                  <div className="text-center">
                    <PlayerAvatar player={player} size="md" />
                    {player.isAlive && player.hasGivenClue && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2 text-green-400 text-2xl"
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
          {phase === 'description-round' && (
            <>
              {!allPlayersGaveClues && (
                <Card>
                  <p className="text-center text-white/70 text-sm">
                    Players give their clues verbally. Check them off as they speak.
                  </p>
                </Card>
              )}
              
              {allPlayersGaveClues && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setPhase('discussion')}
                  >
                    💭 Start Discussion
                  </Button>
                </motion.div>
              )}
            </>
          )}

          {phase === 'discussion' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card>
                <div className="text-center">
                  <div className="text-4xl mb-3">🗣️</div>
                  <h3 className="font-semibold text-lg mb-2 text-white">
                    Discussion Time
                  </h3>
                  <p className="text-white/70 text-sm">
                    Debate who seems suspicious. When ready, proceed to voting.
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
            onClick={() => setPhase(phase === 'description-round' ? 'discussion' : 'description-round')}
          >
            {phase === 'description-round' ? 'Skip to Discussion' : 'Back to Descriptions'}
          </Button>
        </div>
      </div>
    </div>
  );
}

