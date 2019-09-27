import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractPhone = (a: B.MaybeDS<AD.IBaseAttPhone>, _attType: string, valType: string): string | null => {
  switch (valType) {
    case 'number':
      let result = B.getAttrOrStr<AD.IBaseAttPhone, AD.TPhoneNumberObj>(a, 'full')
      return B.stringOrNull(result)
    default:
      return null
  }
}
