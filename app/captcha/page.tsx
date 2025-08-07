'use client'

import { Turnstile } from '../components/Turnstile'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CaptchaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirectUrl') || '/'

  const onCaptchaSuccess = async (token: string) => {
    // No auth verification needed - just redirect
    router.push(redirectUrl)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          Please verify you are human
        </h1>
        <Turnstile onSuccess={onCaptchaSuccess} />
      </div>
    </div>
  )
}