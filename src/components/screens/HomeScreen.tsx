import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/Card';
import { Progress } from '../ui/Progress';

export function HomeScreen() {
  const { t, navigate, hasActivePackage, isDarkMode } = useApp();
  
  const gridItems = [
    { key: 'video', label: t.videoLessons, action: () => navigate('Lesson', { moduleId: 'M8' }), emoji: '🎬' },
    { key: 'quick', label: t.quickTest, action: () => navigate('Practice'), emoji: '📝' },
    { key: 'topics', label: t.topics, action: () => navigate('Topics'), emoji: '📚' },
    { key: 'exam', label: t.exam, action: () => navigate('ExamConfig'), emoji: '🧪' },
    { key: 'mistakes', label: t.mistakes, action: () => navigate('Mistakes'), emoji: '⚠️' },
    { key: 'practical', label: 'Praktiki təcrübə', action: () => alert('Demo feature'), emoji: '💬' },
  ];
  
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < gridItems.length; i += 2) {
      result.push(gridItems.slice(i, i + 2));
    }
    return result;
  }, [gridItems]);

  return (
    <div className={`p-3 pb-24 min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Package Status */}
      {!hasActivePackage() && (
        <div className={`mb-3 p-3 rounded-lg border flex items-center gap-3 transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-blue-900/20 border-blue-700' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
            isDarkMode ? 'bg-blue-800' : 'bg-blue-100'
          }`}>
            <span className={`text-xs transition-colors duration-200 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-600'
            }`}>📦</span>
          </div>
          <div className="flex-1">
            <div className={`text-xs font-medium transition-colors duration-200 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-900'
            }`}>
              Aktiv paketiniz yoxdur
            </div>
          </div>
          <button
            onClick={() => navigate('Packages')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors min-h-[24px] ${
              isDarkMode 
                ? 'bg-blue-700 text-blue-100 hover:bg-blue-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Paket al
          </button>
        </div>
      )}

      {hasActivePackage() && (
        <div className="mb-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-emerald-600 text-xs">👑</span>
          </div>
          <div className="flex-1">
            <div className="text-emerald-900 text-xs font-medium">
              Premium üzv - Bütün funksiyalar aktiv
            </div>
            <div className="text-emerald-700 text-xs">
              {useApp().activePackage?.name} • Bitmə: {useApp().activePackage?.expiryDate.toLocaleDateString('az-AZ')}
            </div>
          </div>
          <div className="text-emerald-600 text-lg">
            ⭐
          </div>
        </div>
      )}

      {/* Progress Card */}
      <Card className="mb-3">
        <div className="text-xs text-gray-500 mb-2">{t.progress}</div>
        <Progress value={42} />
        <div className="text-xs mt-2 text-gray-700">
          {t.continue} → <span className="font-bold">M8: Yol nişanları</span>
        </div>
      </Card>

      {/* Grid Layout */}
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-2">
            {row.map((item) => (
              <button
                key={item.key}
                onClick={item.action}
                className={`rounded-xl border shadow-sm p-3 flex items-center gap-3 transition-colors min-h-[44px] ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg text-emerald-600 flex items-center justify-center text-lg transition-colors duration-200 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  {item.emoji}
                </div>
                <div className={`text-left font-bold text-sm leading-tight transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Tutorial Card */}
      <button
        onClick={() => alert("Tətbiqdən Necə İstifadə Edilir")}
        className="w-full h-36 rounded-2xl p-4 flex items-end justify-end mt-3 bg-gradient-to-br from-emerald-600 via-green-500 to-emerald-700 text-white font-black relative overflow-hidden"
      >
        <div className="absolute left-4 top-4 w-12 h-12 rounded-full bg-white/25 border border-white/35 flex items-center justify-center">
          <span className="text-white text-base">▶</span>
        </div>
        <span className="text-base">Tətbiqdən Necə İstifadə Edilir</span>
      </button>
    </div>
  );
}