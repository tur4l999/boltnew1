import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { IconButton } from '../ui/IconButton';
import { showToast } from '../../lib/utils';

export function Header() {
  const { t, language, setLanguage, navigate, isDarkMode } = useApp();
  const userName = "Tural Qarayev";
  
  return (
    <div className="sticky top-0 z-30">
      <div className={`max-w-md mx-auto backdrop-blur-sm border-b transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="px-4 py-2 flex items-center gap-3">
          <button
            onClick={() => navigate('Settings')}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-white flex items-center justify-center font-bold text-sm hover:from-emerald-700 hover:to-emerald-600 transition-all duration-200"
          >
            {userName.charAt(0).toUpperCase()}
          </button>
          <div className="flex-1 leading-tight">
            <div className={`text-xs transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>DDA.az</div>
            <div className={`text-sm font-bold transition-colors duration-200 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {t.hello}, {userName} 👋
            </div>
          </div>
          <IconButton
            onClick={() => showToast('📣 Push (demo): Bu gün 15 dəq məşq et!')}
            label={t.notifications}
          >
            🔔
          </IconButton>
          <IconButton
            onClick={() => navigate('AIChat')}
            label={t.assistant}
          >
            🤖
          </IconButton>
          <IconButton 
            onClick={() => setLanguage(language === 'az' ? 'ru' : 'az')} 
            label={t.language}
          >
            🌐
          </IconButton>
        </div>
      </div>
    </div>
  );
}