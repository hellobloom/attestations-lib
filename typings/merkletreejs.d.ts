declare module 'merkletreejs' {
  export default class MerkleTree {
    getRoot: () => Buffer
    getLeaves: () => Buffer[]
    getLayers: () => Buffer[]
    getProof: (leaf: Buffer, index?: number) => Buffer[]
    verify: (proof: Buffer[], targetNode: Buffer, root: Buffer) => boolean
    constructor(
      leaves: Buffer[],
      hashAlgorithm: (data: any) => Buffer,
      options?: {
        isBitcoinTree: boolean
      }
    )
  }
}
