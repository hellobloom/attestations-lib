import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractAssets = (a: AD.IBaseAttAssets, _attType: string, valType: string): AD.IBaseAttAssets | string | number | null => {
  // Naive one-account implementation.  Will need future improvement, like adding together values with currency
  // conversions at time of attestation.
  let account = B.getFirst(a.data)
  if (!account) {
    return null
  }
  switch (valType) {
    case 'object':
      return a
    case 'value':
      return account.value || null
    case 'currency':
      return a.currency || null
    case 'institution_name':
      return account.institution_name || null
    case 'type':
      return account.type || null
    default:
      return null
  }
}
