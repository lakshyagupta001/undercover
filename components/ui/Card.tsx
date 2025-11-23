'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', glass = true, onClick }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        ${glass ? 'glass' : 'bg-surface'}
        rounded-2xl p-6 shadow-xl border border-ivory/5
        ${onClick ? 'cursor-pointer hover:bg-surface-light/50 hover:border-ivory/10' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

