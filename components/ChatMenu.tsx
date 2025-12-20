
import React, { useState } from 'react';
import { ChatTopic } from '../types';
import { DISCUSSION_TOPICS, LITERARY_EPOCHS } from '../constants';

interface ChatMenuProps {
  onSelectTopic: (topic: ChatTopic | string) => void;
  onBack: () => void;
}

const ChatMenu: React.FC<ChatMenuProps> = ({ onSelectTopic, onBack }) => {
  const [customTopic, setCustomTopic] = useState('');

  return (
    <div className="animate-fade-in max-w-5xl mx-auto px-4">
      <button 
        onClick={onBack}
        className="mb-8 font-hand text-xl hover:underline dark:text-zinc-400 transition-colors"
      >
        &larr; Zurück zum Couchgespräch
      </button>

      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-6xl font-serif italic text-gray-800 dark:text-zinc-100 mb-4 transition-colors">
          Literarischer Salon
        </h2>
        <p className="font-hand text-3xl text-gray-600 dark:text-zinc-500 transition-colors">
          Worüber möchten Sie heute debattieren?
        </p>
      </div>

      <div className="mb-16">
        <h3 className="text-3xl font-serif font-bold text-gray-700 dark:text-zinc-400 mb-6 border-l-4 border-gray-300 dark:border-zinc-700 pl-4 uppercase tracking-widest">Gattungen & Motive</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DISCUSSION_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic)}
              className="group p-6 bg-white dark:bg-zinc-800 bg-opacity-50 dark:bg-opacity-20 hover:bg-opacity-90 dark:hover:bg-opacity-40 transition-all duration-300 sketch-border text-left"
            >
              <h4 className="text-2xl font-serif font-bold text-gray-800 dark:text-zinc-200 mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">
                {topic.title}
              </h4>
              <p className="font-hand text-xl text-gray-600 dark:text-zinc-400 leading-tight transition-colors">
                {topic.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h3 className="text-3xl font-serif font-bold text-gray-700 dark:text-zinc-400 mb-6 border-l-4 border-gray-300 dark:border-zinc-700 pl-4 uppercase tracking-widest">Epochen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {LITERARY_EPOCHS.map((epoch) => (
            <button
              key={epoch.id}
              onClick={() => onSelectTopic(`Die Epoche des ${epoch.title}`)}
              className="p-4 bg-white dark:bg-zinc-800/40 sketch-border hover:bg-gray-100 dark:hover:bg-zinc-700 text-left transition-colors flex flex-col justify-between h-full"
            >
              <h4 className="text-xl font-serif font-bold dark:text-zinc-200">{epoch.title}</h4>
              <p className="font-hand text-lg text-gray-500 dark:text-zinc-500 leading-tight mt-1">{epoch.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="sketch-border bg-white dark:bg-zinc-800 bg-opacity-40 dark:bg-opacity-10 border-dashed border-gray-400 dark:border-zinc-700 p-8 transition-colors">
         <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-1 text-center sm:text-left">
               <h3 className="text-2xl font-serif font-bold dark:text-zinc-200">Eigenes Thema / Werk</h3>
               <p className="font-hand text-xl text-gray-500 dark:text-zinc-500">Ein spezielles Buch oder eine literarische These?</p>
            </div>
            <div className="flex-2 w-full flex gap-4">
              <input 
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && customTopic && onSelectTopic(customTopic)}
                placeholder="z.B. Das Motiv des Doppelgängers bei E.T.A. Hoffmann"
                className="flex-1 bg-transparent border-b-2 border-gray-400 dark:border-zinc-600 focus:border-gray-800 dark:focus:border-zinc-300 outline-none font-serif text-xl py-2 px-1 dark:text-zinc-100 transition-colors"
              />
              <button 
                onClick={() => customTopic && onSelectTopic(customTopic)}
                disabled={!customTopic.trim()}
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

export default ChatMenu;
