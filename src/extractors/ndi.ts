import {AttestationData as AD} from 'src'
import * as B from './base'

export const extractNDI = (a: AD.IBaseAttNDI, _attType: string, valType: string): AD.IBaseAttNDIData | null => {
  if (!a.data) {
    return null
  }
  let d = B.getFirst(a.data)

  if (valType === 'object') return d

  return null
}
