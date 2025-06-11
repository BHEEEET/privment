"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/NavBar'
import { usePrivy } from '@privy-io/react-auth'
import { getAnchorClient } from "@/lib/anchorClient"
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js'
import { useSendTransaction } from '@privy-io/react-auth/solana'
import { useWallet } from '@solana/wallet-adapter-react'
import { signAndSendTransactionWithWallet } from '@/lib/sendWithExternalWallet'
import { BN } from "@coral-xyz/anchor"
import { useSolanaWallets } from '@privy-io/react-auth'

export default function HomePage() {
  const router = useRouter()
  const { ready, authenticated, user } = usePrivy()
  const { sendTransaction } = useSendTransaction()
  const { wallet, publicKey: externalPublicKey, signTransaction } = useWallet()
  const { createWallet } = useSolanaWallets();

  const usingExternalWallet = !(user?.wallet?.connectorType === "embedded")

  const [client, setClient] = useState<PublicKey | null>(new PublicKey("9v3WYpy5R331ACJ5tPApn1nV12M4QdF4m4u6d4BvtRU3"))
  const [userAccountData, setUserAccountData] = useState<any | null>(null)
  const [invoiceData, setInvoiceData] = useState<any | null>(null)
  const [email, setEmail] = useState("");


  const getCurrentWalletPublicKey = () => {
    if (user?.wallet?.connectorType ==  "embedded") return new PublicKey(user.wallet.address)
    else return externalPublicKey
  }

  const getUserAccountPDA = (pubkey: PublicKey, programId: PublicKey) =>
    PublicKey.findProgramAddressSync([Buffer.from("user"), pubkey.toBytes()], programId)[0]

  const getInvoicePDA = (pubkey: PublicKey, programId: PublicKey) =>
    PublicKey.findProgramAddressSync([Buffer.from("invoice"), pubkey.toBytes()], programId)[0]

  const fetchUserAccount = async (pubkey: PublicKey) => {
    try {
      const { program } = await getAnchorClient(pubkey)
      const userAccount = getUserAccountPDA(pubkey, program.programId)
      const data = await program.account.userAccount.fetch(userAccount)
      console.log(data)
      setUserAccountData({ ...data, address: userAccount.toBase58() })
    } catch (err) {
      console.log("ERROR USER")
      console.warn("No user account found yet.")
    }
  }

  const fetchInvoice = async (pubkey: PublicKey) => {
    try {
      const { program } = await getAnchorClient(pubkey)
      const invoice = getInvoicePDA(pubkey, program.programId)
      const data = await program.account.invoice.fetch(invoice)
      console.log(data)
      setInvoiceData({ ...data, address: invoice.toBase58() })
    } catch (err) {
        console.log("ERROR INVOICE")
      console.warn("No invoice found yet.")
    }
  }

  const handleCreateUser = async (pubkey: PublicKey) => {
    const { program, connection } = await getAnchorClient(pubkey)
    const ix = await program.methods
      .register("User1")
      .accounts({ user: pubkey })
      .instruction()

    const latestBlockhash = await connection.getLatestBlockhash()
    const msgV0 = new TransactionMessage({
      payerKey: pubkey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: [ix],
    }).compileToV0Message()

    const tx = new VersionedTransaction(msgV0)

    let sig: string
    if (usingExternalWallet && signTransaction) {
      sig = await signAndSendTransactionWithWallet(tx, connection, signTransaction, {
        skipPreflight: true
      })
    } else {
      sig = (
        await sendTransaction({
          transaction: tx,
          connection,
          address: user?.wallet?.address!,
          transactionOptions:{
            skipPreflight: false
          }
        })
      ).signature
    }

    console.log("✅ User account created:", sig)
    setTimeout(() => fetchUserAccount(pubkey), 1000)
  }

  const handleAirdropSol = async () => {
    const pubkey = getCurrentWalletPublicKey()
    if (!pubkey) {
      console.error("❌ No wallet connected")
      return
    }

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

      console.log("⏳ Requesting airdrop...")
      const sig = await connection.requestAirdrop(pubkey, 1 * LAMPORTS_PER_SOL)

      const latestBlockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction(
        {
          signature: sig,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed"
      )

      console.log(`✅ Airdropped 1 SOL to ${pubkey.toBase58()}`)
    } catch (err) {
      console.error("❌ Airdrop failed:", err)
    }
  }



  const handleCreateInvoice = async (recipient: PublicKey) => {
    const payer = getCurrentWalletPublicKey()
    if (!payer) return

    const { program, connection } = await getAnchorClient(payer)

    const ix = await program.methods
      .createInvoice(new BN(50))
      .accounts({
        client: payer,
        creator: payer, // or whatever signer your program expects
      })
      .instruction()

    const latestBlockhash = await connection.getLatestBlockhash()
    const msgV0 = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: [ix],
    }).compileToV0Message()

    const tx = new VersionedTransaction(msgV0)

    let sig: string
    if (usingExternalWallet && signTransaction) {
      sig = await signAndSendTransactionWithWallet(tx, connection, signTransaction, {
        skipPreflight: true
      })
    } else {
      sig = (
        await sendTransaction({
          transaction: tx,
          connection,
          address: user?.wallet?.address!,
        })
      ).signature
    }

    console.log("✅ Invoice created:", sig)
    setTimeout(() => fetchInvoice(payer), 1000)
  }


  useEffect(() => {
    const pubkey = getCurrentWalletPublicKey()
    if (authenticated && pubkey) {
      console.log("fetching useraccount...")
      fetchUserAccount(pubkey)
      console.log("fetching invoice...")
      fetchInvoice(pubkey)
      console.log(user)
      setEmail(Array.isArray(user?.linkedAccounts)
    ? user.linkedAccounts.map((acc: any) => acc.email).join("")
    : "")
    }
  }, [authenticated, user, externalPublicKey])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20"></div>
            <Image
              src="/logo.png"
              alt="Privment Logo"
              width={20}
              height={20}
              className="absolute inset-0 m-auto invert"
            />
          </div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-300 mb-4">You need to be signed in to view this page.</p>
          <a
            href="/"
            className="inline-block w-full text-center px-4 py-2 bg-white text-neutral-900 font-medium rounded-md hover:bg-gray-100 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }
  // Define displayName before the return so it's always available
  const displayName = email ? email : (externalPublicKey ? externalPublicKey.toBase58() : "");

  return (
    <div className="min-h-screen bg-white text-white">
      <Navbar userEmail={displayName} />
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-xl p-6 border border-neutral-200 text-black">
          <h2 className="text-2xl font-bold mb-4">Welcome to Privment</h2>
          <button
            onClick={() => {
              createWallet()
            }}
            className="px-2 py-1 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors font-medium"
          >
            Create embedded wallet
          </button>
          <button
            onClick={() => {
              handleAirdropSol()
            }}
            className="px-2 py-1 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors font-medium"
          >
            Airdrop SOL
          </button>
          <p className="text-gray-600 mb-2">Create your company</p>
          <p className="text-sm text-gray-500 mb-4">
            Using {usingExternalWallet ? 'External Wallet (e.g. Phantom)' : 'Privy Wallet'}
          </p>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => {
                const pubkey = getCurrentWalletPublicKey()
                if (pubkey) handleCreateUser(pubkey)
              }}
              className="px-4 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors font-medium"
            >
              Create User Account
            </button>
          </div>

          {userAccountData ? (
            <div className="mt-6 bg-neutral-100 text-black p-4 rounded-md border border-neutral-300">
              <h3 className="font-semibold mb-2">👤 On-chain User Account</h3>
              <p><strong>Name:</strong> {userAccountData.name}</p>
              <p><strong>Payed:</strong> {userAccountData.totalPayed.toString()}</p>
              <p><strong>Received:</strong> {userAccountData.totalReceived.toString()}</p>
              <p><strong>Address:</strong> {userAccountData.address}</p>
            </div>
          ) : (<div className="mt-6 bg-neutral-100 text-black p-4 rounded-md border border-neutral-300">
            <h1 className='font-semibold'>User account not yet created</h1>
          </div>)}

          <div className="flex gap-4 flex-wrap my-5">
            <button
              onClick={() => {
                if (client) handleCreateInvoice(client)
              }}
              className="px-4 py-2 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors font-medium"
            >
              Create Invoice
            </button>
          </div>
          {invoiceData ? (
            <div className="mt-6 bg-neutral-100 text-black p-4 rounded-md border border-neutral-300">
              <h3 className="font-semibold mb-2">🧾 On-chain Invoice</h3>
              <p><strong>Address:</strong> {invoiceData.address}</p>
              <p><strong>Amount:</strong> {invoiceData.amount.words[0]}</p>
              <p><strong>Client:</strong> {invoiceData.client.toString()}</p>
              <p><strong>Created at:</strong> {new Date(invoiceData.createdAt.toNumber() * 1000).toLocaleString()}</p>
            </div>
          ) : (<div className="mt-6 bg-neutral-100 text-black p-4 rounded-md border border-neutral-300">
            <h1 className='font-semibold'>Invoice not yet created</h1>
          </div>)}
        </div>

        <pre className="max-w-4xl bg-neutral-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-6 overflow-x-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </main>
    </div>
  )
}
