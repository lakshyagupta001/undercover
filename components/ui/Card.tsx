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
        ${glass ? 'glass' : 'bg-slate-800'}
        rounded-2xl p-6 shadow-xl
        ${onClick ? 'cursor-pointer hover:bg-white/10' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

