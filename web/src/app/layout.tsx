'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
//import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import { SolanaProvider } from '@/components/SolanaProvider'


const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Privment',
//   description: 'Your private payment solution',
// }



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  //const supabase = createServerComponentClient({ cookies })
  //const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaProvider>
          <PrivyProvider
            appId="cmbhvk3z800i6jp0ns1bgoema"
            clientId="client-WY6MAVh7ybTtyArKkU83grLMcjLQDMA8VhN2QddZcN4CG"
            config={{
              appearance: {
                accentColor: "#000000",
                theme: "#FFFFFF",
                showWalletLoginFirst: false,
                logo: "https://raw.githubusercontent.com/BHEEEET/privment/refs/heads/web/web/public/logo.png",
              },
              loginMethods: [
                "email",
                "google",
                "wallet"
              ],
              // Create embedded wallets for users who don't have a wallet
              embeddedWallets: {
                showWalletUIs: true,
                solana: {
                  createOnLogin: 'users-without-wallets'
                }
              },
              externalWallets: {
                solana: {
                  connectors: toSolanaWalletConnectors()
                }
              },
              mfa: {
                "noPromptOnMfaRequired": false
              }
            }}
          >
            {children}
          </PrivyProvider>
        </SolanaProvider>
      </body>
    </html>
  )
}
