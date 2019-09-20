import {AttestationData as AD} from 'src'
import * as B from './base'

export const fields: Array<keyof AD.IBaseAttAccountData> = ['id', 'email', 'name', 'start_date', 'end_date']

export const extractAccount = (
  a: AD.IBaseAttAccount,
  _attType: string,
  valType: string,
): AD.IBaseAttAccountData | AD.TPersonalNameObj | string | number | null => {
  // Get first provider
  const account: AD.IBaseAttAccountData | null = B.getFirst(a.data)
  if (account) {
    if (valType === 'object') {
      return account
    } else if (account && typeof account === 'object' && valType in account) {
      const accountKey = valType as keyof AD.IBaseAttAccountData
      const val = account[accountKey]
      if (typeof val === 'undefined') {
        return null
      }
      if (accountKey === 'name' && typeof val === 'object') {
        return B.getNameString(val)
      }
      return val
    }
  }
  return null
}
