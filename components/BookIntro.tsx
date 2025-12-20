
import React, { useState, useEffect } from 'react';
import { Book, AppMode, ReadingPreference } from '../types';
import { getBookDeepAnalysis, getTableOfContents, getChapterContent } from '../services/gemini';

interface BookIntroProps {
  book: Book;
  onSelectMode: (mode: AppMode, pref?: ReadingPreference, focus?: string) => void;
  onBack: () => void;
}

const BookIntro: React.FC<BookIntroProps> = ({ book, onSelectMode, onBack }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [pref, setPref] = useState<ReadingPreference>('CHRONOLOGICAL');
  const [focusText, setFocusText] = useState('');

  useEffect(() => {
    // 1. Tiefenanalyse laden
    const loadAnalysis = async () => {
      setLoading(true);
      try {
        const text = await getBookDeepAnalysis(book.title, book.author);
        setAnalysis(text);
      } catch (err) {
        setAnalysis("Analyse konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    // 2. Background Preloading für Lektüre-Modus
    // Wir laden das Inhaltsverzeichnis und das erste Kapitel im Hintergrund, 
    // während der Nutzer die Analyse liest.
    const preLoadContent = async () => {
      try {
        const toc = await getTableOfContents(book.title);
        if (toc && toc.length > 0) {
          console.debug(`[Preload] Starte Laden von Kapitel: ${toc[0]}`);
          // Wir warten nicht auf das Ergebnis hier, es füllt einfach den appCache im Hintergrund
          getChapterContent(book, toc[0]);
        }
      } catch (e) {
        console.debug("[Preload] Fehler beim Vorladen", e);
      }
    };

    loadAnalysis();
    preLoadContent();
  }, [book]);

  const handleReadClick = () => {
    if (book.isPublicDomain) {
      onSelectMode(AppMode.READ, 'CHRONOLOGICAL');
    } else {
      setShowConfigModal(true);
    }
  };

  const confirmRead = () => {
    onSelectMode(AppMode.READ, pref, focusText);
    setShowConfigModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in relative py-8">
      <button 
        onClick={onBack}
        className="absolute -top-4 left-0 font-hand text-xl hover:underline text-gray-600 dark:text-zinc-500"
      >
        &larr; Zurück zur Bibliothek
      </button>

      <div className="text-center mt-12 mb-12">
        <div className="flex justify-center mb-4">
           <span className={`px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase border ${book.isPublicDomain ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400' : 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-900/20 dark:text-orange-400'}`}>
             {book.isPublicDomain ? '📜 Originalwerk verfügbar' : '✨ KI-gestütztes Nach-Erleben'}
           </span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-800 dark:text-zinc-100 mb-4 leading-tight transition-colors">
          {book.title}
        </h1>
        <p className="text-4xl font-hand text-gray-600 dark:text-zinc-400 mb-8">{book.author} ({book.year})</p>
        
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-800 bg-opacity-60 dark:bg-opacity-20 p-8 border-y-2 border-gray-200 dark:border-zinc-800 italic font-serif text-2xl leading-relaxed text-gray-700 dark:text-zinc-300 transition-all mb-12">
          {book.description}
        </div>

        {/* Deep Analysis Section */}
        <div className="text-left bg-white dark:bg-zinc-900 bg-opacity-40 dark:bg-opacity-20 p-8 md:p-12 sketch-border transition-colors">
          <h2 className="text-3xl font-serif font-bold mb-6 border-b border-dashed border-gray-300 dark:border-zinc-700 pb-2 dark:text-zinc-200">
            Tiefenanalyse & Kontext
          </h2>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="font-serif text-xl leading-relaxed text-gray-800 dark:text-zinc-300 space-y-6">
              {analysis.split('\n').map((para, i) => para.trim() && (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
        <button 
          onClick={handleReadClick}
          className="group p-8 bg-white dark:bg-zinc-800 bg-opacity-80 dark:bg-opacity-40 sketch-border hover:bg-gray-800 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-900 transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-3xl font-serif font-bold">Lektüre</h3>
             <span className="text-3xl group-hover:scale-110 transition-transform">📖</span>
          </div>
          <p className="font-hand text-xl opacity-80 group-hover:opacity-100">
            {book.isPublicDomain ? 'Den Originaltext lesen.' : 'Eine hochwertige Nacherzählung lesen.'}
          </p>
        </button>

        <button 
          onClick={() => onSelectMode(AppMode.REPLAY)}
          className="group p-8 bg-white dark:bg-zinc-800 bg-opacity-80 dark:bg-opacity-40 sketch-border hover:bg-orange-900 dark:hover:bg-orange-700 hover:text-white transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-3xl font-serif font-bold">Nach-Erleben</h3>
             <span className="text-3xl group-hover:scale-110 transition-transform">⚛</span>
          </div>
          <p className="font-hand text-xl opacity-80 group-hover:opacity-100">
             Die Geschichte interaktiv erleben.
          </p>
        </button>

        <button 
          onClick={() => onSelectMode(AppMode.QUIZ)}
          className="group p-8 bg-white dark:bg-zinc-800 bg-opacity-80 dark:bg-opacity-40 sketch-border hover:bg-blue-900 dark:hover:bg-blue-700 hover:text-white transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-3xl font-serif font-bold">Quiz</h3>
             <span className="text-3xl group-hover:scale-110 transition-transform">?</span>
          </div>
          <p className="font-hand text-xl opacity-80 group-hover:opacity-100">
             Dein Wissen testen.
          </p>
        </button>

        <button 
          onClick={() => onSelectMode(AppMode.CHAT)}
          className="group p-8 bg-white dark:bg-zinc-800 bg-opacity-80 dark:bg-opacity-40 sketch-border hover:bg-green-900 dark:hover:bg-green-700 hover:text-white transition-all duration-300 text-left"
        >
          <div className="flex justify-between items-center mb-2">
             <h3 className="text-3xl font-serif font-bold">Diskussion</h3>
             <span className="text-3xl group-hover:scale-110 transition-transform">💬</span>
          </div>
          <p className="font-hand text-xl opacity-80 group-hover:opacity-100">
             Über Motive debattieren.
          </p>
        </button>
      </div>

      {/* Choice Modal for Retellings */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
           <div className="bg-paper dark:bg-zinc-900 max-w-xl w-full p-8 md:p-12 sketch-border shadow-2xl relative transition-colors duration-500">
              <button 
                onClick={() => setShowConfigModal(false)}
                className="absolute top-4 right-6 text-3xl hover:scale-110 transition-transform"
              >
                &times;
              </button>
              
              <h2 className="text-4xl font-serif font-bold mb-4 dark:text-zinc-100">Optionen des Nach-Erlebens</h2>
              <p className="font-hand text-2xl text-gray-500 dark:text-zinc-400 mb-8 leading-tight">
                Da dieses Werk noch geschützt ist, erstellen wir für dich ein personalisiertes Lese-Erlebnis.
              </p>

              <div className="space-y-6">
                <button 
                  onClick={() => setPref('CHRONOLOGICAL')}
                  className={`w-full text-left p-6 border-2 transition-all ${pref === 'CHRONOLOGICAL' ? 'border-gray-800 dark:border-zinc-100 bg-gray-50 dark:bg-zinc-800' : 'border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600'}`}
                >
                  <h4 className="text-xl font-bold font-serif dark:text-zinc-200">Chronologischer Rückblick</h4>
                  <p className="font-hand text-lg text-gray-500 dark:text-zinc-500">Die Handlung so nah wie möglich am Original nacherzählt.</p>
                </button>

                <div className={`p-6 border-2 transition-all ${pref === 'FOCUSED' ? 'border-gray-800 dark:border-zinc-100 bg-gray-50 dark:bg-zinc-800' : 'border-gray-200 dark:border-zinc-800'}`}>
                   <button 
                    onClick={() => setPref('FOCUSED')}
                    className="w-full text-left"
                   >
                     <h4 className="text-xl font-bold font-serif dark:text-zinc-200">Spezifischer Fokus</h4>
                     <p className="font-hand text-lg text-gray-500 dark:text-zinc-500">Möchtest du dich auf bestimmte Motive oder Figuren konzentrieren?</p>
                   </button>
                   
                   {pref === 'FOCUSED' && (
                     <input 
                       type="text"
                       value={focusText}
                       onChange={(e) => setFocusText(e.target.value)}
                       placeholder="z.B. Die Beziehung zwischen den Protagonisten..."
                       className="w-full mt-4 bg-transparent border-b border-gray-400 dark:border-zinc-600 outline-none font-serif py-2 dark:text-zinc-100"
                     />
                   )}
                </div>
              </div>

              <button 
                onClick={confirmRead}
                className="w-full mt-10 py-4 bg-gray-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-serif text-2xl hover:bg-gray-700 dark:hover:bg-white sketch-button transition-colors"
              >
                Lektüre starten &rarr;
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default BookIntro;
