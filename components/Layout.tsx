
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: 'home') => void;
  isNightMode: boolean;
  toggleNightMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onNavigate, 
  isNightMode, 
  toggleNightMode
}) => {
  return (
    <div className="min-h-screen font-serif text-gray-800 dark:text-zinc-300 relative overflow-x-hidden transition-colors duration-500">
      {/* Decorative corners */}
      <div className="fixed top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-gray-300 dark:border-zinc-700 opacity-30 rounded-tl-3xl pointer-events-none z-0 m-4 transition-colors" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-gray-300 dark:border-zinc-700 opacity-30 rounded-br-3xl pointer-events-none z-0 m-4 transition-colors" />

      <header className="relative z-10 pt-8 pb-4 text-center border-b border-gray-300 dark:border-zinc-800 mx-auto max-w-4xl border-dashed flex flex-col items-center">
        <div className="relative w-full px-4 mb-2 flex justify-between items-center">
          <div className="w-10" /> {/* Spacer */}
          
          <h1 
            onClick={() => onNavigate('home')}
            className="text-4xl md:text-5xl font-serif font-bold text-gray-800 dark:text-zinc-100 tracking-wider cursor-pointer hover:text-gray-600 dark:hover:text-zinc-400 transition-colors"
          >
            Nadines E-Bibliothek
          </h1>
          
          <button 
            onClick={toggleNightMode}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700 hover:scale-110 transition-transform z-20"
            title={isNightMode ? "Tagmodus" : "Nachtmodus"}
          >
            {isNightMode ? '☀️' : '🌙'}
          </button>
        </div>
        <p className="font-hand text-2xl text-gray-500 dark:text-zinc-500 mt-2 rotate-1">
          Klassiker neu entdecken
        </p>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="text-center py-8 text-gray-400 dark:text-zinc-600 font-serif text-sm border-t border-gray-200 dark:border-zinc-800 mt-12 border-dashed max-w-4xl mx-auto transition-colors">
        <p>© 2025 Nadines E-Bibliothek. Dein literarischer Rückzugsort.</p>
      </footer>
    </div>
  );
};

export default Layout;
