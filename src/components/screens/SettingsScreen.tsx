import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../ui/Card';

export function SettingsScreen() {
  const { goBack, language, setLanguage, theme, setTheme, balance, activePackage, isDarkMode } = useApp();
  const userName = "Tural Qarayev";
  const userEmail = "tural.qarayev@example.com";

  const themeOptions = [
    { value: 'light', label: '☀️ Gündüz', description: 'Açıq tema' },
    { value: 'dark', label: '🌙 Gecə', description: 'Qaranlıq tema' },
    { value: 'system', label: '📱 Cihaza uyğun', description: 'Sistem ayarına görə' }
  ];

  const languageOptions = [
    { value: 'az', label: '🇦🇿 Azərbaycan dili' },
    { value: 'ru', label: '🇷🇺 Русский язык' }
  ];

  const settingsItems = [
    {
      section: 'Hesabım',
      items: [
        { key: 'profile', label: 'Profil məlumatları', emoji: '👤', action: () => alert('Profil məlumatları (demo)') },
        { key: 'security', label: 'Təhlükəsizlik', emoji: '🔒', action: () => alert('Təhlükəsizlik (demo)') },
        { key: 'privacy', label: 'Məxfilik', emoji: '🛡️', action: () => alert('Məxfilik (demo)') },
        { key: 'notifications', label: 'Bildirişlər', emoji: '🔔', action: () => alert('Bildiriş ayarları (demo)') }
      ]
    },
    {
      section: 'Tətbiq',
      items: [
        { key: 'offline', label: 'Offline məzmun', emoji: '📱', action: () => alert('Offline məzmun (demo)') },
        { key: 'cache', label: 'Keş təmizlə', emoji: '🗑️', action: () => alert('Keş təmizləndi (demo)') },
        { key: 'updates', label: 'Yeniləmələr', emoji: '🔄', action: () => alert('Yeniləmələr (demo)') }
      ]
    },
    {
      section: 'Dəstək',
      items: [
        { key: 'help', label: 'Kömək mərkəzi', emoji: '❓', action: () => alert('Kömək mərkəzi (demo)') },
        { key: 'contact', label: 'Bizimlə əlaqə', emoji: '📞', action: () => alert('Əlaqə (demo)') },
        { key: 'feedback', label: 'Rəy bildirin', emoji: '💬', action: () => alert('Rəy bildirin (demo)') },
        { key: 'about', label: 'Haqqında', emoji: 'ℹ️', action: () => alert('DDA.az v1.0.0 (demo)') }
      ]
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="p-3 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={goBack}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors duration-200 ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            ←
          </button>
          <h1 className={`text-lg font-bold transition-colors duration-200 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>Parametrlər</h1>
        </div>

        {/* Profile Card */}
        <Card className={`mb-6 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-500 text-white flex items-center justify-center font-bold text-xl">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className={`font-bold text-lg transition-colors duration-200 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>{userName}</div>
              <div className={`text-sm transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>{userEmail}</div>
              <div className="flex items-center gap-4 mt-2">
                <div className={`text-xs transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Balans: <span className="font-medium text-emerald-600">{balance} AZN</span>
                </div>
                {activePackage && (
                  <div className={`text-xs transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Paket: <span className="font-medium text-emerald-600">{activePackage.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className={`mb-4 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold mb-3 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>Tema</h3>
          <div className="space-y-2">
            {themeOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  theme === option.value
                    ? isDarkMode
                      ? 'border-emerald-500 bg-emerald-900/20'
                      : 'border-emerald-600 bg-emerald-50'
                    : isDarkMode
                      ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="theme"
                  value={option.value}
                  checked={theme === option.value}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="w-4 h-4 text-emerald-600"
                />
                <div className="flex-1">
                  <div className={`font-medium transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>{option.label}</div>
                  <div className={`text-xs transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* Language Settings */}
        <Card className={`mb-4 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-bold mb-3 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>Dil</h3>
          <div className="space-y-2">
            {languageOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  language === option.value
                    ? isDarkMode
                      ? 'border-emerald-500 bg-emerald-900/20'
                      : 'border-emerald-600 bg-emerald-50'
                    : isDarkMode
                      ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value={option.value}
                  checked={language === option.value}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-4 h-4 text-emerald-600"
                />
                <div className={`font-medium transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>{option.label}</div>
              </label>
            ))}
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsItems.map((section) => (
          <div key={section.section} className="mb-4">
            <h3 className={`font-bold mb-3 px-2 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>{section.section}</h3>
            <Card className={`transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="space-y-1">
                {section.items.map((item, index) => (
                  <button
                    key={item.key}
                    onClick={item.action}
                    className={`w-full p-3 flex items-center gap-4 text-left transition-colors duration-200 rounded-lg ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-200' 
                        : 'hover:bg-gray-50 text-gray-900'
                    } ${index !== section.items.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors duration-200 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                    </div>
                    <div className={`transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    } text-lg`}>›</div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => {
              if (confirm('Hesabdan çıxmaq istədiyinizə əminsiniz?')) {
                alert('Çıxış (demo)');
              }
            }}
            className="w-full p-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 font-medium"
          >
            <span className="text-lg">🚪</span>
            Hesabdan çıx
          </button>
        </Card>
      </div>
    </div>
  );
}