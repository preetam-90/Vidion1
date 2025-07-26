'use client'

import { createClient } from '../../utils/supabase/client'

export default function LoginPage() {
  const handleGoogleSignIn = async (event: React.MouseEvent) => {
    event.preventDefault()
    console.log('Attempting Google sign-in...')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error signing in with Google:', error)
      console.error('Google sign-in error details:', error)
    } else if (data.url) {
      console.log('Redirecting to Google OAuth URL:', data.url)
      window.location.href = data.url
    } else {
      console.log('Google sign-in data:', data)
    }
  }

  const handleGithubSignIn = async (event: React.MouseEvent) => {
    event.preventDefault()
    console.log('Attempting GitHub sign-in...')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error signing in with GitHub:', error)
      console.error('GitHub sign-in error details:', error)
    } else if (data.url) {
      console.log('Redirecting to GitHub OAuth URL:', data.url)
      window.location.href = data.url
    } else {
      console.log('GitHub sign-in data:', data)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-900">Login</h1>
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={handleGithubSignIn}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}
