
import React, { useState } from 'react';
import { Difficulty, QuizFocus } from '../types';

interface QuizGlobalMenuProps {
  onStartQuiz: (topic: string, difficulty: Difficulty, focus: QuizFocus) => void;
  onSelectSpecificBook: () => void;
  onBack: () => void;
}

const QuizGlobalMenu: React.FC<QuizGlobalMenuProps> = ({ onStartQuiz, onSelectSpecificBook, onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [focus, setFocus] = useState<QuizFocus>('GENERAL');

  const categories = [
    { title: 'Epochen', items: ['Aufklärung', 'Sturm und Drang', 'Weimarer Klassik', 'Romantik', 'Realismus', 'Moderne'] },
    { title: 'Genres', items: ['Dramatik', 'Lyrik', 'Epik (Romane)', 'Novellen'] },
    { title: 'Themen', items: ['Mensch & Natur', 'Liebe & Verrat', 'Gesellschaftskritik', 'Existenzialismus'] }
  ];

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4">
      <button onClick={onBack} className="mb-8 font-hand text-xl hover:underline dark:text-zinc-500">&larr; Zurück zum Start</button>

      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif italic text-gray-800 dark:text-zinc-100 mb-4 transition-colors">Das Literatur-Examen</h2>
        <p className="font-hand text-2xl text-gray-600 dark:text-zinc-500 transition-colors">Konfiguriere deine Herausforderung</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Settings Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="sketch-border bg-white dark:bg-zinc-800 bg-opacity-60 dark:bg-opacity-40 p-6 transition-colors">
            <h3 className="text-xl font-serif font-bold mb-4 border-b border-gray-200 dark:border-zinc-700 pb-2 dark:text-zinc-200 transition-colors">Einstellungen</h3>
            
            <div className="mb-6">
              <label className="block font-hand text-lg text-gray-500 dark:text-zinc-500 mb-2">Schwierigkeit</label>
              <div className="flex flex-col gap-2">
                {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(d => (
                  <button 
                    key={d} 
                    onClick={() => setDifficulty(d)}
                    className={`p-2 font-serif border-2 transition-all ${difficulty === d ? 'border-gray-800 dark:border-zinc-300 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 dark:text-zinc-400 hover:border-gray-400 dark:hover:border-zinc-600'}`}
                  >
                    {d === 'EASY' ? 'Einfach' : d === 'MEDIUM' ? 'Normal' : 'Schwer'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-hand text-lg text-gray-500 dark:text-zinc-500 mb-2">Fokus</label>
              <div className="flex flex-col gap-2">
                {(['GENERAL', 'PLOT', 'SYMBOLISM'] as QuizFocus[]).map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFocus(f)}
                    className={`p-2 font-serif border-2 transition-all ${focus === f ? 'border-gray-800 dark:border-zinc-300 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 dark:text-zinc-400 hover:border-gray-400 dark:hover:border-zinc-600'}`}
                  >
                    {f === 'GENERAL' ? 'Allgemein' : f === 'PLOT' ? 'Handlung' : 'Symbolik'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={onSelectSpecificBook}
            className="w-full p-6 sketch-border bg-gray-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-serif text-xl hover:bg-gray-700 dark:hover:bg-white sketch-button transition-colors"
          >
            Spezifisches Werk suchen &rarr;
          </button>
        </div>

        {/* Topics Column */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="sketch-border bg-white dark:bg-zinc-800 bg-opacity-40 dark:bg-opacity-20 p-6 h-full transition-colors">
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-700 dark:text-zinc-300 border-b border-dashed border-gray-300 dark:border-zinc-700 pb-2 transition-colors">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map(item => (
                  <button
                    key={item}
                    onClick={() => onStartQuiz(item, difficulty, focus)}
                    className="px-4 py-2 bg-white dark:bg-zinc-800/50 border border-gray-300 dark:border-zinc-700 hover:border-gray-800 dark:hover:border-zinc-400 font-serif rounded-sm transition-colors dark:text-zinc-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="sketch-border bg-orange-50 dark:bg-orange-950/20 bg-opacity-30 p-6 flex flex-col justify-center items-center text-center border-dashed transition-colors">
            <h3 className="text-2xl font-serif font-bold mb-2 dark:text-zinc-200">Zufallsmix</h3>
            <p className="font-hand text-lg text-gray-600 dark:text-zinc-500 mb-4 transition-colors">Ein querbeet Quiz durch alle Epochen.</p>
            <button 
              onClick={() => onStartQuiz("Allgemeine Literaturgeschichte", difficulty, focus)}
              className="px-8 py-2 bg-gray-700 dark:bg-zinc-200 text-white dark:text-zinc-900 font-serif hover:bg-gray-600 dark:hover:bg-white sketch-button transition-colors"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGlobalMenu;
