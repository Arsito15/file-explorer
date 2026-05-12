const http = require('http')
const https = require('https')
const { URL } = require('url')

function request (url, options = {}) {
  const parsedUrl = new URL(url)
  const client = parsedUrl.protocol === 'https:' ? https : http

  return new Promise((resolve, reject) => {
    const req = client.request(
      parsedUrl,
      {
        method: 'GET',
        headers: options.headers || {},
        timeout: options.timeoutMs
      },
      (res) => {
        let body = ''

        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          body += chunk
        })
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            body
          })
        })
      }
    )

    req.on('timeout', () => {
      req.destroy(new Error('Request timeout'))
    })

    req.on('error', reject)
    req.end()
  })
}

async function getJson (url, options = {}) {
  const response = await request(url, options)

  if (response.statusCode < 200 || response.statusCode >= 300) {
    const error = new Error(`Request failed with status ${response.statusCode}`)
    error.statusCode = response.statusCode
    throw error
  }

  return JSON.parse(response.body)
}

async function getText (url, options = {}) {
  const response = await request(url, options)

  if (response.statusCode < 200 || response.statusCode >= 300) {
    const error = new Error(`Request failed with status ${response.statusCode}`)
    error.statusCode = response.statusCode
    throw error
  }

  return response.body
}

module.exports = {
  getJson,
  getText
}
