'use client'

import { login, signup } from './actions'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Sign in to Privment
                </h1>
                <a
                    href={`https://afqrpyamxardgqbhytyx.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent('http://localhost:3000/auth/callback')}`}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 533.5 544.3"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M533.5 278.4c0-18.3-1.5-36.5-4.6-54.4H272v102.9h146.9c-6.3 34.3-25 63.5-53.5 83v68h86.7c50.7-46.7 81.4-115.5 81.4-199.5z"
                            fill="#4285F4"
                        />
                        <path
                            d="M272 544.3c72.6 0 133.6-24.1 178.1-65.5l-86.7-68c-24.1 16.1-55 25.7-91.4 25.7-70.3 0-129.8-47.4-151.1-111.1h-89.3v69.8C91.7 486.2 175.5 544.3 272 544.3z"
                            fill="#34A853"
                        />
                        <path
                            d="M120.9 325.4c-5.3-16.1-8.3-33.2-8.3-50.7s3-34.6 8.3-50.7v-69.8H31.6C11.3 190.3 0 229 0 273.5s11.3 83.2 31.6 118.3l89.3-69.8z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M272 107.7c39.6 0 75.1 13.7 103 40.7l77.3-77.3C405.6 24.1 344.6 0 272 0 175.5 0 91.7 58.1 31.6 154.9l89.3 69.8C142.2 155.1 201.7 107.7 272 107.7z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </a>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm text-gray-400">
                        <span className="bg-white px-2">or</span>
                    </div>
                </div>
                <form className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-black focus:border-black text-sm"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            formAction={login}
                            className="w-1/2 py-2 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                        >
                            Log in
                        </button>
                        <button
                            formAction={signup}
                            className="w-1/2 py-2 border border-black text-black rounded-lg text-sm font-medium hover:bg-black hover:text-white transition"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
