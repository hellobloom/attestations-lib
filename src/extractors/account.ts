import {AttestationData as AD} from 'src'
import * as B from './base'

export const fields: Array<keyof AD.IBaseAttAccountData> = ['id', 'email', 'name', 'start_date', 'end_date']

export const extractAccount = async (
  a: AD.IBaseAttAccount,
  _attType: string,
  valType: string,
): Promise<AD.IBaseAttAccountData | AD.TPersonalNameObj | string | number | null> => {
  // Get first provider
  const account: AD.IBaseAttAccountData | null = await B.getFirst(a.data)
  if (account) {
    if (valType === 'object') {
      return account
    } else if (account && typeof account === 'object' && valType in account) {
      const val = account[valType as keyof AD.IBaseAttAccountData]
      if (typeof val === 'undefined') {
        return null
      }
      return val
    }
  }
  return null
}
