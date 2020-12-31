# token-pagination-hooks

![ci](https://github.com/simoneb/token-pagination-hooks/workflows/ci/badge.svg)
[![codecov](https://codecov.io/gh/simoneb/token-pagination-hooks/branch/master/graph/badge.svg?token=QYDQYG7WN5)](https://codecov.io/gh/simoneb/token-pagination-hooks)
[![npm version](https://badge.fury.io/js/token-pagination-hooks.svg)](https://badge.fury.io/js/token-pagination-hooks)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/token-pagination-hooks)](https://bundlephobia.com/result?p=token-pagination-hooks)
[![bundlephobia](https://badgen.net/bundlephobia/dependency-count/token-pagination-hooks)](https://bundlephobia.com/result?p=token-pagination-hooks)

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
