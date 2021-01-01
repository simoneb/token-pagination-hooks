# token-pagination-hooks

![ci](https://github.com/simoneb/token-pagination-hooks/workflows/ci/badge.svg)
[![codecov](https://codecov.io/gh/simoneb/token-pagination-hooks/branch/master/graph/badge.svg?token=QYDQYG7WN5)](https://codecov.io/gh/simoneb/token-pagination-hooks)
[![npm version](https://badge.fury.io/js/token-pagination-hooks.svg)](https://badge.fury.io/js/token-pagination-hooks)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/token-pagination-hooks)](https://bundlephobia.com/result?p=token-pagination-hooks)
[![bundlephobia](https://badgen.net/bundlephobia/dependency-count/token-pagination-hooks)](https://bundlephobia.com/result?p=token-pagination-hooks)

React Hooks library to use classic pagination in the frontend with a token-based paginatiom backend

<!-- toc -->

<!-- tocstop -->

## Setup

`npm i token-pagination-hooks`

## Quickstart

### API

See example API: 

[![Edit server](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/server-0wmht?fontsize=14&hidenavigation=1&theme=dark)

Assiming you're using an API which:

- accepts a `pageToken` query string parameter to do pagination
- returns data in the format:

```json
{
  "data": [{ 
    "id": 1, 
    "value": "some value" 
  }],
  "nextPage": "some opaque string"
}
```

### Client

See example client:

[![Edit with axios-hooks](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/with-axios-hooks-u035y?fontsize=14&hidenavigation=1&theme=dark)

Assuming you're using a library like [axios-hooks](https://github.com/simoneb/axios-hooks/) to interact with the API:

```js
import React, { useState } from 'react'
import useAxios from 'axios-hooks'
import useTokenPagination from 'token-pagination-hooks'

function Pagination() {
  const [pageNumber, setPageNumber] = useState(1)
  const { currentToken, useUpdateToken, hasToken } = useTokenPagination(
    pageNumber
  )
  const [{ data }] = useAxios({
    url: '/api',
    params: { pageSize: 3, pageToken: currentToken }
  })

  useUpdateToken(data?.nextPage)

  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div>
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((p) => p - 1)}
        >
          &lt;&lt;
        </button>
        {'  '}
        {pageNumber}
        {'  '}
        <button
          disabled={!hasToken(pageNumber + 1) || !data?.nextPage}
          onClick={() => setPageNumber((p) => p + 1)}
        >
          &gt;&gt;
        </button>
      </div>
    </>
  )
}
```
