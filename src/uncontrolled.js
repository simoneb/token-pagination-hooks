import { useCallback, useState, useMemo, useEffect } from 'react'
import useControlledTokenPagination from './controlled'
import { NULL_PERSISTER } from './persisters'
import { assertNumber } from './utils'

const DEFAULTS = {
  defaultPageNumber: 1,
  resetPageNumberOnPageSizeChange: true,
  persister: NULL_PERSISTER,
}

const changerTypes = ['function', 'number']

export default function useUncontrolledTokenPagination(options) {
  options = { ...DEFAULTS, ...options }

  assertNumber('defaultPageNumber', options.defaultPageNumber)
  assertNumber('defaultPageSize', options.defaultPageSize)

  const [{ pageNumber, pageSize }, setPagination] = useState(() => {
    const { pageNumber, pageSize } = options.persister.hydrate()

    return {
      pageNumber: pageNumber || options.defaultPageNumber,
      pageSize: pageSize || options.defaultPageSize,
    }
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

  const controlled = useControlledTokenPagination(pageNumber, options)

  useEffect(() => {
    options.persister.persist({ pageNumber, pageSize })
  }, [options.persister, pageNumber, pageSize])

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
