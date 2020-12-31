import { useCallback, useEffect, useState, useMemo } from 'react'
import { assertNumber } from './utils'

export default function useControlledTokenPagination(pageNumber) {
  assertNumber('pageNumber', pageNumber)

  const [mapping, setMapping] = useState({})

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
