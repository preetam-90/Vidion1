import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/home')
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Welcome to Vidio</h1>
      <p className="mb-8 text-lg">
        Your ultimate destination for discovering and enjoying videos.
      </p>
      <div className="flex space-x-4">
        <a
          href="/login"
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Login
        </a>
        <a
          href="/signup"
          className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Sign Up
        </a>
      </div>
    </div>
  )
}
