
import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';
import { generateStorySegment } from '../services/gemini';

interface StoryReplayProps {
  book: Book;
  onBack: () => void;
}

const StoryReplay: React.FC<StoryReplayProps> = ({ book, onBack }) => {
  const [currentText, setCurrentText] = useState<string>('');
  const [choices, setChoices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deepDiveInput, setDeepDiveInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadScene(null);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentText]);

  const loadScene = async (choice: string | null, deepDive?: string) => {
    setLoading(true);
    setChoices([]);
    try {
      const context = currentText; 
      const data = await generateStorySegment(book.title, context, choice, deepDive);
      
      if (deepDive) {
        // Bei Deep Dive hängen wir den neuen Text an oder ersetzen ihn mit Trenner
        setCurrentText(prev => prev + "\n\n--- Vertiefung ---\n\n" + data.narrative);
      } else {
        setCurrentText(data.narrative);
      }
      setChoices(data.choices);
      setDeepDiveInput('');
    } catch (err) {
      console.error(err);
      setCurrentText("Die Seiten sind verblasst... Ein Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeepDiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deepDiveInput.trim() || loading) return;
    loadScene(null, deepDiveInput);
  };

  return (
    <div className="max-w-3xl mx-auto relative animate-fade-in">
      <button 
        onClick={onBack}
        className="absolute -top-12 left-0 font-hand text-xl hover:underline z-20 dark:text-zinc-400"
      >
        &larr; Buch schließen
      </button>

      <div className="bg-white dark:bg-zinc-800 bg-opacity-80 dark:bg-opacity-40 p-8 md:p-12 lg:p-16 sketch-border min-h-[600px] flex flex-col relative transition-colors duration-500">
        <h3 className="font-serif text-2xl text-gray-400 dark:text-zinc-600 mb-8 border-b border-gray-200 dark:border-zinc-700 pb-2 transition-colors text-center">
          {book.title} &mdash; Nach-Erleben
        </h3>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-4 scroll-smooth">
          {loading && !currentText ? (
             <div className="h-full flex items-center justify-center">
               <div className="animate-pulse font-serif text-2xl dark:text-zinc-500 italic">Die Tinte trocknet auf dem Pergament...</div>
             </div>
          ) : (
            <div className="prose dark:prose-invert font-serif text-2xl leading-loose text-gray-800 dark:text-zinc-200 transition-colors">
              {currentText.split('\n').map((line, i) => (
                <p key={i} className={`mb-6 ${line.includes('--- Vertiefung ---') ? 'text-gray-500 dark:text-zinc-500 italic text-xl border-t border-dashed border-gray-300 dark:border-zinc-700 pt-4 mt-8' : ''}`}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        {!loading && (
          <div className="mt-12 space-y-8 pt-8 border-t border-dashed border-gray-300 dark:border-zinc-700">
            {/* Deep Dive Input */}
            <form onSubmit={handleDeepDiveSubmit} className="relative group">
              <input 
                type="text"
                value={deepDiveInput}
                onChange={(e) => setDeepDiveInput(e.target.value)}
                placeholder="Tiefer in diesen Moment eintauchen? (z.B. Fragen zur Symbolik...)"
                className="w-full bg-transparent border-b-2 border-gray-300 dark:border-zinc-700 py-3 pl-2 pr-12 text-xl font-hand text-gray-700 dark:text-zinc-300 focus:outline-none focus:border-gray-800 dark:focus:border-zinc-400 placeholder-gray-400 dark:placeholder-zinc-600 transition-colors italic"
              />
              <button 
                type="submit"
                disabled={!deepDiveInput.trim()}
                className="absolute right-0 top-2 text-2xl opacity-50 hover:opacity-100 disabled:opacity-20 transition-all"
                title="Vertiefung anfordern"
              >
                ✒️
              </button>
            </form>

            <div>
              <p className="font-hand text-3xl text-gray-600 dark:text-zinc-500 mb-6 transition-colors text-center">Wie soll die Geschichte weitergehen?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadScene(choice)}
                    className="w-full text-center p-4 border-2 border-gray-200 dark:border-zinc-700 hover:border-gray-800 dark:hover:border-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-all font-serif text-lg dark:text-zinc-300 rounded-sm"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && currentText && (
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-10">
             <div className="animate-pulse font-hand text-3xl dark:text-zinc-400">Erweitere das Erleben...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryReplay;
