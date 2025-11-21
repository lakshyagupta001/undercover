'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'civilian' | 'undercover' | 'mrwhite';
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
    primary: 'bg-gradient-primary text-white hover:shadow-purple-500/50',
    secondary: 'glass text-white hover:bg-white/10',
    danger: 'bg-gradient-undercover text-white hover:shadow-red-500/50',
    civilian: 'bg-gradient-civilian text-white hover:shadow-blue-500/50',
    undercover: 'bg-gradient-undercover text-white hover:shadow-red-500/50',
    mrwhite: 'bg-gradient-mrwhite text-gray-900 hover:shadow-gray-500/50',
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

