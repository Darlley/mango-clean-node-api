module.exports = (req, res, next) => {
  // midleware para liberar CORS
  res.type('json')
  next()
}
