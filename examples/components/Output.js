const T = PropTypes

function Output({
  data,
  pageNumber,
  pageSize,
  changePageSize,
  previousPage,
  nextPage,
}) {
  return (
    <>
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

Output.propTypes = {
  data: T.shape({
    nextPage: T.any,
  }),
  pageNumber: T.number.isRequired,
  pageSize: T.number.isRequired,
  changePageSize: T.func.isRequired,
  previousPage: T.func.isRequired,
  nextPage: T.func.isRequired,
}
