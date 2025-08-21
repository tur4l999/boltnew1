import React, { ReactNode } from 'react';
import { useApp } from '../../contexts/AppContext';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = ''
}: ButtonProps) {
  const { isDarkMode } = useApp();
  const baseClasses = 'font-bold rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-sm min-h-[44px]',
    lg: 'px-6 py-4 text-base min-h-[52px]'
  };
  
  const variantClasses = {
    primary: disabled 
      ? isDarkMode
        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    secondary: disabled
      ? isDarkMode
        ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
      : isDarkMode
        ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500'
        : 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-600',
    ghost: disabled
      ? isDarkMode
        ? 'bg-transparent border border-gray-700 text-gray-600 cursor-not-allowed'
        : 'bg-transparent border border-gray-300 text-gray-500 cursor-not-allowed'
      : isDarkMode
        ? 'bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 focus:ring-gray-500'
        : 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  };
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}