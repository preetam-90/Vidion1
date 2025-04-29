"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      
      if (code) {
        try {
          // TODO: Implement OAuth callback with your new auth platform
          // await yourAuthPlatform.handleCallback(code);
        } catch (error) {
          console.error("Error during auth callback:", error);
        }
      }
      
      // Redirect to home page after processing
      router.push("/");
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing login...</h2>
        <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mx-auto"></div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
        <LoadingSpinner />
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthCallbackContent />
    </Suspense>
  );
} 