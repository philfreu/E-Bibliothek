
import React, { useState, useRef, useEffect } from 'react';
import { Book, ChatMessage, PhilosophyTheme } from '../types';
import { sendChatMessage } from '../services/gemini';

interface ChatContext {
  type: 'BOOK' | 'THEME';
  title: string;
  subtitle?: string;
}

interface ChatInterfaceProps {
  context: ChatContext;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ context, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let initialText = "";
    if (context.type === 'BOOK') {
      initialText = `Willkommen im Salon. Lass uns über "${context.title}" sprechen. Was bewegt dich an diesem Werk?`;
    } else {
      initialText = `Willkommen im Salon der Gedanken. Lass uns über das Thema "${context.title}" philosophieren. Was ist deine erste These oder Frage dazu?`;
    }

    setMessages([
      {
        role: 'model',
        content: initialText,
        timestamp: Date.now()
      }
    ]);
  }, [context]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));
      
      const responseText = await sendChatMessage(
        userMsg.content, 
        historyForApi, 
        context.title,
        context.type
      );
      
      const modelMsg: ChatMessage = { 
        role: 'model', 
        content: responseText || "Verzeihung, ich war gerade in Gedanken verloren.", 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "Ein Fehler ist aufgetreten. Bitte versuche es erneut.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-3xl mx-auto sketch-border bg-white dark:bg-zinc-800 bg-opacity-40 dark:bg-opacity-20 relative transition-colors duration-500">
      <button 
        onClick={onBack}
        className="absolute -top-12 left-0 font-hand text-xl hover:underline dark:text-zinc-400"
      >
        &larr; Zurück
      </button>

      <div className="p-4 border-b border-dashed border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 bg-opacity-50 dark:bg-opacity-40 transition-colors">
        <h2 className="text-2xl font-bold font-serif text-center dark:text-zinc-100">
          {context.type === 'BOOK' ? 'Diskussion:' : 'Philosophie:'} {context.title}
        </h2>
        {context.subtitle && (
          <p className="text-center font-hand text-gray-500 dark:text-zinc-500">{context.subtitle}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-4 rounded-sm text-lg leading-relaxed shadow-sm transition-colors
                ${msg.role === 'user' 
                  ? 'bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 border-l-2 border-gray-400 dark:border-zinc-500' 
                  : 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 border-l-2 border-orange-200 dark:border-orange-900'}`}
            >
              <p className="font-serif">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white dark:bg-zinc-800 dark:bg-opacity-40 p-4 text-gray-400 dark:text-zinc-600 font-serif italic transition-colors">
              Der Gelehrte denkt nach...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-dashed border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 bg-opacity-60 dark:bg-opacity-40 transition-colors">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Schreibe deine Gedanken auf..."
            className="flex-1 p-3 bg-transparent border-b-2 border-gray-300 dark:border-zinc-600 focus:border-gray-600 dark:focus:border-zinc-300 outline-none font-serif text-lg placeholder-gray-400 dark:placeholder-zinc-700 dark:text-zinc-200 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-6 py-2 bg-gray-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-serif hover:bg-gray-700 dark:hover:bg-white disabled:opacity-50 sketch-button"
          >
            Senden
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
