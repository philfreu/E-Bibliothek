
import React, { useState } from 'react';
import { Book } from '../types';
import { searchBooks } from '../services/gemini';

interface BookSelectorProps {
  onSelectBook: (book: Book) => void;
  intent?: 'REPLAY' | 'READ' | 'CHAT' | 'QUIZ';
  persistentCategorized: {classics: Book[], contemporary: Book[], nonEuropean: Book[]} | null;
  persistentGeneral: Book[] | null;
  isLoading: boolean;
  hideSearch?: boolean; // Neue Prop
}

const BookCard: React.FC<{ book: Book; onClick: () => void }> = ({ book, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative cursor-pointer p-6 bg-white dark:bg-zinc-800 bg-opacity-60 dark:bg-opacity-40 backdrop-blur-sm sketch-border hover:bg-opacity-100 dark:hover:bg-opacity-60 transition-all duration-300 h-full flex flex-col"
  >
    <div className="absolute top-2 right-4 text-xs font-serif text-gray-400 dark:text-zinc-500 uppercase tracking-widest border-b border-gray-200 dark:border-zinc-700">
      {book.category}
    </div>
    
    <div className="mt-4 flex items-center">
       <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-tighter ${book.isPublicDomain ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'}`}>
         {book.isPublicDomain ? 'Originalwerk' : 'KI-Nacherzählung'}
       </span>
    </div>

    <h3 className="text-2xl font-bold mt-2 mb-1 group-hover:text-black dark:group-hover:text-white text-gray-800 dark:text-zinc-200">
      {book.title}
    </h3>
    <p className="text-lg font-hand text-gray-600 dark:text-zinc-400 mb-4">{book.author}</p>
    <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400 line-clamp-3 mb-4 flex-grow">
      {book.description}
    </p>
    <div className="mt-auto pt-4 border-t border-dashed border-gray-300 dark:border-zinc-700 flex justify-between items-center text-sm text-gray-500 dark:text-zinc-500">
      <span>{book.year}</span>
      <span className="group-hover:translate-x-1 transition-transform font-serif italic">Öffnen &rarr;</span>
    </div>
  </div>
);

const BookSelector: React.FC<BookSelectorProps> = ({ 
  onSelectBook, 
  intent, 
  persistentCategorized, 
  persistentGeneral, 
  isLoading,
  hideSearch = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const renderCategorySection = (title: string, subtitle: string, books: Book[]) => (
    <div className="mb-12">
      <div className="mb-6 pl-2 border-l-4 border-gray-300 dark:border-zinc-700">
        <h2 className="text-3xl font-serif italic text-gray-700 dark:text-zinc-300">{title}</h2>
        <p className="font-hand text-xl text-gray-500 dark:text-zinc-500">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <BookCard key={book.id + Math.random()} book={book} onClick={() => onSelectBook(book)} />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Search Bar */}
      {!hideSearch && (
        <div className="max-w-xl mx-auto mb-16 relative z-20">
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="In den Archiven der Weltliteratur suchen..."
              className="w-full bg-transparent border-b-2 border-gray-400 dark:border-zinc-700 py-3 pl-2 pr-12 text-2xl font-serif text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-gray-800 dark:focus:border-zinc-400 placeholder-gray-400 dark:placeholder-zinc-600 transition-colors"
            />
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-0 top-2 text-2xl text-gray-500 dark:text-zinc-500 hover:text-gray-800 dark:hover:text-zinc-200 transition-colors disabled:opacity-50"
            >
               {isSearching ? '...' : '🔍'}
            </button>
          </div>
        </div>
      )}

      {hasSearched && !hideSearch ? (
        <div className="animate-fade-in">
           <div className="flex justify-between items-center mb-8 border-b border-dashed border-gray-300 dark:border-zinc-700 pb-4">
             <h2 className="text-3xl font-serif italic text-gray-700 dark:text-zinc-300">Suchergebnisse</h2>
             <button 
                onClick={() => { setHasSearched(false); setSearchQuery(''); }}
                className="text-gray-500 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-200 font-hand text-xl underline"
             >
                Zurück zur Auswahl
             </button>
           </div>
           
           {isSearching ? (
             <div className="text-center py-20 opacity-50">
               <div className="animate-spin inline-block w-8 h-8 border-2 border-current border-t-transparent rounded-full mb-2 text-gray-500"></div>
               <p className="font-serif italic text-xl text-gray-500 dark:text-zinc-500">Der Bibliothekar durchstöbert die Regale...</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {searchResults.map(book => (
                 <BookCard key={book.id + Math.random()} book={book} onClick={() => onSelectBook(book)} />
               ))}
               {searchResults.length === 0 && <p className="col-span-full text-center font-serif py-10 dark:text-zinc-500">Keine passenden Werke gefunden.</p>}
             </div>
           )}
        </div>
      ) : (
        <div className="animate-fade-in">
          {isLoading ? (
            <div className="text-center py-20 opacity-60">
               <div className="text-5xl mb-4 animate-bounce">📚</div>
               <p className="font-hand text-2xl text-gray-500 dark:text-zinc-500 italic">Der Bibliothekar stellt eine neue Auswahl für dich zusammen...</p>
            </div>
          ) : (
            <>
              {intent === 'REPLAY' && persistentCategorized ? (
                <>
                  {renderCategorySection("Klassiker (DE & EU)", "Meisterwerke der europäischen Geistesgeschichte bis 1960", persistentCategorized.classics)}
                  <div className="w-1/2 h-px border-b border-dashed border-gray-300 dark:border-zinc-700 mx-auto mb-12" />
                  {renderCategorySection("Zeitgenössisch (ab 1960)", "Moderne deutschsprachige Stimmen und Reflexionen", persistentCategorized.contemporary)}
                  <div className="w-1/2 h-px border-b border-dashed border-gray-300 dark:border-zinc-700 mx-auto mb-12" />
                  {renderCategorySection("Außereuropäisch", "Große Erzähltraditionen aus Asien, Afrika und Amerika", persistentCategorized.nonEuropean)}
                </>
              ) : (
                <>
                  {!hideSearch && (
                    <div className="mb-6 pl-2 border-l-4 border-gray-300 dark:border-zinc-700">
                      <h2 className="text-3xl font-serif italic text-gray-700 dark:text-zinc-300">Literarische Empfehlungen</h2>
                      <p className="font-hand text-xl text-gray-500 dark:text-zinc-500">Exklusiv für deinen Besuch ausgewählt</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {persistentGeneral?.map(book => (
                      <BookCard key={book.id + Math.random()} book={book} onClick={() => onSelectBook(book)} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSelector;
