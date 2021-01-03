# token-pagination-hooks

![ci](https://github.com/simoneb/token-pagination-hooks/workflows/ci/badge.svg)
[![codecov](https://codecov.io/gh/simoneb/token-pagination-hooks/branch/master/graph/badge.svg?token=QYDQYG7WN5)](https://codecov.io/gh/simoneb/token-pagination-hooks)
[![npm version](https://badge.fury.io/js/token-pagination-hooks.svg)](https://badge.fury.io/js/token-pagination-hooks)
[![bundlephobia](https://badgen.net/bundlephobia/minzip/token-pagination-hooks)](https://bundlephobia.com/result?p=token-pagination-hooks)
[![bundlephobia](https://badgen.net/bundlephobia/dependency-count/token-pagination-hooks)](https://bundlephobia.com/result?p=token-pagination-hooks)

React Hooks library to use classic pagination in a frontend, based on page number and page size, with a token-based pagination backend.

<!-- toc -->

- [Setup](#setup)
- [Quickstart](#quickstart)
  * [Backend](#backend)
  * [Frontend](#frontend)
- [Running the examples](#running-the-examples)
- [API](#api)
- [Usage](#usage)
  * [Token update](#token-update)
    + [Declarative](#declarative)
    + [Imperative](#imperative)
  * [Modes](#modes)
    + [Controlled](#controlled)
    + [Uncontrolled](#uncontrolled)

<!-- tocstop -->

## Setup

```bash
npm i token-pagination-hooks
```

## Quickstart

The hook can work in `controlled` and `uncontrolled` modes, as is the React convention. See more details in the [usage](#usage) section. This example uses the controlled mode.

### Backend

[![Edit server](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/server-0wmht?fontsize=14&hidenavigation=1&theme=dark)

Assiming you're using an API which:

- accepts a `pageToken` query string parameter to do pagination

```bash
GET /api?pageSize=2&pageToken=some-opaque-string
```

- returns data in the format:

```json
{
  "data": [{ 
    "id": 1, 
    "value": "some value" 
  }],
  "nextPage": "some-opaque-string"
}
```

### Frontend

[![Edit with axios-hooks](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/with-axios-hooks-u035y?fontsize=14&hidenavigation=1&theme=dark)

Assuming you're using a library like [axios-hooks](https://github.com/simoneb/axios-hooks/) to interact with the API:

```jsx
function Pagination() {
  // store pagination state
  const [pageNumber, setPageNumber] = useState(1)

  // use the hook and provide the current page number
  const { currentToken, useUpdateToken, hasToken } = useTokenPagination(
    pageNumber
  )

  // invoke the paginated api
  const [{ data }] = useAxios({
    url: '/api',
    params: { pageSize: 3, pageToken: currentToken }
  })

  // update the token for the next page
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

## Running the examples

The repository contains several examples showing different usage scenarios. To run the examples:

- clone the repository and cd into it
- `npm i`
- `npm run examples`
- browse to `http://localhost:4000`

## API

```jsx
import useTokenPagination from 'token-pagination-hooks'

function Component() {
  const result = useTokenPagination(options[, stateHookFactory])
}
```

- `options` - `number` | `object` - **Required**
  - `number`
  
    Represents a page number and implies the `controlled` mode. The page number must be provided and its value reflect the current page.

  - `object` 
   
    Implies the `uncontrolled` mode.

    - `options.defaultPageNumber` - `number` - **Default: 1**
          
      The initial page number. The Hook will then keep its internal state.

    - `options.defaultPageSize` - `number` - **Required**

      The initial page size. The Hook will then keep its internal state.

    - `options.resetPageNumberOnPageSizeChange` -`bool` - **Default: true**

      Whether to reset the page number when the page size changes.

- `stateHookFactory` - `(key: string) => function` - **Optional**

  An optional factory for the state Hook which defaults to a function returning `React.useState`.

  It can be customized to provide a Hook which stores the state in a persistent store, like browser storage.

  It should be a function which accepts a unique key and returns a Hook implementation.

- `result` - `object`
  
  The return value of the Hook, its properties change depending on whether `controlled` or `uncontrolled` mode is used.

  **Both controlled and uncontrolled**

  - `result.currentToken` - `any`
   
    The pagination token for the requested page to provide to the API.
  
  - `result.useUpdateToken` - `token: any => void` 
  
    The Hook to invoke with the pagination token as returned by the API for declarative storage of the mapping between page numbers and tokens.

  - `result.updateToken` - `token: any => void`

    The function to invoke with the pagination token as returned by the API for imperative storage of the mapping between page numbers and tokens.

  - `hasToken` - `pageNumber: number => bool`
  
    A function which can be invoked with a page number to check if there is a pagination token for that page. Useful to conditionally enable pagination buttons (see examples).

  **Uncontrolled only**

  - `result.pageNumber` - `number`
  
    The current page number.

  - `result.pageSize` - `number`
  
    The current page size.

  - `result.changePageNumber(changer)`

    A function to change the page number. Changer is either a number, which will be the new page number, or a function, which gets the current page number as its first argument and returns the new page number.

    `changer`:

    - `pageNumber: number`
    - `(previousPageNumber: number) => newPageNumber: number`

  - `result.changePageSize(changer)`

    A function to change the page size. Changer is either a number, which will be the new page size, or a function, which gets the current page size as its first argument and returns the new page size.

    `changer`:

    - `pageNumber: number`
    - `(previousPageSize: number) => newPageSize: number`
  
    
## Usage

### Token update

The Hook provides two ways to update the mapping between a page number and the token used to paginate from the current page to the next: a declarative one based on a React Hook and an imperative one based on a plain function.

#### Declarative

The declarative approach is based on React Hooks and it's useful when you're invoking an API via a React Hook, as when using [`axios-hooks`](https://github.com/simoneb/axios-hooks/), [`graphql-hooks`](https://github.com/nearform/graphql-hooks) or one of the many other Hook-based libraries available.

```jsx
const { useUpdateToken } = useTokenPagination(...)

// invoke your API which returns the token for the next page, e.g.
const { data, nextPage } = useYourApi()

// update the token for the next page using the Hook
useUpdateToken(nextPage)
```

#### Imperative

The imperative approach is useful when you invoke your API imperatively, for instance using `fetch` in a `useEffect` Hook:

```jsx
const { currentToken, updateToken } = useTokenPagination(...)

useEffect(() => {
  async function fetchData() {
    const params = new URLSearchParams({ pageToken: currentToken })

    const res = await fetch(`/api?${params.toString()}`)
    const data = await res.json()

    // update the token imperatively when the API responds
    updateToken(data.nextPage)
  }

  fetchData()
}, [currentToken, updateToken])
```

### Modes

The hook can be used in `controlled` and `uncontrolled` mode. 

#### Controlled

When in controlled mode, you are responsible for keeping the pagination state (page number, page size) and providing the necessary data to the Hook.

To work in controlled mode, you provide a numeric page number as the first argument to the Hook:

```js
// you are responsible for storing the pagination state
const [pageNumber, setPageNumber] = useState(1)

// you provide the current page number to the hook
const { useUpdateToken } = useTokenPagination(pageNumber)

// invoke your API which returns the token for the next page, e.g.
const { data, nextPage } = useYourApi()

// inform the hook of the token to take you from the current page to the next
useUpdateToken(nextPage)
```

#### Uncontrolled

When in uncontrolled mode, the hook keeps its internal pagination state and provides way to read and modify it.

To work in uncontrolled mode, you provide an object containing a default page number and a default page size:

```jsx
// you provide default values and the hook keeps its internal state
const {
  useUpdateToken,
  pageNumber,
  pageSize,
} = useTokenPagination({ defaultPageNumber: 1, defaultPageSize: 5 })


// invoke your API which returns the token for the next page, e.g.
const { data, nextPage } = useYourApi()

// inform  the hook of the token to take you from the current page to the next
useUpdateToken(nextPage)
```
