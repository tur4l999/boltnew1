import React, { ReactNode } from 'react';
import { useApp } from '../../contexts/AppContext';

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  className?: string;
}

export function IconButton({ children, onClick, label, className = '' }: IconButtonProps) {
  const { isDarkMode } = useApp();
  
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`w-9 h-9 rounded-lg border flex items-center justify-center text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 ${
        isDarkMode 
          ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200' 
          : 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700'
      } ${className}`}
    >
      {children}
    </button>
  );
}