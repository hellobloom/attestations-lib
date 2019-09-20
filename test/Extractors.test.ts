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
    biographic: {
      age: 19,
      dob: '2000-01-01',
      name: 'Definitely A Real Person',
    },
    facematch_result: {
      is_match: true,
      score: 80,
    },
  }
  const idDoc: Partial<IBaseAttIDDoc> = {
    data: value,
  }

  expect(JSON.stringify(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'object'))).toEqual(JSON.stringify(value))
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'bogus')).toBeNull()
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'dob')).toEqual(value.biographic.dob)
  expect(Extractors.extractBase(JSON.stringify(idDoc), 'id-document', 'is_match')).toEqual(value.facematch_result.is_match)
})
