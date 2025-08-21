import React, { ReactNode } from 'react';
import { useApp } from '../../contexts/AppContext';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  const { isDarkMode } = useApp();
  
  return (
    <div className={`rounded-xl p-4 border shadow-sm transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700 text-gray-100' 
        : 'bg-white border-gray-200 text-gray-900'
    } ${className}`}>
      {children}
    </div>
  );
}