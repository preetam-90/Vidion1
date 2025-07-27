import { headers } from 'next/headers'

export async function validateCaptcha(token: string) {
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