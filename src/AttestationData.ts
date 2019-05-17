export type TContextField = string | {type: string; data: string}

///////////////////////////////////////////////////
// Base attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAtt {
  '@context': TContextField | Array<TContextField>
  // Date/time attestation was performed
  date?: TDateOrTime

  // Secondary provider
  provider?: string

  // Unique ID for attestation subject from provider
  id?: number | string

  // Date/time when attestation should be considered void (e.g., for credential expiry)
  expiry_date?: TDateOrTime

  // Different levels of generality - zero-indexed, with increasing numbers indicating less
  // generality, to allow for unlimited levels of depth (in practice, 3-5 should be
  // sufficient for most cases).  This allows for arbitrary levels or amounts of generality
  // within sub-attestations, to promote an attestation subject's ability to partially disclose
  // the amount of data provided in an attestation.
  generality?: number

  // Optional summary object (often useful for multiple-account types - otherwise, the data
  // field is preferable for most of these fields, for simplicity's sake
  summary?: {
    // Single date/time during which attestation was applicable or ascertained
    date?: TDateOrTime

    // Start date/time of period during which attestation was applicable
    start_date?: TDateOrTime

    // End date/time of period during which attestation was applicable
    end_date?: TDateOrTime

    // ...extensible with other fields that summarize the content of the attestation - e.g., a
    // list of addresses, accounts, totals of statistics, etc.
  }

  // Core attestation data, dependent on attestation type
  data?: Array<TBaseAttData> | TBaseAttData
  // ...extensible with other fields.  Other fields explicating general data about the attestation,
  // such as location, shelf life, common units, etc., should be placed here.
}

export interface IBaseAttDataObj {}
export type TBaseAttData = IBaseAttDataObj | string | number

///////////////////////////////////////////////////
// Helper types
///////////////////////////////////////////////////
// Designed to be flexible - as a rule, a basic {given: "x", middle: "x", family: "x"} is probably
// the easiest for most Western use cases
export type TPersonalNameObj = {
  full?: string
  given?: string | Array<string>
  middle?: string | Array<string>
  family?: string | Array<string>
  title?: string | Array<string>
  prefix?: string | Array<string>
  suffix?: string | Array<string>
  nickname?: string | Array<string>
  generational?: string | Array<string>

  // For name changes
  start_date?: TDateOrTime
  end_date?: TDateOrTime
}
export type TPersonalName = TPersonalNameObj | string

export type TDateOrTime = TDate | TDatetime

export type TDate = TDateObj | string // ISO-8601 date in YYYY-MM-DD format
export type TDateObj = {
  year: string // YYYY
  month: string // MM
  day: string // DD
}

export type TDatetime = TDatetimeObj | string // ISO-8601 datetime in YYYY-MM-DDTHH:MM:SSZ format
export type TDatetimeObj = {
  year: string // YYYY
  month: string // MM
  day: string // DD
  hour: string // HH
  minute: string // MM
  second: string // SS
}

export type TPhoneNumber =
  | string // Valid internationally-formatted phone number
  | TPhoneNumberObj

export type TPhoneNumberObj = {
  full?: string
  country?: string
  subscriber?: string
  area?: string
  prefix?: string
  line?: string
  ext?: string
}

export type TGender = string // 'male', 'female', ...

export type TAddress = {
  full: string
  name: string
  street_1: string
  street_2?: string
  street_3?: string
  city: string
  postal_code: string | number
  region_1: string
  region_2?: string
  country?: string
}

///////////////////////////////////////////////////
// Phone attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttPhone extends IBaseAtt {
  data: TPhoneNumber | Array<TPhoneNumber>
}

///////////////////////////////////////////////////
// Email attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttEmailData extends IBaseAttDataObj {
  email: string
  start_date?: TDateOrTime
  end_date?: TDateOrTime
}
export type TBaseAttEmailData = string | IBaseAttEmailData
export interface IBaseAttEmail extends IBaseAtt {
  data: TBaseAttEmailData | Array<TBaseAttEmailData>
}

///////////////////////////////////////////////////
// Name attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttName extends IBaseAtt {
  data: TPersonalName | Array<TPersonalName>
}

///////////////////////////////////////////////////
// SSN/government ID # attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttSSNData extends IBaseAttDataObj {
  country_code: string
  id_type: string
  id: string | number
}
export interface IBaseAttSSN extends IBaseAtt {
  data: IBaseAttSSNData | Array<IBaseAttSSNData>
}

///////////////////////////////////////////////////
// Date of birth attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttDOB extends IBaseAtt {
  data: TDateOrTime
}

///////////////////////////////////////////////////
// Account attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttAccountData extends IBaseAttDataObj {
  id?: string | number
  email?: string

  name?: TPersonalName
  start_date?: TDateOrTime
  end_date?: TDateOrTime
}
export interface IBaseAttAccount extends IBaseAtt {
  data: IBaseAttAccountData | Array<IBaseAttAccountData>
}

// Lists (for Sanction/PEP)
export interface IBaseAttList {
  name?: string
  url?: string
}

///////////////////////////////////////////////////
// Sanction screen attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttSanctionScreenData extends IBaseAttDataObj {
  id?: string
  name?: TPersonalName
  birthday?: TDateOrTime
  search_summary?: {
    hit_location?: string
    hit_number?: number
    lists?: Array<IBaseAttList>
    score?: string
    hits?: Array<{
      id?: string
      hit_name?: string
    }>
    flag_type?: string
    comment?: string
  }
}
export interface IBaseAttSanctionScreen extends IBaseAtt {
  data: IBaseAttSanctionScreenData | Array<IBaseAttSanctionScreenData>
}

///////////////////////////////////////////////////
// PEP screen attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttPEPData extends IBaseAttDataObj {
  date: TDateOrTime
  name: TPersonalName
  country: string

  // Primarily modelled after KYC2020 responses, most fields left optional for flexibility
  search_summary: {
    hit_location?: string
    hit_number?: number
    lists: Array<IBaseAttList>
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
export interface IBaseAttPEP extends IBaseAtt {
  data: IBaseAttPEPData | Array<IBaseAttPEPData>
}

///////////////////////////////////////////////////
// ID document attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttIDDocData extends IBaseAttDataObj {
  date: TDateOrTime
  name: TPersonalName
  country: string

  authenticationResult?:
    | 'unknown'
    | 'passed'
    | 'failed'
    | 'skipped'
    | 'caution'
    | 'attention' // IAssureIDResult.AuthenticationResult
  biographic?: {
    age?: number
    dob?: TDateOrTime
    expiration_date?: TDateOrTime
    name?: TPersonalName
    gender?: string
    photo?: string
  } // IAssureIDResult.Biographic,
  facematch_result?: {
    is_match?: boolean
    score?: number
    transaction_id?: string
  } // IFaceMatchResult
}
export interface IBaseAttIDDoc extends IBaseAtt {
  data: IBaseAttIDDocData | Array<IBaseAttIDDocData>
}

///////////////////////////////////////////////////
// Utility bill attestation dataStr type
///////////////////////////////////////////////////
export type TBaseAttUtilitySummary = {
  date?: TDateOrTime
  currency?: string
  total_paid?: number
  account_numbers?: Array<string>
  statement_dates: Array<TDate> | Array<TDatetime>
  address?: TAddress | Array<TAddress>
}
export interface IBaseAttUtilityStatement {
  account_number?: string | number
  currency?: string
  billing_address?: TAddress
  service_address?: TAddress
  total_bill?: number
  balance_adjustments?: number
  due_date?: TDateOrTime
  statement_date: TDateOrTime
}
export interface IBaseAttUtilityPayment {
  currency?: string
  amount?: number
  date?: string
}
export interface IBaseAttUtilityAccount {
  statements?: Array<IBaseAttUtilityStatement>
  payments?: Array<IBaseAttUtilityPayment>
}
export interface IBaseAttUtilityProvider extends IBaseAttDataObj {
  name?: string
  id?: string
  country?: string
  service_types?: string
  website?: string
  accounts?: Array<IBaseAttUtilityAccount>
}
export interface IBaseAttUtility extends IBaseAtt {
  generality: number
  summary?: TBaseAttUtilitySummary
  data?: IBaseAttUtilityProvider | Array<IBaseAttUtilityProvider>
}

///////////////////////////////////////////////////
// Address attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttAddressStatement {
  billing_address?: TAddress | Array<TAddress>
  service_address?: TAddress | Array<TAddress>
  statement_date?: TDateOrTime
}
export interface IBaseAttAddressAccount {
  statements?: Array<IBaseAttAddressStatement>
}
export interface IBaseAttAddressProvider {
  provider?: {
    name: string
    id?: string
    country?: string
    service_types?: Array<string>
    website?: string
  }
  accounts?: Array<IBaseAttAddressAccount>
  address?: TAddress | Array<TAddress>
}
export interface IBaseAttAddress extends IBaseAtt {
  data: IBaseAttAddressProvider | Array<IBaseAttAddressProvider>
}

///////////////////////////////////////////////////
// Income attestation dataStr type (total, gross, or expenses)
///////////////////////////////////////////////////
export type TBaseAttIncomeSummary = {
  start_date: TDateOrTime
  end_date: TDateOrTime
  net?: TBaseAttIncomeIncome
  gross?: TBaseAttIncomeIncome
  expenses?: TBaseAttIncomeIncome
}
export type TBaseAttIncomeIncome = {
  total: number
  regular: number
  irregular: number
  num_transactions: number
}
export type TBaseAttIncomeStreamWrapper = {
  income?: TBaseAttIncomeStream | Array<TBaseAttIncomeStream>
  expense?: TBaseAttIncomeStream | Array<TBaseAttIncomeStream>
}
export type TBaseAttIncomeStream = {
  id?: number
  start_date: TDateOrTime
  end_date: TDateOrTime

  cashflow_category?: string
  cashflow_subcategory?: string
  is_payroll_agency?: boolean
  memo?: string
  num_transactions?: number
  length: number // length in days
  payee?: string
  payer?: string
  rank?: string

  // suggested: 'daily', 'weekly' 'biweekly', 'monthly', 'semi_monthly', 'multiple_months', 'irregular'
  frequency?: string
  // numerical alternative to "frequency" above, in days
  periodicity?: number

  stdev_value?: number
  total_value?: number
  mean_value?: number
  median_value?: number

  transactions?: Array<{
    currency?: string
    date: TDateOrTime
    value: number
  }>
}
export interface IBaseAttIncome extends IBaseAtt {
  generality: number
  summary?: TBaseAttIncomeSummary
  data: TBaseAttIncomeStreamWrapper
}

///////////////////////////////////////////////////
// Assets attestation dataStr type (total, gross, or expenses)
// import {AttestationData as AD} from '@bloomprotocol/attestations-lib'

///////////////////////////////////////////////////
export interface IBaseAttAssetsSummary {
  date?: TDateOrTime
  value?: number
  num_accounts?: number
}
export interface IBaseAttAssetsAccount {
  category?: string
  institution_name?: string
  institution_id?: number
  owner_type?: string
  type?: string
  type_confidence?: string
  value?: number
}
export interface IBaseAttAssets extends IBaseAtt {
  generality: number
  summary?: IBaseAttAssetsSummary
  data: IBaseAttAssetsAccount | Array<IBaseAttAssetsAccount>
  currency?: string
}

///////////////////////////////////////////////////
// Gender attestation dataStr type
///////////////////////////////////////////////////
export interface IBaseAttGender extends IBaseAtt {
  data: TGender
}

/**
 * +--------- Table of implemented attestation types -----------+
 *
 * Key:
 * +------------------------------------------------------------+
 * | X | Attestations completed in this document                |
 * | - | Attestations without a known production implementation |
 * +------------------------------------------------------------+
 *
 *   X 'phone' = 0,
 *   X 'email' = 1,
 *   X 'facebook' = 2,
 *   X 'sanction-screen' = 3,
 *   X 'pep-screen' = 4,
 *   X 'id-document' = 5,
 *   X 'google' = 6,
 *   X 'linkedin' = 7,
 *   X 'twitter' = 8,
 *   - 'payroll' = 9,
 *   X 'ssn' = 10,
 *   - 'criminal' = 11,
 *   - 'offense' = 12,
 *   - 'driving' = 13,
 *   - 'employment' = 14,
 *   - 'education' = 15,
 *   - 'drug' = 16,
 *   - 'bank' = 17,
 *   X 'utility' = 18,
 *   X 'income' = 19,
 *   X 'assets' = 20,
 *   X 'full-name' = 21,
 *   X 'birth-date' = 22,
 *   X 'gender' = 23,
 *   - 'group' = 24,
 *   - 'meta' = 25,
 *   - 'office' = 26,
 *   - 'credential' = 27,
 *   - 'medical' = 28,
 *   - 'biometric' = 29,
 *   - 'supplemental' = 30,
 *   - 'vouch' = 31,
 *   - 'audit' = 32,
 *   X 'address' = 33,
 *   - 'correction' = 34,
 *   X 'account' = 35,
 */
