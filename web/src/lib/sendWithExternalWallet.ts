import {
  Connection,
  VersionedTransaction,
  SendOptions,
} from '@solana/web3.js';

export const signAndSendTransactionWithWallet = async (
  tx: VersionedTransaction,
  connection: Connection,
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>,
  opts?: SendOptions
): Promise<string> => {
  const signedTx = await signTransaction(tx);
  const txid = await connection.sendTransaction(signedTx, opts);
  return txid;
};
