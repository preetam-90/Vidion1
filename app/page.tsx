import { redirect } from 'next/navigation'

export default async function Page() {
  // Redirect to home without authentication
  redirect('/home')
}
