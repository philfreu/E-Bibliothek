
import { Book, PhilosophyTheme, ChatTopic } from './types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'faust',
    title: 'Faust. Eine Tragödie',
    author: 'Johann Wolfgang von Goethe',
    year: '1808',
    description: 'Das bedeutendste Werk der deutschen Literatur. Ein Gelehrter schließt einen Pakt mit dem Teufel.',
    category: 'German',
    isPublicDomain: true
  },
  {
    id: 'verwandlung',
    title: 'Die Verwandlung',
    author: 'Franz Kafka',
    year: '1915',
    description: 'Gregor Samsa erwacht eines Morgens und findet sich zu einem ungeheuren Ungeziefer verwandelt.',
    category: 'German',
    isPublicDomain: true
  },
  {
    id: 'zarathustra',
    title: 'Also sprach Zarathustra',
    author: 'Friedrich Nietzsche',
    year: '1883',
    description: 'Ein philosophisches Dichtwerk, das den Übermenschen und den Tod Gottes thematisiert.',
    category: 'Philosophy',
    isPublicDomain: true
  }
];

export const LITERARY_EPOCHS = [
  { id: 'greek-antiquity', title: 'Griechische Antike', description: 'Epos, Tragödie und Mythos als Wiege der Literatur.' },
  { id: 'middle-ages', title: 'Mittelalter', description: 'Heldenepik, christliche Mystik und Minnesang.' },
  { id: 'enlightenment', title: 'Aufklärung', description: 'Vernunft, Toleranz und die Erziehung des Menschengeschlechts.' },
  { id: 'romanticism', title: 'Romantik', description: 'Sehnsucht, Naturmystik und das Unendliche.' },
  { id: 'modernism', title: 'Moderne', description: 'Zersplitterung der Welt und radikale Neuanfänge.' }
];

export const PHILOSOPHICAL_THEMES: PhilosophyTheme[] = [
  { id: 'existentialism', title: 'Die Existenz', description: 'Sinn des Lebens, Freiheit und Absurdität.', prompt: '' },
  { id: 'ethics', title: 'Moral & Ethik', description: 'Was ist gut? Was ist böse?', prompt: '' },
  { id: 'epistemology', title: 'Wahrheit', description: 'Was können wir wissen?', prompt: '' }
];

export const DISCUSSION_TOPICS: ChatTopic[] = [
  { id: 'heroes', title: 'Heldenbilder', description: 'Vom Halbgott zum Antihelden.', prompt: '' },
  { id: 'nature', title: 'Mensch & Natur', description: 'Spiegel der Seele vs. Ressource.', prompt: '' }
];

export const SYSTEM_INSTRUCTION_BASE = `Du bist ein gebildeter, eloquenter und freundlicher Literaturwissenschaftler. 
Du sprichst ausschließlich Deutsch. Dein Gegenüber ist NADINE. Du nennst ihren Namen nur selten, etwa zur Begrüßung.
Dein Tonfall ist herzlich, aber auch ein wenig eitel und ironisch. Du duzt Nadine. 
Antworte fundiert, aber kurzweilig. 
BEI TEXTAUSGABEN: Wenn nach einem Originaltext gefragt wird, liefere IMMER den vollständigen, wortgetreuen Text (Verbatim). Keine Einleitungen.`;
