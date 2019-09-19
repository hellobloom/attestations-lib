import {AttestationData as AD} from 'src'

export type MaybeDS<T> = string | T

export const parseDataStr = (x: string): null | MaybeDS<AD.IBaseAtt> => {
  if (x.length === 0) {
    return null
  } else if (x[0] === '{') {
    try {
      const obj = JSON.parse(x)
      return obj
    } catch (err) {
      return null
    }
  } else {
    return x
  }
}

export const getStrOrFromAttr = async (a: MaybeDS<AD.IBaseAtt>, attr: string, valType: string): Promise<string | null> => {
  switch (valType) {
    case 'number':
      if (typeof a === 'string') {
        return a
      } else if (typeof a === 'object') {
        if (typeof a.data === 'string') {
          return a.data
        } else if (typeof a.data === 'object') {
          const attrKey = attr as keyof AD.IBaseAttDataObj
          if (a.data instanceof Array) {
            if (typeof a.data[0] === 'string') {
              return a.data[0] as string
            } else if (typeof a.data[0] === 'object' && typeof a.data[0][attrKey] === 'string') {
              return a.data[0][attrKey]
            } else {
              return null
            }
          } else if (typeof a.data[attrKey] === 'string') {
            return a.data[attrKey]
          }
        }
      }
      break
    default:
      return null
  }
  return null
}

export const getDateString = (a: MaybeDS<AD.TDateOrTime>): string | null => {
  if (typeof a === 'string') {
    return a.substr(0, 10) // Enforce actual date, not datetime
  }
  return null
}

export const getNameString = (a: MaybeDS<AD.TPersonalName>): string | null => {
  if (!a) {
    return null
  }
  if (typeof a === 'string') {
    return a
  } else if (typeof a.full === 'string') {
    return a.full
  } else {
    let str = `${a.given} ${a.middle} ${a.family}`
    if (a.prefix) {
      str = `${a.prefix} ${str}`
    }
    if (a.suffix) {
      str = `${str} ${a.suffix}`
    }
    return str
  }
  return null
}

type TDataAny = {[key: string]: any}

export const getFirst = async <T extends TDataAny>(a: T | Array<T>): Promise<T | null> => {
  if (a instanceof Array) {
    if (a.length === 0) {
      return null
    } else {
      return a[0]
    }
  } else {
    return a
  }
}

// Typescript hack :(
export const getFirstPrimitive = async <T extends any>(a: T | Array<T>): Promise<T | null> => {
  if (a instanceof Array) {
    if (a.length === 0) {
      return null
    } else {
      return a[0]
    }
  } else {
    return a
  }
}

// Get an attribute of an attestation data type that's guaranteed to be { ..., data: {... myAttr: any } }
export const getAttr = async <T extends AD.IBaseAtt, TD extends AD.IBaseAttDataObj>(a: T, attr: keyof TD): Promise<TD[keyof TD] | null> => {
  if ('data' in a) {
    if (typeof a.data === 'object') {
      let data = await getFirst(a.data)
      if (data === null) {
        return null
      } else {
        return data[attr as keyof AD.IBaseAttDataObj]
      }
    }
  }
  return null
}

// Get an attribute of an attestation data string that may: (a) just be a string, (b) just have a string for data
// property: { ..., data: "x" }, or have an attribute that resolves to an arbitrary
// type { ..., data: { myAttr: any } }.  For backwards compatibility with legacy attestation types only.
export const getAttrOrStr = async <T extends AD.IBaseAtt, TD extends AD.IBaseAttDataObj>(
  a: MaybeDS<T>,
  attr: keyof TD,
): Promise<TD[keyof TD] | string | null | keyof TD> => {
  if (typeof a === 'string') {
    return (a as unknown) as keyof TD
  } else if (typeof a === 'object') {
    if ('data' in a) {
      if (typeof a.data === 'string') {
        return a.data
      } else if (typeof a.data === 'object') {
        let data = await getFirst(a.data)
        if (data === null) {
          return null
        } else {
          return data[attr as keyof AD.IBaseAttDataObj]
        }
      }
    }
  }
  return null
}

export const stringOrNull = (x: any) => {
  return typeof x === 'string' ? x : null
}
