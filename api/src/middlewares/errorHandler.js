function errorHandler (error, req, res, next) {
  if (res.headersSent) {
    next(error)
    return
  }

  res.status(error.statusCode || 500).json({
    error: error.publicMessage || 'Internal server error'
  })
}

module.exports = errorHandler
