import { useCallback, useEffect, useState } from 'react'

export default function useTokenPagination(firstPage = 1) {
  const [{ pageNumber, pageToToken }, setState] = useState({
    pageNumber: firstPage,
    pageToToken: {
      [firstPage]: '',
    },
  })

  const changePageNumber = useCallback(pageNumber => {
    setState(s => ({
      ...s,
      pageNumber,
    }))
  }, [])

  const changePageSize = useCallback(() => {
    setState(s => ({
      ...s,
      pageNumber: firstPage,
      pageToToken: {
        [firstPage]: '',
      },
    }))
  }, [firstPage])

  const useUpdateToken = useCallback(
    function useUpdateToken(nextToken = '') {
      useEffect(() => {
        setState(s => ({
          ...s,
          pageToToken: {
            ...s.pageToToken,
            [pageNumber + 1]: nextToken,
          },
        }))
      }, [nextToken])
    },
    [pageNumber]
  )

  return {
    pageNumber,
    currentToken: pageToToken[pageNumber],
    useUpdateToken,
    changePageNumber,
    changePageSize,
  }
}
