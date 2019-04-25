import * as EthU from 'ethereumjs-util'
import {isString} from 'lodash'
import {genValidateFn} from './validator'

/**
 * Validate a hex encoded signature string
 *
 * @param signatureString A signature string like "0x123456..."
 */
export const isValidSignatureString = (signatureString: string): boolean => {
  let signature: EthU.Signature
  try {
    signature = EthU.fromRpcSig(signatureString)
  } catch {
    return false
  }
  const {v, r, s} = signature
  return EthU.isValidSignature(v, r, s, true)
}

const isNotEmpty = (value: string) => value.replace(/\s+/g, '') !== ''
export const isNotEmptyString = (value: any) =>
  isString(value) && isNotEmpty(value)

export const isValidEthHexString = (hexString: string): boolean => {
  return hexString.slice(0, 2) === '0x'
}

export const isValidHash = (value: string) =>
  isValidEthHexString(value) && value.length === 66

export const validateBloomMerkleTreeComponents = genValidateFn([
  ['layer2Hash', isValidHash, false],
  ['signedRootHash', isValidSignatureString, false],
])

export const validateBloomBatchMerkleTreeComponents = genValidateFn([
  ['layer2Hash', isValidHash, false],
  ['signedRootHash', isValidSignatureString, false],
])
