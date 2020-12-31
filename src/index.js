import { useCallback, useEffect, useState } from 'react'

export default function useTokenPagination(pageNumber) {
  const [state, setState] = useState({
    [pageNumber]: '',
  })

  const useUpdateToken = useCallback(
    function useUpdateToken(nextToken = '') {
      useEffect(() => {
        setState(s => ({
          ...s,
          [pageNumber + 1]: nextToken,
        }))
      }, [nextToken])
    },
    [pageNumber]
  )

  return {
    currentToken: state[pageNumber],
    useUpdateToken,
  }
}
