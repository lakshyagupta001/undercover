'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'civilian' | 'undercover' | 'mrwhite' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'btn-hover font-semibold rounded-xl transition-all duration-300 shadow-lg';
  
  const variants = {
    primary: 'bg-gradient-primary text-ivory hover:shadow-accent/40 border border-accent-light/20',
    secondary: 'glass text-ivory hover:bg-surface-light/50 border border-ivory/10',
    danger: 'bg-gradient-undercover text-ivory hover:shadow-accent/40 border border-accent-light/20',
    civilian: 'bg-gradient-civilian text-ivory hover:shadow-civilian/40 border border-civilian-light/20',
    undercover: 'bg-gradient-undercover text-ivory hover:shadow-accent/40 border border-accent-light/20',
    mrwhite: 'bg-gradient-mrwhite text-base hover:shadow-gold/40 border border-gold-light/20',
    gold: 'bg-gradient-gold text-base hover:shadow-gold/40 border border-gold-light/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

