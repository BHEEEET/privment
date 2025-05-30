'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js'
import { WalletAdapterProps } from '@solana/wallet-adapter-base'
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { WalletProvider } from '@solana/wallet-adapter-react'

require('@solana/wallet-adapter-react-ui/styles.css')

interface WalletContextType {
  wallet: any
  connectWallet: () => Promise<void>
  signMessage: (message: string) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletContextProvider({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = clusterApiUrl(network)
  const wallets = [new PhantomWalletAdapter()]

  return (
    <WalletProvider wallets={wallets} endpoint={endpoint}>
      <WalletModalProvider>
        {children}
      </WalletModalProvider>
    </WalletProvider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 