import { useEffect } from 'react';

const SITE_NAME = 'Vidion';

export function usePageTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = `${title} - ${SITE_NAME}`;
    } else {
      document.title = SITE_NAME;
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = SITE_NAME;
    };
  }, [title]);
} 