'use client';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactNode, Fragment } from "react";
import { CacheProvider } from "@/contexts/CacheContext";
import { PreloadProvider } from "@/contexts/PreloadContext";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <Fragment>
      <PreloadProvider>
        <CacheProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </CacheProvider>
      </PreloadProvider>
    </Fragment>
  );
} 