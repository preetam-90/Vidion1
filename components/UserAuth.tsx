'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { User, UserPlus } from 'lucide-react';
import Link from 'next/link';

export function UserAuth() {
  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <div className="flex items-center gap-2">
          <Link href="/sign-in">
            <Button variant="default" size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <User className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up" className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-2 border-blue-600 text-blue-600">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
              userButtonPopoverCard: "bg-gray-800 border border-gray-700",
              userButtonPopoverActions: "bg-gray-800",
              userButtonPopoverActionButton: "text-gray-300 hover:bg-gray-700",
              userButtonPopoverActionButtonText: "text-gray-300",
              userButtonPopoverFooter: "bg-gray-800 border-t border-gray-700",
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
