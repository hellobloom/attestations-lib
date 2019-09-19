import {AttestationData as AD} from 'src'
import * as B from './base'

export const fields: Array<keyof AD.TAddress> = [
  'full',
  'name',
  'street_1',
  'street_2',
  'street_3',
  'city',
  'postal_code',
  'region_1',
  'region_2',
  'country',
]

export const extractAddress = async (
  a: AD.IBaseAttAddress,
  attType: string,
  valType: string,
): Promise<AD.TAddress | string | number | null> => {
  // Get first provider
  let providerBlock: AD.IBaseAttAddressProvider | null = await B.getFirst(a.data)
  if (providerBlock) {
    if (typeof providerBlock.address !== 'object') {
      return null
    }
    let address: AD.TAddress | null =
      providerBlock.address instanceof Array ? await B.getFirst(providerBlock.address) : providerBlock.address
    if (valType === 'object') {
      return address
    } else if (address && valType in address) {
      return address[valType]
    }
  }
  return null
}
