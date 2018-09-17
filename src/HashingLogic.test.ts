import * as HashingLogic from './HashingLogic'
import {AttestationTypeID} from './AttestationTypes'

const MerkleTree = require('merkletreejs')

const preComputedHashes = {
  emailAttestationType:
    '5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2',
  emailAttestation:
    '916384b118d284ce03f78e126c658c0a0be150e40590b81abc2626e48a68b341',
  phoneAttestationType:
    'bc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a',
  phoneAttestation:
    '13b32cc88a37dfadbf17263189c226841deac32fcd576c3b4ce383f225df6459',
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

test('HashingLogic merkle trees / proofs', () => {
  const fullNameAttestation: HashingLogic.IAttestationData = {
    type: 'full-name',
    data: 'Ludwig Heinrich Edler von Mises',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const emailAttesation: HashingLogic.IAttestationData = {
    type: 'email',
    data: 'test@bloom.co',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af1',
    version: '1.0.0',
  }
  const phoneAttestation: HashingLogic.IAttestationData = {
    type: 'phone',
    data: '+17203600587',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af2',
    version: '1.0.0',
  }

  const leaves = [
    Buffer.from(HashingLogic.hashAttestation(fullNameAttestation), 'hex'),
    Buffer.from(HashingLogic.hashAttestation(emailAttesation), 'hex'),
    Buffer.from(HashingLogic.hashAttestation(phoneAttestation), 'hex'),
  ]
  const tree = new MerkleTree(leaves, (x: any) =>
    Buffer.from(HashingLogic.hashAttestation(x), 'hex')
  )
  const root = tree.getRoot()
  const fullNameProof = tree.getProof(leaves[0])
  expect(tree.verify(fullNameProof, leaves[0], root)).toBeTruthy()
  expect(tree.verify(fullNameProof, leaves[1], root)).toBeFalsy()
  expect(tree.verify(fullNameProof, leaves[2], root)).toBeFalsy()

  const emailProof = tree.getProof(leaves[1])
  expect(tree.verify(emailProof, leaves[0], root)).toBeFalsy()
  expect(tree.verify(emailProof, leaves[1], root)).toBeTruthy()
  expect(tree.verify(emailProof, leaves[2], root)).toBeFalsy()

  const phoneProof = tree.getProof(leaves[2])
  expect(tree.verify(phoneProof, leaves[0], root)).toBeFalsy()
  expect(tree.verify(phoneProof, leaves[1], root)).toBeFalsy()
  expect(tree.verify(phoneProof, leaves[2], root)).toBeTruthy()
})
