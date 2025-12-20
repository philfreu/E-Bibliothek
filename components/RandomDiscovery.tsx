
import React, { useState, useEffect } from 'react';
import { DiscoveryFragment } from '../types';
import { generateRandomDiscovery } from '../services/gemini';

interface RandomDiscoveryProps {
  onBack: () => void;
}

const RandomDiscovery: React.FC<RandomDiscoveryProps> = ({ onBack }) => {
  const [fragment, setFragment] = useState<DiscoveryFragment | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDiscovery = async (keyword?: string) => {
    setLoading(true);
    try {
      const data = await generateRandomDiscovery(keyword);
      setFragment(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscovery();
  }, []);

  const renderTextWithKeywords = (text: string, keywords: string[]): (string | React.ReactNode)[] => {
    if (!text) return [];
    
    let parts: (string | React.ReactNode)[] = [text];
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

    sortedKeywords.forEach(keyword => {
      const newParts: (string | React.ReactNode)[] = [];
      parts.forEach(part => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }

        // Case-insensitive matching for keywords
        const regex = new RegExp(`(${keyword})`, 'gi');
        const subParts = part.split(regex);
        
        subParts.forEach((sub, i) => {
          if (sub.toLowerCase() === keyword.toLowerCase()) {
            newParts.push(
              <button
                key={`${keyword}-${i}-${Math.random()}`}
                onClick={() => loadDiscovery(sub)}
                className="relative inline-block px-1 group cursor-pointer align-baseline"
              >
                <span className="relative z-10 font-bold text-gray-900 dark:text-zinc-100 border-b-2 border-gray-400 dark:border-zinc-600 group-hover:border-gray-800 dark:group-hover:border-zinc-300 transition-colors italic">{sub}</span>
                <span className="absolute -inset-1 bg-yellow-100 dark:bg-yellow-900 bg-opacity-0 group-hover:bg-opacity-30 dark:group-hover:bg-opacity-20 rounded-sm transition-all -z-10" />
              </button>
            );
          } else {
            newParts.push(sub);
          }
        });
      });
      parts = newParts;
    });

    return parts;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative animate-fade-in">
      <button 
        onClick={onBack}
        className="absolute top-0 left-4 font-hand text-xl hover:underline z-10 dark:text-zinc-400 transition-colors"
      >
        &larr; Reise beenden
      </button>

      <div className="bg-white dark:bg-zinc-800 bg-opacity-80 dark:bg-opacity-40 p-8 md:p-16 lg:p-24 sketch-border shadow-sm min-h-[700px] flex flex-col justify-center relative transition-colors duration-500 overflow-hidden">
         <div className="absolute top-8 right-12 font-hand text-gray-300 dark:text-zinc-700 text-3xl rotate-3 select-none">
            Manuskript #{Math.floor(Math.random() * 9999)}
         </div>
         
         {loading ? (
           <div className="space-y-6 py-10 w-full max-w-4xl mx-auto">
             <div className="animate-pulse flex items-center justify-center mb-16">
               <div className="text-7xl dark:text-zinc-600">✒</div>
             </div>
             {[...Array(15)].map((_, i) => (
               <div 
                 key={i} 
                 className="h-3 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse mx-auto" 
                 style={{ 
                    width: `${Math.random() * 40 + 55}%`,
                    animationDelay: `${i * 0.1}s`
                 }} 
               />
             ))}
             <p className="text-center font-hand text-3xl text-gray-400 dark:text-zinc-600 mt-12 italic animate-pulse">
                In den Tiefen der Archive wird ein vergessenes Fragment gesichtet...
             </p>
           </div>
         ) : (
           <div className="animate-fade-in text-center w-full">
              <div className="text-xl md:text-2xl lg:text-3xl font-serif leading-relaxed text-gray-800 dark:text-zinc-200 text-justify max-w-4xl mx-auto first-letter:text-8xl first-letter:font-bold first-letter:mr-4 first-letter:float-left first-letter:text-gray-900 dark:first-letter:text-white transition-colors">
                {renderTextWithKeywords(fragment?.text || "", fragment?.keywords || [])}
              </div>
              
              {fragment?.sourceInfo && (
                <div className="mt-16 text-center opacity-50 border-t border-dashed border-gray-200 dark:border-zinc-700 pt-6">
                  <p className="font-hand text-gray-500 dark:text-zinc-500 text-3xl">
                    &mdash; {fragment.sourceInfo}
                  </p>
                </div>
              )}

              <div className="mt-24 pt-10 border-t-2 border-dashed border-gray-300 dark:border-zinc-700 transition-colors">
                <p className="font-hand text-4xl text-gray-500 dark:text-zinc-500 italic">
                  Ein Wort erregt dein Interesse? Folge dem Pfad...
                </p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default RandomDiscovery;
