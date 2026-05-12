module.exports = {
  externalApi: {
    baseUrl: 'https://echo-serv.tbxnet.com',
    authToken: 'Bearer aSuperSecretKey',
    timeoutMs: 10000
  },
  server: {
    port: Number(process.env.PORT) || 3001
  }
}
