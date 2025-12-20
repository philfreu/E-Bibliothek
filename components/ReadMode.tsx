
import React, { useState, useEffect } from 'react';
import { Book, ReadingPreference } from '../types';
import { getTableOfContents, getChapterContent } from '../services/gemini';

interface ReadModeProps {
  book: Book;
  onBack: () => void;
  isNightMode: boolean;
  toggleNightMode: () => void;
  preference?: ReadingPreference;
  focusText?: string;
}

const WORDS_PER_PAGE = 800; 

const ReadMode: React.FC<ReadModeProps> = ({ book, onBack, isNightMode, toggleNightMode, preference, focusText }) => {
  const [chapters, setChapters] = useState<string[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(-1);
  const [isOriginal, setIsOriginal] = useState<boolean>(false);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  const [tocLoading, setTocLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [showToc, setShowToc] = useState(true);

  useEffect(() => {
    const loadToc = async () => {
      try {
        const list = await getTableOfContents(book.title);
        setChapters(list);
      } catch (e) {
        console.error(e);
        setChapters(["Einleitung", "Kapitel 1", "Kapitel 2", "Kapitel 3", "Schluss"]);
      } finally {
        setTocLoading(false);
      }
    };
    loadToc();
  }, [book]);

  useEffect(() => {
    if (currentChapterIndex === -1) return;

    const loadContent = async () => {
      setContentLoading(true);
      setPages([]);
      setCurrentPageIndex(0);
      try {
        const data = await getChapterContent(book, chapters[currentChapterIndex], preference, focusText);
        setIsOriginal(data.isOriginal);
        
        // Verbesserte Seiteneinteilung (nach Absätzen, wenn möglich)
        const paragraphs = data.text.split('\n\n');
        const newPages = [];
        let currentString = "";
        
        for (const para of paragraphs) {
          if ((currentString + para).split(/\s+/).length > WORDS_PER_PAGE) {
            newPages.push(currentString.trim());
            currentString = para + "\n\n";
          } else {
            currentString += para + "\n\n";
          }
        }
        if (currentString) newPages.push(currentString.trim());
        
        setPages(newPages.length > 0 ? newPages : [data.text]);
      } catch (e) {
        console.error(e);
        setPages(["Inhalt konnte nicht geladen werden. Bitte versuche es noch einmal."]);
      } finally {
        setContentLoading(false);
      }
    };
    loadContent();
  }, [currentChapterIndex, book, chapters, preference, focusText]);

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(p => p + 1);
    } else if (direction === 'prev' && currentPageIndex > 0) {
      setCurrentPageIndex(p => p - 1);
    }
  };

  const themeClasses = isNightMode 
    ? "bg-zinc-900 text-zinc-300" 
    : "bg-paper text-gray-800";

  const headerClasses = isNightMode
    ? "bg-zinc-800 border-zinc-700"
    : "bg-white bg-opacity-60 border-gray-300";

  const sidebarClasses = isNightMode
    ? "bg-zinc-800 border-zinc-700 bg-opacity-40"
    : "bg-gray-50 border-gray-300 bg-opacity-50";

  const activeChapterClass = isNightMode
    ? "bg-zinc-700 text-white font-bold"
    : "bg-gray-200/50 font-bold";

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-colors duration-500 ${themeClasses}`}> 
       <div className={`absolute inset-0 -z-10 pointer-events-none opacity-20 mix-blend-multiply ${isNightMode ? 'invert brightness-[0.2]' : ''}`} 
            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')", backgroundSize: '500px auto' }}></div> 

       <div className={`h-16 border-b flex items-center justify-between px-4 flex-shrink-0 backdrop-blur-sm z-20 ${headerClasses}`}>
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="font-hand text-xl hover:underline">
              &larr; Zurück
            </button>
            {!contentLoading && currentChapterIndex > -1 && (
               <span className={`hidden sm:inline-block px-3 py-1 rounded text-xs font-serif uppercase tracking-widest border ${isOriginal ? 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/40 dark:border-green-800 dark:text-green-300' : 'bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-900/40 dark:border-orange-800 dark:text-orange-300'}`}>
                 {isOriginal ? '✨ Originaltext' : '📖 Nacherzählung'}
               </span>
            )}
          </div>
          
          <h2 className="font-serif font-bold text-xl truncate px-4 hidden sm:block">
             {book.title} <span className="font-normal text-gray-400 mx-2">|</span> 
             {currentChapterIndex > -1 ? chapters[currentChapterIndex] : 'Inhaltsverzeichnis'}
          </h2>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleNightMode} 
              className={`p-2 rounded-full transition-colors ${isNightMode ? 'hover:bg-zinc-700 text-yellow-400' : 'hover:bg-gray-200 text-zinc-500'}`}
              title={isNightMode ? "Tagmodus" : "Nachtmodus"}
            >
              {isNightMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setShowToc(!showToc)} className="md:hidden font-serif border border-current px-2 py-1 text-sm rounded">
               {showToc ? 'Text' : 'Kapitel'}
            </button>
          </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          <div className={`
             ${showToc ? 'block' : 'hidden'} md:block 
             w-full md:w-80 border-r overflow-y-auto p-6 flex-shrink-0 backdrop-blur-sm z-10 ${sidebarClasses}
          `}>
             <h3 className="font-serif font-bold text-lg mb-4 text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-center md:text-left">Kapitelwahl</h3>
             {tocLoading ? (
               <div className="animate-pulse space-y-3">
                 <div className={`h-4 rounded w-3/4 ${isNightMode ? 'bg-zinc-700' : 'bg-gray-200'}`}></div>
                 <div className={`h-4 rounded w-1/2 ${isNightMode ? 'bg-zinc-700' : 'bg-gray-200'}`}></div>
                 <div className={`h-4 rounded w-5/6 ${isNightMode ? 'bg-zinc-700' : 'bg-gray-200'}`}></div>
               </div>
             ) : (
               <ul className="space-y-1 font-serif text-lg">
                 {chapters.map((chap, idx) => (
                   <li key={idx}>
                     <button 
                       onClick={() => { setCurrentChapterIndex(idx); setShowToc(false); }}
                       className={`text-left w-full p-2 hover:bg-opacity-80 rounded transition-colors ${currentChapterIndex === idx ? activeChapterClass : ''}`}
                     >
                       {chap}
                     </button>
                   </li>
                 ))}
               </ul>
             )}
          </div>

          <div className="flex-1 overflow-y-auto flex justify-center p-6 md:p-12 relative">
             <div className="max-w-4xl w-full h-full flex flex-col">
                {currentChapterIndex === -1 ? (
                   <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 font-hand text-3xl opacity-60">
                      <div className="text-7xl mb-6">📖</div>
                      <p>Wähle ein Kapitel aus, um mit der Lektüre zu beginnen.</p>
                   </div>
                ) : contentLoading ? (
                   <div className="flex flex-col items-center justify-center h-full">
                      <div className={`animate-spin h-8 w-8 border-4 rounded-full mb-4 border-t-transparent ${isNightMode ? 'border-zinc-700' : 'border-gray-300'}`}></div>
                      <p className="font-serif italic text-gray-400">Das Archiv wird durchstöbert...</p>
                   </div>
                ) : (
                  <div className="flex flex-col flex-1">
                     <div className={`font-serif text-2xl leading-relaxed text-justify tracking-wide mb-12 max-w-2xl mx-auto ${isNightMode ? 'text-zinc-300' : 'text-gray-800'}`}>
                        {currentPageIndex === 0 && (
                            <span className={`float-left text-8xl font-bold mr-4 mt-[-8px] font-serif ${isNightMode ? 'text-zinc-100' : 'text-gray-900'}`}>{pages[0]?.charAt(0)}</span>
                        )}
                        <div className="whitespace-pre-wrap">
                          {currentPageIndex === 0 ? pages[0]?.slice(1) : pages[currentPageIndex]}
                        </div>
                     </div>

                     <div className="mt-auto pt-6 border-t border-dashed border-gray-400 flex justify-between items-center text-gray-500 font-hand text-2xl select-none max-w-2xl mx-auto w-full">
                        <button 
                          onClick={() => handlePageChange('prev')}
                          disabled={currentPageIndex === 0}
                          className="hover:text-current disabled:opacity-30 flex items-center gap-1 transition-colors"
                        >
                          &larr; Vorherige
                        </button>
                        <span>Blatt {currentPageIndex + 1} / {pages.length}</span>
                        <button 
                          onClick={() => handlePageChange('next')}
                          disabled={currentPageIndex === pages.length - 1}
                          className="hover:text-current disabled:opacity-30 flex items-center gap-1 transition-colors"
                        >
                          Nächste &rarr;
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default ReadMode;
