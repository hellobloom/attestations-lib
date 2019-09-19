import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractGender = (a: B.MaybeDS<AD.IBaseAttGender>, _attType: string, valType: string): string | null => {
  switch (valType) {
    case 'gender':
      if (typeof a === 'string') {
        return a
      } else if (typeof a === 'object' && typeof a.data === 'string') {
        return a.data
      }
      break
    default:
      return null
  }
  return null
}
