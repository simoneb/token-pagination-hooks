import { useCallback, useState, useMemo } from 'react'
import useControlledTokenPagination from './controlled'
import { assertNumber } from './utils'

const DEFAULTS = {
  defaultPageNumber: 1,
  resetPageNumberOnPageSizeChange: true,
}

export default function useUncontrolledTokenPagination(options) {
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

      const changerType = typeof changer

      if (!['function', 'number'].includes(changerType)) {
        throw new Error(
          `Unsupported value ${changer} of type ${changerType} for ${property}`
        )
      }

      const paginate = p => {
        return {
          ...p,
          ...pageNumberReset,
          [property]: changerType === 'number' ? changer : changer(p[property]),
        }
      }

      setPagination(paginate)
    },
    [options.defaultPageNumber, options.resetPageNumberOnPageSizeChange]
  )

  const changePageNumber = useCallback(c => change('pageNumber', c), [change])
  const changePageSize = useCallback(c => change('pageSize', c), [change])

  const controlled = useControlledTokenPagination(pageNumber)

  return useMemo(
    () => ({
      ...controlled,
      pageNumber,
      pageSize,
      changePageNumber,
      changePageSize,
    }),
    [changePageNumber, changePageSize, pageNumber, pageSize, controlled]
  )
}
