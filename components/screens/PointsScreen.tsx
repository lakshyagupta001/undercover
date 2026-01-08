'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PointsDisplay from '@/components/ui/PointsDisplay';
import { useGameStore } from '@/store/gameStore';
import { generateWordPair } from '@/lib/wordGenerator';

export default function PointsScreen() {
  const { winner, players, resetGame, startNextGame, settings, gameNumber, calculateAndAwardPoints } = useGameStore();
  const [isLoading, setIsLoading] = useState(false);
  const [previousPoints, setPreviousPoints] = useState<Record<string, number>>({});
  const pointsCalculated = useRef(false);

  // Count current role distribution for next game
  const undercoverCount = players.filter(p => p.role === 'undercover').length;
  const mrWhiteCount = players.filter(p => p.role === 'mrwhite').length;

  const handlePlayAgain = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const newWordPair = await generateWordPair(settings.difficulty);
      startNextGame(newWordPair, undercoverCount, mrWhiteCount);
    } catch (error) {
      console.error('Error starting next game:', error);
      alert('Failed to start next game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate and award points when screen loads (only once)
  useEffect(() => {
    if (winner && !pointsCalculated.current) {
      const prevPoints: Record<string, number> = {};
      players.forEach(p => {
        prevPoints[p.id] = p.points;
      });
      setPreviousPoints(prevPoints);
      calculateAndAwardPoints();
      pointsCalculated.current = true;
    }
  }, [winner, calculateAndAwardPoints, players]);

  if (!winner) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 overflow-y-auto bg-base">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl mb-4"
          >
            ⭐
          </motion.div>
          <h1 className="font-display text-4xl font-bold mb-2 text-ivory">
            Points Leaderboard
          </h1>
          <p className="text-ivory-soft">Game {gameNumber} Results</p>
        </motion.div>

        {/* Points Earned This Game */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-gold/20 to-accent/20 border border-gold/30">
            <h3 className="font-semibold text-lg text-ivory mb-3 text-center">
              Points Earned This Game
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="glass rounded-lg p-3 border border-civilian/30">
                <p className="text-2xl font-bold text-civilian">
                  {winner === 'civilians' ? '+1' : '0'}
                </p>
                <p className="text-xs text-ivory-dim">Civilians</p>
              </div>
              <div className="glass rounded-lg p-3 border border-accent/30">
                <p className="text-2xl font-bold text-accent">
                  {winner === 'infiltrators' ? '+2' : '0'}
                </p>
                <p className="text-xs text-ivory-dim">Undercover</p>
              </div>
              <div className="glass rounded-lg p-3 border border-gold/30">
                <p className="text-2xl font-bold text-gold">
                  {winner === 'infiltrators' ? '+3' : '0'}
                </p>
                <p className="text-xs text-ivory-dim">Mr. White</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card>
            <PointsDisplay 
              players={players} 
              showRolePoints={true}
              previousPoints={previousPoints}
            />
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth 
            onClick={handlePlayAgain}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Starting...' : `🎮 Play Again (Game ${gameNumber + 1})`}
          </Button>
          <Button variant="secondary" size="lg" fullWidth onClick={resetGame}>
            🏠 Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
