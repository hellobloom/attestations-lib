export type AttestationType = {
  id: number
  scoreWeight: number
  nameFriendly: string
  name?: string
}

export enum AttestationTypeID {
  'phone' = 0,
  'email' = 1,
  'facebook' = 2,
  'sanction-screen' = 3,
  'pep-screen' = 4,
  'id-document' = 5,
  'google' = 6,
  'linkedin' = 7,
  'twitter' = 8,
  'payroll' = 9,
  'ssn' = 10,
  'criminal' = 11,
  'offense' = 12,
  'driving' = 13,
  'employment' = 14,
  'education' = 15,
  'drug' = 16,
  'bank' = 17,
  'utility' = 18,
  'income' = 19,
  'assets' = 20,
  'full-name' = 21,
  'birth-date' = 22,
  'gender' = 23,
  'corporate' = 24,
  'meta' = 25,
}

export type AttestationTypeManifest = {
  [P in keyof typeof AttestationTypeID]: AttestationType
}

export const AttestationTypes: AttestationTypeManifest = {
  phone: {
    id: AttestationTypeID.phone,
    scoreWeight: 5,
    nameFriendly: 'Phone',
  },
  email: {
    id: 1,
    scoreWeight: 5,
    nameFriendly: 'Email',
  },
  facebook: {
    id: AttestationTypeID.facebook,
    scoreWeight: 5,
    nameFriendly: 'Facebook',
  },
  'sanction-screen': {
    id: AttestationTypeID['sanction-screen'],
    scoreWeight: 10,
    nameFriendly: 'Sanction Screen',
  },
  'pep-screen': {
    id: AttestationTypeID['pep-screen'],
    scoreWeight: 10,
    nameFriendly: 'PEP Screen',
  },
  'id-document': {
    id: AttestationTypeID['id-document'],
    scoreWeight: 20,
    nameFriendly: 'ID Document',
  },
  google: {
    id: AttestationTypeID.google,
    scoreWeight: 5,
    nameFriendly: 'Google',
  },
  linkedin: {
    id: AttestationTypeID.linkedin,
    scoreWeight: 5,
    nameFriendly: 'LinkedIn',
  },
  twitter: {
    id: AttestationTypeID.twitter,
    scoreWeight: 5,
    nameFriendly: 'Twitter',
  },
  payroll: {
    id: AttestationTypeID.payroll,
    scoreWeight: 15,
    nameFriendly: 'Payroll',
  },
  ssn: {
    id: AttestationTypeID.ssn,
    scoreWeight: 15,
    nameFriendly: 'Social Security Number',
  },
  criminal: {
    id: AttestationTypeID.criminal,
    scoreWeight: 15,
    nameFriendly: 'Criminal Records',
  },
  offense: {
    id: AttestationTypeID.offense,
    scoreWeight: 10,
    nameFriendly: 'Offense Records',
  },
  driving: {
    id: AttestationTypeID.driving,
    scoreWeight: 15,
    nameFriendly: 'Driving Records',
  },
  employment: {
    id: AttestationTypeID.employment,
    scoreWeight: 15,
    nameFriendly: 'Employment',
  },
  education: {
    id: AttestationTypeID.education,
    scoreWeight: 10,
    nameFriendly: 'Education',
  },
  drug: {
    id: AttestationTypeID.drug,
    scoreWeight: 5,
    nameFriendly: 'Drug Screen',
  },
  bank: {
    id: AttestationTypeID.bank,
    scoreWeight: 15,
    nameFriendly: 'Bank Statement',
  },
  utility: {
    id: AttestationTypeID.utility,
    scoreWeight: 10,
    nameFriendly: 'Utility Statements',
  },
  income: {
    id: AttestationTypeID.income,
    scoreWeight: 15,
    nameFriendly: 'Income Verification',
  },
  assets: {
    id: AttestationTypeID.assets,
    scoreWeight: 15,
    nameFriendly: 'Assets Verification',
  },
  'full-name': {
    id: AttestationTypeID['full-name'],
    scoreWeight: 5,
    nameFriendly: 'Full Name',
  },
  'birth-date': {
    id: AttestationTypeID['birth-date'],
    scoreWeight: 5,
    nameFriendly: 'Date of Birth',
  },
  gender: {
    id: AttestationTypeID['gender'],
    scoreWeight: 5,
    nameFriendly: 'Gender',
  },
  corporate: {
    id: AttestationTypeID['corporate'],
    scoreWeight: 5,
    nameFriendly: 'Gender',
  },
  meta: {
    id: AttestationTypeID['meta'],
    scoreWeight: 15,
    nameFriendly: 'Gender',
  },
}

export const AttestationTypesByID = Object.keys(AttestationTypes).reduce(
  (acc: any, key: string) => {
    return (Object as any).assign(acc, {
      [AttestationTypes[key].id.toString()]: (Object as any).assign(
        {},
        AttestationTypes[key],
        {
          name: key,
        }
      ),
    })
  },
  {}
)

export type TAttestationTypeNames = keyof typeof AttestationTypeID
export const AttestationTypeNames = Object.keys(AttestationTypes)

export const AttestationTypeIDs: AttestationTypeID[] = Object.keys(
  AttestationTypes
).map(k => AttestationTypes[k].id)

// Type accessors

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

export const getAttestationTypeStr = attestationTypeAccessor('name')

export const getBloomIDStrength = attestationTypeAccessor('scoreWeight')

export const getFormattedName = attestationTypeAccessor('nameFriendly')

export enum AttestationStatus {
  initial = 'initial', // initial state
  ready = 'ready', // ready for attestation
  complete = 'complete', // attestation complete
  rejected = 'rejected', // attestation rejected
}
