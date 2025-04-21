"use client"

import WatchLater from "@/components/WatchLater";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function WatchLaterPage() {
  // Set page title
  usePageTitle("Watch Later");

  return <WatchLater />;
} 