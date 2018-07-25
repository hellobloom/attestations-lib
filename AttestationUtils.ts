import {AttestationTypeID} from './AttestationTypeID'

export function getAttestationTypeStr(typeId: AttestationTypeID): string {
  if (typeId === AttestationTypeID.email) {
    return 'email'
  } else if (typeId === AttestationTypeID.phone) {
    return 'phone'
  } else if (typeId === AttestationTypeID.facebook) {
    return 'facebook'
  } else if (typeId === AttestationTypeID.sanctionScreen) {
    return 'sanction-screen'
  } else {
    throw Error(`AttestationTypeID '${typeId}' not supported`)
  }
}

export function getBloomIDStrength(typeId: AttestationTypeID) {
  switch (typeId) {
    case AttestationTypeID.email:
    case AttestationTypeID.phone:
    case AttestationTypeID.facebook:
      return 5
    case AttestationTypeID.sanctionScreen:
      return 10
    default:
      throw Error(`AttestationTypeID ${typeId} not supported`)
  }
}

export function getFormattedName(typeId: AttestationTypeID) {
  switch (typeId) {
    case AttestationTypeID.email:
      return 'Email'
    case AttestationTypeID.phone:
      return 'Phone'
    case AttestationTypeID.facebook:
      return 'Facebook'
    case AttestationTypeID.sanctionScreen:
      return 'Sanction Screen'
    default:
      throw Error(`AttestationTypeID ${typeId} not supported`)
  }
}
