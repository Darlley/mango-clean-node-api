module.exports = (app) => {
  app.disable('x-powered-by')
  app.use((req, res, next) => {
    // midleware para liberar CORS
    res.set('access-control-allow-origin', '*')
    res.set('access-control-allow-methods', '*')
    res.set('access-control-allow-headers', '*')
    next()
  })
}
