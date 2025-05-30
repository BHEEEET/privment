'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

const SessionContext = createContext(null)

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error.message)
        }
        if (session) {
          // Set session cookie
          document.cookie = `sb-auth-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
          if (session.refresh_token) {
            document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
          }
          router.refresh()
        }
      } catch (error) {
        console.error('Error initializing session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        if (session) {
          // Set session cookie
          document.cookie = `sb-auth-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
          if (session.refresh_token) {
            document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
          }
        }
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        // Clear session cookies
        document.cookie = 'sb-auth-token=; path=/; max-age=0'
        document.cookie = 'sb-refresh-token=; path=/; max-age=0'
        router.refresh()
      } else if (event === 'TOKEN_REFRESHED') {
        if (session) {
          // Update session cookie
          document.cookie = `sb-auth-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
          if (session.refresh_token) {
            document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
          }
        }
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  if (isLoading) {
    return null
  }

  return <>{children}</>
} 