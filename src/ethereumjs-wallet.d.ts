declare module 'ethereumjs-wallet' {
  import {Buffer} from 'buffer'

  export default class Wallet {
    getAddress(): Buffer
    getAddressString(): string
    getChecksumAddressString(): string
    getPrivateKey(): Buffer
    getPrivateKeyString(): string
    getPublicKey(): Buffer
    getPublicKeyString(): string
    getV3Filename(): string

    static generate(): Wallet
    static fromPrivateKey(key: Buffer): Wallet
    static fromPublicKey(key: Buffer): Wallet
  }
}
