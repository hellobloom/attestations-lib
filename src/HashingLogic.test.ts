import * as HashingLogic from './HashingLogic'
import {AttestationTypeID} from './AttestationTypes'

const preComputedHashes = {
  emailAttestationType:
    '0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6',
  emailAttestationDataHash:
    'd1696aa0222c2ee299efa58d265eaecc4677d8c88cb3a5c7e60bc5957fff514a',
  emailAttestationTypeHash:
    '5aa3911df2dd532a0a03c7c6b6a234bb435a31dd9616477ef6cddacf014929df',
  phoneAttestationType:
    '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563',
  phoneAttestationDataHash:
    '1d3ad3b73cddc7948cb0adfbbf6ce74dda20e42e864ecd67088985b339557461',
  phoneAttestationTypeHash:
    '90f61ca5746fc0223e9a7564fd75c2336f902a78c59dfeb04cf119b204f2a404',
}

test('HashingLogic.hashAttestationTypes', () => {
  // Deprecated

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

test('HashingLogic.getPadding', () => {
  // If 0 data node padding should be 0
  let padding = HashingLogic.getPadding(0)
  expect(padding.length).toBe(0)

  // If 1 data node padding should be 14
  padding = HashingLogic.getPadding(1)
  padding.forEach(p => expect(p.length).toBe(64))
  expect(padding.length).toBe(14)

  // If 10 data node padding should be 5
  padding = HashingLogic.getPadding(10)
  padding.forEach(p => expect(p.length).toBe(64))
  expect(padding.length).toBe(5)

  // If 15 data node padding should be 0
  padding = HashingLogic.getPadding(15)
  expect(padding.length).toBe(0)

  // If 16 data node padding should be 495
  padding = HashingLogic.getPadding(16)
  padding.forEach(p => expect(p.length).toBe(64))
  expect(padding.length).toBe(495)

  // If 511 data node padding should be 0
  padding = HashingLogic.getPadding(511)
  expect(padding.length).toBe(0)

  // If 512 data node padding should be 16383
  padding = HashingLogic.getPadding(512)
  expect(padding.length).toBe(15871)
})

test('HashingLogic hashAttestations matches', () => {
  const emailAttestationData: HashingLogic.IAttestationData = {
    data: 'test@bloom.co',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const emailAttestationDataHash = HashingLogic.hashAttestation(emailAttestationData)

  const emailAttestationType: HashingLogic.IAttestationType = {
    type: 'email',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    provider: 'Bloom',
  }
  const emailAttestationTypeHash = HashingLogic.hashAttestation(emailAttestationType)

  const phoneAttestationData: HashingLogic.IAttestationData = {
    data: '+17203600587',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const phoneAttestationDataHash = HashingLogic.hashAttestation(phoneAttestationData)

  const phoneAttestationType: HashingLogic.IAttestationType = {
    type: 'phone',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    provider: 'Bloom',
  }
  const phoneAttestationTypeHash = HashingLogic.hashAttestation(phoneAttestationType)

  // Precomputed hashes should match (if they don't a bug has potentially been introduced)
  expect(emailAttestationDataHash).toBe(preComputedHashes.emailAttestationDataHash)
  expect(emailAttestationTypeHash).toBe(preComputedHashes.emailAttestationTypeHash)
  expect(phoneAttestationDataHash).toBe(preComputedHashes.phoneAttestationDataHash)
  expect(phoneAttestationTypeHash).toBe(preComputedHashes.phoneAttestationTypeHash)
})

// IP todo test getMerkleTreeFromLeaves that it sorts deterministically

test('HashingLogic hashAttestations mismatches', () => {

  const emailAttestationData: HashingLogic.IAttestationData = {
    data: 'not-test@bloom.co', // Not test@bloom.co
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
    version: '1.0.0',
  }
  const emailAttestationDataHash = HashingLogic.hashAttestation(emailAttestationData)

  const notEmailAttestationType: HashingLogic.IAttestationType = {
    type: 'phone',
    provider: 'Bloom',
    nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
  }
  const emailAttestationTypeHash = HashingLogic.hashAttestation(notEmailAttestationType)

  expect(emailAttestationDataHash).not.toBe(preComputedHashes.emailAttestationDataHash)
  expect(emailAttestationTypeHash).not.toBe(preComputedHashes.emailAttestationTypeHash)
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

// test('HashingLogic merkle trees / proofs', () => {
//   const fullNameAttestation: HashingLogic.IAttestationData = {
//     type: 'full-name',
//     data: 'Ludwig Heinrich Edler von Mises',
//     nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
//     version: '1.0.0',
//   }
//   const emailAttestation: HashingLogic.IAttestationData = {
//     type: 'email',
//     data: 'test@bloom.co',
//     nonce: 'a3877038-79a9-477d-8037-9826032e6af1',
//     version: '1.0.0',
//   }
//   const phoneAttestation: HashingLogic.IAttestationData = {
//     type: 'phone',
//     data: '+17203600587',
//     nonce: 'a3877038-79a9-477d-8037-9826032e6af2',
//     version: '1.0.0',
//   }

//   const hashedEmailAttestation = HashingLogic.hashAttestation(emailAttestation)
//   const hashedPhoneAttestation = HashingLogic.hashAttestation(phoneAttestation)
//   const hashedFullNameAttestation = HashingLogic.hashAttestation(
//     fullNameAttestation
//   )

//   const tree = HashingLogic.getMerkleTree([
//     fullNameAttestation,
//     emailAttestation,
//     phoneAttestation,
//   ])
//   const root = tree.getRoot()
//   const leaves = tree.getLeaves()
//   const emailProof = tree.getProof(Buffer.from(hashedEmailAttestation, 'hex'))
//   const fullNameProof = tree.getProof(
//     Buffer.from(hashedFullNameAttestation, 'hex')
//   )
//   const phoneProof = tree.getProof(Buffer.from(hashedPhoneAttestation, 'hex'))

//   const treeDifferentOrder = HashingLogic.getMerkleTreeFromLeaves([
//     hashedEmailAttestation,
//     hashedFullNameAttestation,
//     hashedPhoneAttestation,
//   ])

//   const singleLeafTree = HashingLogic.getMerkleTree([emailAttestation])
//   const singleLeafTreeProof = singleLeafTree.getProof(
//     Buffer.from(hashedEmailAttestation, 'hex')
//   )

//   const stringLeaves = leaves.map(x => x.toString('hex'))

//   const emailPosition = stringLeaves.indexOf(hashedEmailAttestation)
//   const fullNamePosition = stringLeaves.indexOf(hashedFullNameAttestation)
//   const phonePosition = stringLeaves.indexOf(hashedPhoneAttestation)

//   expect(
//     HashingLogic.verifyMerkleProof(
//       emailProof,
//       tree.getLeaves()[emailPosition],
//       root
//     )
//   ).toBeTruthy()
//   expect(
//     HashingLogic.verifyMerkleProof(
//       emailProof,
//       tree.getLeaves()[phonePosition],
//       root
//     )
//   ).toBeFalsy()
//   expect(
//     HashingLogic.verifyMerkleProof(
//       emailProof,
//       tree.getLeaves()[fullNamePosition],
//       root
//     )
//   ).toBeFalsy()

//   expect(
//     HashingLogic.verifyMerkleProof(fullNameProof, leaves[emailPosition], root)
//   ).toBeFalsy()
//   expect(
//     HashingLogic.verifyMerkleProof(
//       fullNameProof,
//       leaves[fullNamePosition],
//       root
//     )
//   ).toBeTruthy()
//   expect(
//     HashingLogic.verifyMerkleProof(fullNameProof, leaves[phonePosition], root)
//   ).toBeFalsy()

//   expect(
//     HashingLogic.verifyMerkleProof(phoneProof, leaves[fullNamePosition], root)
//   ).toBeFalsy()
//   expect(
//     HashingLogic.verifyMerkleProof(phoneProof, leaves[emailPosition], root)
//   ).toBeFalsy()
//   expect(
//     HashingLogic.verifyMerkleProof(phoneProof, leaves[phonePosition], root)
//   ).toBeTruthy()

//   expect(
//     HashingLogic.verifyMerkleProof([], Buffer.from(''), Buffer.from(''))
//   ).toBeFalsy()

//   expect(
//     Buffer.compare(tree.getRoot(), treeDifferentOrder.getRoot()) === 0
//   ).toBeTruthy()

//   expect(
//     HashingLogic.verifyMerkleProof(
//       singleLeafTreeProof,
//       Buffer.from(hashedEmailAttestation, 'hex'),
//       singleLeafTree.getRoot()
//     )
//   ).toBeTruthy()
// })

// test(
//   'HashingLogic getAttestationAgreement' +
//     ' - format matches for same data independent of order of the objects properties',
//   () => {
//     const subject = '0x7ce40ed34b4170d4f2d027906552aa18f2137330'
//     const attester = '0x5bd995a55218baa26a6f25904bcc77805e11a337'
//     const requester = '0x156ba3f2af07d24cfd5dd8ec0fe2b17c6131d7fb'
//     const dataHash = preComputedHashes.emailAttestation
//     const typeHash = preComputedHashes.emailAttestationType
//     const nonce = HashingLogic.generateAttestationRequestNonceHash()

//     const agreementParamsA = JSON.stringify(
//       HashingLogic.getAttestationAgreement({
//         subject,
//         attester,
//         requester,
//         dataHash,
//         typeHash,
//         nonce,
//       })
//     )
//     const agreementParamsB = JSON.stringify(
//       HashingLogic.getAttestationAgreement({
//         nonce,
//         typeHash,
//         dataHash,
//         requester,
//         attester,
//         subject,
//       })
//     )
//     const agreementParamsC = JSON.stringify(
//       HashingLogic.getAttestationAgreement({
//         attester,
//         dataHash,
//         nonce,
//         requester,
//         subject,
//         typeHash,
//       })
//     )
//     const agreementParamsD = JSON.stringify(
//       HashingLogic.getAttestationAgreement({
//         attester,
//         dataHash,
//         nonce: HashingLogic.generateAttestationRequestNonceHash(),
//         requester,
//         subject,
//         typeHash,
//       })
//     )

//     expect(agreementParamsA).toBe(agreementParamsB)
//     expect(agreementParamsB).toBe(agreementParamsC)
//     expect(agreementParamsC).not.toBe(agreementParamsD)
//   }
// )
