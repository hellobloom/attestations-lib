import {Extractors} from '../src'

import {
  IBaseAttPhone,
  IBaseAttEmail,
  IBaseAttName,
  IBaseAttSSN,
  IBaseAttAccount,
  IBaseAttDOB,
  IBaseAttSanctionScreen,
  IBaseAttPEP,
  IBaseAttIDDoc,
  IBaseAttIDDocData,
  IBaseAttUtility,
  TAddress,
  IBaseAttAddress,
  IBaseAttIncome,
} from '../src/AttestationData'

test('phone extractor', () => {
  const value = '+15154932491'

  expect(Extractors.extractBase('+1234567890', 'phone', 'number')).not.toEqual(value)

  expect(Extractors.extractBase(value, 'phone', 'bogus')).toBeNull()

  expect(Extractors.extractBase(value, 'phone', 'number')).toEqual(value)

  const bap: Partial<IBaseAttPhone> = {
    data: {
      full: value,
    },
  }
  const p = JSON.stringify(bap)
  expect(Extractors.extractBase(p, 'phone', 'number')).toEqual(value)
})

test('email extractor', () => {
  const value = 'test@bloom.co'

  expect(Extractors.extractBase('tester@bloom.co', 'email', 'email')).not.toEqual(value)

  expect(Extractors.extractBase(value, 'email', 'bogus')).toBeNull()

  expect(Extractors.extractBase(value, 'email', 'email')).toEqual(value)

  const bae: Partial<IBaseAttEmail> = {
    data: {
      email: value,
    },
  }
  const e = JSON.stringify(bae)
  expect(Extractors.extractBase(e, 'email', 'email')).toEqual(value)
})

test('full-name extractor', () => {
  const value = 'Friedrich August von Hayek'

  expect(Extractors.extractBase('John Maynard Keynes', 'full-name', 'full')).not.toEqual(value)

  expect(Extractors.extractBase(value, 'full-name', 'bogus')).toBeNull()

  expect(Extractors.extractBase(value, 'full-name', 'full')).toEqual(value)

  const full: Partial<IBaseAttName> = {
    data: {
      full: value,
    },
  }
  const components: Partial<IBaseAttName> = {
    data: {
      given: 'Friedrich',
      middle: 'August',
      family: 'von Hayek',
    },
  }
  const firstLast: Partial<IBaseAttName> = {
    data: {
      given: 'Friedrich',
      family: 'von Hayek',
    },
  }
  expect(Extractors.extractBase(JSON.stringify(full), 'full-name', 'full')).toEqual(value)
  expect(Extractors.extractBase(JSON.stringify(components), 'full-name', 'full')).toEqual(value)
  expect(Extractors.extractBase(JSON.stringify(firstLast), 'full-name', 'full')).toEqual(value.replace(' August', ''))

  const arrData: Partial<IBaseAttName> = {
    data: [
      {
        given: 'Friedrich',
        middle: 'August',
        family: 'von Hayek',
      },
    ],
  }
  const arrComponents: Partial<IBaseAttName> = {
    data: [
      {
        given: ['Friedrich', 'not', 'bastiat'],
        middle: ['xtra', 'August'],
        family: ['von ', ' Hayek'],
      },
    ],
  }
  expect(Extractors.extractBase(JSON.stringify(arrData), 'full-name', 'full')).toEqual(value)
  expect(Extractors.extractBase(JSON.stringify(arrComponents), 'full-name', 'full')).toEqual('Friedrich not bastiat xtra August von Hayek')
})

test('ssn extractor', () => {
  const value = '000-000-0000'

  expect(Extractors.extractBase('111-111-1111', 'ssn', 'number')).not.toEqual(value)

  expect(Extractors.extractBase(value, 'ssn', 'bogus')).toBeNull()

  expect(Extractors.extractBase(value, 'ssn', 'number')).toEqual(value)

  const ssn: Partial<IBaseAttSSN> = {
    data: {
      id: '000-000-0000',
      country_code: 'US',
      id_type: 'SSN',
    },
  }
  expect(Extractors.extractBase(JSON.stringify(ssn), 'ssn', 'number')).toEqual(value)

  const ssnArr: Partial<IBaseAttSSN> = {
    data: [
      {
        id: '000-000-0000',
        country_code: 'US',
        id_type: 'SSN',
      },
    ],
  }
  expect(Extractors.extractBase(JSON.stringify(ssnArr), 'ssn', 'number')).toEqual(value)
})

test('birth-date extractor', () => {
  const value = '2000-01-01'

  expect(Extractors.extractBase('2000-01-02', 'birth-date', 'dob')).not.toEqual(value)
  expect(Extractors.extractBase(value, 'birth-date', 'dob')).toEqual(value)
  expect(Extractors.extractBase(value, 'birth-date', 'bogus')).toBeNull()

  const dob: Partial<IBaseAttDOB> = {
    data: '2000-01-01',
  }
  expect(Extractors.extractBase(JSON.stringify(dob), 'birth-date', 'dob')).toEqual(value)
})

test('account extractor', () => {
  const name = 'Bloom Tester'
  const value = {
    id: 'id',
    email: 'test@bloom.co',
    name,
  }

  const account: Partial<IBaseAttAccount> = {
    data: value,
  }
  const accountJSON = JSON.stringify(account)
  expect(JSON.stringify(Extractors.extractBase(accountJSON, 'account', 'object'))).toEqual(JSON.stringify(value))
  expect(Extractors.extractBase(accountJSON, 'account', 'id')).toEqual(value.id)
  expect(Extractors.extractBase(accountJSON, 'account', 'email')).toEqual(value.email)
  expect(Extractors.extractBase(accountJSON, 'account', 'name')).toEqual(name)

  const accountNameObj0: Partial<IBaseAttAccount> = {
    data: {
      id: 'id',
      email: 'test@bloom.co',
      name: {
        full: name,
      },
    },
  }
  const accountNameObj0JSON = JSON.stringify(accountNameObj0)
  expect(Extractors.extractBase(accountNameObj0JSON, 'account', 'name')).toEqual(name)

  const accountNameObj1: Partial<IBaseAttAccount> = {
    data: {
      id: 'id',
      email: 'test@bloom.co',
      name: {
        given: 'Bloom',
        family: 'Tester',
      },
    },
  }
  const accountNameObj1JSON = JSON.stringify(accountNameObj1)
  expect(Extractors.extractBase(accountNameObj1JSON, 'account', 'name')).toEqual(name)
})

test('birth-date extractor', () => {
  const value = '2000-01-01'

  expect(Extractors.extractBase('2000-01-02', 'birth-date', 'dob')).not.toEqual(value)
  expect(Extractors.extractBase(value, 'birth-date', 'dob')).toEqual(value)
  expect(Extractors.extractBase(value, 'birth-date', 'bogus')).toBeNull()

  const dob: Partial<IBaseAttDOB> = {
    data: '2000-01-01',
  }
  expect(Extractors.extractBase(JSON.stringify(dob), 'birth-date', 'dob')).toEqual(value)
})

test('sanction-screen extractor', () => {
  const value = {
    id: 'id',
    name: 'Bloom Tester',
    dob: '2000-01-01',
    search_summary: {
      hit_number: 1,
      hits: [
        {
          id: 'hits.id',
          hit_name: 'Orlando Bloom',
        },
      ],
    },
  }

  const ss: Partial<IBaseAttSanctionScreen> = {
    data: [value],
  }

  expect(JSON.stringify(Extractors.extractBase(JSON.stringify(ss), 'sanction-screen', 'object'))).toEqual(JSON.stringify(value))
  expect(Extractors.extractBase(JSON.stringify(ss), 'sanction-screen', 'id')).toEqual(value.id)
  expect(Extractors.extractBase(JSON.stringify(ss), 'sanction-screen', 'bogus')).toBeNull()
  expect(Extractors.extractBase(JSON.stringify(ss), 'sanction-screen', 'hit_number')).toEqual(value.search_summary.hit_number)
})

test('pep-screen extractor', () => {
  const value = {
    date: '2019-01-01',
    name: {
      given: 'Given',
      middle: 'Middle',
      family: 'Family',
    },
    country: 'US',
    search_summary: {
      hit_number: 10,
      lists: [],
    },
  }
  const pep: Partial<IBaseAttPEP> = {
    data: value,
  }

  expect(JSON.stringify(Extractors.extractBase(JSON.stringify(pep), 'pep-screen', 'object'))).toEqual(JSON.stringify(value))
  expect(Extractors.extractBase(JSON.stringify(pep), 'pep-screen', 'bogus')).toBeNull()
  expect(Extractors.extractBase(JSON.stringify(pep), 'pep-screen', 'name')).toEqual('Given Middle Family')
  expect(Extractors.extractBase(JSON.stringify(pep), 'pep-screen', 'country')).toEqual(value.country)
  expect(Extractors.extractBase(JSON.stringify(pep), 'pep-screen', 'hit_number')).toEqual(value.search_summary.hit_number)
})

test('id-document extractor', () => {
  const value = {
    date: '2019-01-01',
    name: 'Definitely A Real Person A',
    country: 'US',
    document_type: 'US Passport',
    authentication_result: 'caution',
    biographic: {
      age: 19,
      dob: '2000-01-01',
      name: {
        full: 'Definitely A Real Person B',
      },
    },
    classification: {
      classification_method: 'automatic',
      id_class: 'passport',
    },
    facematch_result: {
      is_match: true,
      score: 80,
    },
  }
  const idDoc: Partial<IBaseAttIDDoc> = {
    data: value as IBaseAttIDDocData,
  }

  expect(JSON.stringify(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'object'))).toEqual(JSON.stringify(value))
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'bogus')).toBeNull()
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'date')).toEqual(value.date)

  // top level props
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'name')).toEqual(value.name)
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'country')).toEqual(value.country)
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'document_type')).toEqual(value.document_type)
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'authentication_result')).toEqual(value.authentication_result)

  // second level props
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'age')).toEqual(value.biographic.age)
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'dob')).toEqual(value.biographic.dob)
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'biographic.name')).toEqual(value.biographic.name.full)
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'id_class')).toEqual(value.classification.id_class)
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'classification_method')).toEqual(
    value.classification.classification_method,
  )
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'dob')).toEqual(value.biographic.dob)
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'is_match')).toEqual(value.facematch_result.is_match)
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'score')).toEqual(value.facematch_result.score)
})

test('utility extractor', () => {
  const fullAddress = '123 Main St New York, NY 12345'
  const d = {
    name: 'fake name',
    id: 'fake id',
    country: 'US',
    service_types: 'Natural Gas',
    website: 'https://naturalgas.co',
    accounts: [],
  }
  const u: Partial<IBaseAttUtility> = {
    generality: 10,
    summary: {
      date: '2019-01-05',
      currency: 'USD',
      total_paid: 0,
      account_numbers: ['fake-acct-number'],
      statement_dates: ['2018-11-11'],
      address: [
        {
          full: fullAddress,
          name: 'some addy',
          street_1: 'Main St',
          city: 'New York',
          postal_code: '12345',
          region_1: 'NY',
        },
      ],
    },
    data: d,
  }
  const uJSON = JSON.stringify(u)

  expect(JSON.stringify(Extractors.extractBase(uJSON, 'utility', 'object'))).toEqual(uJSON)

  // summary
  expect(Extractors.extractBase(uJSON, 'utility', 'date')).toEqual(u.summary!.date)
  expect(Extractors.extractBase(uJSON, 'utility', 'currency')).toEqual(u.summary!.currency)
  expect(Extractors.extractBase(uJSON, 'utility', 'total_paid')).toEqual(u.summary!.total_paid)
  expect(Extractors.extractBase(uJSON, 'utility', 'account_number')).toEqual(u.summary!.account_numbers![0])
  expect(Extractors.extractBase(uJSON, 'utility', 'statement_date')).toEqual(u.summary!.statement_dates![0])
  const a: TAddress = Extractors.extractBase(uJSON, 'utility', 'address')
  expect(a && a.full).toEqual(fullAddress)

  // data
  expect(Extractors.extractBase(uJSON, 'utility', 'name')).toEqual(d.name)
  expect(Extractors.extractBase(uJSON, 'utility', 'id')).toEqual(d.id)
  expect(Extractors.extractBase(uJSON, 'utility', 'country')).toEqual(d.country)
  expect(Extractors.extractBase(uJSON, 'utility', 'service_types')).toEqual(d.service_types)
  expect(Extractors.extractBase(uJSON, 'utility', 'website')).toEqual(d.website)
  expect(Extractors.extractBase(uJSON, 'utility', 'accounts')).toHaveLength(d.accounts.length)
})

test('address extractor', () => {
  const fullAddress = '123 Main St New York, NY 12345'
  const baap = {
    provider: {
      name: 'Provider name',
      id: 'Provider id',
      country: 'US',
      service_types: ['Natural Gas'],
      website: 'https://naturalgas.co',
    },
    accounts: [],
    address: [
      {
        full: fullAddress,
        name: 'some addy',
        street_1: 'Main St',
        city: 'New York',
        postal_code: '12345',
        region_1: 'NY',
      },
    ],
  }
  const value: Partial<IBaseAttAddress> = {
    data: baap,
  }
  const json = JSON.stringify(value)

  expect(JSON.stringify(Extractors.extractBase(json, 'address', 'object'))).toEqual(JSON.stringify(baap))
  expect(JSON.stringify(Extractors.extractBase(json, 'address', 'address'))).toEqual(JSON.stringify(baap.address[0]))
  expect(Extractors.extractBase(json, 'address', 'full')).toEqual(fullAddress)
  expect(Extractors.extractBase(json, 'address', 'name')).toEqual(baap.address[0].name)
  expect(Extractors.extractBase(json, 'address', 'provider.name')).toEqual(baap.provider.name)
  expect(Extractors.extractBase(json, 'address', 'service_types')).toHaveLength(1)
})

test('income extractor', () => {
  const income: Partial<IBaseAttIncome> = {
    data: {},
    generality: 100,
    summary: {
      start_date: '2018-01-01',
      end_date: '2019-01-01',
    },
  }

  expect(Extractors.extractBase(JSON.stringify(income), 'income', 'start_date')).toEqual(income.summary!.start_date)
  expect(Extractors.extractBase(JSON.stringify(income), 'income', 'end_date')).toEqual(income.summary!.end_date)
  expect(JSON.stringify(Extractors.extractBase(JSON.stringify(income), 'income', 'object'))).toEqual(JSON.stringify(income))
})
