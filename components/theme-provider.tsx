"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Use a simpler approach with any props to avoid type issues with different versions
type ThemeProviderProps = {
  children: React.ReactNode
  [key: string]: any
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
