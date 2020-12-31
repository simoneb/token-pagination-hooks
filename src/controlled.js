import { useCallback, useEffect, useState, useMemo } from 'react'
import { NULL_PERSISTER } from './persisters'
import { assertNumber } from './utils'

const DEFAULTS = {
  persister: NULL_PERSISTER,
}

export default function useControlledTokenPagination(pageNumber, options) {
  options = { ...DEFAULTS, ...options }

  assertNumber('pageNumber', pageNumber)

  const [mapping, setMapping] = useState(() => {
    const { mapping } = options.persister.hydrate()
    return mapping || {}
  })

  const updateToken = useCallback(
    nextToken => {
      setMapping(m => ({
        ...m,
        [pageNumber + 1]: nextToken,
      }))
    },
    [pageNumber]
  )

  const useUpdateToken = useCallback(
    function useUpdateToken(nextToken) {
      useEffect(() => updateToken(nextToken), [nextToken])
    },
    [updateToken]
  )

  useEffect(() => {
    options.persister.persist({ mapping })
  }, [options.persister, mapping])

  return useMemo(
    () => ({
      currentToken: mapping[pageNumber],
      useUpdateToken,
      updateToken,
      hasToken: pageNumber => pageNumber in mapping,
    }),
    [mapping, pageNumber, updateToken, useUpdateToken]
  )
}
