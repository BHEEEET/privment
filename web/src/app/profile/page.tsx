"use client";

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function ProfilePage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        router.push('/login')
        return
      }
      setSession(session)
      setLoading(false)
    }
    fetchSession()
  }, [router, supabase])

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
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        Loading...
      </div>
    )
  }

  const user = session.user

  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="border-b border-neutral-200 px-6 py-2 flex justify-between items-center shadow-sm bg-white">
        <div className="flex items-center gap-3">
          <Link href="/home" className="flex items-center gap-2 hover:opacity-90">
            <Image src="/logo.png" alt="Privment Logo" width={28} height={28} />
            <h1 className="text-xl font-semibold text-neutral-900">Privment</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4 relative">
          <WalletMultiButton className="!bg-neutral-800 hover:!bg-neutral-700 !text-white border border-neutral-600 text-sm px-4 py-2 rounded-md" />
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="px-4 py-2 text-sm bg-neutral-100 text-neutral-800 rounded-full hover:bg-neutral-200 transition"
            >
              {user.email}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-neutral-200 rounded-md shadow-lg z-50 text-sm overflow-hidden">
                <button onClick={() => router.push('/profile')} className="w-full text-left px-4 py-2 hover:bg-neutral-100">
                  View Profile
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-neutral-100">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="min-h-screen bg-neutral-50 text-neutral-900 px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow">
            <h2 className="text-2xl font-bold mb-6">Account Details</h2>
            <div className="flex items-center gap-6">
              {user.user_metadata?.avatar_url && (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile Picture"
                  width={80}
                  height={80}
                  className="rounded-full border border-neutral-300"
                />
              )}
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Full Name:</span> {user.user_metadata?.full_name || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
