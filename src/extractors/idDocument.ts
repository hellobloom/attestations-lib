import {AttestationData as AD} from 'src'
import * as B from './base'

const biographicFields: Array<keyof NonNullable<AD.IBaseAttIDDocData['biographic']>> = [
  'age',
  'dob',
  'expiration_date',
  'name',
  'gender',
  'photo',
]
const facematchResultFields: Array<keyof NonNullable<AD.IBaseAttIDDocData['facematch_result']>> = ['is_match', 'score', 'transaction_id']

export const extractIDDoc = async (
  a: AD.IBaseAttIDDoc,
  attType: string,
  valType: string,
): Promise<AD.IBaseAttIDDocData['facematch_result'] | AD.IBaseAttIDDocData['biographic'] | string | number | null> => {
  if (!a.data) {
    return null
  }

  let d = await B.getFirst(a.data)

  if (!d) return null

  if (valType === 'object') return d

  // Biographic
  if (valType === 'biographic') return d.biographic || null

  if (biographicFields.indexOf(valType as any) !== -1) {
    if (!d.biographic) {
      return null
    }
    return d.biographic[valType]
  }

  // Facematch result
  if (valType === 'facematch_result') return d.facematch_result || null

  if (facematchResultFields.indexOf(valType as any) !== -1) {
    if (!d.facematch_result) {
      return null
    }
    return d.facematch_result[valType]
  }

  if (valType === 'authentication_result') return d.authentication_result || null

  return null
}
