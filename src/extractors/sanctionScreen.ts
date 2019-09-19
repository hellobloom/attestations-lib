import {AttestationData as AD} from 'src'
import * as B from './base'

const dataFields: Array<keyof AD.IBaseAttSanctionScreenData> = ['id', 'name', 'dob', 'search_summary']
const searchSummaryFields: Array<keyof NonNullable<AD.IBaseAttSanctionScreenData['search_summary']>> = [
  'hit_location',
  'hit_number',
  'lists',
  'score',
  'hits',
  'flag_type',
  'comment',
]

export const extractSanctionScreen = async (
  a: AD.IBaseAttSanctionScreen,
  attType: string,
  valType: string,
): Promise<
  | AD.IBaseAttSanctionScreenData
  | AD.IBaseAttSanctionScreenData['search_summary']
  | NonNullable<NonNullable<AD.IBaseAttSanctionScreenData['search_summary']>['hits']>
  | string
  | number
  | null
> => {
  if (!a.data) {
    return null
  }

  let d = await B.getFirst(a.data)

  if (valType === 'object') return d

  if (!d) return null

  if (dataFields.indexOf(valType as any) !== -1) {
    return d[valType]
  }

  if (searchSummaryFields.indexOf(valType as any) !== -1) {
    let s = d['search_summary']
    if (!s) return null
    return s[valType] || null
  }

  return null
}
