/**
 * Should correlate to AttestationLogic permittedTypesList ordering.
 * 
 * Example call to verify would look like:
 * var attestationLogic = new AttestationLogic(CONTRACT_ADDRESS);
 * attesationLogic.permittedTypesList.call(0) // should print out 'phone'
 * attesationLogic.permittedTypesList.call(5) // should print out 'id-document'
 */
export enum AttestationTypeID {
  phone = 0,
  email = 1,
  facebook = 2,
  sanctionScreen = 3,
  pepScreen = 4,
  idDocument = 5,
  google= 6,
  linkedin= 7,
  twitter= 8,
}
