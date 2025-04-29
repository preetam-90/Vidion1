'use client';

import { Analytics } from "@vercel/analytics/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
} 