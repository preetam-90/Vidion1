import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  
  if (!code) {
    return NextResponse.json({ error: 'Missing authentication code' }, { status: 400 })
  }
  
  // Get the cookie that contains our redirect information
  const cookies = request.headers.get('cookie') || ''
  const authRedirectCookie = cookies
    .split(';')
    .find(c => c.trim().startsWith('auth_redirect='))
    ?.split('=')[1]
  
  if (!authRedirectCookie) {
    return NextResponse.json({ error: 'Missing redirect information' }, { status: 400 })
  }
  
  try {
    // Parse the cookie to get the original redirect URI
    const redirectInfo = JSON.parse(decodeURIComponent(authRedirectCookie))
    const { originalRedirectUri } = redirectInfo
    
    if (!originalRedirectUri) {
      throw new Error('Invalid redirect URI')
    }
    
    // Create the final redirect URL with the authentication code
    const finalRedirect = new URL(originalRedirectUri)
    finalRedirect.searchParams.append('code', code)
    if (state) {
      finalRedirect.searchParams.append('state', state)
    }
    
    // Redirect to the original callback URL with the code
    return NextResponse.redirect(finalRedirect.toString(), {
      status: 302,
      headers: {
        // Clear the cookie
        'Set-Cookie': 'auth_redirect=; Path=/; HttpOnly; Max-Age=0'
      }
    })
  } catch (error) {
    console.error('Error processing authentication callback:', error)
    return NextResponse.json({ error: 'Failed to process authentication' }, { status: 500 })
  }
} 