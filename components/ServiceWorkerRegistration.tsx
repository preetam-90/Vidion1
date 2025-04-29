'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    workbox: any;
  }
}

interface ServiceWorkerEvent extends Event {
  type: string;
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      
      // Add event listeners
      wb.addEventListener('installed', (event: ServiceWorkerEvent) => {
        console.log(`Service Worker installed: ${event.type}`);
      });

      wb.addEventListener('controlling', (event: ServiceWorkerEvent) => {
        console.log(`Service Worker controlling: ${event.type}`);
      });

      wb.addEventListener('activated', (event: ServiceWorkerEvent) => {
        console.log(`Service Worker activated: ${event.type}`);
      });

      // Register the service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      }

      // Start the service worker
      wb.register();
    }
  }, []);

  return null;
} 