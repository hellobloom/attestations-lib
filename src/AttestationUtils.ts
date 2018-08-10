import {AttestationTypeID} from './AttestationTypeID'

export function getAttestationTypeStr(typeId: AttestationTypeID): string {
  switch (typeId) {
    case AttestationTypeID.email:
      return 'email'
    case AttestationTypeID.phone:
      return 'phone'
    case AttestationTypeID.facebook:
      return 'facebook'
    case AttestationTypeID.sanctionScreen:
      return 'sanction-screen'
    case AttestationTypeID.pepScreen:
        return 'pep-screen'
    case AttestationTypeID.idDocument:
        return 'id-document'
    case AttestationTypeID.google:
      return 'google'
    case AttestationTypeID.linkedin:
      return 'linkedin'
    case AttestationTypeID.twitter:
      return 'twitter'
    default:
      throw Error(`AttestationTypeID ${typeId} not supported`)
  }
}

export function getBloomIDStrength(typeId: AttestationTypeID) {
  switch (typeId) {
    case AttestationTypeID.email:
    case AttestationTypeID.phone:
    case AttestationTypeID.facebook:
      return 5
    case AttestationTypeID.sanctionScreen:
    case AttestationTypeID.pepScreen:
      return 10
    case AttestationTypeID.idDocument:
      return 20
    case AttestationTypeID.google:
      return 5
    case AttestationTypeID.linkedin:
      return 5
    case AttestationTypeID.twitter:
      return 5
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
      case AttestationTypeID.pepScreen:
      return 'PEP Screen'
      case AttestationTypeID.idDocument:
      return 'ID Document'
      case AttestationTypeID.google:
      return 'Google'
      case AttestationTypeID.linkedin:
      return 'Linkedin'
      case AttestationTypeID.twitter:
      return 'Twitter'
    default:
      throw Error(`AttestationTypeID ${typeId} not supported`)
  }
}
