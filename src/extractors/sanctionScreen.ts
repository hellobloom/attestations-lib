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

export const extractSanctionScreen = (
  a: AD.IBaseAttSanctionScreen,
  _attType: string,
  valType: string,
):
  | AD.IBaseAttSanctionScreenData
  | AD.IBaseAttSanctionScreenData['id']
  | AD.IBaseAttSanctionScreenData['name']
  | AD.IBaseAttSanctionScreenData['dob']
  | AD.IBaseAttSanctionScreenData['search_summary']
  | NonNullable<NonNullable<AD.IBaseAttSanctionScreenData['search_summary']>['hits']>
  | string
  | number
  | null => {
  if (!a.data) {
    return null
  }

  let d = B.getFirst(a.data)

  if (valType === 'object') return d

  if (!d) return null

  if (dataFields.indexOf(valType as any) !== -1 && typeof d === 'object' && valType in d) {
    return d[valType as keyof AD.IBaseAttSanctionScreenData]
  }

  if (searchSummaryFields.indexOf(valType as any) !== -1) {
    let s = d['search_summary']
    if (!s) return null
    return s[valType as keyof AD.IBaseAttSanctionScreenData['search_summary']] || null
  }

  return null
}
