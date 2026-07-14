const http = require('http')

const NEXT_PORT = 3001
const PROXY_PORT = 3000

// No basePath, no path rewriting. Just forward as-is to Next.js on 3001.
// SageMaker absports proxy strips /codeeditor/default/absports/3000 before forwarding to us,
// so we receive plain paths like "/" and "/_next/...".
const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: NEXT_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers,
  }

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers)
    proxyRes.pipe(res)
  })

  proxyReq.on('error', () => {
    res.writeHead(502)
    res.end('Bad Gateway')
  })

  req.pipe(proxyReq)
})

server.listen(PROXY_PORT, '127.0.0.1', () => {
  console.log(`Proxy :${PROXY_PORT} -> Next.js :${NEXT_PORT}`)
})
