const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://dromii-v3.duckdns.org',
      changeOrigin: true,
    })
  );
};
