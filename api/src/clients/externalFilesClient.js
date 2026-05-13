const env = require('../config/env')
const httpClient = require('./httpClient')

function getRequestOptions () {
  return {
    headers: {
      authorization: env.externalApi.authToken
    },
    timeoutMs: env.externalApi.timeoutMs
  }
}

async function fetchAvailableFiles () {
  const filesResponse = await httpClient.getJson(
    `${env.externalApi.baseUrl}/v1/secret/files`,
    getRequestOptions()
  )

  return Array.isArray(filesResponse.files) ? filesResponse.files : []
}

async function fetchFileContent (fileName) {
  return httpClient.getText(
    `${env.externalApi.baseUrl}/v1/secret/file/${encodeURIComponent(fileName)}`,
    getRequestOptions()
  )
}

module.exports = {
  fetchAvailableFiles,
  fetchFileContent
}
