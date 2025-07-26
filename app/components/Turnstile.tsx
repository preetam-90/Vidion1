'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'error-callback'?: () => void
          action?: string
          theme?: 'light' | 'dark' | 'auto'
        },
      ) => string | undefined
      reset: (widgetId?: string) => void
    }
  }
}

export function Turnstile({
  onSuccess,
}: {
  onSuccess?: (token: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onSuccessRef = useRef(onSuccess)

  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  useEffect(() => {
    if (!ref.current || !window.turnstile) {
      return
    }

    const widgetId = window.turnstile.render(ref.current, {
      sitekey: process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY!,
      callback: (token) => {
        onSuccessRef.current?.(token)
      },
    })

    return () => {
      if (widgetId) {
        window.turnstile.reset(widgetId)
      }
    }
  }, [])

  return <div ref={ref} />
}