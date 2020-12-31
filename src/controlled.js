import { useCallback, useState, useMemo } from 'react'
import useUncontrolledTokenPagination from './uncontrolled'
import { assertNumber } from './utils'

const DEFAULTS = {
  defaultPageNumber: 1,
  resetPageNumberOnPageSizeChange: true,
}

export default function useControlledTokenPagination(options) {
  options = { ...DEFAULTS, ...options }

  assertNumber('defaultPageNumber', options.defaultPageNumber)
  assertNumber('defaultPageSize', options.defaultPageSize)

  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: options.defaultPageNumber,
    pageSize: options.defaultPageSize,
  })

  const change = useCallback(
    (property, changer) => {
      const pageNumberReset = options.resetPageNumberOnPageSizeChange
        ? { pageNumber: options.defaultPageNumber }
        : {}

      switch (typeof changer) {
        case 'function':
          return setPagination(p => ({
            ...p,
            ...pageNumberReset,
            [property]: changer(p[property]),
          }))
        case 'number':
          return setPagination(p => ({
            ...p,
            ...pageNumberReset,
            [property]: changer,
          }))
        default:
          throw new Error(
            `Unsupported value ${changer} of type ${typeof changer} for ${property}`
          )
      }
    },
    [options.defaultPageNumber, options.resetPageNumberOnPageSizeChange]
  )

  const changePageNumber = useCallback(c => change('pageNumber', c), [change])
  const changePageSize = useCallback(c => change('pageSize', c), [change])

  const uncontrolled = useUncontrolledTokenPagination(pageNumber)

  return useMemo(
    () => ({
      ...uncontrolled,
      pageNumber,
      pageSize,
      changePageNumber,
      changePageSize,
    }),
    [changePageNumber, changePageSize, pageNumber, pageSize, uncontrolled]
  )
}