export interface INDIFieldValueBased {
  value: string | number
}

export interface INDIFieldCodeBased {
  code: string
  desc: string
}

export type TNDIField = INDIFieldCodeBased | INDIFieldValueBased

// export type TNDIObject = {[key: string]: TNDIField}

export type TNDIItemBase = {
  classification: string
  source: string
  // '1' - Government-verified
  // '2' - User provided
  // '3' - Field is Not Applicable to Person
  // '4' - Verified by SingPass
  lastupdated: string
}

export type TNDIItemValueBased = {
  value: string | number
} & TNDIItemBase

export type TNDIItemCodeBased = {
  code: string
  desc: string
} & TNDIItemBase

// export type TNDIDataItemObjectKeyBased = {
//   [key: string]: any
// } & TNDIDataItemBase

export type TNDIDataItemUnavailable = {
  unavailable: true
}

export type TNDIMobileNo = {
  areacode: INDIFieldValueBased
  prefix: INDIFieldValueBased
  nbr: INDIFieldValueBased
} & TNDIItemBase

// TODO in NDI spec if something is missing is it unavailable or just undefined?
export type TNDIMailAdd = {
  country: INDIFieldCodeBased
  unit: INDIFieldValueBased
  street: INDIFieldValueBased
  block: INDIFieldValueBased
  postal: INDIFieldValueBased
  floor: INDIFieldValueBased
  building: INDIFieldValueBased
} & TNDIItemBase

export type TNDIHouseholdIncome = {
  high: INDIFieldValueBased
  low: INDIFieldValueBased
} & TNDIItemBase

export const extractNDIField = (f: TNDIField) => {
  if ('value' in f) {
    return f.value
  } else if ('desc') {
    return f.desc
  }
  return null
}
