const { useState, useEffect } = React

function makeStateHookFactory(prefix) {
  return function makeStateHook(key) {
    const id = [prefix, key].join('-')

    return function useSessionStorageState(initializer) {
      const result = useState(
        JSON.parse(sessionStorage.getItem(id) || 'null') ?? initializer
      )

      const [state] = result

      useEffect(() => {
        sessionStorage.setItem(id, JSON.stringify(state))
      }, [state])

      return result
    }
  }
}

const stateHookFactory = makeStateHookFactory('persistence')

function Persistence() {
  const {
    currentToken,
    hasToken,
    useUpdateToken,
    changePageNumber,
    changePageSize,
    pageNumber,
    pageSize,
  } = useTokenPagination(
    {
      defaultPageNumber: 1,
      defaultPageSize: 5,
    },
    stateHookFactory
  )
  const [data, setData] = useState()

  useEffect(() => {
    async function fetchData() {
      const params = new URLSearchParams({ pageSize })

      if (currentToken) {
        params.append('pageToken', currentToken)
      }

      const res = await fetch(`/api?${params.toString()}`)
      const data = await res.json()

      setData(data)
    }

    fetchData()
  }, [pageSize, currentToken])

  useUpdateToken(data?.nextPage)

  function previousPage() {
    changePageNumber(n => n - 1)
  }
  function nextPage() {
    changePageNumber(n => n + 1)
  }
  function handleChangePageSize(e) {
    changePageSize(+e.target.value)
  }

  return (
    <Output
      data={data}
      pageNumber={pageNumber}
      pageSize={pageSize}
      changePageSize={handleChangePageSize}
      previousPage={previousPage}
      nextPage={hasToken(pageNumber + 1) ? nextPage : undefined}
    />
  )
}

Persistence.propTypes = {}
