import { renderHook } from '@testing-library/react-hooks'
import useTokenPagination from './'

jest.mock('./controlled', () => jest.fn(() => 'controlled'))
jest.mock('./uncontrolled', () => jest.fn(() => 'uncontrolled'))

import controlled from './controlled'
import uncontrolled from './uncontrolled'

describe('useTokenPagination', () => {
  it('returns uncontrolled when a pageNumber is provided', async () => {
    const { result } = renderHook(() => useTokenPagination(1))

    expect(result.current).toBe('uncontrolled')
    expect(uncontrolled).toHaveBeenCalledWith(1)
  })

  it('returns controlled when an object is provided', async () => {
    const arg = {}
    const { result } = renderHook(() => useTokenPagination(arg))

    expect(result.current).toBe('controlled')
    expect(controlled).toHaveBeenCalledWith(arg)
  })

  it('throws when an unknown input type is provided', async () => {
    const { result } = renderHook(() => useTokenPagination('wrong'))

    expect(() => result.current).toThrow(
      /Unsupported options wrong of type string/
    )
  })
})
