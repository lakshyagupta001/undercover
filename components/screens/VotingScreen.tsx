'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';

export default function VotingScreen() {
  const { players, eliminatePlayer, setPhase } = useGameStore();
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);

  const alivePlayers = players.filter(p => p.isAlive);

  const handleVote = (playerId: string) => {
    if (hasVoted) return;
    
    setVotes(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));
  };

  const handleConfirmVote = () => {
    // Find player with most votes
    let maxVotes = 0;
    let eliminatedPlayerId = '';

    Object.entries(votes).forEach(([playerId, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        eliminatedPlayerId = playerId;
      }
    });

    if (eliminatedPlayerId) {
      eliminatePlayer(eliminatedPlayerId);
      setPhase('role-reveal');
    }
  };

  const handleSkipVote = () => {
    // Skip voting this round, go back to description
    const updatedPlayers = players.map(p => ({ ...p, hasGivenClue: false }));
    useGameStore.setState({ 
      players: updatedPlayers,
      currentRound: useGameStore.getState().currentRound + 1 
    });
    setPhase('description-round');
  };

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">🗳️</div>
          <h1 className="font-display text-3xl font-bold mb-2 text-white">
            Voting Time
          </h1>
          <p className="text-white/60">
            Tap on a player to vote them out
          </p>
        </motion.div>

        {/* Vote Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">{totalVotes}</p>
              <p className="text-white/60">Total Votes Cast</p>
            </div>
          </Card>
        </motion.div>

        {/* Players Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
          {alivePlayers.map((player, index) => {
            const playerVotes = votes[player.id] || 0;
            
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
                  onClick={() => handleVote(player.id)}
                  className={`
                    cursor-pointer transition-all duration-300
                    ${playerVotes > 0 ? 'ring-4 ring-red-500 bg-red-500/20' : 'hover:bg-white/10'}
                  `}
                >
                  <div className="text-center relative">
                    <PlayerAvatar player={player} size="md" />
                    
                    {playerVotes > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm"
                      >
                        {playerVotes}
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Vote Summary */}
        {totalVotes > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-red-600/20 to-orange-600/20">
              <h3 className="font-semibold text-lg mb-3 text-white">Vote Summary</h3>
              <div className="space-y-2">
                {Object.entries(votes)
                  .sort(([, a], [, b]) => b - a)
                  .map(([playerId, voteCount]) => {
                    const player = players.find(p => p.id === playerId);
                    if (!player) return null;
                    
                    return (
                      <div
                        key={playerId}
                        className="flex items-center justify-between text-white/80"
                      >
                        <span className="flex items-center gap-2">
                          <span>{player.avatar}</span>
                          <span>{player.name}</span>
                        </span>
                        <span className="font-bold">{voteCount} vote{voteCount !== 1 ? 's' : ''}</span>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          {totalVotes > 0 ? (
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={handleConfirmVote}
            >
              ⚡ Eliminate Player
            </Button>
          ) : (
            <Card>
              <p className="text-center text-white/70 text-sm">
                Tap on a player above to cast your vote
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
              onClick={() => setVotes({})}
              disabled={totalVotes === 0}
            >
              Clear Votes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

