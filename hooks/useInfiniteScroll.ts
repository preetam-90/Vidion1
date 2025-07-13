import { useState, useEffect, useCallback } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

interface UseInfiniteScrollOptions<T> {
  initialData: T[];
  itemsPerPage: number;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll<T>({
  initialData,
  itemsPerPage,
  threshold = 0.1,
  rootMargin = "0px"
}: UseInfiniteScrollOptions<T>) {
  const [allItems] = useState<T[]>(initialData);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const [loaderRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    threshold
  });

  const loadMore = useCallback(() => {
    const startIndex = 0;
    const endIndex = page * itemsPerPage;
    
    // Get items from startIndex to endIndex
    const nextItems = allItems.slice(startIndex, endIndex);
    
    setVisibleItems(nextItems);
    setHasMore(endIndex < allItems.length);
    setPage(prevPage => prevPage + 1);
  }, [allItems, page, itemsPerPage]);

  // Initial load
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load more when the sentinel comes into view
  useEffect(() => {
    if (isIntersecting && hasMore) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loadMore]);

  return {
    items: visibleItems,
    hasMore,
    loaderRef,
    allItemsCount: allItems.length,
    visibleItemsCount: visibleItems.length
  };
} 

interface UseInfiniteAPIScrollOptions<T> {
  fetchFunction: (pageToken?: string, queryIndex?: number) => Promise<{
    items: T[];
    nextPageToken?: string | null;
    nextQueryIndex?: number;
  }>;
  batchSize?: number;
  threshold?: number;
  rootMargin?: string;
  initialItems?: T[];
  key?: any;
}

export function useInfiniteAPIScroll<T>({
  fetchFunction,
  batchSize = 12,
  threshold = 0.1,
  rootMargin = "0px",
  initialItems = [],
  key = null
}: UseInfiniteAPIScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [nextQueryIndex, setNextQueryIndex] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [loaderRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    threshold
  });

  const loadMore = useCallback(async (initialLoad = false) => {
    if (loading || (!hasMore && !initialLoad)) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchFunction(nextPageToken || undefined, nextQueryIndex);
      
      const newItems = response.items;
      const newNextPageToken = response.nextPageToken || null;
      const newNextQueryIndex = response.nextQueryIndex !== undefined ? response.nextQueryIndex : nextQueryIndex;
      
      if (newItems && newItems.length > 0) {
        setItems(prev => {
          // Filter out duplicates (using id property if available)
          const existingIds = new Set(prev.map((item: any) => item.id));
          const uniqueNewItems = newItems.filter((item: any) => !existingIds.has(item.id));
          return [...prev, ...uniqueNewItems];
        });
      }
      
      setNextPageToken(newNextPageToken);
      setNextQueryIndex(newNextQueryIndex);
      setHasMore(!!newNextPageToken || (newNextQueryIndex !== undefined && newNextQueryIndex !== nextQueryIndex));
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(typeof err === 'string' ? err : (err as Error).message || 'Failed to fetch data');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, loading, nextPageToken, nextQueryIndex, hasMore]);
  
  // Combined effect for initialization and key changes
  useEffect(() => {
    const initialLoad = async () => {
      // Reset state before fetching
      setItems([]);
      setNextPageToken(null);
      setNextQueryIndex(0);
      setHasMore(true);
      setLoading(true);
      setError(null);

      try {
        const response = await fetchFunction(undefined, 0); // Always fetch first page on key change
        
        const newItems = response.items;
        const newNextPageToken = response.nextPageToken || null;
        const newNextQueryIndex = response.nextQueryIndex !== undefined ? response.nextQueryIndex : 0;

        if (newItems && newItems.length > 0) {
          setItems(newItems);
        } else {
          setItems([]);
        }
        
        setNextPageToken(newNextPageToken);
        setNextQueryIndex(newNextQueryIndex);
        setHasMore(!!newNextPageToken || (newNextQueryIndex !== 0));

      } catch (err) {
        console.error("Error fetching data on initial load:", err);
        setError(typeof err === 'string' ? err : (err as Error).message || 'Failed to fetch data');
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, fetchFunction]);

  // Load more when the sentinel comes into view
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loading, loadMore]);

  return {
    items,
    loading,
    error,
    hasMore,
    loaderRef,
    refresh: () => {
      setItems([]);
      setNextPageToken(null);
      setNextQueryIndex(0);
      setHasMore(true);
      loadMore(true);
    }
  };
} 