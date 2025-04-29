'use client';

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
    </>
  );
} 