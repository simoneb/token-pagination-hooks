# token-pagination-hooks

React Hooks library to use classic pagination in the frontend with a token-based paginatiom backend

## Setup

`npm i token-pagination-hooks`

## Quickstart

The API you're using

- accepts a `pageToken` query string parameter to do pagination
- returns data in the format:

```json
{
  "data": [...],
  "nextPage": "some opaque string"
}
```

Assuming you're using a library like [axios-hooks](https://github.com/simoneb/axios-hooks/) to interact with the API:

```js
import React, { useState } from 'react'
import useAxios from 'axios-hooks'
import useTokenPagination from 'token-pagination-hooks'

function Pagination() {
  const [pageNumber, setPageNumber] = useState(1)
  const { currentToken, useUpdateToken } = useTokenPagination(pageNumber)
  const [{ data }] = useAxios({ url: '/api', params: { pageToken: currentToken })
}
```
