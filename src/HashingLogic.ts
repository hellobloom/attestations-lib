import {AttestationTypeID} from './AttestationTypes'

const {soliditySha3} = require('web3-utils')

interface IAttestationData {
  type: keyof typeof AttestationTypeID
  provider?: string
  data: string
  nonce: string
  version: string
}

export const hashAttestations = (attestations: IAttestationData[]) => {
  const individualAttestationHashes = attestations.map(a =>
    soliditySha3({
      type: 'string',
      value: JSON.stringify(a),
    })
  )
  const combinedAttestationHash = soliditySha3({
    type: 'string',
    value: JSON.stringify(individualAttestationHashes),
  })
  return combinedAttestationHash
}

export const hashAttestationTypes = (types: AttestationTypeID[]) =>
  soliditySha3({type: 'uint256[]', value: types})

interface IAgreementParameters {
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
   * Attestation request nonce
   */
  nonce: string
}

interface IAgreementEntry {
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
