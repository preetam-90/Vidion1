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