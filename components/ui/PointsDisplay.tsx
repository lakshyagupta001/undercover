'use client';

import { motion } from 'framer-motion';
import { Player } from '@/types/game';

interface PointsDisplayProps {
  players: Player[];
  showRolePoints?: boolean; // Show points earned this game
  previousPoints?: Record<string, number>; // Points before this game (to calculate difference)
}

export default function PointsDisplay({ players, showRolePoints = false, previousPoints }: PointsDisplayProps) {
  // Sort players by points (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-2">
      {sortedPlayers.map((player, index) => {
        const pointsEarned = previousPoints 
          ? player.points - (previousPoints[player.id] || 0)
          : 0;
        
        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-surface-light/30 border border-ivory/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gold w-6">
                {index + 1}.
              </span>
              <span className="text-2xl">{player.avatar}</span>
              <span className="text-ivory font-medium">{player.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {showRolePoints && pointsEarned > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-sm text-success-light bg-success/20 px-2 py-1 rounded-full"
                >
                  +{pointsEarned}
                </motion.span>
              )}
              <span className="text-xl font-bold text-gold">
                ⭐ {player.points}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
