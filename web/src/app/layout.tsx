"use client"

import type { Metadata } from "next";
import "./globals.css";
import { SolanaProvider } from "@/components/SolanaProvider";
import { Auth0Provider } from '@auth0/nextjs-auth0'

// export const metadata: Metadata = {
//   title: "Privment",
//   description: "Evade the middleman",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <SolanaProvider>
            {children}
          </SolanaProvider>
      </body>
    </html>
  );
}
