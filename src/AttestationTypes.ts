import {reduce} from 'lodash'

export type AttestationType = {
  id: number
  nameContract: string
  scoreWeight: number
  nameFriendly: string
}

export enum AttestationTypeID {
  phone = 0,
  email = 1,
  facebook = 2,
  sanctionScreen = 3,
  pepScreen = 4,
  idDocument = 5,
  google = 6,
  linkedin = 7,
  twitter = 8,
  payroll = 9,
  ssn = 10,
  criminal = 11,
  offense = 12,
  driving = 13,
  employment = 14,
  education = 15,
  drug = 16,
  bank = 17,
  utility = 18,
}

export type AttestationTypeManifest = {
  [P in keyof typeof AttestationTypeID]: AttestationType
}

export const AttestationTypes: AttestationTypeManifest = {
  phone: {
    id: AttestationTypeID.phone,
    nameContract: 'phone',
    scoreWeight: 5,
    nameFriendly: 'Phone',
  },
  email: {
    id: 1,
    nameContract: 'email',
    scoreWeight: 5,
    nameFriendly: 'Email',
  },
  facebook: {
    id: AttestationTypeID.facebook,
    nameContract: 'facebook',
    scoreWeight: 5,
    nameFriendly: 'Facebook',
  },
  sanctionScreen: {
    id: AttestationTypeID.sanctionScreen,
    nameContract: 'sanction-screen',
    scoreWeight: 10,
    nameFriendly: 'Sanction Screen',
  },
  pepScreen: {
    id: AttestationTypeID.pepScreen,
    nameContract: 'pep-screen',
    scoreWeight: 10,
    nameFriendly: 'PEP Screen',
  },
  idDocument: {
    id: AttestationTypeID.idDocument,
    nameContract: 'id-document',
    scoreWeight: 20,
    nameFriendly: 'ID Document',
  },
  google: {
    id: AttestationTypeID.google,
    nameContract: 'google',
    scoreWeight: 5,
    nameFriendly: 'Google',
  },
  linkedin: {
    id: AttestationTypeID.linkedin,
    nameContract: 'linkedin',
    scoreWeight: 5,
    nameFriendly: 'LinkedIn',
  },
  twitter: {
    id: AttestationTypeID.twitter,
    nameContract: 'twitter',
    scoreWeight: 5,
    nameFriendly: 'Twitter',
  },
  payroll: {
    id: AttestationTypeID.payroll,
    nameContract: 'payroll',
    scoreWeight: 15,
    nameFriendly: 'Payroll',
  },
  ssn: {
    id: AttestationTypeID.ssn,
    nameContract: 'ssn',
    scoreWeight: 15,
    nameFriendly: 'Social Security Number',
  },
  criminal: {
    id: AttestationTypeID.criminal,
    nameContract: 'criminal',
    scoreWeight: 15,
    nameFriendly: 'Criminal Records',
  },
  offense: {
    id: AttestationTypeID.offense,
    nameContract: 'offense',
    scoreWeight: 10,
    nameFriendly: 'Offense Records',
  },
  driving: {
    id: AttestationTypeID.driving,
    nameContract: 'driving',
    scoreWeight: 15,
    nameFriendly: 'Driving Records',
  },
  employment: {
    id: AttestationTypeID.employment,
    nameContract: 'employment',
    scoreWeight: 15,
    nameFriendly: 'Employment',
  },
  education: {
    id: AttestationTypeID.education,
    nameContract: 'education',
    scoreWeight: 10,
    nameFriendly: 'Education',
  },
  drug: {
    id: AttestationTypeID.drug,
    nameContract: 'drug',
    scoreWeight: 5,
    nameFriendly: 'Drug Screen',
  },
  bank: {
    id: AttestationTypeID.bank,
    nameContract: 'bank',
    scoreWeight: 15,
    nameFriendly: 'Bank Statement',
  },
  utility: {
    id: AttestationTypeID.utility,
    nameContract: 'utility',
    scoreWeight: 10,
    nameFriendly: 'Utility Statements',
  },
}

export const AttestationTypesByID = reduce(
  AttestationTypes,
  (obj, val, key) => {
    obj[val.id.toString()] = (Object as any).assign({}, val, {name: key})
    return obj
  },
  {}
)

export const AttestationTypeNames = Object.keys(AttestationTypes)

export const AttestationTypeContractNames = Object.keys(AttestationTypes).map(
  k => AttestationTypes[k].nameContract
)

export const AttestationTypeIDs: AttestationTypeID[] = Object.keys(
  AttestationTypes
).map(k => AttestationTypes[k].id)

export const getAttestationTypeAttrib = (
  typeId: AttestationTypeID,
  attrib: keyof AttestationType
) => {
  let val = AttestationTypesByID[typeId.toString()][attrib]
  if (!val) throw new Error(`AttestationTypeID ${typeId} not supported`)
  return val
}

const attestationTypeAccessor = (attrib: keyof AttestationType) => (
  typeId: AttestationTypeID
) => getAttestationTypeAttrib(typeId, attrib)

export const getAttestationTypeStr = attestationTypeAccessor('nameContract')

export const getBloomIDStrength = attestationTypeAccessor('scoreWeight')

export const getFormattedName = attestationTypeAccessor('nameFriendly')

export enum AttestationStatus {
  initial = 'initial', // initial state
  ready = 'ready', // ready for attestation
  complete = 'complete', // attestation complete
  rejected = 'rejected', // attestation rejected
}
