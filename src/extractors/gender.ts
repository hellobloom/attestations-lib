import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractGender = async (a: B.MaybeDS<AD.IBaseAttGender>, attType: string, valType: string): Promise<string | null> => {
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
