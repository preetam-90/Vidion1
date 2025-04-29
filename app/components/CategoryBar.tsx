"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

// Video categories extracted from data
const categories = [
  'All', 'Music', 'Gaming', 'Movies', 'Flowcharts', 'Programming Patterns', 
  'Sorting Algorithms', 'Number Systems', 'Math Problems', 'News', 'Bit Manipulation', 
  'Complexity Analysis', 'Arrays',  'Array Algorithms', 'Matrix Algorithms',
  'Large Numbers', 'Sorting & Searching', 'Data Structures', 'Search Algorithms',
  'Algorithm Problems', 'Strings', 'String Algorithms', 'String Conversion',
  'Pointers', 'Recursion', 'C++ Concepts', 'Linked Lists', 'Stacks', 'Stack Problems',
  'Education'
];

export default function CategoryBar() {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Determine active category based on current path
  const getActiveCategory = () => {
    if (pathname === '/') return 'All';
    if (pathname.startsWith('/music')) return 'Music';
    if (pathname.startsWith('/gaming')) return 'Gaming';
    if (pathname.startsWith('/movies')) return 'Movies';
    
    // For category pages like /category/[category]
    const match = pathname.match(/\/category\/([^/]+)/);
    if (match) {
      const categorySlug = decodeURIComponent(match[1]).toLowerCase();
      // Find matching category (case insensitive)
      const matchedCategory = categories.find(
        cat => cat.toLowerCase() === categorySlug
      );
      return matchedCategory || null;
    }
    
    return null;
  };
  
  const activeCategory = getActiveCategory();

  // Check if arrows should be displayed
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  // Handle scroll buttons
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 300; // Adjust as needed
    const container = scrollContainerRef.current;
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  // Scroll to active category when component mounts or active category changes
  useEffect(() => {
    if (activeCategory && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = container.querySelector(`[data-category="${activeCategory}"]`);
      
      if (activeElement) {
        // Scroll active element into view with some offset
        const containerWidth = container.clientWidth;
        const elementOffset = (activeElement as HTMLElement).offsetLeft;
        const scrollPosition = elementOffset - containerWidth / 3;
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [activeCategory]);

  return (
    <div className="relative w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center py-1 -mt-1">
      {showLeftArrow && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 shadow-sm h-8 w-8" 
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex items-center overflow-x-auto scrollbar-hide px-4 md:px-6 gap-2 max-w-full h-full"
      >
        {categories.map((category, index) => {
          // Define special categories that should redirect to dedicated pages
          const specialCategories = ['Music', 'Gaming', 'Movies', 'News'];
          const isSpecialCategory = specialCategories.includes(category);
          
          // Check if current category is active
          const isActive = category === activeCategory;
          
          // Define the href based on category type
          let href;
          if (category === 'All') {
            href = '/'; // Redirect to homepage for "All" category
          } else if (isSpecialCategory) {
            if (category === 'News') {
              href = '/category/news'; // Use relative URL for News
            } else {
              href = `/${category.toLowerCase()}`; // For Music, Gaming, Movies
            }
          } else {
            href = `/category/${category.toLowerCase()}`;
          }
          
          return (
            <Link 
              href={href} 
              key={index}
              data-category={category}
            >
              <Button 
                variant={isActive ? "default" : "secondary"} 
                size="sm" 
                className={`whitespace-nowrap text-xs font-medium px-3 py-1 h-8 rounded-lg hover:bg-gray-700 ${
                  isActive 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100/10 text-gray-200'
                }`}
              >
                {category}
              </Button>
            </Link>
          );
        })}
      </div>
      
      {showRightArrow && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 shadow-sm h-8 w-8" 
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
} 