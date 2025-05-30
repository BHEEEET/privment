// components/HomeClient.tsx
"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function HomePage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(session)
      } catch (error) {
        console.error('Error getting session:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    initializeSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase.auth])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto"></div>
          <p className="mt-4 text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

if (!session) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-gray-300 mb-4">
          You need to be signed in to view this page. Please log in to continue.
        </p>
        <a
          href="/login"
          className="inline-block w-full text-center px-4 py-2 bg-white text-neutral-900 font-medium rounded-md hover:bg-gray-100 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  )
}




  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-zinc-900 rounded-lg shadow-2xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Welcome to Privment</h1>
            <div className="flex items-center gap-4">
              <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !text-white border border-white/10" />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white/80 hover:text-white border border-white/10 rounded-md hover:bg-white/5 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
          <p className="text-white/60 mb-6">Your secure payment solution</p>

          <div className="space-y-4">
            <div className="p-4 bg-black/40 rounded-lg border border-white/5">
              <h2 className="font-semibold mb-2 text-white">Your Profile</h2>
              <p className="text-sm text-white/60">Email: {session.user.email}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/profile')}
                className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 transition-colors font-medium"
              >
                View Profile
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
