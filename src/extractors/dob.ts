import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractDOB = async (a: B.MaybeDS<AD.IBaseAttDOB>, attType: string, valType: string): Promise<string | null> => {
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
