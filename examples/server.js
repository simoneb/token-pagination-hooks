const http = require('http')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')

const tokenEncoding = 'base64'

const data = Array(100)
  .fill(null)
  .map((_, i) => ({ id: i + 1, value: 'some value ' + (i + 1) }))

function api(req, res) {
  const search = new URL(req.url, `http://${req.headers.host}`).searchParams
  const pageSize = +search.get('pageSize')
  const pageToken = search.get('pageToken')

  const pageNumber = pageToken
    ? +Buffer.from(pageToken, tokenEncoding).toString().split(':')[1]
    : 1
  const start = pageSize * (pageNumber - 1)
  const end = start + pageSize

  const result = {
    data: data.slice(start, end),
    nextPage:
      end < data.length
        ? Buffer.from(`pageNumber:${pageNumber + 1}`).toString(tokenEncoding)
        : null,
  }

  setTimeout(() => {
    res.end(JSON.stringify(result))
  }, 1000)
}

function static(req, res) {
  const filePath = path.join(__dirname, req.url)

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.end(fs.readFileSync(filePath))
  }

  return res.end(fs.readFileSync(path.join(__dirname, 'index.html')))
}

http
  .createServer((req, res) => {
    if (/^\/api/.test(req.url)) {
      return api(req, res)
    }

    static(req, res)
  })
  .listen(4000, () => console.log(`listening on port 4000`))
