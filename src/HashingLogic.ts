import {AttestationTypeID} from './AttestationTypes'
import {keccak256} from 'js-sha3'
const crypto = require('crypto')
import MerkleTree, {IProof} from 'merkletreejs'
import {validateDateTime} from './RFC3339DateTime'
const ethUtil = require('ethereumjs-util')
const ethSigUtil = require('eth-sig-util')
import * as ethereumjsWallet from 'ethereumjs-wallet'

export const hashMessage = (message: string): string =>
  ethUtil.addHexPrefix(keccak256(message))

/**
 * Generate a random hex string with 0x prefix
 */
export const generateNonce = () => hashMessage(crypto.randomBytes(20))

/**
 * Latest supported types for constructing and interpreting Bloom Merkle Tree
 */
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

export interface IIssuanceNode {
  /**
   * Hex string to identify this attestation node in the event of partial revocation
   */
  localRevocationToken: string
  /**
   * Hex string to identify this attestation in the event of revocation
   */
  globalRevocationToken: string
  /**
   * hash of data node attester is verifying
   */
  dataHash: string
  /**
   * hash of type node attester is verifying
   */
  typeHash: string
  /**
   * RFC3339 timestamp of when the claim was issued
   * https://tools.ietf.org/html/rfc3339
   */
  issuanceDate: string
  /**
   * RFC3339 timestamp of when the claim should expire
   * https://tools.ietf.org/html/rfc3339
   */
  expirationDate: string
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

export interface IClaimNode {
  data: IAttestationData
  type: IAttestationType
  /**
   * aux either contains a hash of IAuxSig or just a padding node hash
   */
  aux: string
}

export interface IIssuedClaimNode extends IClaimNode {
  issuance: IIssuanceNode
}

export interface ISignedClaimNode {
  claimNode: IIssuedClaimNode
  attester: string
  attesterSig: string // Root hash of claim tree signed by attester
}

export interface IBloomMerkleTreeComponents {
  attester: string
  attesterSig: string
  checksumSig: string // Attester signature of ordered array of dataNode hashes
  claimNodes: ISignedClaimNode[]
  layer2Hash: string // Hash of merkle root and nonce
  paddingNodes: string[]
  rootHash: string // The root the Merkle tree
  rootHashNonce: string
  version: string
}

export interface IBloomBatchMerkleTreeComponents
  extends IBloomMerkleTreeComponents {
  batchAttesterSig: string
  batchLayer2Hash: string // Hash of attester sig and subject sig
  contractAddress: string
  requestNonce: string
  subject: string
  subjectSig: string
}

export interface IAuthorization {
  /**
   * Address of keypair granting authorization
   */
  subject: string
  /**
   * Address of keypair receiving authorization
   */
  recipient: string
  /**
   * Hex string to identify this authorization in the event of revocation
   */
  revocation: string
}

export interface ISignedAuthorization {
  /**
   * Hash of IAuthorization
   */
  authorization: IAuthorization
  /**
   * Signed hashed authorization
   */
  signature: string
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
export const getClaimTree = (claim: IIssuedClaimNode): MerkleTree => {
  const dataHash = hashMessage(orderedStringify(claim.data))
  const typeHash = hashMessage(orderedStringify(claim.type))
  const issuanceHash = hashMessage(orderedStringify(claim.issuance))
  const auxHash = hashMessage(claim.aux)
  return getMerkleTreeFromLeaves([dataHash, typeHash, issuanceHash, auxHash])
}

/**
 * Given the contents of an attestation node, return the root hash of the Merkle tree
 */
export const hashClaimTree = (claim: IIssuedClaimNode): Buffer => {
  const dataTree = getClaimTree(claim)
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
 * Sign a complete attestation node and return an object containing the datanode and the signature
 * @param dataNode - Complete attestation data node
 * @param globalRevocationLink - Hex string referencing revocation of the whole attestation
 * @param privKey - Private key of signer
 */
export const getSignedClaimNode = (
  claimNode: IClaimNode,
  globalRevocationLink: string,
  privKey: Buffer,
  issuanceDate: string,
  expirationDate: string
): ISignedClaimNode => {
  // validateDates
  if (!validateDateTime(issuanceDate)) throw new Error('Invalid issuance date')
  if (!validateDateTime(expirationDate)) {
    throw new Error('Invalid expiration date')
  }
  const issuedClaimNode: IIssuedClaimNode = {
    data: claimNode.data,
    type: claimNode.type,
    aux: claimNode.aux,
    issuance: {
      localRevocationToken: generateNonce(),
      globalRevocationToken: globalRevocationLink,
      dataHash: hashMessage(orderedStringify(claimNode.data)),
      typeHash: hashMessage(orderedStringify(claimNode.type)),
      issuanceDate: issuanceDate,
      expirationDate: expirationDate,
    },
  }
  const claimHash = hashClaimTree(issuedClaimNode)
  const attesterSig = signHash(claimHash, privKey)
  const attester = ethereumjsWallet.fromPrivateKey(privKey)
  return {
    claimNode: issuedClaimNode,
    attester: attester.getAddressString(),
    attesterSig: attesterSig,
  }
}

/**
 * Legacy types for constructing and interpreting Bloom Merkle Tree
 */
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

export interface IAttestationLegacy {
  data: IAttestationData
  type: IAttestationType
  /**
   * aux either contains a hash of IAuxSig or just a padding node hash
   */
  aux: string
}

export interface IAttestationNode extends IAttestationLegacy {
  link: IRevocationLinks
}

export interface IDataNodeLegacy {
  attestationNode: IAttestationNode
  signedAttestation: string // Root hash of Attestation tree signed by attester
}

export interface IBloomMerkleTreeComponentsLegacy {
  layer2Hash: string // Hash merkle root and nonce
  signedRootHash: string
  rootHashNonce: string
  rootHash: string // The root the Merkle tree
  dataNodes: IDataNodeLegacy[]
  checksumSig: string // Attester signature of ordered array of dataNode hashes
  paddingNodes: string[]
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
 * Sign a complete attestation node and return an object containing the datanode and the signature
 * @param dataNode - Complete attestation data node
 * @param globalRevocationLink - Hex string referencing revocation of the whole attestation
 * @param privKey - Private key of signer
 */
export const getSignedDataNode = (
  dataNode: IAttestationLegacy,
  globalRevocationLink: string,
  privKey: Buffer
): IDataNodeLegacy => {
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
 *
 * Methods supporting both current and legacy data structures
 */

/**
 * Given an array of hashed dataNode signatures and a hashed checksum signature, creates a new MerkleTree
 * after padding, and sorting.
 *
 */
export const getBloomMerkleTree = (
  claimHashes: string[],
  paddingNodes: string[],
  checksumHash: string
): MerkleTree => {
  let leaves = claimHashes
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
  return Array.apply(null, Array(paddingCount)).map(() => {
    return hashMessage(crypto.randomBytes(20))
  })
}
/**
 * Given attestation data and the attester's private key, construct the entire Bloom Merkle tree
 * and return the components needed to generate proofs
 * @param claimNodes - Complete attestation nodes
 * @param privKey - Attester private key
 */
export const getSignedMerkleTreeComponents = (
  claimNodes: IClaimNode[],
  issuanceDate: string,
  expirationDate: string,
  privKey: Buffer
): IBloomMerkleTreeComponents => {
  const globalRevocationLink = generateNonce()
  const signedClaimNodes: ISignedClaimNode[] = claimNodes.map(a => {
    return getSignedClaimNode(
      a,
      globalRevocationLink,
      privKey,
      issuanceDate,
      expirationDate
    )
  })
  const attesterClaimSigHashes = signedClaimNodes.map(a =>
    hashMessage(a.attesterSig)
  )

  const paddingNodes = getPadding(attesterClaimSigHashes.length)
  const signedChecksum = signChecksum(attesterClaimSigHashes, privKey)
  const signedChecksumHash = hashMessage(signedChecksum)
  const rootHash = getBloomMerkleTree(
    attesterClaimSigHashes,
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
  const attester = ethereumjsWallet.fromPrivateKey(privKey)
  return {
    attester: attester.getAddressString(),
    layer2Hash: layer2Hash,
    attesterSig: signedRootHash,
    rootHashNonce: rootHashNonce,
    rootHash: ethUtil.bufferToHex(rootHash),
    claimNodes: signedClaimNodes,
    checksumSig: signedChecksum,
    paddingNodes: paddingNodes,
    version: 'Attestation-Tree-2.0.0',
  }
}

/**
 * Given attestation data and the attester's private key, construct the entire Bloom Merkle tree
 * and return the components needed to generate proofs
 * @param claimNodes - Complete attestation nodes
 * @param privKey - Attester private key
 */
export const getSignedBatchMerkleTreeComponents = (
  components: IBloomMerkleTreeComponents,
  contractAddress: string,
  subjectSig: string,
  subject: string,
  requestNonce: string,
  privKey: Buffer
): IBloomBatchMerkleTreeComponents => {
  if (
    !validateSignedAgreement(
      subjectSig,
      contractAddress,
      components.layer2Hash,
      requestNonce,
      subject
    )
  ) {
    throw new Error('Invalid subject sig')
  }
  const batchAttesterSig = signHash(
    ethUtil.toBuffer(
      hashMessage(
        orderedStringify({
          subject: subject,
          rootHash: components.layer2Hash,
        })
      )
    ),
    privKey
  )
  const batchLayer2Hash = hashMessage(
    orderedStringify({
      attesterSig: batchAttesterSig,
      subjectSig: subjectSig,
    })
  )
  const attester = ethereumjsWallet.fromPrivateKey(privKey)
  return {
    attesterSig: components.attesterSig,
    batchAttesterSig: batchAttesterSig,
    batchLayer2Hash: batchLayer2Hash,
    checksumSig: components.checksumSig,
    claimNodes: components.claimNodes,
    contractAddress: contractAddress,
    layer2Hash: components.layer2Hash,
    paddingNodes: components.paddingNodes,
    requestNonce: requestNonce,
    rootHash: components.rootHash,
    rootHashNonce: components.rootHashNonce,
    attester: attester.getAddressString(),
    subject: subject,
    subjectSig: subjectSig,
    version: 'Batch-Attestation-Tree-1.0.0',
  }
}

/**
 * Given attestation data and the attester's private key, construct the entire Bloom Merkle tree
 * and return the components needed to generate proofs
 * @param dataNodes - Complete attestation nodes
 * @param privKey - Attester private key
 */
export const getSignedMerkleTreeComponentsLegacy = (
  dataNodes: IAttestationLegacy[],
  privKey: Buffer
): IBloomMerkleTreeComponentsLegacy => {
  const globalRevocationLink = generateNonce()
  const signedDataNodes: IDataNodeLegacy[] = dataNodes.map(a => {
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

export const getMerkleTreeFromComponentsLegacy = (
  components: IBloomMerkleTreeComponentsLegacy
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

export const getMerkleTreeFromComponents = (
  components: IBloomMerkleTreeComponents | IBloomBatchMerkleTreeComponents
): MerkleTree => {
  const signedDataHashes = components.claimNodes.map(a =>
    hashMessage(a.attesterSig)
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

export enum ChainId {
  Main = 1,
  Rinkeby = 4,
}

export interface ITypedDataParam {
  name: string
  type: string
}

export interface IFormattedTypedData {
  types: {
    EIP712Domain: ITypedDataParam[]
    [key: string]: ITypedDataParam[]
  }
  primaryType: string
  domain: {
    name: string
    version: string
    chainId: number
    verifyingContract: string
  }
  message: {[key: string]: string}
}

export const getAttestationAgreement = (
  contractAddress: string,
  chainId: number,
  dataHash: string,
  requestNonce: string
): IFormattedTypedData => {
  return {
    types: {
      EIP712Domain: [
        {name: 'name', type: 'string'},
        {name: 'version', type: 'string'},
        {name: 'chainId', type: 'uint256'},
        {name: 'verifyingContract', type: 'address'},
      ],
      AttestationRequest: [
        {name: 'dataHash', type: 'bytes32'},
        {name: 'nonce', type: 'bytes32'},
      ],
    },
    primaryType: 'AttestationRequest',
    domain: {
      name: 'Bloom Attestation Logic',
      version: '2',
      chainId: chainId,
      verifyingContract: contractAddress,
    },
    message: {
      dataHash: dataHash,
      nonce: requestNonce,
    },
  }
}

export const validateSignedAgreement = (
  subjectSig: string,
  contractAddress: string,
  dataHash: string,
  nonce: string,
  subject: string
) => {
  const recoveredEthAddress = ethSigUtil.recoverTypedSignature({
    data: getAttestationAgreement(contractAddress, 1, dataHash, nonce),
    sig: subjectSig,
  })
  return recoveredEthAddress.toLowerCase() === subject.toLowerCase()
}
