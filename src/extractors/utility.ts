import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractUtility = (
  a: AD.IBaseAttUtility,
  _attType: string,
  valType: string,
): AD.IBaseAttUtility | string | number | AD.TAddress | null | AD.IBaseAttUtilityProvider['accounts'] => {
  if (valType === 'object') {
    return a
  }

  if (
    a.summary &&
    (['date', 'currency', 'total_paid', 'account_number', 'statement_date', 'address'] as Array<string>).indexOf(valType) !== -1
  ) {
    if (valType === 'address') {
      if (typeof a.summary.address === 'undefined') return null
      let addr = B.getFirst(a.summary.address)
      return addr || null
    }

    switch (valType) {
      case 'date':
        return a.summary.date || null
      case 'currency':
        return a.summary.currency || null
      case 'total_paid':
        return typeof a.summary.total_paid === 'number' ? a.summary.total_paid : null
      case 'account_number':
        return a.summary.account_numbers ? B.getFirstPrimitive(a.summary.account_numbers) : null
      case 'statement_date':
        return a.summary.statement_dates ? B.getFirstPrimitive(a.summary.statement_dates) : null
      default:
        return null
    }
  }

  if (a.data && ['name', 'id', 'country', 'service_types', 'website', 'accounts'].indexOf(valType as any) !== -1) {
    const data = B.getFirst(a.data)
    if (!data) {
      return null
    }

    if (valType === 'accounts') {
      return data.accounts
    }
    return data[valType as keyof AD.IBaseAttUtilityProvider]
  }

  return null
}
