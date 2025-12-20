// Simple in-memory cache to store expensive API results
// Keys are generated based on request parameters (e.g., prompt, bookId + chapter)

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  private readonly TTL: number; // Time To Live in ms

  constructor(ttlMinutes: number = 60) {
    this.cache = new Map();
    this.TTL = ttlMinutes * 60 * 1000;
  }

  set<T>(key: string, data: T): void {
    // Simple eviction policy: if cache gets too big (>100 items), clear old ones
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.debug(`[Cache] Set: ${key}`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    console.debug(`[Cache] Hit: ${key}`);
    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const appCache = new MemoryCache();