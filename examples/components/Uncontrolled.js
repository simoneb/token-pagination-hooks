const { useState, useEffect } = React

function Uncontrolled() {
  const {
    currentToken,
    useUpdateToken,
    changePageNumber,
    changePageSize,
    pageNumber,
    pageSize,
  } = useTokenPagination({ defaultPageNumber: 1, defaultPageSize: 5 })
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const params = new URLSearchParams({ pageSize })

      if (currentToken) {
        params.append('pageToken', currentToken)
      }

      const res = await fetch(`/api?${params.toString()}`)
      const data = await res.json()

      setData(data)
      setLoading(false)
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
      nextPage={!loading && nextPage}
    />
  )
}

Uncontrolled.propTypes = {}
