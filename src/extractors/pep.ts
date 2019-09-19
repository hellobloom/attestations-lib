import {AttestationData as AD} from 'src'
import * as B from './base'
// import {lensPath} from 'ramda'

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

export const extractPEP = async (
  a: AD.IBaseAttPEP,
  attType: string,
  valType: string,
): Promise<AD.IBaseAttPEPData | string | number | null> => {
  // Original spec
  if (typeof a.data === 'object') {
    let data: AD.IBaseAttPEPData | null = await B.getFirst(a.data)
    if (data === null) {
      return null
    }
    if (typeof data === 'object') {
      // Since there's no overlap between 'fields' and 'ssfields' this just does a quick property lookup across both
      if ((fields as Array<string>).indexOf(valType) !== -1) {
        if (typeof data[valType] !== 'undefined') {
          return data[valType]
        } else {
          return null
        }
      } else {
        let ss = data.search_summary
        if (typeof ss === 'object') {
          if ((ssfields as Array<string>).indexOf(valType) !== -1) {
            if (typeof ss[valType] !== 'undefined') {
              return ss[valType]
            }
          }
        }
      }
    }
    return null
  }
  return null
}
