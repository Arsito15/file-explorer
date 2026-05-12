const app = require('./app')
const config = require('./config')

const MAX_PORT_ATTEMPTS = 10

function startServer (port, attemptsLeft) {
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })

  server.on('error', (error) => {
    const shouldRetry =
      error.code === 'EADDRINUSE' && !process.env.PORT && attemptsLeft > 0

    if (shouldRetry) {
      console.log(`Port ${port} is in use, trying ${port + 1}`)
      startServer(port + 1, attemptsLeft - 1)
      return
    }

    throw error
  })
}

startServer(config.server.port, MAX_PORT_ATTEMPTS)
