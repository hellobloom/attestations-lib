import {AttestationData as AD} from 'src'
import * as B from './base'

export const fields: Array<keyof AD.IBaseAttPEPData> = ['date', 'name', 'country', 'search_summary']
export const ssfields: Array<keyof AD.IBaseAttPEPData['search_summary']> = [
  'hit_location',
  'hit_number',
  'lists',
  'record_id',
  'search_reference_id',
  'score',
  'hits',
  'flag_type',
  'comment',
]

export const extractPEP = (
  a: AD.IBaseAttPEP,
  _attType: string,
  valType: string,
):
  | AD.IBaseAttPEPData
  | AD.IBaseAttPEPData['date']
  | AD.IBaseAttPEPData['name']
  | AD.IBaseAttPEPData['search_summary']
  | AD.IBaseAttPEPData['search_summary']['lists']
  | AD.IBaseAttPEPData['search_summary']['hits']
  | string
  | number
  | null => {
  // Original spec
  if (typeof a.data === 'object') {
    let data: AD.IBaseAttPEPData | null = B.getFirst(a.data)
    if (data === null) {
      return null
    }
    if (valType === 'object') {
      return data
    }
    if (typeof data === 'object') {
      // Since there's no overlap between 'fields' and 'ssfields' this just does a quick property lookup across both
      if ((fields as Array<string>).indexOf(valType) !== -1) {
        const pepKey = valType as keyof AD.IBaseAttPEPData
        if (typeof data[pepKey] !== 'undefined') {
          if (pepKey === 'name') {
            return B.getNameString(data[pepKey])
          }
          return data[pepKey]
        } else {
          return null
        }
      } else {
        let ss = data.search_summary
        if (typeof ss === 'object') {
          if ((ssfields as Array<string>).indexOf(valType) !== -1) {
            const ssKey = valType as keyof AD.IBaseAttPEPData['search_summary']
            if (typeof ss[ssKey] !== 'undefined') {
              return ss[ssKey]
            }
          }
        }
      }
    }
    return null
  }
  return null
}
