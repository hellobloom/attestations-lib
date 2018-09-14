import * as HashingLogic from './HashingLogic'
import {AttestationTypeID} from './AttestationTypes'

const preComputedHashes = {
  emailAttestationType:
    '0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6',
  emailAttestation:
    '0x81b6819c368a22ea3b4b1b3ea939a6e8e264acaff4c314b8d2ed834536dcdfff',
  phoneAttestationType:
    '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563',
  phoneAttestation:
    '0xa9f1b74f342ac217e990c3690728339f12af70ad93ad38b9d3284ad406ad24ad',
}

test('HashingLogic.hashAttestationTypes', () => {
  const emailAttestationType = AttestationTypeID.email
  const phoneAttestationType = AttestationTypeID.phone
  const emailAttestationTypeHash = HashingLogic.hashAttestationTypes([
    emailAttestationType,
  ])
  const phoneAttestationTypeHash = HashingLogic.hashAttestationTypes([
    phoneAttestationType,
  ])
  const emailFirstCombinedAttestationTypeHash = HashingLogic.hashAttestationTypes(
    [emailAttestationType, phoneAttestationType]
  )
  const phoneFirstCombinedAttestationTypeHash = HashingLogic.hashAttestationTypes(
    [phoneAttestationType, emailAttestationType]
  )

  // Precomputed hashes should match (if they don't a bug has potentially been introduced)
  expect(emailAttestationTypeHash).toBe(preComputedHashes.emailAttestationType)
  expect(phoneAttestationTypeHash).toBe(preComputedHashes.phoneAttestationType)

  // Differently sorted input arrays should output the same hash due to sorting prior to serialization / hashing
  expect(emailFirstCombinedAttestationTypeHash).toBe(
    phoneFirstCombinedAttestationTypeHash
  )
})

test('HashingLogic hashAttestations matches', () => {
  const emailAttesation: HashingLogic.IAttestationData = {
    type: 'email',
    data: 'test@bloom.co',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const emailAttestationHash = HashingLogic.hashAttestations([emailAttesation])
  const phoneAttestation: HashingLogic.IAttestationData = {
    type: 'phone',
    data: '+17203600587',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const phoneAttestationHash = HashingLogic.hashAttestations([phoneAttestation])

  // Precomputed hashes should match (if they don't a bug has potentially been introduced)
  expect(emailAttestationHash).toBe(preComputedHashes.emailAttestation)
  expect(phoneAttestationHash).toBe(preComputedHashes.phoneAttestation)

  const emailFirstCombinedAttestationHash = HashingLogic.hashAttestations([
    emailAttesation,
    phoneAttestation,
  ])
  const phoneFirstCombinedAttestationHash = HashingLogic.hashAttestations([
    phoneAttestation,
    emailAttesation,
  ])
  expect(emailFirstCombinedAttestationHash).toBe(
    phoneFirstCombinedAttestationHash
  )
})

test('HashingLogic hashAttestations mismatches', () => {
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

test('HashingLogic orderedStringify', () => {
  const objectA = {
    name: 'Test Flower',
    email: 'test@bloom.co',
    phone: '+17203600587',
  }
  const objectB = {
    email: 'test@bloom.co',
    name: 'Test Flower',
    phone: '+17203600587',
  }
  const objectC = {
    email: 'test@bloom.co',
    phone: '+17203600587',
    name: 'Test Flower',
  }
  const objectD = {
    email: 'test@bloom.com', // .com instead of .co
    phone: '+17203600587',
    name: 'Test Flower',
  }

  // serialized objects a, b, and c should be equal because of orderedStringify
  expect(HashingLogic.orderedStringify(objectA)).toBe(
    HashingLogic.orderedStringify(objectB)
  )
  expect(HashingLogic.orderedStringify(objectA)).toBe(
    HashingLogic.orderedStringify(objectC)
  )
  expect(HashingLogic.orderedStringify(objectB)).toBe(
    HashingLogic.orderedStringify(objectC)
  )

  // serialized objects will not equal because the data isn't the same
  expect(HashingLogic.orderedStringify(objectA)).not.toBe(
    HashingLogic.orderedStringify(objectD)
  )
})
