import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function ResultsScreen() {
  const { t, navigate, currentScreen, isDarkMode } = useApp();
  const { result } = currentScreen.params;
  const passed = result.score >= Math.ceil(result.total * 0.8);

  return (
    <div className={`p-3 pb-24 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Card className="mb-3 text-center">
        <div className={`text-xs transition-colors duration-200 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>{t.yourScore}</div>
        <div className={`text-3xl font-black mt-1 transition-colors duration-200 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {result.score}/{result.total}
        </div>
        <div className={`mt-2 font-bold ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
          {passed ? t.pass : t.fail}
        </div>
      </Card>
      
      <Card>
        <div className={`font-bold mb-2 transition-colors duration-200 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>{t.weakTopics}</div>
        <div className={`text-sm mb-3 transition-colors duration-200 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          M8 (nişanlar), M5 (dairəvi). (demo)
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('Mistakes')}>
            {t.learnFromMistakes}
          </Button>
          <Button onClick={() => navigate('ExamConfig')} variant="ghost">
            Yenidən
          </Button>
        </div>
      </Card>
    </div>
  );
}