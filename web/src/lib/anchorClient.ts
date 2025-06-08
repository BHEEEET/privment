import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import idl from "../../../target/idl/privment.json";
import { Program } from "@coral-xyz/anchor";
import { Privment } from "../../../target/types/privment";

// Replace with your deployed program ID
const PROGRAM_ID = new PublicKey(idl.address);

// Optional: you can switch this to mainnet/testnet/devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Accept a publicKey parameter for the wallet
export async function getAnchorClient(publicKey: PublicKey) {
  // Minimal wallet interface for Anchor
  const wallet = {
        publicKey,
        signTransaction: async (tx: any) => tx,
        signAllTransactions: async (txs: any[]) => txs,
      }

  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  anchor.setProvider(provider);
  const program = new anchor.Program(idl as anchor.Idl, provider) as Program<Privment>;
  return { program, connection };
}