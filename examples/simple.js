/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */

function Simple() {
  const {
    pageNumber,
    currentToken,
    useUpdateToken,
    changePageNumber,
    changePageSize,
  } = useTokenPagination()

  function previousPage() {
    changePageNumber(pageNumber - 1)
  }
  function nextPage() {
    changePageNumber(pageNumber + 1)
  }

  useUpdateToken('after page ' + pageNumber)

  return (
    <>
      <h1>hello world</h1>
      <pre>{JSON.stringify({ currentToken }, null, 2)}</pre>
      <div>
        <button onClick={previousPage}>&lt;&lt;</button>
        {'  '}
        {pageNumber}
        {'  '}
        <button onClick={nextPage}>&gt;&gt;</button>
      </div>
    </>
  )
}
