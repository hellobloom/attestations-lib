import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractEmail = (a: B.MaybeDS<AD.IBaseAttEmail>, _attType: string, valType: string): string | null => {
  switch (valType) {
    case 'email':
      if (typeof a === 'string') {
        let result = B.getAttrOrStr<AD.IBaseAttEmail, AD.IBaseAttEmailData>(a, 'email')
        return B.stringOrNull(result)
      } else if (typeof a === 'object') {
        if (a.data instanceof Array) {
          if (a.data.length === 0) {
            return null
          } else if (typeof a.data[0] === 'string') {
            return B.getEmailString(a.data[0])
          } else if (typeof a.data[0] === 'object') {
            return B.getEmailString(a.data[0])
          }
        } else {
          return B.getEmailString(a.data)
        }
      }
      return null
      break
    default:
      return null
  }
}
