import {AttestationData as AD} from 'src'
import * as NDI from '../NDIData'

export const extractIncome = (
  a: AD.TBaseAttIncome,
  _attType: string,
  valType: string,
): AD.IBaseAttIncomeObj | NDI.TNDIHouseholdIncome | string | number | null => {
  if ('summary' in a) {
    if (typeof a.summary === 'undefined') {
      return null
    }
    switch (valType) {
      case 'object':
        return a
      case 'net':
        return a.summary.net ? a.summary.net.total : null
      case 'gross':
        return a.summary.gross ? a.summary.gross.total : null
      case 'expenses':
        return a.summary.expenses ? a.summary.expenses.total : null
      case 'start_date':
        return a.summary.start_date ? a.summary.start_date : null
      case 'end_date':
        return a.summary.end_date ? a.summary.end_date : null
      case 'currency':
        return a.summary.currency ? a.summary.currency : null
      default:
        return null
    }
  } else {
    if ('generality' in a) {
      return null
    } else {
      return a.data
    }
  }
}
