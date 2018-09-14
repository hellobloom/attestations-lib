import * as HashingLogic from './HashingLogic'
import {AttestationTypeID} from './AttestationTypes'

const preComputedHashes = {
  emailAttestationType:
    '0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6',
  emailAttestation:
    '0x5c836525f55b64ede01a232fafde74afa7a8a82b47ecfe599294317971b2f4b5',
}

test('HashingLogic matches', () => {
  const emailAttestationType = AttestationTypeID.email
  const emailAttestationTypeHash = HashingLogic.hashAttestationTypes([
    emailAttestationType,
  ])
  expect(emailAttestationTypeHash).toBe(preComputedHashes.emailAttestationType)

  const emailAttesation: HashingLogic.IAttestationData = {
    type: 'email',
    data: 'test@bloom.co',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const emailAttestationHash = HashingLogic.hashAttestations([emailAttesation])
  expect(emailAttestationHash).toBe(preComputedHashes.emailAttestation)
})

test('HashingLogic mismatches', () => {
  const emailAttestationType = AttestationTypeID.phone // Not email
  const emailAttestationTypeHash = HashingLogic.hashAttestationTypes([
    emailAttestationType,
  ])
  expect(emailAttestationTypeHash).not.toBe(
    preComputedHashes.emailAttestationType
  )

  const emailAttesation: HashingLogic.IAttestationData = {
    type: 'email',
    data: 'not-test@bloom.co', // Not test@bloom.co
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const emailAttestationHash = HashingLogic.hashAttestations([emailAttesation])
  expect(emailAttestationHash).not.toBe(preComputedHashes.emailAttestation)
})
