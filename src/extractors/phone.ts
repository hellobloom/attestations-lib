import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractPhone = async (a: B.MaybeDS<AD.IBaseAttPhone>, attType: string, valType: string): Promise<string | null> => {
  switch (valType) {
    case 'number':
      let result = await B.getAttrOrStr<AD.IBaseAttPhone, AD.TPhoneNumberObj>(a, 'full')
      return B.stringOrNull(result)
      break
    default:
      return null
  }
  return null
}
