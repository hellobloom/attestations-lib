import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractSSN = (a: B.MaybeDS<AD.IBaseAttSSN>, _attType: string, valType: string): string | null => {
  switch (valType) {
    case 'number':
      let result = B.getAttrOrStr<AD.IBaseAttSSN, AD.IBaseAttSSNData>(a, 'id')
      return B.stringOrNull(result)
    default:
      return null
  }
}
