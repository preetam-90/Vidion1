"use client";

import { useEffect } from 'react';
import { useUser } from '@stackframe/stack';

export default function StackAuthAvatarFixer() {
  const user = useUser();

  useEffect(() => {
    if (!user?.profileImageUrl) return;

    const fixStackAuthAvatar = () => {
      // Look for elements that contain the user's initials (GU)
      const initials = user.displayName?.charAt(0)?.toUpperCase() || user.primaryEmail?.charAt(0)?.toUpperCase() || 'U';
      const proxyUrl = `/api/proxy/image?url=${encodeURIComponent(user.profileImageUrl!)}`;
      
      console.log('Looking for avatar elements with initials:', initials);
      
      // Function to find elements by text content
      const findElementsByText = (searchText: string) => {
        const elements: Element[] = [];
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let node;
        while (node = walker.nextNode()) {
          const textContent = node.textContent?.trim();
          if (textContent === searchText) {
            const parentElement = node.parentElement;
            if (parentElement && !elements.includes(parentElement)) {
              elements.push(parentElement);
            }
          }
        }
        
        return elements;
      };
      
      // Look for elements with initials
      const initialsElements = [
        ...findElementsByText(initials),
        ...findElementsByText(`${initials}${initials}`),
        ...findElementsByText('GU'), // Common default for Guest User
        ...findElementsByText('G'),  // Single letter fallback
      ];
      
      console.log(`Found ${initialsElements.length} elements with initials text`);
      
      initialsElements.forEach((element) => {
        console.log('Processing element with initials:', element, 'Text:', element.textContent);
        
        // Check if this looks like an avatar (circular, has specific classes, etc.)
        const styles = window.getComputedStyle(element);
        const isCircular = styles.borderRadius.includes('50%') || styles.borderRadius.includes('100%');
        const hasAvatarClass = element.className.toLowerCase().includes('avatar') || 
                              element.className.toLowerCase().includes('profile');
        const isSquareish = styles.width && styles.height;
        
        if (isCircular || hasAvatarClass || isSquareish) {
          // Try replacing with image
          const img = document.createElement('img');
          img.src = proxyUrl;
          img.alt = 'User Avatar';
          img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            display: block;
            max-width: 100px;
            max-height: 100px;
          `;
          
          // Clear the element and add the image
          element.innerHTML = '';
          element.appendChild(img);
          
          console.log('Replaced initials with avatar image for:', element);
        }
      });
      
      // Also try Stack Auth specific selectors
      const stackSelectors = [
        '[data-stack-component="accountSettings"] div[style*="background"]',
        '[data-stack-component="accountSettings"] [role="button"]',
        '[class*="stack"] div[style*="border-radius"]',
        'div[style*="border-radius"][style*="background"]'
      ];
      
      stackSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          
          elements.forEach((element) => {
            const textContent = element.textContent?.trim();
            
            // Check if this element is showing initials
            if (textContent === initials || textContent === `${initials}${initials}` || textContent === 'GU' || textContent === 'G') {
              const htmlElement = element as HTMLElement;
              
              // Try background image approach
              htmlElement.style.backgroundImage = `url(${proxyUrl})`;
              htmlElement.style.backgroundSize = 'cover';
              htmlElement.style.backgroundPosition = 'center';
              htmlElement.style.color = 'transparent'; // Hide text
              
              console.log('Applied background image to Stack Auth element:', element);
            }
          });
        } catch (error) {
          console.error(`Error with selector: "${selector}"`, error);
        }
      });

      // Also try a more aggressive approach - find any circular div that might be an avatar
      const potentialAvatars = document.querySelectorAll('div[style*="border-radius"], div[class*="rounded"], div[class*="circle"]');
      potentialAvatars.forEach((element) => {
        const textContent = element.textContent?.trim();
        if (textContent === initials || textContent === `${initials}${initials}`) {
          const proxyUrl = `/api/proxy/image?url=${encodeURIComponent(user.profileImageUrl!)}`;
          const htmlElement = element as HTMLElement;
          
          htmlElement.style.backgroundImage = `url(${proxyUrl})`;
          htmlElement.style.backgroundSize = 'cover';
          htmlElement.style.backgroundPosition = 'center';
          htmlElement.textContent = '';
          
          console.log('Applied background image to potential avatar:', element);
        }
      });
    };

    // Run the fix with delays to catch dynamically loaded content
    const timeouts = [500, 1000, 2000, 3000];
    timeouts.forEach(delay => {
      setTimeout(fixStackAuthAvatar, delay);
    });

    // Also observe for DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(fixStackAuthAvatar, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [user]);

  return null; // This component doesn't render anything
}
