require('dotenv').config()

module.exports = {
  externalApi: {
    baseUrl: process.env.EXTERNAL_API_BASE_URL || 'https://echo-serv.tbxnet.com',
    authToken: process.env.EXTERNAL_API_AUTH_TOKEN || '',
    timeoutMs: Number(process.env.EXTERNAL_API_TIMEOUT_MS) || 10000
  },
  server: {
    port: Number(process.env.PORT) || 3001
  }
}
