const express = require('express')
const swaggerUi = require('swagger-ui-express')
const cors = require('./middlewares/cors')
const errorHandler = require('./middlewares/errorHandler')
const openApiSpec = require('./docs/openapi')
const filesRoutes = require('./routes/filesRoutes')

const app = express()

app.use(cors)
app.get('/openapi.json', (req, res) => {
  res.json(openApiSpec)
})
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  explorer: true
}))
app.use('/files', filesRoutes)
app.use(errorHandler)

module.exports = app
