import {AttestationTypeID, getAttestationTypeStr, getBloomIDStrength, getFormattedName} from '../src/AttestationTypes'

test('AttestationTypes.getAttestationTypeAttrib does not throw', () => {
  Object.keys(AttestationTypeID)
    .filter(k => typeof AttestationTypeID[k as any] === 'number')
    .forEach(_key => {
      const key = _key as keyof typeof AttestationTypeID
      getAttestationTypeStr(AttestationTypeID[key])
      getBloomIDStrength(AttestationTypeID[key])
      getFormattedName(AttestationTypeID[key])
    })
})
