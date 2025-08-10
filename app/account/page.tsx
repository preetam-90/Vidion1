"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/handler/account-settings');
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto text-center">
        <p>Redirecting to account settings...</p>
      </div>
    </div>
  );
}
