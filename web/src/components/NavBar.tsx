'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePrivy } from '@privy-io/react-auth'

type NavbarProps = {
  userEmail: string
}

export default function Navbar({ userEmail }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  //const supabase = createClientComponentClient()
  const { user, logout } = usePrivy();

  return (
    <nav className="border-b border-neutral-200 px-6 py-2 flex justify-between items-center shadow-sm bg-white">
      <Link href="/home" className="flex items-center gap-2 hover:opacity-90">
        <Image src="/logo.png" alt="Privment Logo" width={28} height={28} />
        <h1 className="text-xl font-semibold text-neutral-900">Privment</h1>
      </Link>

      <div className="relative z-10">
        <div className="flex items-center gap-4">
          {user?.wallet?.connectorType == "solana_adapter" && (
            <WalletMultiButton className="!bg-neutral-800 hover:!bg-neutral-700 !text-white border border-neutral-600 text-sm px-4 py-1 rounded-md transition" />
          )}

          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-3 text-sm bg-neutral-100 text-neutral-800 rounded-full hover:bg-neutral-200 transition"
          >
            <span className="truncate max-w-[120px]">{userEmail}</span>
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div
          className={`absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl text-sm text-neutral-800 overflow-hidden transition-all duration-200 origin-top ${dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
            }`}
        >
          <button
            onClick={() => {
              setDropdownOpen(false)
              router.push('/profile')
            }}
            className="w-full text-left px-4 py-3 hover:bg-neutral-100 transition"
          >
            View Profile
          </button>
          <button
            onClick={() => {
              setDropdownOpen(false)
              logout()
            }}
            className="w-full text-left px-4 py-3 hover:bg-neutral-100 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
