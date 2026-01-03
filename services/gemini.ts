
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION_BASE } from '../constants';
import { QuizQuestion, Book, Difficulty, QuizFocus, DiscoveryFragment, ReadingPreference } from '../types';
import { appCache } from './cache';
import { persistence } from './persistence';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key nicht gefunden. Bitte prüfe die Kodierung deiner .env Datei (muss UTF-8 sein).");
  }
  return new GoogleGenAI({ apiKey });
};

// Upgrade to 'gemini-3-flash-preview' for text tasks as per guidelines
const DEFAULT_MODEL = 'gemini-3-flash-preview';

export const sendChatMessage = async (message: string, history: any[], title: string, type: 'BOOK' | 'THEME') => {
  const ai = getAiClient();
  const context = type === 'BOOK' ? `das Werk "${title}"` : `das philosophische Thema "${title}"`;
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: [
        ...history.map(h => ({ 
            role: h.role === 'user' ? 'user' : 'model', 
            parts: [{ text: h.content }] 
        })),
        { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION_BASE}\nNadine möchte mit dir über ${context} sprechen. Sei charmant und klug.`
    }
  });
  // Correctly access .text property from response
  return response.text || "";
};

const BOOK_SCHEMA_PROPERTIES = {
  id: { type: Type.STRING },
  title: { type: Type.STRING },
  author: { type: Type.STRING },
  year: { type: Type.STRING },
  description: { type: Type.STRING },
  category: { type: Type.STRING },
  isPublicDomain: { type: Type.BOOLEAN }
};

const BOOK_SCHEMA_REQUIRED = ["id", "title", "author", "year", "description", "category", "isPublicDomain"];

export const getBookDeepAnalysis = async (title: string, author: string): Promise<string> => {
  const cacheKey = `analysis_${title}_${author}`;
  const memCached = appCache.get<string>(cacheKey);
  if (memCached) return memCached;

  const dbCached = await persistence.getContent<string>(cacheKey);
  if (dbCached) {
    appCache.set(cacheKey, dbCached);
    return dbCached;
  }

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Erstelle eine tiefschürfende Analyse zu "${title}" von ${author}.`,
    config: { systemInstruction: SYSTEM_INSTRUCTION_BASE }
  });
  
  const result = response.text || "Analyse konnte nicht geladen werden.";
  appCache.set(cacheKey, result);
  await persistence.saveContent(cacheKey, result);
  return result;
};

export const getRecommendedBooksCategorized = async (): Promise<{classics: Book[], contemporary: Book[], nonEuropean: Book[]}> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Erstelle eine literarische Auswahl für die Bibliothek.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            classics: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: BOOK_SCHEMA_PROPERTIES, required: BOOK_SCHEMA_REQUIRED } },
            contemporary: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: BOOK_SCHEMA_PROPERTIES, required: BOOK_SCHEMA_REQUIRED } },
            nonEuropean: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: BOOK_SCHEMA_PROPERTIES, required: BOOK_SCHEMA_REQUIRED } }
          },
          required: ["classics", "contemporary", "nonEuropean"]
        }
      }
    });
    return JSON.parse(response.text || '{"classics":[], "contemporary":[], "nonEuropean":[]}');
};

export const getRecommendedBooks = async (intent?: string): Promise<Book[]> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Empfiehl 6 Bücher für den Bereich ${intent || 'GENERAL'}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.OBJECT, properties: BOOK_SCHEMA_PROPERTIES, required: BOOK_SCHEMA_REQUIRED }
        }
      }
    });
    return JSON.parse(response.text || '[]');
};

export const searchBooks = async (query: string): Promise<Book[]> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Suche nach: "${query}".`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.OBJECT, properties: BOOK_SCHEMA_PROPERTIES, required: BOOK_SCHEMA_REQUIRED }
        }
      }
    });
    return JSON.parse(response.text || '[]');
};

export const generateQuiz = async (topic: string, diff: Difficulty, focus: QuizFocus): Promise<QuizQuestion[]> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Erstelle ein Quiz zu "${topic}".`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctAnswerIndex: { type: Type.INTEGER }, explanation: { type: Type.STRING } }, required: ["question", "options", "correctAnswerIndex", "explanation"] }
        }
      }
    });
    return JSON.parse(response.text || '[]');
};

export const generateStorySegment = async (
  title: string, 
  context: string, 
  choice: string | null,
  deepDiveQuery?: string
): Promise<{ narrative: string, choices: string[] }> => {
    const ai = getAiClient();
    let prompt = choice ? `Entscheidung: "${choice}".` : `Lass uns "${title}" atmosphärisch nacherleben.`;
    if (deepDiveQuery) prompt = `Vertiefung: "${deepDiveQuery}".`;

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: prompt,
      config: {
        systemInstruction: `${SYSTEM_INSTRUCTION_BASE}\nNimm die Leserin mit auf eine immersive Reise.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { 
            narrative: { type: Type.STRING }, 
            choices: { type: Type.ARRAY, items: { type: Type.STRING } } 
          },
          required: ["narrative", "choices"]
        }
      }
    });
    return JSON.parse(response.text || '{"narrative": "...", "choices": []}');
};

export const getTableOfContents = async (title: string): Promise<string[]> => {
    const cacheKey = `toc_${title}`;
    const memCached = appCache.get<string[]>(cacheKey);
    if (memCached) return memCached;

    const dbCached = await persistence.getContent<string[]>(cacheKey);
    if (dbCached) {
      appCache.set(cacheKey, dbCached);
      return dbCached;
    }

    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `Inhaltsverzeichnis von "${title}".`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    const result = JSON.parse(response.text || '[]');
    appCache.set(cacheKey, result);
    await persistence.saveContent(cacheKey, result);
    return result;
};

export const getChapterContent = async (
  book: Book, 
  chap: string, 
  pref: ReadingPreference = 'CHRONOLOGICAL', 
  focusText?: string
): Promise<{ text: string, isOriginal: boolean }> => {
    const cacheKey = `content_${book.id}_${chap}_${pref}_${focusText || 'none'}`;
    const memCached = appCache.get<{text: string, isOriginal: boolean}>(cacheKey);
    if (memCached) return memCached;

    const dbCached = await persistence.getContent<{text: string, isOriginal: boolean}>(cacheKey);
    if (dbCached) {
      appCache.set(cacheKey, dbCached);
      return dbCached;
    }

    const ai = getAiClient();
    let prompt = "";
    
    if (book.isPublicDomain) {
      prompt = `GIB DEN VOLLSTÄNDIGEN ORIGINALTEXT (VERBATIM) von "${chap}" aus "${book.title}" von ${book.author} aus. 
      WICHTIG: Das Werk ist gemeinfrei. Liefere den echten Text Wort für Wort. 
      KEINE Zusammenfassungen. Gib nur den reinen literarischen Text zurück.`;
    } else {
      prompt = `Erstelle eine SEHR AUSFÜHRLICHE Nacherzählung von "${chap}" aus "${book.title}". Behalte den Stil des Autors bei.`;
    }

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL, 
      contents: prompt,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            isOriginal: { type: Type.BOOLEAN }
          },
          required: ["text", "isOriginal"]
        }
      }
    });
    
    const result = JSON.parse(response.text || '{"text": "Fehler beim Laden des Archivs.", "isOriginal": false}');
    appCache.set(cacheKey, result);
    await persistence.saveContent(cacheKey, result);
    await persistence.saveBook(book);
    return result;
};

export const generateRandomDiscovery = async (contextWord?: string): Promise<DiscoveryFragment> => {
  const ai = getAiClient();
  const prompt = contextWord ? `Interesse an: "${contextWord}".` : `Überrasche mit einem literarischen Fundstück.`;
    
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_BASE,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          sourceInfo: { type: Type.STRING }
        },
        required: ["text", "keywords"]
      }
    }
  });
  return JSON.parse(response.text || '{"text": "", "keywords": []}');
};
