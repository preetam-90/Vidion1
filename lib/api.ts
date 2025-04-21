// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetch data with caching to reduce API calls
 * @param key - Unique identifier for the data
 * @param fetchFn - Function to fetch data if not in cache
 * @param ttl - Cache time-to-live in milliseconds (default: 5 minutes)
 */
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);

  // Return cached data if it exists and is not expired
  if (cached && now - cached.timestamp < ttl) {
    return cached.data;
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Cache the result
  cache.set(key, { data, timestamp: now });
  
  return data;
}

/**
 * Invalidate a specific cache entry
 * @param key - The cache key to invalidate
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Invalidate all cache entries
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache info
 */
export function getCacheInfo() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
    entries: Array.from(cache.entries()).map(([key, { timestamp }]) => ({
      key,
      age: Math.floor((Date.now() - timestamp) / 1000),
    })),
  };
} 