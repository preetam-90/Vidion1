'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

export default function TMDBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Remove focus from any element that gets focus
    const removeFocus = () => {
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }
    };
    
    // Run every 100ms to catch any elements that get focus
    const interval = setInterval(removeFocus, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-10 pb-10">
      {/* Script to immediately disable focus outlines */}
      <Script id="disable-focus" strategy="afterInteractive">
        {`
          // Immediately disable focus outline
          document.addEventListener('DOMContentLoaded', function() {
            // Apply to current elements
            document.querySelectorAll('*').forEach(function(el) {
              if (el instanceof HTMLElement) {
                el.style.outline = 'none';
                el.style.boxShadow = 'none';
              }
            });
            
            // Create a style element to override focus styles
            var style = document.createElement('style');
            style.innerHTML = \`
              * {
                outline: none !important;
                box-shadow: none !important;
              }
              *:focus, *:focus-visible {
                outline: none !important;
                box-shadow: none !important;
                border-color: transparent !important;
              }
            \`;
            document.head.appendChild(style);
            
            // Remove focus whenever it happens
            setInterval(function() {
              if (document.activeElement && document.activeElement !== document.body) {
                document.activeElement.blur();
              }
            }, 100);
          });
        `}
      </Script>
      {children}
    </div>
  );
} 