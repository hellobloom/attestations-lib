import * as Validation from './Validation'
import * as HashingLogic from './HashingLogic'
import * as ethereumjsWallet from 'ethereumjs-wallet'
const ethSigUtil = require('eth-sig-util')

const aliceWallet = ethereumjsWallet.fromPrivateKey(
  new Buffer(
    'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
    'hex'
  )
)
const alicePrivkey = aliceWallet.getPrivateKey()
const bobWallet = ethereumjsWallet.fromPrivateKey(
  new Buffer(
    'ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f',
    'hex'
  )
)

const bobPrivkey = bobWallet.getPrivateKey()
const bobAddress = bobWallet.getAddressString()

const emailAttestationData: HashingLogic.IAttestationData = {
  data: 'test@bloom.co',
  nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
  version: '1.0.0',
}

const emailAttestationType: HashingLogic.IAttestationType = {
  type: 'email',
  nonce: 'a3877038-79a9-477d-8037-9826032e6af1',
  provider: 'Bloom',
}

const emailIssuanceNode: HashingLogic.IIssuanceNode = {
  localRevocationToken:
    '0x5a35e46865c7a4e0a5443b03d17d60c528896881646e6d58d3c4ad90ef84448e',
  globalRevocationToken:
    '0xe04448fe19da4c3d85d6e646188628825c86d71b30b5445a0e4a7c56864e53a7',
  dataHash:
    '0xd1696aa0222c2ee299efa58d265eaecc4677d8c88cb3a5c7e60bc5957fff514a',
  typeHash:
    '0x5aa3911df2dd532a0a03c7c6b6a234bb435a31dd9616477ef6cddacf014929df',
  issuanceDate: '2016-02-01T00:00:00.000Z',
  expirationDate: '2018-02-01T00:00:00.000Z',
}

const emailAuxHash =
  '0x3a25e46865c7a4e0a5445b03b17d68c529826881647e6d58d3c4ad91ef83440f'

const emailAttestation: HashingLogic.IAttestationLegacy = {
  data: emailAttestationData,
  type: emailAttestationType,
  aux: emailAuxHash,
}

const emailIssuedClaimNode: HashingLogic.IIssuedClaimNode = {
  data: emailAttestationData,
  type: emailAttestationType,
  aux: emailAuxHash,
  issuance: emailIssuanceNode,
}

const phoneAttestationData: HashingLogic.IAttestationData = {
  data: '+17203600587',
  nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
  version: '1.0.0',
}
const phoneAttestationType: HashingLogic.IAttestationType = {
  type: 'phone',
  nonce: 'a3877038-79a9-477d-8037-9826032e6af0',
  provider: 'Bloom',
}

const phoneAuxHash =
  '0x303438fe19da4c3d85d6e746188618925c86d71b30b5443a0e4a7c56864e52b5'

const phoneAttestation: HashingLogic.IAttestationLegacy = {
  data: phoneAttestationData,
  type: phoneAttestationType,
  aux: phoneAuxHash,
}

const contractAddress = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'

const components = HashingLogic.getSignedMerkleTreeComponents(
  [emailAttestation, phoneAttestation],
  emailIssuedClaimNode.issuance.issuanceDate,
  emailIssuedClaimNode.issuance.expirationDate,
  alicePrivkey
)

const requestNonce = HashingLogic.generateNonce()

const bobSubjectSig = ethSigUtil.signTypedData(bobPrivkey, {
  data: HashingLogic.getAttestationAgreement(
    contractAddress,
    1,
    components.layer2Hash,
    requestNonce
  ),
})

const batchComponents = HashingLogic.getSignedBatchMerkleTreeComponents(
  components,
  contractAddress,
  bobSubjectSig,
  bobAddress,
  requestNonce,
  alicePrivkey
)

test('Validation.validateBloomMerkleTreeComponents', () => {
  const validated = Validation.validateBloomMerkleTreeComponents(components)
  expect(validated.kind).toBe('validated')
})

test('HashingLogic.getSignedBatchMerkleTreeComponents', () => {
  const validated = Validation.validateBloomBatchMerkleTreeComponents(
    batchComponents
  )
  expect(validated.kind).toBe('validated')
})

test('Validation.isNotEmptyString', () => {
  expect(Validation.isNotEmptyString('')).toBeFalsy()
  expect(Validation.isNotEmptyString('a')).toBeTruthy()
})

test('Validation.isValidEthHexString', () => {
  expect(Validation.isValidEthHexString('abc')).toBeFalsy()
  expect(Validation.isValidEthHexString('0xabc')).toBeTruthy()
})

test('Validation.isValidHash', () => {
  expect(Validation.isValidHash('abc')).toBeFalsy()
  expect(
    Validation.isValidHash(
      '9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658'
    )
  ).toBeFalsy()
  expect(
    Validation.isValidHash(
      '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb65'
    )
  ).toBeFalsy()
  expect(
    Validation.isValidHash(
      '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658'
    )
  ).toBeTruthy()
})

test('Validation.isArrayOfPaddingNodes', () => {
  const validPadding = HashingLogic.getPadding(1)
  expect(Validation.isArrayOfPaddingNodes(validPadding)).toBeTruthy()
  expect(Validation.isArrayOfPaddingNodes([])).toBeFalsy()
  const invalidPadding = validPadding.map(a =>
    a.substring(0, Math.round(Math.random() * a.length))
  )
  expect(Validation.isArrayOfPaddingNodes(invalidPadding)).toBeFalsy()
})

test('Validation.isValidTypeString', () => {
  expect(Validation.isValidTypeString('phone')).toBeTruthy()
  expect(Validation.isValidTypeString('sms')).toBeFalsy()
})

test('Validation.validateAttesterClaimSig', () => {
  expect(
    Validation.validateAttesterClaimSig(
      components.claimNodes[0].attesterSig,
      components.claimNodes[0]
    )
  ).toBeTruthy()
  expect(
    Validation.validateAttesterClaimSig(
      components.claimNodes[0].attesterSig,
      components.claimNodes[1]
    )
  ).toBeFalsy()
})

test('Validation.validateAttesterRootSig', () => {
  expect(
    Validation.validateAttesterRootSig(components.attesterSig, components)
  ).toBeTruthy()
  expect(
    Validation.validateAttesterRootSig(
      components.claimNodes[0].attesterSig,
      components
    )
  ).toBeFalsy()
})

test('Validation.validateBatchAttesterSig', () => {
  expect(
    Validation.validateBatchAttesterSig(
      batchComponents.batchAttesterSig,
      batchComponents
    )
  ).toBeTruthy()
  expect(
    Validation.validateBatchAttesterSig(
      batchComponents.attesterSig,
      batchComponents
    )
  ).toBeFalsy()
})

test('Validation.validateSubjectSig', () => {
  expect(
    Validation.validateSubjectSig(batchComponents.subjectSig, batchComponents)
  ).toBeTruthy()
  expect(
    Validation.validateSubjectSig(batchComponents.attesterSig, batchComponents)
  ).toBeFalsy()
})

test('Validation.validateChecksumSig', () => {
  expect(
    Validation.validateChecksumSig(batchComponents.checksumSig, batchComponents)
  ).toBeTruthy()
  expect(
    Validation.validateChecksumSig(batchComponents.attesterSig, batchComponents)
  ).toBeFalsy()
  expect(
    Validation.validateChecksumSig(components.checksumSig, components)
  ).toBeTruthy()
  expect(
    Validation.validateChecksumSig(components.attesterSig, components)
  ).toBeFalsy()
})

test('Validation.isValidSignatureString', () => {
  expect(Validation.isValidSignatureString(components.attesterSig)).toBeTruthy()
  expect(
    Validation.isValidSignatureString(components.rootHashNonce)
  ).toBeFalsy()
})

test('Validation.isValidArrayOfClaimNodes', () => {
  expect(
    Validation.isValidArrayOfClaimNodes(components.claimNodes)
  ).toBeTruthy()
  expect(
    Validation.isValidArrayOfClaimNodes(components.paddingNodes)
  ).toBeFalsy()
  expect(Validation.isValidArrayOfClaimNodes([])).toBeFalsy()
})
