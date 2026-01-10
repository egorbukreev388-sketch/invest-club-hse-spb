
import React from 'react';
import { WhaleIcon, CLUB_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  onAdminClick?: () => void;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, onAdminClick, isAdmin }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="whale-gradient text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.hash = ''}>
            <div className="bg-white/20 p-2 rounded-full animate-swim">
              <WhaleIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              {CLUB_NAME}
            </h1>
          </div>
          <nav className="flex space-x-4">
            <button 
              onClick={() => window.location.hash = '#tests'}
              className="hover:bg-white/10 px-3 py-1 rounded transition-colors text-sm font-medium"
            >
              Тесты
            </button>
            <button 
              onClick={onAdminClick}
              className={`px-3 py-1 rounded transition-colors text-sm font-medium ${isAdmin ? 'bg-white text-blue-900' : 'hover:bg-white/10'}`}
            >
              {isAdmin ? 'Админ Панель' : 'Вход для админов'}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-gray-100 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2024 {CLUB_NAME} • HSE SPB</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="https://t.me/investclubhsespb" className="text-blue-600 hover:underline">Telegram</a>
            <a href="https://vk.com/investclubhsespb" className="text-blue-600 hover:underline">VK</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
