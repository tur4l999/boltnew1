import React from 'react';
import { useApp } from '../../contexts/AppContext';

export function TabBar() {
  const { t, currentTab, switchTab, navigate, currentScreen, setMoreSheetVisible, isDarkMode } = useApp();
  
  const tabs = [
    { key: 'Home', label: t.home, emoji: '🏠' },
    { key: 'Topics', label: 'Təlimlər', emoji: '📚' },
    { key: 'ExamConfig', label: t.exam, emoji: '🧪' },
    { key: 'Store', label: t.store, emoji: '🛍️' },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-30 backdrop-blur-sm border-t transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-800/90 border-gray-700' 
        : 'bg-white/90 border-gray-200'
    }`}>
      <div className="max-w-md mx-auto grid grid-cols-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              if (tab.key === 'ExamConfig') {
                switchTab('Home');
                navigate('ExamConfig');
              } else {
                switchTab(tab.key);
              }
            }}
            className={`p-2 flex flex-col items-center gap-1 min-h-[56px] transition-colors duration-200 ${
              (currentTab === tab.key || (tab.key === 'ExamConfig' && currentScreen.screen === 'ExamConfig')) 
                ? 'text-emerald-600' : 'text-gray-500'
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
              (currentTab === tab.key || (tab.key === 'ExamConfig' && currentScreen.screen === 'ExamConfig'))
                ? isDarkMode ? 'bg-gray-700' : 'bg-gray-50' 
                : 'bg-transparent'
            }`}>
              <span className="text-base">{tab.emoji}</span>
            </div>
            <div className="text-xs font-semibold">{tab.label}</div>
          </button>
        ))}
        <button
          onClick={() => switchTab('More')}
          className={`p-2 flex flex-col items-center gap-1 min-h-[56px] transition-colors duration-200 ${
            currentTab === 'More' ? 'text-emerald-600' : 'text-gray-500'
          }`}
        >
          <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
            currentTab === 'More' 
              ? isDarkMode ? 'bg-gray-700' : 'bg-gray-50' 
              : 'bg-transparent'
          }`}>
            <span className="text-base">➕</span>
          </div>
          <div className="text-xs font-semibold">{t.more}</div>
        </button>
      </div>
    </div>
  );
}