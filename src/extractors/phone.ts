import {AttestationData as AD} from 'src'
import * as B from './base'
import {TNDIMobileNo} from '../NDIData'

export const extractPhone = (a: B.MaybeDS<AD.IBaseAttPhone>, _attType: string, valType: string): string | null => {
  switch (valType) {
    case 'number':
      let result = B.getAttrOrStr<AD.IBaseAttPhone, AD.TPhoneNumberObj>(a, 'full')
      if (typeof a === 'object' && result === undefined) {
        // Try NDI extraction
        try {
          let aNDI = a.data as TNDIMobileNo
          let ndiNumber = aNDI.prefix.value.toString() + aNDI.areacode.value.toString() + aNDI.nbr.value.toString()
          return ndiNumber
        } catch {
          return null
        }
      }
      return B.stringOrNull(result)
    default:
      return null
  }
}
