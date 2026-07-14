const http = require("http");

const UPSTREAM_PORT = process.env.UPSTREAM_PORT || 3001;
const PROXY_PORT = process.env.PROXY_PORT || 3000;
const PROXY_PREFIX = process.env.PROXY_PREFIX || "/codeeditor/default/absports/3000";

const server = http.createServer((req, res) => {
  // Restore the prefix that SageMaker's absports proxy strips
  const options = {
    hostname: "127.0.0.1",
    port: UPSTREAM_PORT,
    path: PROXY_PREFIX + req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", () => {
    res.writeHead(502);
    res.end("Bad Gateway");
  });

  req.pipe(proxyReq);
});

server.listen(PROXY_PORT, "127.0.0.1", () => {
  console.log(
    `SageMaker proxy :${PROXY_PORT} -> :${UPSTREAM_PORT} (prefix: ${PROXY_PREFIX})`
  );
});
