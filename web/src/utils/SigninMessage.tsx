import bs58 from 'bs58';
import nacl from 'tweetnacl';

export type SignMessageParams = {
  domain: string;
  publicKey: string;
  nonce: string;
  statement: string;
};

export class SigninMessage {
  readonly domain: string;
  readonly publicKey: string;
  readonly nonce: string;
  readonly statement: string;

  constructor({ domain, publicKey, nonce, statement }: SignMessageParams) {
    this.domain = domain;
    this.publicKey = publicKey;
    this.nonce = nonce;
    this.statement = statement;
  }

  prepare(): string {
    return `${this.statement}${this.nonce}`;
  }

  async validate(signature: string): Promise<boolean> {
    const msg = this.prepare();
    const signatureUint8 = bs58.decode(signature);
    const msgUint8 = new TextEncoder().encode(msg);
    const pubKeyUint8 = bs58.decode(this.publicKey);

    return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
  }
}
