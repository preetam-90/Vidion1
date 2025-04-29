'use client';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactNode } from "react";
import { CacheProvider } from "@/contexts/CacheContext";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <CacheProvider>
      <div>
        {children}
        <Analytics />
        <SpeedInsights />
      </div>
    </CacheProvider>
  );
} 