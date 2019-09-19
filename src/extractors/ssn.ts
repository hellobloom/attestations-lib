import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractSSN = async (a: B.MaybeDS<AD.IBaseAttSSN>, _attType: string, valType: string): Promise<string | null> => {
  switch (valType) {
    case 'number':
      let result = await B.getAttrOrStr<AD.IBaseAttSSN, AD.IBaseAttSSNData>(a, 'id')
      return B.stringOrNull(result)
      break
    default:
      return null
  }
  return null
}
