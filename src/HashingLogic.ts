import {AttestationTypeID} from './AttestationTypes'
import {keccak256} from 'js-sha3'
const crypto = require('crypto')
import MerkleTree, {IProof} from 'merkletreejs'
const ethUtil = require('ethereumjs-util')
const ethSigUtil = require('eth-sig-util')

const {soliditySha3} = require('web3-utils')

export const hashMessage = (message: string) =>
  ethUtil.addHexPrefix(keccak256(message))

/**
 * Generate a random hex string with 0x prefix
 */
export const generateNonce = () => hashMessage(crypto.randomBytes(20))

export interface IAttestationData {
  // tslint:disable:max-line-length
  /**
   * String representation of the attestations data.
   *
   * ### Examples ###
   * email: "test@bloom.co"
   * sanction-screen: {\"firstName\":\"FIRSTNAME\",\"middleName\":\"MIDDLENAME\",\"lastName\":\"LASTNAME\",\"birthMonth\":1,\"birthDay\":1,\"birthYear\":1900,\"id\":\"a1a1a1a...\"}
   *
   * Any attestation that isn't a single string value will be
   * a JSON string representing the attestation data.
   */
  // tslint:enable:max-line-length
  data: string
  /**
   * Attestation data nonce
   */
  nonce: string
  /**
   * Semantic version used to keep track of attestation versions
   */
  version: string
}

export interface IAttestationType {
  /**
   * The type of attestation (phone, email, etc.)
   */
  type: keyof typeof AttestationTypeID
  /**
   * Optionally identifies service used to perform attestation
   */
  provider?: string
  /**
   * Attestation type nonce
   */
  nonce: string
}

export interface IRevocationLinks {
  /**
   * Hex string to identify this attestation node in the event of partial revocation
   */
  local: string
  /**
   * Hex string to identify this attestation in the event of revocation
   */
  global: string
  /**
   * hash of data node attester is verifying
   */
  dataHash: string
  /**
   * hash of type node attester is verifying
   */
  typeHash: string
}

export interface IAuxSig {
  /**
   * Hex string containing subject's auxiliary signature
   * Signs the ordered stringified object containing
   * { dataHash: hashAttestation(IAttestationData), typeHash: hashAttestation(IAttestationType)}
   */
  signedHash: string
  /**
   * Nonce to conceal unwanted revealing of aux public key
   */
  nonce: string
}

export interface IAttestation {
  data: IAttestationData
  type: IAttestationType
  /**
   * aux either contains a hash of IAuxSig or just a padding node hash
   */
  aux: string
}

export interface IAttestationNode extends IAttestation {
  link: IRevocationLinks
}

export interface IDataNode {
  attestationNode: IAttestationNode
  signedAttestation: string // Root hash of Attestation tree signed by attester
}

export interface IBloomMerkleTreeComponents {
  layer2Hash: string // Hash merkle root signed with nonce
  signedRootHash: string
  rootHashNonce: string
  rootHash: string // The root the Merkle tree
  dataNodes: IDataNode[]
  checksumSig: string // Attester signature of ordered array of dataNode hashes
  paddingNodes: string[]
}

/**
 * Returns the value of `JSON.stringify` of a new object argument `obj`,
 * which is a copy of `obj`, but its properties are sorted using
 * `Array<string>.sort`.
 */
export const orderedStringify = (obj: {}) => {
  let orderedObj = {}
  Object.keys(obj)
    .sort()
    .map(o => (orderedObj[o] = obj[o]))
  return JSON.stringify(orderedObj)
}

/**
 * Given an array of hashed attestations, creates a new MerkleTree with the leaves
 * after the leaves are sorted by hash and mapped into hash Buffers.
 */
export const getMerkleTreeFromLeaves = (leaves: string[]) => {
  const leavesSorted = leaves.sort().map(hexStr => ethUtil.toBuffer(hexStr))
  return new MerkleTree(leavesSorted, (x: Buffer) =>
    Buffer.from(keccak256(x), 'hex')
  )
}

/**
 *
 * @param attestation Given the contents of an attestation node, return a
 * Merkle tree
 */
export const getDataTree = (attestation: IAttestationNode): MerkleTree => {
  const dataHash = hashMessage(orderedStringify(attestation.data))
  const typeHash = hashMessage(orderedStringify(attestation.type))
  const linkHash = hashMessage(orderedStringify(attestation.link))
  const auxHash = hashMessage(attestation.aux)
  return getMerkleTreeFromLeaves([dataHash, typeHash, linkHash, auxHash])
}

/**
 * Given the contents of an attestation node, return the root hash of the Merkle tree
 */
export const hashAttestationNode = (attestation: IAttestationNode): Buffer => {
  const dataTree = getDataTree(attestation)
  return dataTree.getRoot()
}

/**
 * Sign a buffer with a given private key and return a hex string of the signature
 * @param hash Any message buffer
 * @param privKey A private key buffer
 */
export const signHash = (hash: Buffer, privKey: Buffer): string => {
  const sig = ethUtil.ecsign(hash, privKey)
  return ethSigUtil.concatSig(sig.v, sig.r, sig.s)
}

/**
 * Recover the address of the signer of a given message hash
 * @param hash Buffer of the message that was signed
 * @param sig Hex string of the signature
 */
export const recoverHashSigner = (hash: Buffer, sig: string) => {
  const signature = ethUtil.toBuffer(sig)
  const sigParams = ethUtil.fromRpcSig(signature)
  const pubKey = ethUtil.ecrecover(hash, sigParams.v, sigParams.r, sigParams.s)
  const sender = ethUtil.publicToAddress(pubKey)
  return ethUtil.bufferToHex(sender)
}

/**
 * Given an array of hashed dataNode signatures and a hashed checksum signature, creates a new MerkleTree
 * after padding, and sorting.
 *
 */
export const getBloomMerkleTree = (
  dataHashes: string[],
  paddingNodes: string[],
  checksumHash: string
): MerkleTree => {
  let leaves = dataHashes
  leaves.push(checksumHash)
  leaves = leaves.concat(paddingNodes)
  return getMerkleTreeFromLeaves(leaves)
}

/**
 * Given an array of root hashes, sort and hash them into a checksum buffer
 * @param {string[]} dataHashes - array of dataHashes as hex strings
 */
export const getChecksum = (dataHashes: string[]): Buffer => {
  return ethUtil.toBuffer(hashMessage(JSON.stringify(dataHashes.sort())))
}

/**
 * Given an array of root hashes, get and sign the checksum
 * @param dataHashes - array of dataHashes as hex strings
 * @param privKey - private key of signer
 */
export const signChecksum = (dataHashes: string[], privKey: Buffer): string => {
  return signHash(getChecksum(dataHashes), privKey)
}

/**
 * Sign a complete attestation node and return an object containing the datanode and the signature
 * @param dataNode - Complete attestation data node
 * @param globalRevocationLink - Hex string referencing revocation of the whole attestation
 * @param privKey - Private key of signer
 */
export const getSignedDataNode = (
  dataNode: IAttestation,
  globalRevocationLink: string,
  privKey: Buffer
): IDataNode => {
  const attestationNode: IAttestationNode = {
    data: dataNode.data,
    type: dataNode.type,
    aux: dataNode.aux,
    link: {
      local: generateNonce(),
      global: globalRevocationLink,
      dataHash: hashMessage(orderedStringify(dataNode.data)),
      typeHash: hashMessage(orderedStringify(dataNode.type)),
    },
  }
  const attestationHash = hashAttestationNode(attestationNode)
  const attestationSig = signHash(attestationHash, privKey)
  return {
    attestationNode: attestationNode,
    signedAttestation: attestationSig,
  }
}

/**
 * Given the number of data nodes return an array of padding nodes
 * @param {number} dataCount - number of data nodes in tree
 *
 * A Bloom Merkle tree will contain at minimum one data node and one checksum node
 * In order to obscure the amount of data in the tree, the number of nodes are padded to
 * a set threshold
 *
 * The Depth of the tree increments in steps of 5
 * The number of terminal nodes in a filled binary tree is 2 ^ (n - 1) where n is the depth
 *
 * dataCount 1 -> 15: paddingCount: 14 -> 0 (remeber + 1 for checksum node)
 * dataCount 16 -> 511: paddingCount 495 -> 0
 * dataCount 512 -> ...: paddingCount 15871 -> ...
 * ...
 */
export const getPadding = (dataCount: number): string[] => {
  if (dataCount < 1) return []
  let i = 5
  while (dataCount + 1 > 2 ** (i - 1)) {
    i += 5
  }
  const paddingCount = 2 ** (i - 1) - (dataCount + 1)
  return Array.apply(null, Array(paddingCount)).map(
    (item: number, index: number) => {
      return hashMessage(crypto.randomBytes(20))
    }
  )
}

/**
 * Given attestation data and the attester's private key, construct the entire Bloom Merkle tree
 * and return the components needed to generate proofs
 * @param dataNodes - Complete attestation nodes
 * @param privKey - Attester private key
 */
export const getSignedMerkleTreeComponents = (
  dataNodes: IAttestation[],
  privKey: Buffer
): IBloomMerkleTreeComponents => {
  const globalRevocationLink = generateNonce()
  const signedDataNodes: IDataNode[] = dataNodes.map(a => {
    return getSignedDataNode(a, globalRevocationLink, privKey)
  })
  const signedDataHashes = signedDataNodes.map(a =>
    hashMessage(a.signedAttestation)
  )

  const paddingNodes = getPadding(signedDataHashes.length)
  const signedChecksum = signChecksum(signedDataHashes, privKey)
  const signedChecksumHash = hashMessage(signedChecksum)
  const rootHash = getBloomMerkleTree(
    signedDataHashes,
    paddingNodes,
    signedChecksumHash
  ).getRoot()
  const signedRootHash = signHash(rootHash, privKey)
  const rootHashNonce = generateNonce()
  const layer2Hash = hashMessage(
    orderedStringify({
      rootHash: ethUtil.bufferToHex(rootHash),
      nonce: rootHashNonce,
    })
  )
  return {
    layer2Hash: layer2Hash,
    signedRootHash: signedRootHash,
    rootHashNonce: rootHashNonce,
    rootHash: ethUtil.bufferToHex(rootHash),
    dataNodes: signedDataNodes,
    checksumSig: signedChecksum,
    paddingNodes: paddingNodes,
  }
}

export const getMerkleTreeFromComponents = (
  components: IBloomMerkleTreeComponents
): MerkleTree => {
  const signedDataHashes = components.dataNodes.map(a =>
    hashMessage(a.signedAttestation)
  )
  return getBloomMerkleTree(
    signedDataHashes,
    components.paddingNodes,
    hashMessage(components.checksumSig)
  )
}

/**
 * verify
 * @desc Returns true if the proof path (array of hashes) can connect the target node
 * to the Merkle root.
 * @param {Object[]} proof - Array of proof objects that should connect
 * target node to Merkle root.
 * @param {Buffer} targetNode - Target node Buffer
 * @param {Buffer} root - Merkle root Buffer
 * @return {Boolean}
 * @example
 * const root = tree.getRoot()
 * const proof = tree.getProof(leaves[2])
 * const verified = tree.verify(proof, leaves[2], root)
 *
 * standalone verify function taken from https://github.com/miguelmota/merkletreejs
 */
export const verifyMerkleProof = (
  proof: IProof[],
  targetNode: Buffer,
  root: Buffer
): boolean => {
  // Should not succeed with all empty arguments
  // Proof can be empty if single leaf tree
  if (targetNode.toString() === '' || root.toString() === '') {
    return false
  }

  // Initialize hash with only targetNode data
  let hash = targetNode

  // Build hash using each component of proof until the root node
  proof.forEach(node => {
    const isLeftNode = node.position === 'left'
    const buffers = [hash]
    buffers[isLeftNode ? 'unshift' : 'push'](node.data)
    hash = Buffer.from(keccak256(Buffer.concat(buffers)), 'hex')
  })

  return Buffer.compare(hash, root) === 0
}

/**
 * Given an array of type `AttestationTypeID`, sorts the array, and
 * uses `soliditySha3` to hash the array.
 *
 * Deprecated due to types being removed from Attestation Logic contract
 */
export const hashAttestationTypes = (types: AttestationTypeID[]) =>
  soliditySha3({type: 'uint256[]', value: types.sort()})

export interface IAgreementParameters {
  /**
   * ETH address of the subject
   */
  subject: string
  /**
   * ETH address of the requester
   */
  requester: string
  /**
   * ETH address of the attester
   */
  attester: string
  /**
   * Meant to contain the value from a MerkleTree's `getRoot()` func
   */
  dataHash: string
  /**
   * Meant to contain the value from hashAttestationTypes
   */
  nonce: string
}

export interface IAgreementEntry {
  type: string
  name: keyof IAgreementParameters
  value: string
}

export const getAttestationAgreement = (
  params: IAgreementParameters
): IAgreementEntry[] => [
  {
    type: 'address',
    name: 'subject',
    value: params.subject,
  },
  {
    type: 'address',
    name: 'attester',
    value: params.attester,
  },
  {
    type: 'address',
    name: 'requester',
    value: params.requester,
  },
  {
    type: 'bytes32',
    name: 'dataHash',
    value: params.dataHash,
  },
  {
    type: 'bytes32',
    name: 'nonce',
    value: params.nonce,
  },
]

export enum ChainId {
  Main = 1,
  Rinkeby = 4,
}

export const getAttestationAgreementEIP712 = (
  message: IAgreementParameters
) => ({
  types: {
    EIP712Domain: [
      {name: 'name', type: 'string'},
      {name: 'version', type: 'string'},
      {name: 'chainId', type: 'uint256'},
      {name: 'verifyingContract', type: 'address'},
    ],
    AttestationRequest: [
      {name: 'subject', type: 'address'},
      {name: 'attester', type: 'address'},
      {name: 'requester', type: 'address'},
      {name: 'dataHash', type: 'bytes32'},
      {name: 'nonce', type: 'bytes32'},
    ],
  },
  primaryType: 'AttestationRequest',
  domain: {
    name: 'Bloom',
    version: '1',
  },
  message,
})
