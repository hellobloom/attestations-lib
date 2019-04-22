type TContextField = string | {type: string; data: string}

///////////////////////////////////////////////////
// Base attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAtt {
  '@context': TContextField | Array<TContextField>
  // Date/time attestation was performed
  date?: string

  // Secondary provider
  provider?: string

  // Unique ID for attestation subject from provider
  id?: number | string

  // Date/time when attestation should be considered void (e.g., for credential expiry)
  expiry_date?: string

  // Optional summary object (often useful for multiple-account types - otherwise, the data field is preferable for most of these fields, for simplicity's sake
  summary?: {
    // Single date/time during which attestation was applicable
    date?: string

    // Start date/time of period during which attestation was applicable
    start_date?: string

    // End date/time of period during which attestation was applicable
    end_date?: string

    // Different levels of specificity - zero-indexed, with increasing numbers indicating less specificity, to allow for unlimited levels of depth (in practice, 3-5 should be sufficient for most cases).  This allows for arbitrary levels or amounts of specificity within sub-attestations, to promote an attestation subject's ability to partially disclose the amount of data provided in an attestation.
    specificity?: number

    // ...extensible with other fields that summarize the content of the attestation - e.g., a list of addresses, accounts, totals of statistics, etc.
  }

  data?: any
  // ...extensible with other fields.  Other fields explicating general data about the attestation, such as location, shelf life, common units, etc., should be placed here.
}

///////////////////////////////////////////////////
// Helper types
///////////////////////////////////////////////////
export type TPersonalName =  // Designed to be flexible - as a rule, a basic {given: 'x', middle: 'x', family: 'x'} is probably the easiest for most Western use cases
  | string
  | {
      full?: string
      given?: string | Array<string>
      middle?: string | Array<string>
      family?: string | Array<string>
      title?: string | Array<string>
      prefix?: string | Array<string>
      suffix?: string | Array<string>
      nickname?: string | Array<string>
    }

export type TDate =
  | string // ISO-8601 date in YYYY-MM-DD format
  | {
      year: string // YYYY
      month: string // MM
      day: string // DD
    }

export type TDatetime =
  | string // ISO-8601 datetime in YYYY-MM-DDTHH:MM:SSZ format
  | {
      year: string // YYYY
      month: string // MM
      day: string // DD
      hour: string // HH
      minute: string // MM
      second: string // SS
    }

export type TPhoneNumber =
  | string // Valid internationally-formatted phone number
  | {
      full?: string
      country?: string
      subscriber?: string
      area?: string
      prefix?: string
      line?: string
      ext?: string
    }

export type TGender = string // 'male', 'female', ...

///////////////////////////////////////////////////
// Phone attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttPhone extends IBaseAtt {
  data: string | TPhoneNumber
}

///////////////////////////////////////////////////
// Email attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttEmail extends IBaseAtt {
  data: {
    email?: string
    start_date?: string
    end_date?: string
  }
}

///////////////////////////////////////////////////
// Name attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttName extends IBaseAtt {
  data: TPersonalName
}

///////////////////////////////////////////////////
// SSN/government ID # attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttSSN extends IBaseAtt {
  data: string
}

///////////////////////////////////////////////////
// Date of birth attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttDOB extends IBaseAtt {
  data: TDate
}

///////////////////////////////////////////////////
// Account attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttAccount extends IBaseAtt {
  data: {
    email?: string

    name?: TPersonalName
    start_date?: string
    end_date?: string
  }
}

///////////////////////////////////////////////////
// Sanction screen attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttSanctionScreen extends IBaseAtt {
  data: {
    name: TPersonalName
    birthday: TDate
  }
}

///////////////////////////////////////////////////
// PEP screen attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttPEP extends IBaseAtt {
  data: {
    date: TDate
    name: TPersonalName
    country: string

    // Primarily modelled after KYC2020 responses, most fields left optional for flexibility
    search_summary: {
      hit_location?: string
      hit_number?: number
      list_name?: string
      list_url?: string
      record_id?: string
      search_reference_id?: string
      score?: string
      hits?: Array<{
        id?: string
        hit_name?: string
      }>
      flag_type?: string
      comment?: string
    }
  }
}

///////////////////////////////////////////////////
// ID document attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttIDDocument extends IBaseAtt {
  data: {
    date: TDate
    name: TPersonalName
    country: string

    // Primarily modelled after KYC2020 responses, most fields left optional for flexibility
    authenticationResult:
      | 'unknown'
      | 'passed'
      | 'failed'
      | 'skipped'
      | 'caution'
      | 'attention' // IAssureIDResult.AuthenticationResult
    biographic: {
      age: number
      dob: TDate
      expiration_date: TDate
      name: TPersonalName
      gender: string
      photo: string
    } // IAssureIDResult.Biographic,
    facematchResult: {
      is_match: boolean
      score: number
      transaction_id: string
    } // IFaceMatchResult
  }
}

/*
 * X for completed, U for currently un-implemented elsewhere:
  X 'phone' = 0,
  X 'email' = 1,
  X 'facebook' = 2,
  X 'sanction-screen' = 3,
  X 'pep-screen' = 4,
  X 'id-document' = 5,
  X 'google' = 6,
  X 'linkedin' = 7,
  X 'twitter' = 8,
  U 'payroll' = 9,
  U 'ssn' = 10,
  U 'criminal' = 11,
  U 'offense' = 12,
  U 'driving' = 13,
  U 'employment' = 14,
  U 'education' = 15,
  U 'drug' = 16,
  U 'bank' = 17,
  'utility' = 18,
  'income' = 19,
  'assets' = 20,
  X 'full-name' = 21,
  X 'birth-date' = 22,
  'gender' = 23,
  'group' = 24,
  'meta' = 25,
  'office' = 26,
  'credential' = 27,
  'medical' = 28,
  'biometric' = 29,
  'supplemental' = 30,
  'vouch' = 31,
  'audit' = 32,
  'address' = 33,
  'correction' = 34,
  'account' = 35,
*/
