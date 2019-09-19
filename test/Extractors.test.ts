import {Extractors} from '../src'
import {IBaseAttPhone} from 'dist/AttestationData'

test('Phone extractor', () => {
  const value = '+15154932491'

  expect(Extractors.extractBase('+1234567890', 'phone', 'number')).not.toEqual(value)

  expect(Extractors.extractBase('+1234567890', 'phone', 'phone')).toBeNull()

  expect(Extractors.extractBase(value, 'phone', 'number')).toEqual(value)

  const bap: Partial<IBaseAttPhone> = {
    data: {
      full: value,
      country: 'US',
      subscriber: undefined,
      area: undefined,
      prefix: undefined,
      line: undefined,
      ext: undefined,
    },
  }
  const p = JSON.stringify(bap)
  expect(Extractors.extractBase(p, 'phone', 'number')).toEqual(value)
})
