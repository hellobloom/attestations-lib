import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractEmail = (a: B.MaybeDS<AD.IBaseAttEmail>, _attType: string, valType: string): string | null => {
  switch (valType) {
    case 'email':
      let result = B.getAttrOrStr<AD.IBaseAttEmail, AD.IBaseAttEmailData>(a, 'email')
      return B.stringOrNull(result)
    default:
      return null
  }
}
