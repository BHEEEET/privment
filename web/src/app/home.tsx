"use client";

import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import bs58 from "bs58";
import Navbar from "@/components/NavBar";
import { SigninMessage } from "@/utils/SigninMessage";
import Link from "next/link";
import Image from "next/image";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function HomeClient() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { publicKey, signMessage, connected } = wallet;

  const handleSignIn = async () => {
    try {
      if (!connected) {
        walletModal.setVisible(true);
        return;
      }

      if (!signMessage || !publicKey) {
        throw new Error("Wallet not ready for signing.");
      }

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: publicKey.toBase58(),
        statement: "Sign this message to sign in to the Privment app.\n\nNonce: ",
        nonce: "",
      });

      const encodedMsg = new TextEncoder().encode(message.prepare());
      const signature = await signMessage(encodedMsg);
      const serializedSignature = bs58.encode(signature);
    } catch (err) {
      console.error("Sign-in failed:", err);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Navbar />
      <Link href="/login">Login</Link>
      <Link href="/auth/logout">Logout</Link>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/privment_transparent_black.png"
          alt="Privment logo"
          width={50}
          height={30}
          priority
        />
        Evade the middleman

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <WalletMultiButtonDynamic />
        </div>
      </main>
    </div>
  );
}
