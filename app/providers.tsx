'use client';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactNode, Fragment } from "react";
import { CacheProvider } from "@/contexts/CacheContext";
import { PreloadProvider } from "@/contexts/PreloadContext";
import { ClerkProvider } from "@clerk/nextjs";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <ClerkProvider>
      <PreloadProvider>
        <CacheProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </CacheProvider>
      </PreloadProvider>
    </ClerkProvider>
  );
}
