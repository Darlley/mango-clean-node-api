module.exports = (req, res, next) => {
  // midleware para liberar CORS
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-methods', '*')
  res.set('access-control-allow-headers', '*')
  next()
}
