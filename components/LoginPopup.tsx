'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export function LoginPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Only show popup after 10 seconds if user is not signed in
    if (!isSignedIn) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isSignedIn]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <SignedOut>
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-background rounded-lg shadow-lg w-full max-w-md p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Join Vidion</h2>
                <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mb-6">
                Sign in or create an account to save your favorite videos, create playlists, and get personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/sign-in" className="flex-1">
                  <Button 
                    variant="default" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SignedOut>
  );
} 