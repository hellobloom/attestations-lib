import * as HashingLogic from './HashingLogic'
import {AttestationTypeID} from './AttestationTypes'

const preComputedHashes = {
  emailAttestationType:
    '5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2',
  emailAttestation:
    '4f40b2af901ae168de7c8514a932e71e91347cd0ba821162462d421f07e3cc42',
  phoneAttestationType:
    'bc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a',
  phoneAttestation:
    '8495a0af5e35ade5b867bc6937f7d43d073b4ef25ffcc21c38d81d8ea529cfb8',
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
  const emailAttestation: HashingLogic.IAttestationData = {
    type: 'email',
    data: 'test@bloom.co',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const emailAttestationHash = HashingLogic.hashAttestation(emailAttestation)
  const phoneAttestation: HashingLogic.IAttestationData = {
    type: 'phone',
    data: '+17203600587',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const phoneAttestationHash = HashingLogic.hashAttestation(phoneAttestation)

  // Precomputed hashes should match (if they don't a bug has potentially been introduced)
  expect(emailAttestationHash).toBe(preComputedHashes.emailAttestation)
  expect(phoneAttestationHash).toBe(preComputedHashes.phoneAttestation)

  const emailFirstMerkleTree = HashingLogic.getMerkleTree([
    emailAttestation,
    phoneAttestation,
  ])
  const phoneFirstMerkleTree = HashingLogic.getMerkleTree([
    phoneAttestation,
    emailAttestation,
  ])
  expect(emailFirstMerkleTree.getRoot().toString('hex')).toBe(
    phoneFirstMerkleTree.getRoot().toString('hex')
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

  const emailAttestation: HashingLogic.IAttestationData = {
    type: 'email',
    data: 'not-test@bloom.co', // Not test@bloom.co
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const emailAttestationHash = HashingLogic.hashAttestation(emailAttestation)
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
  const emailAttestation: HashingLogic.IAttestationData = {
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
  const tree = HashingLogic.getMerkleTree([
    fullNameAttestation,
    emailAttestation,
    phoneAttestation,
  ])
  const root = tree.getRoot()
  const leaves = tree.getLeaves()
  const emailProof = tree.getProof(
    Buffer.from(HashingLogic.hashAttestation(emailAttestation), 'hex')
  )
  const fullNameProof = tree.getProof(
    Buffer.from(HashingLogic.hashAttestation(fullNameAttestation), 'hex')
  )
  const phoneProof = tree.getProof(
    Buffer.from(HashingLogic.hashAttestation(phoneAttestation), 'hex')
  )

  expect(tree.verify(emailProof, tree.getLeaves()[0], root)).toBeTruthy()
  expect(tree.verify(emailProof, tree.getLeaves()[1], root)).toBeFalsy()
  expect(tree.verify(emailProof, tree.getLeaves()[2], root)).toBeFalsy()

  expect(tree.verify(fullNameProof, leaves[0], root)).toBeFalsy()
  expect(tree.verify(fullNameProof, leaves[1], root)).toBeTruthy()
  expect(tree.verify(fullNameProof, leaves[2], root)).toBeFalsy()

  expect(tree.verify(phoneProof, leaves[0], root)).toBeFalsy()
  expect(tree.verify(phoneProof, leaves[1], root)).toBeFalsy()
  expect(tree.verify(phoneProof, leaves[2], root)).toBeTruthy()
})
