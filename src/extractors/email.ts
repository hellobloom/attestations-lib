import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractEmail = async (a: B.MaybeDS<AD.IBaseAttEmail>, _attType: string, valType: string): Promise<string | null> => {
  switch (valType) {
    case 'email':
      let result = await B.getAttrOrStr<AD.IBaseAttEmail, AD.IBaseAttEmailData>(a, 'email')
      return B.stringOrNull(result)
      break
    default:
      return null
  }
  return null
}
