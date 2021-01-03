import React, { useCallback, useMemo } from 'react'

import useControlledTokenPagination from './controlled'
import { assertNumber } from './utils'

const DEFAULTS = {
  defaultPageNumber: 1,
  resetPageNumberOnPageSizeChange: true,
}

const changerTypes = ['function', 'number']

export default function useUncontrolledTokenPagination(
  options,
  stateHookFactory = () => React.useState
) {
  options = { ...DEFAULTS, ...options }

  assertNumber('defaultPageNumber', options.defaultPageNumber)
  assertNumber('defaultPageSize', options.defaultPageSize)

  const useState = stateHookFactory('uncontrolled')

  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: options.defaultPageNumber,
    pageSize: options.defaultPageSize,
  })

  const change = useCallback(
    (property, changer) => {
      const pageNumberReset = options.resetPageNumberOnPageSizeChange
        ? { pageNumber: options.defaultPageNumber }
        : null

      const changerType = typeof changer

      if (!changerTypes.includes(changerType)) {
        throw new Error(
          `Unsupported value ${changer} of type ${changerType} for ${property}. Supported values are ${changerTypes}`
        )
      }

      setPagination(p => ({
        ...p,
        ...pageNumberReset,
        [property]: changerType === 'function' ? changer(p[property]) : changer,
      }))
    },
    [options.defaultPageNumber, options.resetPageNumberOnPageSizeChange]
  )

  const changePageNumber = useCallback(
    changer => change('pageNumber', changer),
    [change]
  )
  const changePageSize = useCallback(changer => change('pageSize', changer), [
    change,
  ])

  const controlled = useControlledTokenPagination(pageNumber, stateHookFactory)

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
