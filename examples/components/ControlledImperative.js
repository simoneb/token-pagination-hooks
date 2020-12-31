const { useState, useEffect } = React

function ControlledImperative() {
  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: 1,
    pageSize: 3,
  })
  const { currentToken, updateToken } = useTokenPagination(pageNumber)
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

      updateToken(data.nextPage)

      setData(data)
      setLoading(false)
    }

    fetchData()
  }, [pageSize, currentToken, updateToken])

  function previousPage() {
    setPagination(s => ({ ...s, pageNumber: pageNumber - 1 }))
  }
  function nextPage() {
    setPagination(s => ({ ...s, pageNumber: pageNumber + 1 }))
  }
  function changePageSize(e) {
    setPagination({ pageSize: e.target.value, pageNumber: 1 })
  }

  return (
    <Output
      data={data}
      pageNumber={pageNumber}
      pageSize={pageSize}
      changePageSize={changePageSize}
      previousPage={previousPage}
      nextPage={!loading && nextPage}
    />
  )
}

ControlledImperative.propTypes = {}
