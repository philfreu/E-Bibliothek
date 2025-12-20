
import React, { useState, useEffect } from 'react';
import { Book, QuizQuestion, Difficulty, QuizFocus } from '../types';
import { generateQuiz } from '../services/gemini';

interface QuizModeProps {
  book: Book | null;
  topicOverride?: string;
  difficultyOverride?: Difficulty;
  focusOverride?: QuizFocus;
  onBack: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ book, topicOverride, difficultyOverride, focusOverride, onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(difficultyOverride || 'MEDIUM');
  const [focus, setFocus] = useState<QuizFocus>(focusOverride || 'GENERAL');
  const [isStarted, setIsStarted] = useState(!!topicOverride);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const quizTitle = topicOverride || book?.title || "Literaturquiz";

  useEffect(() => {
    if (isStarted) {
      const loadQuiz = async () => {
        setLoading(true);
        try {
          const generated = await generateQuiz(quizTitle, difficulty, focus);
          setQuestions(generated);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadQuiz();
    }
  }, [isStarted, quizTitle, difficulty, focus]);

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === questions[currentIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto relative animate-fade-in">
        <button onClick={onBack} className="absolute -top-12 left-0 font-hand text-xl hover:underline dark:text-zinc-500">&larr; Abbrechen</button>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-gray-800 dark:text-zinc-100 mb-2">Quiz-Konfiguration</h2>
          <p className="font-hand text-2xl text-gray-600 dark:text-zinc-500 italic">"{book?.title}"</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 bg-opacity-60 dark:bg-opacity-40 sketch-border p-8 md:p-12 space-y-10 transition-colors">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4 border-b border-dashed border-gray-300 dark:border-zinc-700 pb-2 dark:text-zinc-200">Schwierigkeitsgrad</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(d => (
                <button key={d} onClick={() => setDifficulty(d)} className={`p-4 font-serif text-lg border-2 transition-all ${difficulty === d ? 'border-gray-800 dark:border-zinc-300 bg-gray-100 dark:bg-zinc-700 shadow-inner text-gray-900 dark:text-white' : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'}`}>{d === 'EASY' ? 'Einfach' : d === 'MEDIUM' ? 'Normal' : 'Schwer'}</button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4 border-b border-dashed border-gray-300 dark:border-zinc-700 pb-2 dark:text-zinc-200">Schwerpunkt</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[ { id: 'GENERAL', label: 'Allgemein' }, { id: 'PLOT', label: 'Handlung' }, { id: 'SYMBOLISM', label: 'Symbolik' } ].map(f => (
                <button key={f.id} onClick={() => setFocus(f.id as QuizFocus)} className={`p-4 font-serif text-lg border-2 transition-all ${focus === f.id ? 'border-gray-800 dark:border-zinc-300 bg-gray-100 dark:bg-zinc-700 shadow-inner text-gray-900 dark:text-white' : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'}`}>{f.label}</button>
              ))}
            </div>
          </div>
          <button onClick={() => setIsStarted(true)} className="w-full py-4 bg-gray-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-serif text-2xl hover:bg-gray-700 dark:hover:bg-white sketch-button">Quiz starten &rarr;</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="animate-spin h-12 w-12 border-4 border-gray-300 dark:border-zinc-700 border-t-gray-600 dark:border-t-zinc-400 rounded-full mx-auto mb-4"/>
        <p className="font-hand text-2xl text-gray-500 dark:text-zinc-500 italic">Der Bibliothekar stellt die Fragen für "{quizTitle}" zusammen...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl dark:text-zinc-400">Es tut uns leid, das Quiz konnte nicht geladen werden.</p>
        <button onClick={onBack} className="mt-4 text-blue-600 dark:text-blue-400 underline font-serif">Zurück</button>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center p-8 sketch-border bg-white dark:bg-zinc-800 bg-opacity-50 dark:bg-opacity-40 animate-fade-in transition-colors">
        <h2 className="text-4xl font-serif mb-6 dark:text-zinc-100">Dein Ergebnis</h2>
        <p className="text-2xl mb-4 font-serif dark:text-zinc-300">Du hast {score} von {questions.length} Fragen richtig beantwortet.</p>
        <div className="w-full bg-gray-200 dark:bg-zinc-700 h-4 rounded-full mb-8 overflow-hidden border border-gray-400 dark:border-zinc-600">
          <div className="bg-gray-700 dark:bg-zinc-300 h-full transition-all duration-1000" style={{ width: `${(score / questions.length) * 100}%` }} />
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={() => { setQuestions([]); setScore(0); setCurrentIndex(0); setQuizComplete(false); setSelectedOption(null); setShowResult(false); }} className="px-6 py-2 bg-white dark:bg-zinc-800 border border-gray-400 dark:border-zinc-600 font-serif text-lg hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-zinc-200 sketch-button transition-colors">Wiederholen</button>
          <button onClick={onBack} className="px-6 py-2 bg-gray-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-serif text-lg hover:bg-gray-700 dark:hover:bg-white sketch-button transition-colors">Beenden</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  return (
    <div className="max-w-3xl mx-auto relative animate-fade-in">
      <button onClick={onBack} className="absolute -top-12 left-0 font-hand text-xl hover:underline dark:text-zinc-500">&larr; Abbrechen</button>
      <div className="sketch-border bg-white dark:bg-zinc-800 bg-opacity-60 dark:bg-opacity-40 p-8 min-h-[400px] flex flex-col transition-colors duration-500">
        <div className="flex justify-between items-center mb-6 text-gray-500 dark:text-zinc-500 font-hand text-lg border-b border-dashed border-gray-300 dark:border-zinc-700 pb-2 transition-colors">
          <span>Frage {currentIndex + 1} / {questions.length}</span>
          <span className="uppercase text-xs tracking-widest border border-gray-300 dark:border-zinc-700 px-2 py-1">{quizTitle}</span>
        </div>
        <h3 className="text-2xl font-serif font-bold mb-8 dark:text-zinc-100 transition-colors">{currentQ.question}</h3>
        <div className="space-y-4 flex-1">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedOption !== null}
              className={`w-full text-left p-4 text-lg font-serif transition-all border-2 ${selectedOption === null ? 'border-gray-200 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 dark:text-zinc-300' : idx === currentQ.correctAnswerIndex ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' : selectedOption === idx ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300' : 'border-gray-200 dark:border-zinc-700 opacity-50 dark:text-zinc-500'}`}
            >
              <span className="inline-block w-8 font-bold">{String.fromCharCode(65 + idx)}.</span> {option}
            </button>
          ))}
        </div>
        {showResult && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-gray-50 dark:bg-zinc-800/60 p-4 border-l-4 border-gray-500 dark:border-zinc-600 mb-6 italic text-gray-700 dark:text-zinc-400 font-serif transition-colors">{currentQ.explanation}</div>
            <button onClick={nextQuestion} className="w-full py-3 bg-gray-800 dark:bg-zinc-100 text-white dark:text-zinc-900 font-serif text-xl hover:bg-gray-700 dark:hover:bg-white sketch-button transition-colors">{currentIndex === questions.length - 1 ? 'Ergebnis ansehen' : 'Nächste Frage'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
