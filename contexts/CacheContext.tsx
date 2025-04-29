import React, { createContext, useContext, ReactNode } from 'react';
import { clientCache, CACHE_KEYS } from '@/lib/cache';

interface CacheContextType {
  setUserHistory: (history: any[]) => void;
  getUserHistory: () => any[];
  setWatchLater: (videos: any[]) => void;
  getWatchLater: () => any[];
  setUserPreferences: (preferences: any) => void;
  getUserPreferences: () => any;
  setRecentSearches: (searches: string[]) => void;
  getRecentSearches: () => string[];
  clearAllCache: () => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export function CacheProvider({ children }: { children: ReactNode }) {
  const setUserHistory = (history: any[]) => {
    clientCache.set(CACHE_KEYS.USER_HISTORY, history);
  };

  const getUserHistory = () => {
    return clientCache.get(CACHE_KEYS.USER_HISTORY) || [];
  };

  const setWatchLater = (videos: any[]) => {
    clientCache.set(CACHE_KEYS.WATCH_LATER, videos);
  };

  const getWatchLater = () => {
    return clientCache.get(CACHE_KEYS.WATCH_LATER) || [];
  };

  const setUserPreferences = (preferences: any) => {
    clientCache.set(CACHE_KEYS.USER_PREFERENCES, preferences);
  };

  const getUserPreferences = () => {
    return clientCache.get(CACHE_KEYS.USER_PREFERENCES) || {};
  };

  const setRecentSearches = (searches: string[]) => {
    clientCache.set(CACHE_KEYS.RECENT_SEARCHES, searches);
  };

  const getRecentSearches = () => {
    return clientCache.get(CACHE_KEYS.RECENT_SEARCHES) || [];
  };

  const clearAllCache = () => {
    clientCache.clear();
  };

  const value = {
    setUserHistory,
    getUserHistory,
    setWatchLater,
    getWatchLater,
    setUserPreferences,
    getUserPreferences,
    setRecentSearches,
    getRecentSearches,
    clearAllCache
  };

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
}

export function useCacheContext() {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error('useCacheContext must be used within a CacheProvider');
  }
  return context;
} 