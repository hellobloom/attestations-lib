import {AttestationData as AD} from 'src'
import * as B from './base'

const biographicFields: Array<keyof NonNullable<AD.IBaseAttIDDocData['biographic']>> = ['age', 'dob', 'expiration_date', 'name', 'gender']
const facematchResultFields: Array<keyof NonNullable<AD.IBaseAttIDDocData['facematch_result']>> = ['is_match', 'score', 'transaction_id']

export const extractIDDoc = async (
  a: AD.IBaseAttIDDoc,
  _attType: string,
  valType: string,
): Promise<AD.IBaseAttIDDocData['facematch_result'] | AD.IBaseAttIDDocData['biographic'] | string | number | null> => {
  if (!a.data) {
    return null
  }

  const d = await B.getFirst(a.data)

  if (!d) return null

  if (valType === 'object') return d

  // Biographic
  if (valType === 'biographic') return d.biographic || null

  if (biographicFields.indexOf(valType as any) !== -1) {
    if (!d.biographic || !(valType in d.biographic)) {
      return null
    }

    return d.biographic[valType as keyof AD.IBaseAttIDDocData['biographic']]
  }

  // Facematch result
  if (valType === 'facematch_result') return d.facematch_result || null

  if (facematchResultFields.indexOf(valType as any) !== -1) {
    if (!d.facematch_result || !(valType in d.facematch_result)) {
      return null
    }
    return d.facematch_result[valType as keyof AD.IBaseAttIDDocData['facematch_result']]
  }

  if (valType === 'authentication_result') return d.authentication_result || null

  return null
}
