import {
  AttestationTypeID,
  getAttestationTypeStr,
  getBloomIDStrength,
  getFormattedName,
} from './AttestationTypes'

test('AttestationTypes.getAttestationTypeAttrib does not throw', () => {
  Object.keys(AttestationTypeID)
    .filter(k => typeof AttestationTypeID[k as any] === 'number')
    .forEach(key => {
      getAttestationTypeStr(AttestationTypeID[key])
      getBloomIDStrength(AttestationTypeID[key])
      getFormattedName(AttestationTypeID[key])
    })
})
