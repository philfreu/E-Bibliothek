
import React from 'react';

export type Intent = 'COUCH_TALK' | 'QUIZ' | 'REPLAY' | 'RANDOM';

interface IntroViewProps {
  onSelectIntent: (intent: Intent) => void;
}

const SketchCouchTalk = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-charcoal dark:text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15,70 L85,70 L85,55 C85,45 75,40 65,40 L35,40 C25,40 15,45 15,55 Z" />
    <path d="M15,70 L15,80 M85,70 L85,80" />
    <path d="M25,40 C25,30 35,25 50,25 C65,25 75,30 75,40" />
    <path d="M60,20 Q80,5 90,25 Q95,45 80,55 L70,50" strokeDasharray="3,3" className="opacity-60" />
    <circle cx="80" cy="30" r="1.5" fill="currentColor" stroke="none" className="animate-pulse" />
  </svg>
);

const SketchQuiz = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-charcoal dark:text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30,15 Q80,10 75,25 Q70,40 75,85 Q40,90 25,85 Q20,30 30,15" />
    <path d="M30,15 Q25,25 35,25 Q70,20 75,25" />
    <path d="M25,85 Q30,75 40,75 Q70,80 75,85" />
    <path d="M50,35 Q65,30 65,45 Q65,58 50,62" />
    <path d="M50,72 L50,74" strokeWidth="3.5" />
  </svg>
);

const SketchReplay = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-charcoal dark:text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10,45 Q30,45 50,65 Q70,45 90,45 L90,85 Q70,85 50,98 Q30,85 10,85 Z" />
    <path d="M50,65 L50,98" />
    <path d="M15,50 Q30,50 45,65" className="opacity-60" />
    <path d="M85,50 Q70,50 55,65" className="opacity-60" />
    <path d="M30,25 Q40,15 50,25 Q60,15 70,25" strokeDasharray="3,3" />
  </svg>
);

const SketchRandom = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-charcoal dark:text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M25,40 L45,30 L75,40 L55,55 Z" />
    <path d="M25,40 L25,70 L55,85 L55,55" />
    <path d="M75,40 L75,70 L55,85" />
    <circle cx="50" cy="42" r="3" fill="currentColor" stroke="none" />
    <circle cx="35" cy="60" r="3" fill="currentColor" stroke="none" />
    <circle cx="65" cy="60" r="3" fill="currentColor" stroke="none" />
  </svg>
);

const IntentCard: React.FC<{ 
  title: string; 
  Sketch: React.FC; 
  description: string; 
  onClick: () => void;
  delay?: string;
}> = ({ title, Sketch, description, onClick, delay = '0s' }) => (
  <button 
    onClick={onClick}
    style={{ animationDelay: delay }}
    className="group relative flex flex-col items-center text-center p-8 bg-white dark:bg-zinc-800 bg-opacity-70 dark:bg-opacity-40 sketch-border hover:bg-opacity-100 dark:hover:bg-opacity-60 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg animate-fade-in opacity-0"
  >
    <div className="w-28 h-28 mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out">
        <Sketch />
    </div>
    <h3 className="text-3xl font-serif font-bold mb-3 text-gray-800 dark:text-zinc-100 border-b-2 border-transparent group-hover:border-gray-300 dark:group-hover:border-zinc-600 pb-1 transition-colors">
      {title}
    </h3>
    <p className="font-hand text-2xl text-gray-600 dark:text-zinc-400 leading-tight">
      {description}
    </p>
  </button>
);

const IntroView: React.FC<IntroViewProps> = ({ onSelectIntent }) => {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-16 animate-fade-in px-4">
        <h2 className="text-5xl md:text-7xl font-serif italic text-gray-800 dark:text-zinc-100 mb-6 transition-colors">
          Was bewegt deinen Geist heute?
        </h2>
        <div className="w-48 h-1 bg-gray-400 dark:bg-zinc-700 mx-auto rounded-full mb-6 opacity-40 transition-colors"></div>
        <p className="text-2xl font-hand text-gray-500 dark:text-zinc-500">
          Wähle deinen Pfad durch die Bibliothek der Gedanken.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        <IntentCard 
          title="Couchgespräch" 
          Sketch={SketchCouchTalk}
          description="Ein tiefer Austausch über Literatur, Philosophie oder deine eigenen Thesen."
          onClick={() => onSelectIntent('COUCH_TALK')}
          delay="0.1s"
        />
        <IntentCard 
          title="Wissen testen" 
          Sketch={SketchQuiz}
          description="Stelle deine Kenntnisse in einem anspruchsvollen Quiz auf die Probe."
          onClick={() => onSelectIntent('QUIZ')}
          delay="0.2s"
        />
        <IntentCard 
          title="Geschichte erleben" 
          Sketch={SketchReplay}
          description="Tauche interaktiv in ein Nach-Erleben großer Werke ein."
          onClick={() => onSelectIntent('REPLAY')}
          delay="0.3s"
        />
        <IntentCard 
          title="Zufalls-Pfad" 
          Sketch={SketchRandom}
          description="Lass dich von Wort zu Wort durch die Literaturgeschichte treiben."
          onClick={() => onSelectIntent('RANDOM')}
          delay="0.4s"
        />
      </div>
    </div>
  );
};

export default IntroView;
