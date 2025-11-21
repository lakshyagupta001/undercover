'use client';

import { motion } from 'framer-motion';
import { Player } from '@/types/game';

interface PlayerAvatarProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  showRole?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function PlayerAvatar({
  player,
  size = 'md',
  showRole = false,
  onClick,
  isSelected = false,
}: PlayerAvatarProps) {
  const sizes = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  };

  const roleColors = {
    civilian: 'ring-civilian',
    undercover: 'ring-undercover',
    mrwhite: 'ring-mrwhite',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        whileHover={{ scale: onClick ? 1.05 : 1 }}
        whileTap={{ scale: onClick ? 0.95 : 1 }}
        onClick={onClick}
        className={`
          ${sizes[size]}
          rounded-full
          flex items-center justify-center
          ${player.isAlive ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gray-600 opacity-50'}
          ${showRole ? `ring-4 ${roleColors[player.role]}` : ''}
          ${isSelected ? 'ring-4 ring-yellow-400' : ''}
          ${onClick ? 'cursor-pointer' : ''}
          shadow-lg transition-all duration-300
        `}
      >
        <span className={player.isAlive ? '' : 'grayscale'}>{player.avatar}</span>
      </motion.div>
      <div className="text-center">
        <p className={`text-sm font-medium ${player.isAlive ? 'text-white' : 'text-gray-500'}`}>
          {player.name}
        </p>
        {showRole && (
          <p className="text-xs text-gray-400 capitalize">{player.role}</p>
        )}
      </div>
    </div>
  );
}

