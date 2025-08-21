import React from 'react';
import { useApp } from '../../contexts/AppContext';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function Progress({ value, max = 100, className = '' }: ProgressProps) {
  const { isDarkMode } = useApp();
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`w-full h-3 rounded-full overflow-hidden border transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-gray-100 border-gray-200'
    } ${className}`}>
      <div 
        className="h-full bg-emerald-600 transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}