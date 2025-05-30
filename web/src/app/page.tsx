// app/page.tsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <Image
          src="/logo.png"
          alt="Privment Logo"
          width={60}
          height={60}
          className="invert"
        />
        <br />
        <h1 className="text-4xl font-bold mb-8">Welcome to Privment</h1>
        <div className="space-y-4">
          <p className="text-lg">Please sign in to access your dashboard</p>
          <br />
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
