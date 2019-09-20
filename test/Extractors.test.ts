import {Extractors} from '../src'

import {IBaseAttPhone, IBaseAttEmail, IBaseAttName, IBaseAttSSN} from 'src/AttestationData'

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
