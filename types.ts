
export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  description: string;
  category: string; 
  isPublicDomain: boolean; // Neu: Kennzeichnung für Original vs Retell
}

export type ReadingPreference = 'CHRONOLOGICAL' | 'FOCUSED';

export interface PhilosophyTheme {
  id: string;
  title: string;
  description: string;
  prompt: string; 
}

export interface ChatTopic {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export enum AppMode {
  INTRO = 'INTRO',
  LIBRARY = 'LIBRARY',
  PHILOSOPHY_MENU = 'PHILOSOPHY_MENU',
  CHAT_MENU = 'CHAT_MENU',
  QUIZ_MENU = 'QUIZ_MENU',
  COUCH_TALK = 'COUCH_TALK',
  CHAT = 'CHAT',
  QUIZ = 'QUIZ',
  REPLAY = 'REPLAY',
  READ = 'READ',
  RANDOM_DISCOVERY = 'RANDOM_DISCOVERY'
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuizFocus = 'PLOT' | 'SYMBOLISM' | 'GENERAL';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ReplayState {
  currentSceneText: string;
  imageUrl?: string;
  choices: string[];
  history: string[];
}

export interface DiscoveryFragment {
  text: string;
  keywords: string[];
  imagePrompt: string;
  sourceInfo?: string;
}
