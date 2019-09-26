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

export const extractAddress = (
  a: AD.IBaseAttAddress,
  _attType: string,
  valType: string,
): AD.IBaseAttAddressProvider | AD.TAddress | string | number | null => {
  // Get first provider
  const providerBlock: AD.IBaseAttAddressProvider | null = B.getFirst(a.data)
  if (providerBlock) {
    if (valType === 'object') {
      return providerBlock
    }
    if (typeof providerBlock.address !== 'object') {
      return null
    }
    const address: AD.TAddress | null = providerBlock.address instanceof Array ? B.getFirst(providerBlock.address) : providerBlock.address
    const provider = providerBlock.provider
    if (valType === 'address') {
      return address
    } else if (address && typeof address === 'object' && valType in address) {
      const val = address[valType as keyof AD.TAddress]
      if (typeof val === 'undefined') {
        return null
      }
      return val
    } else if (provider && typeof provider === 'object' && (valType === 'provider.name' || valType in provider)) {
      if (valType === 'provider.name') {
        return provider.name
      }
      const val = provider[valType as keyof AD.IBaseAttAddressProvider['provider']]
      if (typeof val === 'undefined') {
        return null
      }
      return val
    }
  }
  return null
}
