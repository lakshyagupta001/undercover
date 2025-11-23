'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PlayerAvatar from '@/components/ui/PlayerAvatar';
import { useGameStore } from '@/store/gameStore';
import { shuffleArray } from '@/lib/utils';

export default function VotingScreen() {
  const { players, eliminatePlayer, setPhase } = useGameStore();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [randomizedPlayers, setRandomizedPlayers] = useState<typeof players>([]);

  // Randomize player order for voting
  useEffect(() => {
    const alive = players.filter(p => p.isAlive);
    const shuffled = shuffleArray(alive);
    setRandomizedPlayers(shuffled);
  }, [players.filter(p => p.isAlive).length]); // Re-randomize when players change

  const alivePlayers = randomizedPlayers.length > 0 ? randomizedPlayers : players.filter(p => p.isAlive);

  const handleSelectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };

  const handleConfirmElimination = () => {
    if (selectedPlayerId) {
      const playerToEliminate = players.find(p => p.id === selectedPlayerId);
      eliminatePlayer(selectedPlayerId);
      
      // If Mr. White is eliminated, give him a chance to guess
      if (playerToEliminate?.role === 'mrwhite') {
        setPhase('mrwhite-guess');
      } else {
        setPhase('role-reveal');
      }
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

  return (
    <div className="min-h-screen p-6 bg-base">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="font-display text-3xl font-bold mb-2 text-ivory">
          Select Player to Eliminate
        </h1>
        <p className="text-ivory-dim">
          Discuss and agree, then select who to eliminate
        </p>
      </motion.div>

      {/* Players Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
        {alivePlayers.map((player, index) => {
          const isSelected = selectedPlayerId === player.id;
          
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
                  cursor-pointer transition-all duration-300
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
              <p className="text-ivory-soft mb-2">Selected for elimination:</p>
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
      </div>
      </div>
    </div>
  );
}

