import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { cookies } from 'next/headers'

async function validateCaptcha(token: string) {
  const h = await headers()
  const ip = h.get('CF-Connecting-IP')

  const formData = new FormData()
  formData.append('secret', process.env.CLOUDFLARE_SECRET_KEY!)
  formData.append('response', token)
  if (ip) {
    formData.append('remoteip', ip)
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: formData,
    },
  )

  const data = await response.json()

  return data.success
}

export async function POST(request: Request) {
  const { token } = await request.json()

  if (await validateCaptcha(token)) {
    const cookieStore = await cookies()
    cookieStore.set('captcha-verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })
    return new NextResponse('Captcha verified', { status: 200 })
  } else {
    return new NextResponse('Invalid captcha', { status: 400 })
  }
}