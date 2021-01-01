import { useCallback, useEffect, useState, useMemo } from 'react'
import { NULL_PERSISTER } from './persisters'
import { assertNumber } from './utils'

export default function useControlledTokenPagination(
  pageNumber,
  persister = NULL_PERSISTER
) {
  assertNumber('pageNumber', pageNumber)

  const [mapping, setMapping] = useState(() => {
    const { mapping } = persister.hydrate()
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
    persister.persist({ mapping })
  }, [persister, mapping])

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
