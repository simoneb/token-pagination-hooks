import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-test-renderer'

import useControlled from './controlled'

describe('controlled', () => {
  it('throws if a non numeric page number is provided', () => {
    const { result } = renderHook(() => useControlled('1'))

    expect(() => result.current).toThrow(/pageNumber must be a number/)
  })

  it('sets the initial token to undefined', () => {
    const { result } = renderHook(() => useControlled(1))

    expect(result.current.currentToken).toBe(undefined)
  })

  it('updates the token declaratively', async () => {
    const { result, rerender } = renderHook(props => useControlled(props), {
      initialProps: 1,
    })

    const { useUpdateToken } = result.current

    renderHook(() => useUpdateToken('next'))

    rerender(2)

    expect(result.current.currentToken).toBe('next')
  })

  it('updates the token imperatively', async () => {
    const { result, rerender } = renderHook(props => useControlled(props), {
      initialProps: 1,
    })

    const { updateToken } = result.current

    act(() => updateToken('next'))

    rerender(2)

    expect(result.current.currentToken).toBe('next')
  })
})
