import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-test-renderer'

import useUncontrolled from './uncontrolled'

describe('uncontrolled', () => {
  it('throws if a non numeric default page number is provided', () => {
    const { result } = renderHook(() =>
      useUncontrolled({ defaultPageNumber: '1' })
    )

    expect(() => result.current).toThrow(/defaultPageNumber must be a number/)
  })

  it('throws if a non numeric default page size is provided', () => {
    const { result } = renderHook(() =>
      useUncontrolled({ defaultPageSize: '1' })
    )

    expect(() => result.current).toThrow(/defaultPageSize must be a number/)
  })

  it('does not throw if a default page number is not provided', () => {
    const { result } = renderHook(() => useUncontrolled({ defaultPageSize: 1 }))

    expect(() => result.current).not.toThrow()
  })

  it('throws if a default page size is not provided', () => {
    const { result } = renderHook(() => useUncontrolled())

    expect(() => result.current).toThrow(/defaultPageSize must be a number/)
  })

  it('defaults the page number to 1 if not provided', () => {
    const { result } = renderHook(() => useUncontrolled({ defaultPageSize: 1 }))

    expect(result.current.pageNumber).toBe(1)
  })

  it('returns the provided default page number', () => {
    const { result } = renderHook(() =>
      useUncontrolled({ defaultPageNumber: 5, defaultPageSize: 1 })
    )

    expect(result.current.pageNumber).toBe(5)
  })

  it('returns the provided default page size', () => {
    const { result } = renderHook(() => useUncontrolled({ defaultPageSize: 1 }))

    expect(result.current.pageSize).toBe(1)
  })

  describe('changePageNumber', () => {
    it('changes page number via raw value', () => {
      const { result } = renderHook(() =>
        useUncontrolled({ defaultPageSize: 1 })
      )

      act(() => result.current.changePageNumber(2))

      expect(result.current.pageNumber).toBe(2)
    })

    it('changes page number via updater', () => {
      const { result } = renderHook(() =>
        useUncontrolled({ defaultPageSize: 1 })
      )

      act(() => result.current.changePageNumber(p => p + 1))

      expect(result.current.pageNumber).toBe(2)
    })
  })

  describe('changePageSize', () => {
    it('throws when changer type is not supported', () => {
      const { result } = renderHook(() =>
        useUncontrolled({ defaultPageSize: 1 })
      )

      act(() => {
        expect(() => result.current.changePageSize('2')).toThrow()
      })
    })

    describe('resetPageNumberOnPageSizeChange=true [default]', () => {
      it('changes page size via raw value', () => {
        const { result } = renderHook(() =>
          useUncontrolled({ defaultPageSize: 1 })
        )

        act(() => result.current.changePageNumber(2))
        act(() => result.current.changePageSize(2))

        expect(result.current.pageNumber).toBe(1)
        expect(result.current.pageSize).toBe(2)
      })

      it('changes page size via updater', () => {
        const { result } = renderHook(() =>
          useUncontrolled({ defaultPageSize: 1 })
        )

        act(() => result.current.changePageNumber(2))
        act(() => result.current.changePageSize(p => p + 1))

        expect(result.current.pageNumber).toBe(1)
        expect(result.current.pageSize).toBe(2)
      })
    })

    describe('resetPageNumberOnPageSizeChange=false', () => {
      it('changes page size via raw value', () => {
        const { result } = renderHook(() =>
          useUncontrolled({
            defaultPageSize: 1,
            resetPageNumberOnPageSizeChange: false,
          })
        )

        act(() => result.current.changePageNumber(2))
        act(() => result.current.changePageSize(2))

        expect(result.current.pageNumber).toBe(2)
        expect(result.current.pageSize).toBe(2)
      })

      it('changes page size via updater', () => {
        const { result } = renderHook(() =>
          useUncontrolled({
            defaultPageSize: 1,
            resetPageNumberOnPageSizeChange: false,
          })
        )

        act(() => result.current.changePageNumber(2))
        act(() => result.current.changePageSize(p => p + 1))

        expect(result.current.pageNumber).toBe(2)
        expect(result.current.pageSize).toBe(2)
      })
    })
  })
})
