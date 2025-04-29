import { useState, useEffect } from 'react';
import { clientCache, CACHE_KEYS, CACHE_DURATION, isCacheExpired } from '@/lib/cache';

interface CacheOptions {
  key: string;
  duration?: number;
}

export function useCache<T>({ key, duration = CACHE_DURATION }: CacheOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cachedData = clientCache.get(key);
        if (cachedData && !isCacheExpired(cachedData.timestamp)) {
          setData(cachedData.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load cached data'));
      } finally {
        setLoading(false);
      }
    };

    loadCachedData();
  }, [key]);

  const setCache = (newData: T) => {
    try {
      const cacheData = {
        data: newData,
        timestamp: Date.now()
      };
      clientCache.set(key, cacheData);
      setData(newData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set cache'));
    }
  };

  const clearCache = () => {
    try {
      clientCache.remove(key);
      setData(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear cache'));
    }
  };

  return {
    data,
    loading,
    error,
    setCache,
    clearCache
  };
} 