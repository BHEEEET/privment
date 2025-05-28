// app/auth/callback/page.tsx
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function AuthCallback() {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.auth.getUser()

  if (!data?.user || error) {
    console.error("Google login error:", error)
    redirect('/login')
  }

  // optionally redirect to `next` param if included
  redirect('/')
}
