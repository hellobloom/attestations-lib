import {Extractors} from '../src'

import {IBaseAttPhone, IBaseAttEmail} from 'src/AttestationData'

test('Phone extractor', () => {
  const value = '+15154932491'

  expect(Extractors.extractBase('+1234567890', 'phone', 'number')).not.toEqual(value)

  expect(Extractors.extractBase(value, 'phone', 'phone')).toBeNull()

  expect(Extractors.extractBase(value, 'phone', 'number')).toEqual(value)

  const bap: Partial<IBaseAttPhone> = {
    data: {
      full: value,
    },
  }
  const p = JSON.stringify(bap)
  expect(Extractors.extractBase(p, 'phone', 'number')).toEqual(value)
})

test('Email extractor', () => {
  const value = 'test@bloom.co'

  expect(Extractors.extractBase('tester@bloom.co', 'email', 'email')).not.toEqual(value)

  expect(Extractors.extractBase(value, 'email', 'value')).toBeNull()

  expect(Extractors.extractBase(value, 'email', 'email')).toEqual(value)

  const bae: Partial<IBaseAttEmail> = {
    data: {
      email: value,
    },
  }
  const e = JSON.stringify(bae)
  expect(Extractors.extractBase(e, 'email', 'email')).toEqual(value)
})
