import {AttestationTypeID} from './AttestationTypes'
import {sortBy} from 'lodash'

const {soliditySha3} = require('web3-utils')
const uuid = require('uuidv4')

export const generateAttestationRequestNonceHash = () =>
  soliditySha3({type: 'string', value: uuid()})

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

export const hashAttestations = (attestations: IAttestationData[]) => {
  const individualAttestationHashes = sortBy(attestations, ['type']).map(a =>
    soliditySha3({
      type: 'string',
      value: orderedStringify(a),
    })
  )
  const combinedAttestationHash = soliditySha3({
    type: 'string',
    value: JSON.stringify(individualAttestationHashes),
  })
  return combinedAttestationHash
}

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
   * Meant to contain the value from hashAttestations
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
  params: IAgreementParameters,
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
      {name: 'attester', type: 'address'},
      {name: 'requester', type: 'address'},
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
  message: params,
})
