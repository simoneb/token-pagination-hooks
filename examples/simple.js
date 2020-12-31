/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

function Simple() {
  const [{ pageNumber, pageSize }, setPagination] = React.useState({
    pageNumber: 1,
    pageSize: 3,
  })
  const { currentToken, useUpdateToken } = useTokenPagination(pageNumber)

  const [data, setData] = React.useState()

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `/api?pageSize=${pageSize}&pageToken=${currentToken}`
      )
      setData(await res.json())
    }

    fetchData()
  }, [pageSize, currentToken])

  function previousPage() {
    setPagination(s => ({ ...s, pageNumber: pageNumber - 1 }))
  }
  function nextPage() {
    setPagination(s => ({ ...s, pageNumber: pageNumber + 1 }))
  }
  function changePageSize(e) {
    setPagination({ pageSize: e.target.value, pageNumber: 1 })
  }

  useUpdateToken(data?.nextPage)

  return (
    <>
      <h1>hello world</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div>
        <select value={pageSize} onChange={changePageSize}>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={12}>12</option>
        </select>
        {'  '}

        <button disabled={pageNumber <= 1} onClick={previousPage}>
          &lt;&lt;
        </button>
        {'  '}
        {pageNumber}
        {'  '}
        <button disabled={!data?.nextPage} onClick={nextPage}>
          &gt;&gt;
        </button>
      </div>
    </>
  )
}
