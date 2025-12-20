
import React, { useState } from 'react';
import { PhilosophyTheme } from '../types';
import { PHILOSOPHICAL_THEMES } from '../constants';

interface PhilosophyMenuProps {
  onSelectTheme: (theme: PhilosophyTheme | string) => void;
  onBack: () => void;
}

const PhilosophyMenu: React.FC<PhilosophyMenuProps> = ({ onSelectTheme, onBack }) => {
  const [customTheme, setCustomTheme] = useState('');

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4">
      <button 
        onClick={onBack}
        className="mb-8 font-hand text-xl hover:underline dark:text-zinc-500 transition-colors"
      >
        &larr; Zurück zum Couchgespräch
      </button>

      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-serif italic text-gray-800 dark:text-zinc-100 mb-4 transition-colors">
          Die Welt der Ideen
        </h2>
        <p className="font-hand text-2xl text-gray-600 dark:text-zinc-500">
          Ergründe die Fundamente unseres Denkens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {PHILOSOPHICAL_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme)}
            className="group text-left bg-white dark:bg-zinc-800 bg-opacity-40 dark:bg-opacity-20 hover:bg-opacity-80 dark:hover:bg-opacity-40 transition-all duration-300 sketch-border flex flex-col h-full p-6"
          >
            <div className="flex-1 flex flex-col">
              <h3 className="text-2xl font-serif font-bold text-gray-800 dark:text-zinc-200 mb-3 group-hover:text-black dark:group-hover:text-white transition-colors">
                {theme.title}
              </h3>
              <p className="font-hand text-xl text-gray-600 dark:text-zinc-400 leading-tight transition-colors mb-4">
                {theme.description}
              </p>
              <div className="mt-auto pt-2 flex justify-end border-t border-dashed border-gray-200 dark:border-zinc-700">
                <span className="text-gray-400 dark:text-zinc-600 font-serif italic text-sm group-hover:translate-x-1 transition-transform">
                  Erörtern &rarr;
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="sketch-border bg-white dark:bg-zinc-800 bg-opacity-40 dark:bg-opacity-10 border-dashed border-gray-400 dark:border-zinc-700 p-8 transition-colors">
         <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-1 text-center sm:text-left">
               <h3 className="text-2xl font-serif font-bold dark:text-zinc-200">Spezifische Fragestellung</h3>
               <p className="font-hand text-xl text-gray-500 dark:text-zinc-500">Hast du ein eigenes philosophisches Problem?</p>
            </div>
            <div className="flex-2 w-full flex gap-4">
              <input 
                type="text"
                value={customTheme}
                onChange={(e) => setCustomTheme(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && customTheme && onSelectTheme(customTheme)}
                placeholder="z.B. Das Problem des freien Willens..."
                className="flex-1 bg-transparent border-b-2 border-gray-400 dark:border-zinc-600 focus:border-gray-800 dark:focus:border-zinc-300 outline-none font-serif text-xl py-2 px-1 dark:text-zinc-100 transition-colors"
              />
              <button 
                onClick={() => customTheme && onSelectTheme(customTheme)}
                disabled={!customTheme.trim()}
                className="px-6 py-2 bg-gray-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-serif text-lg hover:bg-gray-700 dark:hover:bg-white sketch-button transition-colors disabled:opacity-50"
              >
                Starten
              </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PhilosophyMenu;
