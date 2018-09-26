import {AttestationTypeID} from './AttestationTypes'
import {sortBy} from 'lodash'
import {keccak256} from 'js-sha3'
import MerkleTree, {IProof} from 'merkletreejs'

const {soliditySha3} = require('web3-utils')
const uuid = require('uuidv4')

export const generateAttestationRequestNonceHash = () => keccak256(uuid())

export interface IAttestationData {
  /**
   * The type of attestation (phone, email, etc.)
   */
  type: keyof typeof AttestationTypeID
  /**
   * Optionally identifies service used to perform attestation
   */
  provider?: string
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
   * Attestation type nonce
   */
  nonce: string
  /**
   * Semantic version used to keep track of attestation versions
   */
  version: string
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
 * Given an IAttestationData, sorts the property names, serializes the object to JSON,
 * and uses keccak256 to hash to a hex string with NO 0x prefix.
 */
export const hashAttestation = (attestation: IAttestationData) => {
  const attestationHash = keccak256(orderedStringify(attestation))
  return attestationHash
}

/**
 * Given an array of hashed attestations, creates a new MerkleTree with the leaves
 * after the leaves are sorted by hash and mapped into hash Buffers.
 */
export const getMerkleTreeFromLeaves = (leaves: string[]) => {
  const leavesSorted = leaves.sort().map(hexStr => Buffer.from(hexStr, 'hex'))
  return new MerkleTree(leavesSorted, (x: Buffer) =>
    Buffer.from(keccak256(x), 'hex')
  )
}

/**
 * Given an array of IAttestationData, creates a new MerkleTree with the attestations
 * after the leaves are sorted by hash and mapped into hash Buffers.
 */
export const getMerkleTree = (attestations: IAttestationData[]) => {
  const leaves = attestations.map(hashAttestation)
  return getMerkleTreeFromLeaves(leaves)
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
  if (!proof.length || !targetNode || !root) {
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
 */
export const hashAttestationTypes = (types: AttestationTypeID[]) =>
  soliditySha3({type: 'uint256[]', value: sortBy(types)})

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
  typeHash: string
  /**
   * Meant to contain the value from generateAttestationRequestNonceHash
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
    name: 'requester',
    value: params.requester,
  },
  {
    type: 'address',
    name: 'attester',
    value: params.attester,
  },
  {
    type: 'bytes32',
    name: 'dataHash',
    value: params.dataHash,
  },
  {
    type: 'bytes32',
    name: 'typeHash',
    value: params.typeHash,
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
  message: IAgreementParameters,
  chainId: ChainId,
  verifyingContract: string
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
      {name: 'requester', type: 'address'},
      {name: 'attester', type: 'address'},
      {name: 'dataHash', type: 'bytes32'},
      {name: 'typeHash', type: 'bytes32'},
      {name: 'nonce', type: 'bytes32'},
    ],
  },
  primaryType: 'AttestationRequest',
  domain: {
    name: 'Bloom',
    version: '1',
    chainId,
    verifyingContract,
  },
  message,
})
