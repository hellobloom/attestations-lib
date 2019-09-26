import {AttestationData as AD} from 'src'

export const extractIncome = (a: AD.IBaseAttIncome, _attType: string, valType: string): AD.IBaseAttIncome | string | number | null => {
  if (!a.summary) {
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
}
