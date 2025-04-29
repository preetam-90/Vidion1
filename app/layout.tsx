import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import ClientLayout from "./client-layout"
import { Providers } from "./providers"
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration"
import { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Vidiony',
  description: 'Video streaming platform',
  verification: {
    google: 'ABCg9GS2lVnsrDFDj22yTT_Mc6ya9-fMXl09o3OIQ9I',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ServiceWorkerRegistration />
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  )
}