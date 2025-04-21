"use client"

import { usePageTitle } from "@/hooks/usePageTitle";
import Favorites from "@/components/Favorites";

export default function FavoritesPage() {
  // Set page title
  usePageTitle("Favorites");

  return <Favorites />;
} 