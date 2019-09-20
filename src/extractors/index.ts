import {TAttestationTypeNames, AttestationData as AD} from 'src'
import * as B from './base'

import {extractAccount} from './account'
import {extractAddress} from './address'
import {extractAssets} from './assets'
import {extractDOB} from './dob'
import {extractEmail} from './email'
import {extractGender} from './gender'
import {extractIDDoc} from './idDocument'
import {extractIncome} from './income'
import {extractName} from './name'
import {extractPEP} from './pep'
import {extractPhone} from './phone'
import {extractSanctionScreen} from './sanctionScreen'
import {extractSSN} from './ssn'
import {extractUtility} from './utility'

export const extractBase = (dataStr: string, attType: TAttestationTypeNames, valType: string, errCallback?: (err: any) => void) => {
  const a: string | AD.IBaseAtt | null = B.parseDataStr(dataStr)
  if (a === null) {
    return a
  }
  var val: any = null
  try {
    switch (attType) {
      case 'phone':
        val = extractPhone(a as B.MaybeDS<AD.IBaseAttPhone>, attType, valType)
        break
      case 'email':
        val = extractEmail(a as B.MaybeDS<AD.IBaseAttEmail>, attType, valType)
        break
      case 'full-name':
        val = extractName(a as B.MaybeDS<AD.IBaseAttName>, attType, valType)
        break
      case 'ssn':
        val = extractSSN(a as B.MaybeDS<AD.IBaseAttSSN>, attType, valType)
        break
      case 'birth-date':
        val = extractDOB(a as B.MaybeDS<AD.IBaseAttDOB>, attType, valType)
        break
      case 'account':
        val = extractAccount(a as AD.IBaseAttAccount, attType, valType)
        break
      case 'sanction-screen':
        val = extractSanctionScreen(a as AD.IBaseAttSanctionScreen, attType, valType)
        break
      case 'pep-screen':
        val = extractPEP(a as AD.IBaseAttPEP, attType, valType)
        break
      case 'id-document':
        val = extractIDDoc(a as AD.IBaseAttIDDoc, attType, valType)
        break
      case 'utility':
        val = extractUtility(a as AD.IBaseAttUtility, attType, valType)
        break
      case 'address':
        val = extractAddress(a as AD.IBaseAttAddress, attType, valType)
        break
      case 'income':
        val = extractIncome(a as AD.IBaseAttIncome, attType, valType)
        break
      case 'assets':
        val = extractAssets(a as AD.IBaseAttAssets, attType, valType)
        break
      case 'gender':
        val = extractGender(a as AD.IBaseAttGender, attType, valType)
        break
      default:
        return null
    }
  } catch (err) {
    if (typeof errCallback === 'function') {
      errCallback(err)
    }
    return null
  }
  if (typeof val === 'undefined') {
    val = null
  }
  return val
}
