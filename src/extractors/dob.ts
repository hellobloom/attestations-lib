import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractDOB = (a: B.MaybeDS<AD.IBaseAttDOB>, _attType: string, valType: string): string | null => {
  switch (valType) {
    case 'dob':
      if (typeof a === 'string') {
        return B.getDateString(a)
      } else if (typeof a === 'object') {
        return B.getDateString(a.data)
      } else {
        return null
      }
      break
    default:
      return null
  }
  return null
}
