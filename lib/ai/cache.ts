type Key = string; // `${userId}:${planHash}:${weekIndex}:${type}`

interface CacheEntry {
  text: string;
  ts: number;
}

const mem = new Map<Key, CacheEntry>();

export function getCached(key: Key): string | undefined {
  const entry = mem.get(key);
  if (!entry) return undefined;
  
  // Optional: Add TTL (time-to-live) logic here if needed
  // For dev, we'll keep cache indefinitely
  return entry.text;
}

export function setCached(key: Key, text: string): void {
  mem.set(key, { text, ts: Date.now() });
  
  // Optional: Implement LRU eviction if memory becomes a concern
  // For dev, we'll keep it simple
}

export function makeKey(parts: { 
  userId: string; 
  planHash: string; 
  weekIndex: number; 
  type: string;
}): Key {
  return `${parts.userId}:${parts.planHash}:${parts.weekIndex}:${parts.type}`;
}

export function clearCache(): void {
  mem.clear();
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: mem.size,
    keys: Array.from(mem.keys()),
  };
}