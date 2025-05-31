"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import Link from 'next/link';


export default function HomePage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
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
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-white text-white">
      <nav className="bg-white-800 border-b border-neutral-700 px-6 py-2 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/qsdfqssdf" className="flex items-center gap-2 hover:opacity-90">
            <Image
              src="/logo.png"
              alt="Privment Logo"
              width={25}
              height={25}
            />
            <h1 className="text-2xl text-black font-semibold tracking-tight">Privment</h1>
          </Link>
        </div>
        <div className="flex items-center gap-3 relative">
          <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !text-white border border-white/10 text-sm" />
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="px-4 py-3 text-sm border rounded-3xl hover:bg-gray-200 transition text-black"
            >
              {session.user.email}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-50 text-sm overflow-hidden">
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-700"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-xl p-6 border border-neutral-200 text-black">
          <h2 className="text-2xl font-bold mb-4">Welcome to Privment</h2>
          <p className="text-gray-600 mb-6">Your secure payment solution</p>

          <div className="p-4 bg-neutral-100 rounded-lg border border-neutral-300 mb-6">
            <h3 className="font-semibold mb-2 text-neutral-800">Your Profile</h3>
            <p className="text-sm text-neutral-600">Email: {session.user.email}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors font-medium"
            >
              View Profile
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="px-4 py-2 bg-neutral-200 text-black rounded-md hover:bg-neutral-300 transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
