
import React, { useState, useEffect } from 'react';
import { Book, AppMode, PhilosophyTheme, ChatTopic, Difficulty, QuizFocus, ReadingPreference } from './types';
import Layout from './components/Layout';
import IntroView, { Intent } from './components/IntroView';
import BookSelector from './components/BookSelector';
import ChatInterface from './components/ChatInterface';
import QuizMode from './components/QuizMode';
import StoryReplay from './components/StoryReplay';
import ReadMode from './components/ReadMode';
import BookIntro from './components/BookIntro';
import PhilosophyMenu from './components/PhilosophyMenu';
import CouchTalkMenu from './components/CouchTalkMenu';
import ChatMenu from './components/ChatMenu';
import QuizGlobalMenu from './components/QuizGlobalMenu';
import RandomDiscovery from './components/RandomDiscovery';
import { getRecommendedBooks, getRecommendedBooksCategorized } from './services/gemini';
import { persistence } from './services/persistence';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.INTRO);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<PhilosophyTheme | string | null>(null);
  const [selectedChatTopic, setSelectedChatTopic] = useState<ChatTopic | string | null>(null);
  const [quizTopic, setQuizTopic] = useState<{title: string, difficulty: Difficulty, focus: QuizFocus} | null>(null);
  
  const [readPref, setReadPref] = useState<ReadingPreference | undefined>(undefined);
  const [focusText, setFocusText] = useState<string | undefined>(undefined);

  const [categorizedBooks, setCategorizedBooks] = useState<{classics: Book[], contemporary: Book[], nonEuropean: Book[]} | null>(null);
  const [generalBooks, setGeneralBooks] = useState<Book[] | null>(null);
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

  const [pendingMode, setPendingMode] = useState<AppMode | null>(null);
  const [currentIntent, setCurrentIntent] = useState<Intent | null>(null);

  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('literaSkizze_nightMode');
    return saved === 'true';
  });

  useEffect(() => {
    if (isNightMode) {
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('literaSkizze_nightMode', String(isNightMode));
  }, [isNightMode]);

  // Lokale Bücher beim Start laden
  useEffect(() => {
    const loadLocal = async () => {
      const stored = await persistence.getAllBooks();
      setLocalBooks(stored);
    };
    loadLocal();
  }, []);

  const toggleNightMode = () => setIsNightMode(prev => !prev);

  const handleIntent = (intent: Intent) => {
    setCurrentIntent(intent);
    if (intent === 'QUIZ' || intent === 'REPLAY') {
       loadLibraryData(intent);
    }
    switch (intent) {
      case 'COUCH_TALK': setMode(AppMode.COUCH_TALK); break;
      case 'QUIZ': setMode(AppMode.QUIZ_MENU); break;
      case 'REPLAY': setPendingMode(AppMode.REPLAY); setMode(AppMode.LIBRARY); break;
      case 'RANDOM': setMode(AppMode.RANDOM_DISCOVERY); break;
      default: setMode(AppMode.INTRO); break;
    }
  };

  const loadLibraryData = async (intent: string) => {
    setIsLoadingLibrary(true);
    setCategorizedBooks(null);
    setGeneralBooks(null);
    try {
      if (intent === 'REPLAY') {
        const data = await getRecommendedBooksCategorized();
        setCategorizedBooks(data);
      } else {
        const recs = await getRecommendedBooks(intent);
        setGeneralBooks(recs);
      }
    } catch (error: any) {
      console.error("Failed to load library data", error);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const handleBackToLibrary = () => {
    // Wenn wir zurückgehen, aktualisieren wir auch die lokale Liste (falls was neues dazu kam)
    persistence.getAllBooks().then(setLocalBooks);

    if (mode === AppMode.COUCH_TALK || mode === AppMode.QUIZ_MENU || mode === AppMode.RANDOM_DISCOVERY) {
      setMode(AppMode.INTRO);
    } else if (mode === AppMode.CHAT_MENU || mode === AppMode.PHILOSOPHY_MENU) {
      setMode(AppMode.COUCH_TALK);
    } else if (mode === AppMode.CHAT) {
      if (selectedTheme) setMode(AppMode.PHILOSOPHY_MENU);
      else if (selectedChatTopic) setMode(AppMode.CHAT_MENU);
      else if (selectedBook) setMode(AppMode.LIBRARY);
      else setMode(AppMode.COUCH_TALK);
      
      setSelectedChatTopic(null);
      setSelectedTheme(null);
    } else if (mode === AppMode.QUIZ && quizTopic) {
      setMode(AppMode.QUIZ_MENU);
      setQuizTopic(null);
    } else if (mode !== AppMode.LIBRARY && selectedBook) {
       setMode(AppMode.LIBRARY); 
    } else if (mode === AppMode.LIBRARY && selectedBook) {
      setSelectedBook(null);
    } else {
      setCategorizedBooks(null);
      setGeneralBooks(null);
      setMode(AppMode.INTRO);
    }
  };

  const renderContent = () => {
    if (mode === AppMode.INTRO) return <IntroView onSelectIntent={handleIntent} />;
    if (mode === AppMode.RANDOM_DISCOVERY) return <RandomDiscovery onBack={handleBackToLibrary} />;
    
    if (mode === AppMode.COUCH_TALK) {
        return <CouchTalkMenu 
                  onSelectType={(type) => {
                      if (type === 'LITERATURE') setMode(AppMode.CHAT_MENU);
                      else if (type === 'PHILOSOPHY') setMode(AppMode.PHILOSOPHY_MENU);
                  }} 
                  onStartFreeTalk={(topic) => {
                      setSelectedChatTopic(topic);
                      setMode(AppMode.CHAT);
                  }}
                  onBack={handleBackToLibrary} 
                />;
    }

    if (mode === AppMode.PHILOSOPHY_MENU) {
        return <PhilosophyMenu 
                onSelectTheme={(t) => { setSelectedTheme(t); setMode(AppMode.CHAT); }} 
                onBack={handleBackToLibrary}
               />;
    }
    
    if (mode === AppMode.CHAT_MENU) {
        return <ChatMenu onSelectTopic={(t) => { setSelectedChatTopic(t); setMode(AppMode.CHAT); }} onBack={handleBackToLibrary} />;
    }
    
    if (mode === AppMode.QUIZ_MENU) {
        return <QuizGlobalMenu onStartQuiz={(title, diff, focus) => { setQuizTopic({title, difficulty: diff, focus}); setMode(AppMode.QUIZ); }} onSelectSpecificBook={() => { setPendingMode(AppMode.QUIZ); setMode(AppMode.LIBRARY); }} onBack={handleBackToLibrary} />;
    }
    
    if (mode === AppMode.LIBRARY) {
      if (selectedBook) return (
        <BookIntro 
          book={selectedBook} 
          onSelectMode={(m, p, f) => { 
            setMode(m); 
            setReadPref(p); 
            setFocusText(f);
          }} 
          onBack={handleBackToLibrary} 
        />
      );
      return (
        <div className="animate-fade-in">
          <button onClick={handleBackToLibrary} className="mb-6 font-hand text-xl hover:underline dark:text-zinc-400">&larr; Zurück</button>
          
          {/* Lokale Sammlung anzeigen, falls vorhanden */}
          {localBooks.length > 0 && !isLoadingLibrary && (
             <div className="mb-12">
                <div className="mb-6 pl-2 border-l-4 border-green-500 dark:border-green-700">
                  <h2 className="text-3xl font-serif italic text-gray-700 dark:text-zinc-300">Deine lokale Sammlung</h2>
                  <p className="font-hand text-xl text-gray-500 dark:text-zinc-500">Diese Werke sind offline verfügbar</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {localBooks.map(book => (
                    <div key={book.id + "_local"} className="relative">
                      <div className="absolute -top-2 -right-2 z-10 bg-green-500 text-white p-1 rounded-full shadow-lg text-xs" title="Offline verfügbar">✓</div>
                      <BookSelector 
                        onSelectBook={setSelectedBook}
                        persistentGeneral={[book]}
                        isLoading={false}
                        hideSearch
                      />
                    </div>
                  ))}
                </div>
                <div className="w-full h-px border-b border-dashed border-gray-300 dark:border-zinc-800 my-12" />
             </div>
          )}

          <BookSelector 
            onSelectBook={setSelectedBook} 
            intent={currentIntent as any}
            persistentCategorized={categorizedBooks}
            persistentGeneral={generalBooks}
            isLoading={isLoadingLibrary}
          />
        </div>
      );
    }
    
    if (mode === AppMode.CHAT) {
        const title = (typeof selectedTheme === 'string' ? selectedTheme : selectedTheme?.title) || 
                      (typeof selectedChatTopic === 'string' ? selectedChatTopic : selectedChatTopic?.title) || 
                      selectedBook?.title || "";
        const subtitle = (typeof selectedTheme === 'string' ? 'Philosophische Erörterung' : selectedTheme?.description) || 
                         (typeof selectedChatTopic === 'string' ? 'Literarische Debatte' : selectedChatTopic?.description) || 
                         selectedBook?.author;
        return <ChatInterface context={{ type: (selectedBook || selectedChatTopic) ? 'BOOK' : 'THEME', title, subtitle }} onBack={handleBackToLibrary} />;
    }
    
    switch (mode) {
      case AppMode.QUIZ: return <QuizMode book={selectedBook} topicOverride={quizTopic?.title} difficultyOverride={quizTopic?.difficulty} focusOverride={quizTopic?.focus} onBack={handleBackToLibrary} />;
      case AppMode.REPLAY: return selectedBook ? <StoryReplay book={selectedBook} onBack={handleBackToLibrary} /> : null;
      case AppMode.READ: return selectedBook ? (
        <ReadMode 
          book={selectedBook} 
          onBack={handleBackToLibrary} 
          isNightMode={isNightMode} 
          toggleNightMode={toggleNightMode}
          preference={readPref}
          focusText={focusText}
        />
      ) : null;
      default: return <div>Modus nicht gefunden</div>;
    }
  };

  return (
    <Layout 
      onNavigate={handleBackToLibrary} 
      isNightMode={isNightMode} 
      toggleNightMode={toggleNightMode}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
