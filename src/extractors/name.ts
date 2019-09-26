import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractName = (a: B.MaybeDS<AD.IBaseAttName>, _attType: string, valType: string): string | null => {
  switch (valType) {
    case 'full':
      if (typeof a === 'string') {
        return B.getNameString(a)
      } else if (typeof a === 'object') {
        if (a.data instanceof Array) {
          if (a.data.length === 0) {
            return null
          } else if (typeof a.data[0] === 'string') {
            return B.getNameString(a.data[0])
          } else if (typeof a.data[0] === 'object') {
            return B.getNameString(a.data[0])
          }
        } else {
          return B.getNameString(a.data)
        }
      } else {
        return null
      }
      break
    default:
      return null
  }
  return null
}
