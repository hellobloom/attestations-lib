import {AttestationData as AD} from 'src'
import * as B from './base'
// import {lensPath} from 'ramda'

export const extractUtility = async (
  a: AD.IBaseAttUtility,
  _attType: string,
  valType: string,
): Promise<AD.IBaseAttUtility | string | number | AD.TAddress | null> => {
  if (valType === 'object') {
    return a
  }

  if (!a.data) return null
  if (!a.summary) return null

  if ((['date', 'currency', 'total_paid', 'statement_date'] as Array<string>).indexOf(valType) !== -1) {
    switch (valType) {
      case 'date':
        return a.summary.date || null
        break
      case 'currency':
        return a.summary.currency || null
        break
      case 'total_paid':
        return a.summary.total_paid || null
        break
      case 'statement_date':
        return a.summary.statement_dates ? await B.getFirstPrimitive(a.summary.statement_dates) : null
        break
      default:
        return null
    }
  }

  if (valType === 'address') {
    if (typeof a.summary.address === 'undefined') return null
    let addr = await B.getFirst(a.summary.address)
    return addr || null
  }

  return null
}
