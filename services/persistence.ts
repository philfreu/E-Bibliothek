
import { Book } from '../types';

const DB_NAME = 'NadinesBibliothekDB';
const DB_VERSION = 1;
const STORES = {
  BOOKS: 'books',
  CONTENT: 'content', // TOCs, Analysen, Kapitel
};

class PersistenceService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORES.BOOKS)) {
          db.createObjectStore(STORES.BOOKS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.CONTENT)) {
          db.createObjectStore(STORES.CONTENT);
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async getDB(): Promise<IDBDatabase> {
    if (!this.db) await this.init();
    return this.db!;
  }

  async saveBook(book: Book): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction(STORES.BOOKS, 'readwrite');
    tx.objectStore(STORES.BOOKS).put(book);
    return new Promise((res) => (tx.oncomplete = () => res()));
  }

  async getAllBooks(): Promise<Book[]> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.BOOKS, 'readonly');
      const request = tx.objectStore(STORES.BOOKS).getAll();
      request.onsuccess = () => resolve(request.result);
    });
  }

  async saveContent(key: string, data: any): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction(STORES.CONTENT, 'readwrite');
    tx.objectStore(STORES.CONTENT).put(data, key);
    return new Promise((res) => (tx.oncomplete = () => res()));
  }

  async getContent<T>(key: string): Promise<T | null> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.CONTENT, 'readonly');
      const request = tx.objectStore(STORES.CONTENT).get(key);
      request.onsuccess = () => resolve(request.result || null);
    });
  }
}

export const persistence = new PersistenceService();
