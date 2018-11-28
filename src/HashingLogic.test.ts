import * as HashingLogic from './HashingLogic'
import * as ethereumjsWallet from 'ethereumjs-wallet'
const ethUtil = require('ethereumjs-util')

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

// tslint:disable:max-line-length
const preComputedHashes = {
  emailAttestationType:
    '0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6',
  emailAttestationDataHash:
    '0xd1696aa0222c2ee299efa58d265eaecc4677d8c88cb3a5c7e60bc5957fff514a',
  emailAttestationTypeHash:
    '0x5aa3911df2dd532a0a03c7c6b6a234bb435a31dd9616477ef6cddacf014929df',
  phoneAttestationType:
    '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563',
  phoneAttestationDataHash:
    '0x1d3ad3b73cddc7948cb0adfbbf6ce74dda20e42e864ecd67088985b339557461',
  phoneAttestationTypeHash:
    '0x90f61ca5746fc0223e9a7564fd75c2336f902a78c59dfeb04cf119b204f2a404',
  treeARootHash:
    '0xeff7cf589aa83bb524c9daeb776d171558b77a17ada025a94a67b0086dac5ede',
  emailDataTreeHash:
    '0x0ef39bc9c680c01dbf61db1186ea4632bb195b85575eb205670cb146ee181275',
  emailDataTreeHashAliceSigned:
    '0x124af1877444cbfea5a31a323449e76ab341c4df4d9943588fbe289c5eaf1bd339216d2e34c73d8d4f8f9f7bc939b1f127591ef25c4f1ce57d2e0af1a4cd8b561b',
  rootHash:
    '0xe72cf1f9a85fbc529cd17cded83d0021beb12359c7f238276d8e20aea603e928',
}
// tslint:enable:max-line-length

const preComputedAgreement = {
  types: {
    EIP712Domain: [
      {name: 'name', type: 'string'},
      {name: 'version', type: 'string'},
      {name: 'chainId', type: 'uint256'},
      {name: 'verifyingContract', type: 'address'},
    ],
    AttestationRequest: [
      {name: 'dataHash', type: 'bytes32'},
      {name: 'nonce', type: 'bytes32'},
    ],
  },
  primaryType: 'AttestationRequest',
  domain: {
    name: 'Bloom Attestation Logic',
    version: '2',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  message: {
    dataHash:
      '0xe72cf1f9a85fbc529cd17cded83d0021beb12359c7f238276d8e20aea603e928',
    nonce: '0xd5d7e6ae812a8ff7bd44f928b199806446c2170412df381efb41d8f47fcd044b',
  },
}

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

const emailRevocationLinks: HashingLogic.IRevocationLinks = {
  local: '0x5a35e46865c7a4e0a5443b03d17d60c528896881646e6d58d3c4ad90ef84448e',
  global: '0xe04448fe19da4c3d85d6e646188628825c86d71b30b5445a0e4a7c56864e53a7',
  dataHash:
    '0xd1696aa0222c2ee299efa58d265eaecc4677d8c88cb3a5c7e60bc5957fff514a',
  typeHash:
    '0x5aa3911df2dd532a0a03c7c6b6a234bb435a31dd9616477ef6cddacf014929df',
}

const emailAuxHash =
  '0x3a25e46865c7a4e0a5445b03b17d68c529826881647e6d58d3c4ad91ef83440f'

const emailAttestation: HashingLogic.IAttestation = {
  data: emailAttestationData,
  type: emailAttestationType,
  aux: emailAuxHash,
}

const emailAttestationNode: HashingLogic.IAttestationNode = {
  data: emailAttestationData,
  type: emailAttestationType,
  aux: emailAuxHash,
  link: emailRevocationLinks,
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

const phoneRevocationLinks: HashingLogic.IRevocationLinks = {
  local: '0xb85448fe09da4c3d85d6e646188698825c06d71d30b3445a0e4a7c56864e52a4',
  global: '0xe04448fe19da4c3d85d6e646188628825c86d71b30b5445a0e4a7c56864e53a7',
  dataHash:
    '0x1d3ad3b73cddc7948cb0adfbbf6ce74dda20e42e864ecd67088985b339557461',
  typeHash:
    '0x90f61ca5746fc0223e9a7564fd75c2336f902a78c59dfeb04cf119b204f2a404',
}

const phoneAuxHash =
  '0x303438fe19da4c3d85d6e746188618925c86d71b30b5443a0e4a7c56864e52b5'

const phoneAttestation: HashingLogic.IAttestation = {
  data: phoneAttestationData,
  type: phoneAttestationType,
  aux: phoneAuxHash,
}
const phoneAttestationNode: HashingLogic.IAttestationNode = {
  data: phoneAttestationData,
  type: phoneAttestationType,
  aux: phoneAuxHash,
  link: phoneRevocationLinks,
}

const sample13PaddingNodes = [
  '0x9fc2f4407a5c4d28539121adcc2b294d69eac31f6ddc82bd82fed867ade29e63',
  '0xb44f1116ecdc24656c276814ebbf5c8feebce925bda53891dc086eceab1b2d02',
  '0x3603a4be55fffb54b7bc20090ec92655c142ff6e5b5867e2a61c8dffbd232cfa',
  '0xf0214686e4f3cdfd0eb70eaab5456bd11587246677bda641c316f7825404d5ba',
  '0x1310aed20a28d0d21357bd4458766c85a363c3945a8e564ad34f1585324a5f18',
  '0x74fe469ba1ff7398eaeda42976f25bda861dd0281b9460a1c04f50b5a6c13566',
  '0x8f7dd55bfaf656bfcff6567e88311833776e7444bd433eed485e9791f4da9e33',
  '0x0ffe3ebb9d45aedf09a551b4c035940001b0b8f45cbbb3f996d2f75c750a1916',
  '0xeff79179da0425e950b168e30003ac6589a3d7de1261c61605a16cc758a1cc04',
  '0x57b916759597b63bc55eb8033cb25edf6b7a42f2098f7dd44a5e0263cccf34bb',
  '0x409203975c17a730b9ef7db829cd24504444fb386e2ead719618c3afc9aadb25',
  '0xa7c44c3ca235e9e95e4acfb653d2de2f8379e7b6f43d20a8c50c0c4fcea3ef64',
  '0xfba3ca75b60179e7b00edb36db2a2de9c917e4caad7de6dbc61dd1fbc30b3758',
]

const fourRootHashes = [
  '0x7a35e46865c7a4e0a5445b03d17d60c528896881646e6d58d3c4ad90ef84440e',
  '0xf1e980ada99fc38d5e99d95d1ba52578ebd03caca349cfa1f1d721c954882550',
  '0xb15e74e8068d54a6e69a6a2e16ab1f1652a0e4821b09e935c994bda54a0b9a4b',
  '0xfabbbef9b00916a5d0a9bdd6f92ef7053eda577ea321d0ee339aad9a31aba718',
]

const fourRootHashesDifferentOrder = [
  '0xb15e74e8068d54a6e69a6a2e16ab1f1652a0e4821b09e935c994bda54a0b9a4b',
  '0xfabbbef9b00916a5d0a9bdd6f92ef7053eda577ea321d0ee339aad9a31aba718',
  '0x7a35e46865c7a4e0a5445b03d17d60c528896881646e6d58d3c4ad90ef84440e',
  '0xf1e980ada99fc38d5e99d95d1ba52578ebd03caca349cfa1f1d721c954882550',
]

test('HashingLogic.generateNonce', () => {
  const nonce = HashingLogic.generateNonce()
  expect(nonce.length).toBe(66)
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

test('HashingLogic.getMerkleTreeFromLeaves', () => {
  const leaves = fourRootHashes

  const leavesDifferentOrder = fourRootHashesDifferentOrder

  const differentLeaves = [
    '0xc15e74e8068d54a6e69a6a2e16ab1f1652a0e4821b09e935c994bda54a0b9a4b',
    '0xfabbbef9b00916a5d0a9bdd6f92ef7053eda577ea321d0ee339aad9a31aba718',
    '0x7a35e46865c7a4e0a5445b03d17d60c528896881646e6d58d3c4ad90ef84440e',
    '0xf1e980ada99fc38d5e99d95d1ba52578ebd03caca349cfa1f1d721c954882550',
  ]

  const treeA = HashingLogic.getMerkleTreeFromLeaves(leaves)
  const treeB = HashingLogic.getMerkleTreeFromLeaves(leavesDifferentOrder)
  const treeC = HashingLogic.getMerkleTreeFromLeaves(differentLeaves)

  expect(treeA.getRoot().equals(treeB.getRoot())).toBeTruthy()
  expect(treeA.getRoot().equals(treeC.getRoot())).toBeFalsy()

  // If this doesn't match something changed
  expect(ethUtil.bufferToHex(treeA.getRoot())).toBe(
    preComputedHashes.treeARootHash
  )
})

test('HashingLogic.getDataTree & hashAttestationNode', () => {
  const dataTreeA = HashingLogic.getDataTree(emailAttestationNode)
  const dataTreeHash = HashingLogic.hashAttestationNode(emailAttestationNode)

  const dataTreeWrongDataNonce = HashingLogic.getDataTree({
    data: {
      data: 'test@bloom.co',
      nonce: 'b3877038-79a9-477d-8037-9826032e6af0',
      version: '1.0.0',
    },
    type: emailAttestationType,
    link: emailRevocationLinks,
    aux: emailAuxHash,
  })

  const dataTreeWrongTypeNonce = HashingLogic.getDataTree({
    data: emailAttestationData,
    type: {
      type: 'email',
      nonce: 'b3877038-79a9-477d-8037-9826032e6af1',
      provider: 'Bloom',
    },
    link: emailRevocationLinks,
    aux: emailAuxHash,
  })

  const dataTreeWrongLink = HashingLogic.getDataTree({
    data: emailAttestationData,
    type: emailAttestationType,
    link: {
      local:
        '0x6a35e46865c7a4e0a5443b03d17d60c528896881646e6d58d3c4ad90ef84448e',
      global:
        '0xe04448fe19da4c3d85d6e646188628825c86d71b30b5445a0e4a7c56864e53a7',
      dataHash:
        '0xd1696aa0222c2ee299efa58d265eaecc4677d8c88cb3a5c7e60bc5957fff514a',
      typeHash:
        '0x5aa3911df2dd532a0a03c7c6b6a234bb435a31dd9616477ef6cddacf014929df',
    },
    aux: emailAuxHash,
  })

  const dataTreeWrongAux = HashingLogic.getDataTree({
    data: emailAttestationData,
    type: emailAttestationType,
    link: emailRevocationLinks,
    aux: '0xf04448fe19da4c3d85d6e646188628825c86d71b30b5445a0e4a7c56864e53a7',
  })

  expect(
    dataTreeA.getRoot().equals(dataTreeWrongDataNonce.getRoot())
  ).toBeFalsy()
  expect(
    dataTreeA.getRoot().equals(dataTreeWrongTypeNonce.getRoot())
  ).toBeFalsy()
  expect(dataTreeA.getRoot().equals(dataTreeWrongLink.getRoot())).toBeFalsy()
  expect(dataTreeA.getRoot().equals(dataTreeWrongAux.getRoot())).toBeFalsy()

  // If this doesn't match something changed
  expect(ethUtil.bufferToHex(dataTreeA.getRoot())).toBe(
    preComputedHashes.emailDataTreeHash
  )

  expect(dataTreeA.getRoot().equals(dataTreeHash)).toBeTruthy()
})

test('HashingLogic.signHash & recoverHashSigner', () => {
  const emailDataRoot = HashingLogic.hashAttestationNode(emailAttestationNode)
  const signedEmailRoot = HashingLogic.signHash(emailDataRoot, alicePrivkey)

  const sender = HashingLogic.recoverHashSigner(emailDataRoot, signedEmailRoot)

  expect(sender.toLowerCase()).toBe(
    aliceWallet.getAddressString().toLowerCase()
  )
  expect(sender.toLowerCase()).not.toBe(
    bobWallet.getAddressString().toLowerCase()
  )

  // If this doesn't match something changed
  expect(signedEmailRoot).toBe(preComputedHashes.emailDataTreeHashAliceSigned)
})

test('HashingLogic.getBloomMerkleTree', () => {
  const emailDataRoot = HashingLogic.hashAttestationNode(emailAttestationNode)
  const signedEmailRoot = HashingLogic.signHash(emailDataRoot, alicePrivkey)
  const phoneDataRoot = HashingLogic.hashAttestationNode(phoneAttestationNode)
  const signedPhoneRoot = HashingLogic.signHash(phoneDataRoot, alicePrivkey)

  const dataHashes = [
    HashingLogic.hashMessage(signedEmailRoot),
    HashingLogic.hashMessage(signedPhoneRoot),
  ]

  const checksum = HashingLogic.getChecksum(dataHashes)
  const signedChecksumHash = HashingLogic.hashMessage(
    HashingLogic.signHash(checksum, alicePrivkey)
  )

  const tree = HashingLogic.getBloomMerkleTree(
    dataHashes,
    sample13PaddingNodes,
    signedChecksumHash
  )
  expect(ethUtil.bufferToHex(tree.getRoot())).toBe(preComputedHashes.rootHash)

  const leaves = tree.getLeaves()
  expect(leaves.length).toBe(16)

  // leaves should be in alphabetical order
  const leavesAsStrings = leaves.map(l => ethUtil.bufferToHex(l))
  const leavesStringified = JSON.stringify(leavesAsStrings)
  leavesAsStrings.sort()
  const leavesSortedStringified = JSON.stringify(leavesAsStrings)
  expect(leavesStringified).toBe(leavesSortedStringified)
})

test('HashingLogic.getChecksum', () => {
  const fourRootChecksum = HashingLogic.getChecksum(fourRootHashes)
  const fourRootChecksumDifferentOrder = HashingLogic.getChecksum(
    fourRootHashesDifferentOrder
  )

  expect(ethUtil.bufferToHex(fourRootChecksum).length).toBe(66)
  expect(fourRootChecksumDifferentOrder.equals(fourRootChecksum)).toBeTruthy()

  const oneRootHash = [
    '0x7a35e46865c7a4e0a5445b03d17d60c528896881646e6d58d3c4ad90ef84440e',
  ]
  const oneRootChecksum = HashingLogic.getChecksum(oneRootHash)
  expect(ethUtil.bufferToHex(oneRootChecksum).length).toBe(66)

  const noRootChecksum = HashingLogic.getChecksum([])
  expect(ethUtil.bufferToHex(noRootChecksum)).toBe(
    '0x518674ab2b227e5f11e9084f615d57663cde47bce1ba168b4c19c7ee22a73d70'
  )
})

test('HashingLogic.getSignedChecksum', () => {
  const signedChecksumHash = HashingLogic.signChecksum(
    fourRootHashes,
    alicePrivkey
  )
  const sender = HashingLogic.recoverHashSigner(
    HashingLogic.getChecksum(fourRootHashes),
    signedChecksumHash
  )

  expect(sender.toLowerCase()).toBe(
    aliceWallet.getAddressString().toLowerCase()
  )
  expect(sender.toLowerCase()).not.toBe(
    bobWallet.getAddressString().toLowerCase()
  )
})

test('HashingLogic.getPadding', () => {
  // If 0 data node padding should be 0
  let padding = HashingLogic.getPadding(0)
  expect(padding.length).toBe(0)

  // If 1 data node padding should be 14
  padding = HashingLogic.getPadding(1)
  padding.forEach(p => expect(p.length).toBe(66))
  expect(padding.length).toBe(14)

  // If 10 data node padding should be 5
  padding = HashingLogic.getPadding(10)
  padding.forEach(p => expect(p.length).toBe(66))
  expect(padding.length).toBe(5)

  // If 15 data node padding should be 0
  padding = HashingLogic.getPadding(15)
  expect(padding.length).toBe(0)

  // If 16 data node padding should be 495
  padding = HashingLogic.getPadding(16)
  padding.forEach(p => expect(p.length).toBe(66))
  expect(padding.length).toBe(495)

  // If 511 data node padding should be 0
  padding = HashingLogic.getPadding(511)
  expect(padding.length).toBe(0)

  // If 512 data node padding should be 15871
  padding = HashingLogic.getPadding(512)
  expect(padding.length).toBe(15871)
})

test('Bloom Merkle Tree Proofs', () => {
  const emailDataRoot = HashingLogic.hashAttestationNode(emailAttestationNode)
  const signedEmailRoot = HashingLogic.signHash(emailDataRoot, alicePrivkey)
  const phoneDataRoot = HashingLogic.hashAttestationNode(phoneAttestationNode)
  const signedPhoneRoot = HashingLogic.signHash(phoneDataRoot, alicePrivkey)

  const hashedEmailAttestation = HashingLogic.hashMessage(signedEmailRoot)
  const hashedPhoneAttestation = HashingLogic.hashMessage(signedPhoneRoot)

  const dataHashes = [hashedEmailAttestation, hashedPhoneAttestation]

  const checksum = HashingLogic.getChecksum(dataHashes)
  const signedChecksumHash = HashingLogic.hashMessage(
    HashingLogic.signHash(checksum, alicePrivkey)
  )

  const tree = HashingLogic.getBloomMerkleTree(
    dataHashes,
    sample13PaddingNodes,
    signedChecksumHash
  )
  const root = tree.getRoot()
  const leaves = tree.getLeaves()
  const emailProof = tree.getProof(ethUtil.toBuffer(hashedEmailAttestation))
  const phoneProof = tree.getProof(ethUtil.toBuffer(hashedPhoneAttestation))
  const checksumProof = tree.getProof(ethUtil.toBuffer(signedChecksumHash))

  const stringLeaves = leaves.map(x => ethUtil.bufferToHex(x))

  const emailPosition = stringLeaves.indexOf(hashedEmailAttestation)
  const checksumPosition = stringLeaves.indexOf(signedChecksumHash)
  const phonePosition = stringLeaves.indexOf(hashedPhoneAttestation)

  expect(
    HashingLogic.verifyMerkleProof(
      emailProof,
      tree.getLeaves()[emailPosition],
      root
    )
  ).toBeTruthy()
  expect(
    HashingLogic.verifyMerkleProof(
      emailProof,
      tree.getLeaves()[phonePosition],
      root
    )
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(
      emailProof,
      tree.getLeaves()[checksumPosition],
      root
    )
  ).toBeFalsy()

  expect(
    HashingLogic.verifyMerkleProof(checksumProof, leaves[emailPosition], root)
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(
      checksumProof,
      leaves[checksumPosition],
      root
    )
  ).toBeTruthy()
  expect(
    HashingLogic.verifyMerkleProof(checksumProof, leaves[phonePosition], root)
  ).toBeFalsy()

  expect(
    HashingLogic.verifyMerkleProof(phoneProof, leaves[checksumPosition], root)
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(phoneProof, leaves[emailPosition], root)
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(phoneProof, leaves[phonePosition], root)
  ).toBeTruthy()

  expect(
    HashingLogic.verifyMerkleProof([], Buffer.from(''), Buffer.from(''))
  ).toBeFalsy()
})

test('Attestation Data Tree Proofs', () => {
  const dataHash = HashingLogic.hashMessage(
    HashingLogic.orderedStringify(emailAttestationNode.data)
  )
  const typeHash = HashingLogic.hashMessage(
    HashingLogic.orderedStringify(emailAttestationNode.type)
  )
  const linkHash = HashingLogic.hashMessage(
    HashingLogic.orderedStringify(emailAttestationNode.link)
  )
  const auxHash = HashingLogic.hashMessage(emailAttestationNode.aux)

  const tree = HashingLogic.getDataTree(emailAttestationNode)
  const root = tree.getRoot()
  const leaves = tree.getLeaves()
  const dataProof = tree.getProof(ethUtil.toBuffer(dataHash))
  const typeProof = tree.getProof(ethUtil.toBuffer(typeHash))
  const linkProof = tree.getProof(ethUtil.toBuffer(linkHash))
  const auxProof = tree.getProof(ethUtil.toBuffer(auxHash))

  const stringLeaves = leaves.map(x => ethUtil.bufferToHex(x))

  const dataPosition = stringLeaves.indexOf(dataHash)
  const typePosition = stringLeaves.indexOf(typeHash)
  const linkPosition = stringLeaves.indexOf(linkHash)
  const auxPosition = stringLeaves.indexOf(auxHash)

  expect(
    HashingLogic.verifyMerkleProof(
      dataProof,
      tree.getLeaves()[dataPosition],
      root
    )
  ).toBeTruthy()
  expect(
    HashingLogic.verifyMerkleProof(
      dataProof,
      tree.getLeaves()[typePosition],
      root
    )
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(
      dataProof,
      tree.getLeaves()[linkPosition],
      root
    )
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(
      dataProof,
      tree.getLeaves()[auxPosition],
      root
    )
  ).toBeFalsy()

  expect(
    HashingLogic.verifyMerkleProof(
      typeProof,
      tree.getLeaves()[typePosition],
      root
    )
  ).toBeTruthy()
  expect(
    HashingLogic.verifyMerkleProof(
      typeProof,
      tree.getLeaves()[dataPosition],
      root
    )
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(
      typeProof,
      tree.getLeaves()[linkPosition],
      root
    )
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(
      typeProof,
      tree.getLeaves()[auxPosition],
      root
    )
  ).toBeFalsy()

  expect(
    HashingLogic.verifyMerkleProof(
      linkProof,
      tree.getLeaves()[linkPosition],
      root
    )
  ).toBeTruthy()
  expect(
    HashingLogic.verifyMerkleProof(
      linkProof,
      tree.getLeaves()[dataPosition],
      root
    )
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(
      linkProof,
      tree.getLeaves()[typePosition],
      root
    )
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(
      linkProof,
      tree.getLeaves()[auxPosition],
      root
    )
  ).toBeFalsy()

  expect(
    HashingLogic.verifyMerkleProof(
      auxProof,
      tree.getLeaves()[auxPosition],
      root
    )
  ).toBeTruthy()
  expect(
    HashingLogic.verifyMerkleProof(
      auxProof,
      tree.getLeaves()[dataPosition],
      root
    )
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(
      auxProof,
      tree.getLeaves()[typePosition],
      root
    )
  ).toBeFalsy()
  expect(
    HashingLogic.verifyMerkleProof(
      auxProof,
      tree.getLeaves()[linkPosition],
      root
    )
  ).toBeFalsy()
})

test('HashingLogic.getSignedDataNodes', () => {
  const globalLink = HashingLogic.generateNonce()
  const dataNode = HashingLogic.getSignedDataNode(
    emailAttestation,
    globalLink,
    alicePrivkey
  )

  expect(dataNode.attestationNode.link.global).toBe(globalLink)
  expect(dataNode.attestationNode.link.local.length).toBe(66)
  expect(dataNode.attestationNode.data).toEqual(emailAttestation.data)
  expect(dataNode.attestationNode.type).toEqual(emailAttestation.type)
  expect(dataNode.attestationNode.aux).toEqual(emailAttestation.aux)

  const attestationHash = HashingLogic.hashAttestationNode(
    dataNode.attestationNode
  )
  const sender = HashingLogic.recoverHashSigner(
    attestationHash,
    dataNode.signedAttestation
  )
  expect(sender.toLowerCase()).toBe(
    aliceWallet.getAddressString().toLowerCase()
  )
})

test('HashingLogic.getSignedMerkleTreeComponents', () => {
  const components = HashingLogic.getSignedMerkleTreeComponents(
    [emailAttestation, phoneAttestation],
    alicePrivkey
  )

  expect(components.paddingNodes.length).toBe(13)
  components.paddingNodes.forEach(p => {
    expect(p.length).toBe(66)
  })

  const checksum = HashingLogic.getChecksum(
    components.dataNodes.map(a => HashingLogic.hashMessage(a.signedAttestation))
  )
  const checksumSigner = HashingLogic.recoverHashSigner(
    checksum,
    components.checksumSig
  )
  expect(checksumSigner.toLowerCase()).toBe(
    aliceWallet.getAddressString().toLowerCase()
  )

  const rootHash = HashingLogic.getBloomMerkleTree(
    components.dataNodes.map(a =>
      HashingLogic.hashMessage(a.signedAttestation)
    ),
    components.paddingNodes,
    HashingLogic.hashMessage(components.checksumSig)
  ).getRoot()

  expect(ethUtil.bufferToHex(rootHash)).toBe(components.rootHash)

  const rootHashSigner = HashingLogic.recoverHashSigner(
    rootHash,
    components.signedRootHash
  )
  expect(rootHashSigner.toLowerCase()).toBe(
    aliceWallet.getAddressString().toLowerCase()
  )

  const layer2Hash = HashingLogic.hashMessage(
    HashingLogic.orderedStringify({
      rootHash: ethUtil.bufferToHex(rootHash),
      nonce: components.rootHashNonce,
    })
  )
  expect(layer2Hash).toBe(components.layer2Hash)

  const rootHashFromComponents = HashingLogic.getMerkleTreeFromComponents(
    components
  ).getRoot()
  expect(rootHashFromComponents.equals(rootHash)).toBeTruthy()
})

test(
  'HashingLogic getAttestationAgreement' +
    ' - has not been modified',
  () => {
    const contractAddress = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
    const dataHash = preComputedHashes.rootHash
    const nonce = '0xd5d7e6ae812a8ff7bd44f928b199806446c2170412df381efb41d8f47fcd044b'

    const agreementParams = JSON.stringify(
      HashingLogic.getAttestationAgreement(contractAddress, 1, dataHash, nonce)
    )
    // If this fails something changed
    expect(agreementParams).toBe(JSON.stringify(preComputedAgreement))
  }
)
