'use client'

import { SolanaProvider } from "@/components/SolanaProvider"
import SessionProvider from '@/components/SessionProvider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <SolanaProvider>
        {children}
      </SolanaProvider>
    </SessionProvider>
  )
} 