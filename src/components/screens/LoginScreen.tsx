import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useApp } from '../../contexts/AppContext';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useApp();

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  const handleDemoLogin = () => {
    setEmail('demo@dda.az');
    setPassword('demo123');
    setTimeout(handleLogin, 100);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-emerald-50 to-green-100'
    }`}>
      {/* Background Elements - Lower opacity and behind content */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Traffic Signs */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-red-500/5 rounded-full flex items-center justify-center text-2xl opacity-20">
          🛑
        </div>
        <div className="absolute top-32 right-16 w-12 h-12 bg-yellow-500/5 rounded-full flex items-center justify-center text-xl opacity-15">
          ⚠️
        </div>
        <div className="absolute bottom-40 left-8 w-14 h-14 bg-blue-500/5 rounded-full flex items-center justify-center text-2xl opacity-20">
          🚗
        </div>
        <div className="absolute bottom-60 right-12 w-10 h-10 bg-green-500/5 rounded-full flex items-center justify-center text-lg opacity-15">
          🚦
        </div>
        <div className="absolute top-1/2 left-4 w-8 h-8 bg-orange-500/5 rounded-full flex items-center justify-center text-sm opacity-10">
          🛣️
        </div>
        <div className="absolute top-1/3 right-8 w-12 h-12 bg-purple-500/5 rounded-full flex items-center justify-center text-xl opacity-15">
          📚
        </div>
        
        {/* Decorative Lines */}
        <div className="absolute top-1/4 left-0 w-32 h-0.5 bg-emerald-200/10 rotate-12 opacity-20"></div>
        <div className="absolute bottom-1/3 right-0 w-24 h-0.5 bg-green-200/10 -rotate-12 opacity-20"></div>
        <div className="absolute top-2/3 left-1/4 w-16 h-0.5 bg-emerald-300/10 rotate-45 opacity-15"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl shadow-lg flex items-center justify-center transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <img 
              src="/DDA_logo.png" 
              alt="DDA.az Logo" 
              className="w-16 h-16 object-contain"
              onError={(e) => {
                // Fallback to text logo if image fails
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="text-2xl font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}">DDA</div>`;
                }
              }}
            />
          </div>
          <h1 className={`text-3xl font-black mb-2 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>DDA.az</h1>
          <p className={`transition-colors duration-200 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Sürücülük vəsiqəsi üçün hazırlıq</p>
        </div>

        {/* Login Form */}
        <Card className={`p-6 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail ünvanınızı daxil edin"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Şifrə
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrənizi daxil edin"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
              />
              <label htmlFor="remember-me" className={`ml-2 text-sm transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Yadda saxla
              </label>
            </div>

            <Button
              onClick={handleLogin}
              disabled={!email || !password || isLoading}
              className="w-full"
            >
              {isLoading ? 'Giriş edilir...' : 'Daxil ol'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t transition-colors duration-200 ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                }`}></div>
              </div>
              <div className={`relative flex justify-center text-sm transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <span className={`px-2 transition-colors duration-200 ${
                  isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                }`}>və ya</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => alert('Google ilə giriş (demo)')}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-xl transition-colors duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className={`font-medium transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Google ilə daxil ol</span>
              </button>
              
              <button
                onClick={() => alert('Apple ilə giriş (demo)')}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-xl transition-colors text-white ${
                  isDarkMode ? 'border-gray-600 bg-gray-900 hover:bg-black' : 'border-gray-300 bg-black hover:bg-gray-800'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="font-medium">Apple ilə daxil ol</span>
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={handleDemoLogin}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
                }`}
              >
                Demo hesabı ilə daxil ol
              </button>
            </div>
          </div>
        </Card>

        {/* Additional Options */}
        <div className="mt-6 text-center space-y-3">
          <button className={`text-sm transition-colors duration-200 ${
            isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
          }`}>
            Şifrəni unutmusan?
          </button>
          <div className={`text-sm transition-colors duration-200 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Hesabın yoxdur?{' '}
            <button className={`font-medium transition-colors duration-200 ${
              isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
            }`}>
              Qeydiyyatdan keç
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-8 text-center text-xs transition-colors duration-200 ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          © 2024 DDA.az - Bütün hüquqlar qorunur
        </div>
      </div>
    </div>
  );
}