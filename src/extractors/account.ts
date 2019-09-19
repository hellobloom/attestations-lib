import {AttestationData as AD} from 'src'
import * as B from './base'

export const fields: Array<keyof AD.IBaseAttAccountData> = ['id', 'email', 'name', 'start_date', 'end_date']

export const extractAccount = async (
  a: AD.IBaseAttAccount,
  attType: string,
  valType: string,
): Promise<AD.IBaseAttAccountData | string | number | null> => {
  // Get first provider
  let account: AD.IBaseAttAccountData | null = await B.getFirst(a.data)
  if (account) {
    if (valType === 'object') {
      return account
    } else if (account && valType in account) {
      return account[valType]
    }
  }
  return null
}
