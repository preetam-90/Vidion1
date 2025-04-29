import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";
import { ReactNode } from "react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
        <WifiOff className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          It seems you've lost your internet connection. Please check your network settings and try again.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
} 