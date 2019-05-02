import * as EthU from 'ethereumjs-util'
const ethSigUtil = require('eth-sig-util')
import {isString} from 'lodash'
import {genValidateFn, TUnvalidated} from './validator'
import {AttestationTypeID} from './AttestationTypes'
import {validateDateTime} from './RFC3339DateTime'
import {
  IBloomMerkleTreeComponents,
  ISignedClaimNode,
  IBloomBatchMerkleTreeComponents,
} from './HashingLogic'
import * as HashingLogic from './HashingLogic'

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

export const isArrayOfPaddingNodes = (value: any): boolean => {
  if (!Array.isArray(value)) {
    return false
  }
  if (value.length === 0) return false
  return value.every(v => v.length === 66)
}

export const isValidTypeString = (value: any): boolean =>
  (<any>Object).values(AttestationTypeID).includes(value)

export const isValidRFC3339DateTime = (value: any): boolean =>
  validateDateTime(value)

export const validateAttesterClaimSig = (
  attesterSig: string,
  params: TUnvalidated<ISignedClaimNode>
) => {
  const claimHash = HashingLogic.hashClaimTree(params.claimNode)
  const recoveredSigner = HashingLogic.recoverHashSigner(claimHash, attesterSig)
  return recoveredSigner.toLowerCase() === params.attester.toLowerCase()
}

export const validateAttesterRootSig = (
  attesterSig: string,
  params: TUnvalidated<IBloomMerkleTreeComponents>
) => {
  const recoveredSigner = HashingLogic.recoverHashSigner(
    EthU.toBuffer(params.rootHash),
    attesterSig
  )
  return recoveredSigner.toLowerCase() === params.attester.toLowerCase()
}

export const validateBatchAttesterSig = (
  batchAttesterSig: string,
  params: TUnvalidated<IBloomBatchMerkleTreeComponents>
) => {
  const recoveredSigner = HashingLogic.recoverHashSigner(
    EthU.toBuffer(
      HashingLogic.hashMessage(
        HashingLogic.orderedStringify({
          subject: params.subject,
          rootHash: params.layer2Hash,
        })
      )
    ),
    batchAttesterSig
  )
  return recoveredSigner.toLowerCase() === params.attester.toLowerCase()
}

export const validateSubjectSig = (
  subjectSig: string,
  params: TUnvalidated<IBloomBatchMerkleTreeComponents>
) => {
  const recoveredSigner = ethSigUtil.recoverTypedSignature({
    data: HashingLogic.getAttestationAgreement(
      params.contractAddress,
      1,
      params.layer2Hash,
      params.requestNonce
    ),
    sig: subjectSig,
  })
  return recoveredSigner.toLowerCase() === params.subject.toLowerCase()
}

export const validateChecksumSig = (
  checksumSig: string,
  params: TUnvalidated<IBloomMerkleTreeComponents>
) => {
  const checksum = HashingLogic.getChecksum(
    params.claimNodes.map((a: ISignedClaimNode) =>
      HashingLogic.hashMessage(a.attesterSig)
    )
  )
  const recoveredSigner = HashingLogic.recoverHashSigner(checksum, checksumSig)
  return recoveredSigner.toLowerCase() === params.attester.toLowerCase()
}

export const validateAttestationDataNode = genValidateFn([
  ['data', isNotEmptyString, false],
  ['nonce', isNotEmptyString, false],
  ['version', isNotEmptyString, false],
])

export const validateAttestationTypeNode = genValidateFn([
  ['type', isNotEmptyString, false],
  ['type', isValidTypeString, false],
  ['nonce', isNotEmptyString, false],
])

export const validateLinkNode = genValidateFn([
  ['local', isValidHash, false],
  ['global', isValidHash, false],
  ['dataHash', isValidHash, false],
  ['typeHash', isValidHash, false],
])

export const validateAttestationIssuanceNode = genValidateFn([
  ['localRevocationToken', isValidHash, false],
  ['localRevocationToken', isValidEthHexString, false],
  ['globalRevocationToken', isValidHash, false],
  ['globalRevocationToken', isValidEthHexString, false],
  ['dataHash', isValidHash, false],
  ['dataHash', isValidEthHexString, false],
  ['typeHash', isValidHash, false],
  ['typeHash', isValidEthHexString, false],
  ['issuanceDate', isNotEmptyString, false],
  ['issuanceDate', isValidRFC3339DateTime, false],
  ['expirationDate', isNotEmptyString, false],
  ['expirationDate', isValidRFC3339DateTime, false],
])

export const isValidAttestationDataNode = (value: any): boolean =>
  validateAttestationDataNode(value).kind === 'validated'

export const isValidAttestationTypeNode = (value: any): boolean =>
  validateAttestationTypeNode(value).kind === 'validated'

export const isValidAttestationIssuanceNode = (value: any): boolean =>
  validateAttestationIssuanceNode(value).kind === 'validated'

export const isValidLinkNode = (value: any): boolean =>
  validateLinkNode(value).kind === 'validated'

export const validateLegacyAttestationNode = genValidateFn([
  ['data', isValidAttestationDataNode, false],
  ['type', isValidAttestationTypeNode, false],
  ['link', isValidLinkNode, false],
  ['aux', isValidEthHexString, false],
  ['aux', isValidHash, false],
])

export const isValidLegacyAttestationNode = (value: any): boolean =>
  validateLegacyAttestationNode(value).kind === 'validated'

export const validateIssueClaimNode = genValidateFn([
  ['data', isValidAttestationDataNode, false],
  ['type', isValidAttestationTypeNode, false],
  ['issuance', isValidAttestationIssuanceNode, false],
  ['aux', isValidEthHexString, false],
  ['aux', isValidHash, false],
])

export const isValidIssuedClaimNode = (value: any): boolean =>
  validateIssueClaimNode(value).kind === 'validated'

export const validateClaimNode = genValidateFn([
  ['attesterSig', isValidSignatureString, false],
  ['attesterSig', validateAttesterClaimSig, true],
  ['claimNode', isValidIssuedClaimNode, false],
])

export const isValidArrayOfClaimNodes = (value: any): boolean => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(v => validateClaimNode(v).kind === 'validated')
}

export const validateDataNodeLegacy = genValidateFn([
  ['signedAttestation', isValidSignatureString, false],
  // cannot validate attestation sig matches attester here. missing in data structure
  ['attestationNode', isValidLegacyAttestationNode, false],
])

export const isValidArrayOfLegacyDataNodes = (value: any): boolean => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(v => validateDataNodeLegacy(v).kind === 'validated')
}

export const validateBloomLegacyMerkleTreeComponents = genValidateFn([
  ['layer2Hash', isValidHash, false],
  ['signedRootHash', isValidSignatureString, false],
  ['rootHashNonce', isValidHash, false],
  ['rootHash', isValidHash, false],
  ['dataNodes', isValidArrayOfLegacyDataNodes, false],
  ['checksumSig', isValidSignatureString, false],
  ['paddingNodes', isArrayOfPaddingNodes, false],
])

export const validateBloomMerkleTreeComponents = genValidateFn([
  ['attesterSig', isValidSignatureString, false],
  ['attesterSig', validateAttesterRootSig, true],
  ['checksumSig', isValidSignatureString, false],
  ['checksumSig', validateChecksumSig, true],
  ['claimNodes', isValidArrayOfClaimNodes, false],
  ['layer2Hash', isValidEthHexString, false],
  ['layer2Hash', isValidHash, false],
  ['paddingNodes', isArrayOfPaddingNodes, false],
  ['rootHash', isValidEthHexString, false],
  ['rootHash', isValidHash, false],
  ['rootHashNonce', isValidHash, false],
  ['rootHashNonce', isValidEthHexString, false],
  ['version', isNotEmptyString, false],
])

export const validateBloomBatchMerkleTreeComponents = genValidateFn([
  ['attesterSig', isValidSignatureString, false],
  ['attesterSig', validateAttesterRootSig, true],
  ['checksumSig', isValidSignatureString, false],
  ['checksumSig', validateChecksumSig, true],
  ['claimNodes', isValidArrayOfClaimNodes, false],
  ['layer2Hash', isValidEthHexString, false],
  ['layer2Hash', isValidHash, false],
  ['paddingNodes', isArrayOfPaddingNodes, false],
  ['rootHash', isValidEthHexString, false],
  ['rootHash', isValidHash, false],
  ['rootHashNonce', isValidHash, false],
  ['rootHashNonce', isValidEthHexString, false],
  ['version', isNotEmptyString, false],
  ['batchAttesterSig', isValidSignatureString, false],
  ['batchAttesterSig', validateBatchAttesterSig, true],
  ['contractAddress', EthU.isValidAddress, false],
  ['requestNonce', isValidHash, false],
  ['requestNonce', isValidEthHexString, false],
  ['subject', EthU.isValidAddress, false],
  ['subjectSig', isValidSignatureString, false],
  ['subjectSig', validateSubjectSig, true],
])
