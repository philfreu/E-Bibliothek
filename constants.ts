
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
  { id: 'greek-antiquity', title: 'Griechische Antike', description: 'Epos, Tragödie und Mythos als Wiege der Literatur (ca. 800 v. Chr. – 146 v. Chr.).' },
  { id: 'roman-antiquity', title: 'Römische Antike', description: 'Rhetorik, Lyrik und die Weiterführung griechischer Traditionen (ca. 240 v. Chr. – 476 n. Chr.).' },
  { id: 'middle-ages', title: 'Mittelalter', description: 'Heldenepik, christliche Mystik und Minnesang (ca. 500 – 1500).' },
  { id: 'renaissance', title: 'Renaissance', description: 'Humanismus und die Wiederentdeckung antiker Ideale (15. – 16. Jahrhundert).' },
  { id: 'baroque', title: 'Barock', description: 'Vanitas, Memento Mori und Carpe Diem (1600–1720).' },
  { id: 'enlightenment', title: 'Aufklärung', description: 'Vernunft, Toleranz und die Erziehung des Menschengeschlechts (1720–1785).' },
  { id: 'sturm-drang', title: 'Sturm und Drang', description: 'Gefühl, Genie und Auflehnung gegen Konventionen (1765–1785).' },
  { id: 'classicism', title: 'Weimarer Klassik', description: 'Humanität, Harmonie und formale Vollendung (1786–1832).' },
  { id: 'romanticism', title: 'Romantik', description: 'Sehnsucht, Naturmystik und das Unendliche (1795–1840).' },
  { id: 'realism', title: 'Realismus', description: 'Objektive Darstellung der Wirklichkeit (1848–1890).' },
  { id: 'modernism', title: 'Moderne', description: 'Zersplitterung der Welt und radikale Neuanfänge (1890–1945).' }
];

export const PHILOSOPHICAL_THEMES: PhilosophyTheme[] = [
  {
    id: 'existentialism',
    title: 'Die Existenz',
    description: 'Über den Sinn des Lebens, Freiheit und die Absurdität des Seins.',
    prompt: 'Abstract pencil sketch representing existentialism, a lone figure in a vast empty space, minimalist, philosophical concept'
  },
  {
    id: 'ethics',
    title: 'Moral & Ethik',
    description: 'Was ist gut? Was ist böse? Die Frage nach dem richtigen Handeln.',
    prompt: 'Abstract pencil sketch representing morality, balance scales or forking paths, duality of light and shadow, minimalist'
  },
  {
    id: 'epistemology',
    title: 'Wahrheit & Erkenntnis',
    description: 'Was können wir wissen? Die Grenzen der menschlichen Wahrnehmung.',
    prompt: 'Abstract pencil sketch representing an eye opening or a light bulb in darkness, geometric shapes, truth and illusion'
  },
  {
    id: 'metaphysics',
    title: 'Zeit & Raum',
    description: 'Die Struktur der Realität, Unendlichkeit und das Wesen des Universums.',
    prompt: 'Abstract pencil sketch representing time, melting clocks or hourglass, cosmic spiral, metaphysical concept'
  },
  {
    id: 'politics',
    title: 'Politik & Staat',
    description: 'Macht, Gerechtigkeit und die Frage nach dem idealen Zusammenleben.',
    prompt: 'Abstract pencil sketch representing political philosophy, columns of a forum, scales of justice, minimalist'
  },
  {
    id: 'aesthetics',
    title: 'Ästhetik & Kunst',
    description: 'Was ist das Schöne? Die Rolle der Kunst in der menschlichen Erfahrung.',
    prompt: 'Abstract pencil sketch representing aesthetics, a blooming flower merging with geometric patterns, artistic vision'
  }
];

export const DISCUSSION_TOPICS: ChatTopic[] = [
  {
    id: 'heroes',
    title: 'Heldenbilder',
    description: 'Vom antiken Halbgott zum gebrochenen Antihelden der Moderne.',
    prompt: 'Pencil sketch of a knight looking at his reflection in a modern mirror, cracked glass, literary evolution'
  },
  {
    id: 'nature',
    title: 'Mensch & Natur',
    description: 'Die Natur als Spiegel der Seele in der Romantik und Bedrohung heute.',
    prompt: 'Pencil sketch of a dark stormy forest reflecting a human face in the clouds, romanticism style'
  },
  {
    id: 'women',
    title: 'Frauenrollen',
    description: 'Starke Frauenfiguren und gesellschaftliche Zwänge in der Klassik.',
    prompt: 'Sketch of a quill pen and a broken corset, literary symbols of female liberation'
  }
];

export const SYSTEM_INSTRUCTION_BASE = `Du bist ein gebildeter, eloquenter und freundlicher Literaturwissenschaftler und Philosoph. 
Du sprichst ausschließlich Deutsch. Dein Stil ist anspruchsvoll, aber verständlich. Du duzt dein Gegenüber stets freundlich und respektvoll. 
Du liebst es, die tiefere Bedeutung, Symbolik und philosophischen Hintergründe zu diskutieren.`;
