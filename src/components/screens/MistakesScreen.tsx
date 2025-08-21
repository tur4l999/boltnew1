import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { mistakesStore } from '../../lib/mistakesStore';
import { useApp } from '../../contexts/AppContext';

export function MistakesScreen() {
  const { isDarkMode } = useApp();
  const [mistakes, setMistakes] = useState<string[]>(mistakesStore.getAll());

  useEffect(() => {
    const unsubscribe = mistakesStore.subscribe(() => {
      setMistakes(mistakesStore.getAll());
    });
    return unsubscribe;
  }, []);

  return (
    <div className={`p-3 pb-24 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Card>
        <div className={`font-bold mb-3 transition-colors duration-200 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>Səhv verdiyim suallar</div>
        {mistakes.length === 0 ? (
          <div className={`text-sm transition-colors duration-200 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Hələlik qeyd yoxdur.</div>
        ) : (
          <ul className={`list-disc list-inside text-sm transition-colors duration-200 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {mistakes.map((id, index) => (
              <li key={index} className="mb-1">{id}</li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}