
import React, { useState } from 'react';

interface CouchTalkMenuProps {
  onSelectType: (type: 'LITERATURE' | 'PHILOSOPHY' | 'FREE') => void;
  onStartFreeTalk: (topic: string) => void;
  onBack: () => void;
}

const CouchTalkMenu: React.FC<CouchTalkMenuProps> = ({ onSelectType, onStartFreeTalk, onBack }) => {
  const [customTopic, setCustomTopic] = useState('');

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4">
      <button 
        onClick={onBack}
        className="mb-8 font-hand text-xl hover:underline dark:text-zinc-500 transition-colors"
      >
        &larr; Zurück zum Start
      </button>

      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-serif italic text-gray-800 dark:text-zinc-100 mb-4 transition-colors">
          Couchgespräch
        </h2>
        <p className="font-hand text-3xl text-gray-600 dark:text-zinc-500 transition-colors">
          Welchen Geisteszustand bringst du heute mit?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <button
          onClick={() => onSelectType('LITERATURE')}
          className="group p-10 bg-white dark:bg-zinc-800 bg-opacity-50 dark:bg-opacity-20 hover:bg-opacity-90 dark:hover:bg-opacity-40 transition-all duration-300 sketch-border text-center"
        >
          <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">📚</span>
          <h3 className="text-3xl font-serif font-bold text-gray-800 dark:text-zinc-200 mb-2">Literatur</h3>
          <p className="font-hand text-2xl text-gray-600 dark:text-zinc-400">Debatten über Epochen, Genres und Motive.</p>
        </button>

        <button
          onClick={() => onSelectType('PHILOSOPHY')}
          className="group p-10 bg-white dark:bg-zinc-800 bg-opacity-50 dark:bg-opacity-20 hover:bg-opacity-90 dark:hover:bg-opacity-40 transition-all duration-300 sketch-border text-center"
        >
          <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">🏛️</span>
          <h3 className="text-3xl font-serif font-bold text-gray-800 dark:text-zinc-200 mb-2">Philosophie</h3>
          <p className="font-hand text-2xl text-gray-600 dark:text-zinc-400">Ergründe Existenz, Ethik und Erkenntnis.</p>
        </button>
      </div>

      <div className="sketch-border bg-white dark:bg-zinc-800 bg-opacity-40 dark:bg-opacity-10 border-dashed border-gray-400 dark:border-zinc-700 p-10 transition-colors">
         <div className="text-center mb-8">
            <span className="text-4xl mb-2 block">✒️</span>
            <h3 className="text-3xl font-serif font-bold dark:text-zinc-200">Freitext / Eigene These</h3>
            <p className="font-hand text-2xl text-gray-500 dark:text-zinc-500 italic">Worüber möchtest du heute ganz frei nachdenken?</p>
         </div>
         <div className="flex flex-col sm:flex-row gap-6">
            <input 
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && customTopic && onStartFreeTalk(customTopic)}
              placeholder="z.B. Die Vergänglichkeit des Augenblicks..."
              className="flex-1 bg-transparent border-b-2 border-gray-400 dark:border-zinc-600 focus:border-gray-800 dark:focus:border-zinc-300 outline-none font-serif text-2xl py-2 px-1 dark:text-zinc-100 dark:placeholder-zinc-700 transition-colors"
            />
            <button 
              onClick={() => customTopic && onStartFreeTalk(customTopic)}
              disabled={!customTopic.trim()}
              className="px-10 py-3 bg-gray-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-serif text-xl hover:bg-gray-700 dark:hover:bg-white sketch-button transition-colors disabled:opacity-50"
            >
              Starten
            </button>
         </div>
      </div>
    </div>
  );
};

export default CouchTalkMenu;
