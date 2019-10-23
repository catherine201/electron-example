const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy('/fangman', {
      target: 'http://192.168.10.137:8000/',
      changeOrigin: true,
      pathRewrite: {
        '^/fangman': ''
      }
    })
  )
  app.use(
    proxy('/log', {
      target: 'http://192.168.10.121:9000/',
      changeOrigin: true,
      pathRewrite: {
        '^/log': ''
      }
    })
  )
  app.use(
    proxy('/third', {
      target: 'http://192.168.10.135:3030/',
      changeOrigin: true,
      pathRewrite: {
        '^/third': ''
      }
    })
  )
}
