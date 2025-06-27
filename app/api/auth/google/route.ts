import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirectUri = searchParams.get('redirect_uri') || 'https://donkey.to/auth/callback'
  const clientId = searchParams.get('client_id') || '1089774638024-v63mu7nf4tiqkm0g7k29v1qjb86mgfbo.apps.googleusercontent.com'
  const responseType = searchParams.get('response_type') || 'code'
  const scope = searchParams.get('scope') || 'email profile'
  const state = searchParams.get('state') || Date.now().toString()
  
  // Encode our own redirect URL instead of the original one
  const ourRedirectUri = `${request.headers.get('origin')}/api/auth/callback`
  
  // Store the original redirect URI so we can redirect back after authentication
  const cookieValue = encodeURIComponent(JSON.stringify({
    originalRedirectUri: redirectUri,
    state: state
  }))
  
  // Build Google OAuth URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.append('client_id', clientId)
  googleAuthUrl.searchParams.append('redirect_uri', ourRedirectUri)
  googleAuthUrl.searchParams.append('response_type', responseType)
  googleAuthUrl.searchParams.append('scope', scope)
  googleAuthUrl.searchParams.append('state', state)
  googleAuthUrl.searchParams.append('prompt', 'select_account')
  
  // Redirect to Google with a cookie storing the original redirect
  return NextResponse.redirect(googleAuthUrl.toString(), {
    status: 302,
    headers: {
      'Set-Cookie': `auth_redirect=${cookieValue}; Path=/; HttpOnly; Max-Age=3600`
    }
  })
} 