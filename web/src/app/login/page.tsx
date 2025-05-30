'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { signup } from './actions'

const passwordCriteria = [
  { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw: string) => /\d/.test(pw) },
  { label: 'One special character', test: (pw: string) => /[^a-zA-Z0-9]/.test(pw) },
]

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const router = useRouter()
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/home')
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const allPassed = passwordCriteria.every((rule) => rule.test(password))
    if (!allPassed) {
      setError('Password does not meet all strength requirements.')
      return
    }

    const formData = new FormData()
    formData.set('email', email)
    formData.set('password', password)

    await signup(formData)
    setSignupSuccess(true)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-900 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.png" alt="Privment Logo" width={50} height={50} />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            {mode === 'login' ? 'Sign in to Privment' : 'Create your Privment Account'}
          </h1>
        </div>

        {message && (
          <div className="mb-4 p-3 text-sm border border-green-200 bg-green-50 text-green-700 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 text-sm border border-red-200 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {signupSuccess ? (
          <div className="flex flex-col items-center gap-4 p-6  bg-gray-50 rounded-xl shadow-md text-center text-white">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-600/10">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-green-400">Account successfully created</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Check your inbox to confirm your email. Once confirmed, you’ll be able to log in.
            </p>

            <button
              onClick={() => setMode('login')}
              className="mt-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-sm text-white font-medium rounded-md transition"
            >
              Back to Login
            </button>
          </div>


        ) : (
          <form
            onSubmit={mode === 'login' ? handleEmailSignIn : handleSignup}
            className="space-y-5"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
              />

              {mode === 'signup' && (
                <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-xs">
                  <p className="mb-2 font-medium text-gray-700">Password requirements:</p>
                  <ul className="space-y-1">
                    {passwordCriteria.map((rule, i) => {
                      const passed = rule.test(password)
                      return (
                        <li
                          key={i}
                          className={`flex items-center gap-2 ${passed ? 'text-green-600' : 'text-gray-500'
                            }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {passed ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            )}
                          </svg>
                          <span>{rule.label}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gray-800 text-white text-sm font-semibold rounded-md hover:bg-gray-700 transition disabled:opacity-50"
            >
              {loading
                ? mode === 'login'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'login'
                  ? 'Sign in with Email'
                  : 'Create Account'}
            </button>
          </form>
        )}

        {mode === 'login' && !signupSuccess && (
          <>
            <div className="my-6 text-center text-sm text-gray-500">or continue with</div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition text-sm font-medium disabled:opacity-50"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
          </>
        )}

        {!signupSuccess && (
          <div className="mt-6 text-center text-sm text-gray-600">
            {mode === 'login' ? (
              <>
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setMode('signup')
                  }}
                  className="underline font-medium hover:text-gray-800"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setMode('login')
                  }}
                  className="underline font-medium hover:text-gray-800"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
