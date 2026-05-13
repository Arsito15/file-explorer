/* global after, afterEach, before, describe, it */

const { expect } = require('chai')
const http = require('http')

const app = require('../../src/app')
const env = require('../../src/config/env')

const AUTH_TOKEN = 'Bearer aSuperSecretKey'

function listen (server) {
  return new Promise((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      resolve(server.address().port)
    })

    server.on('error', reject)
  })
}

function close (server) {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve()
      return
    }

    server.close((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

function requestJson (port, path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
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
            headers: res.headers,
            body: JSON.parse(body)
          })
        })
      }
    )

    req.on('error', reject)
    req.end()
  })
}

function createMockApiServer (routeHandler) {
  return http.createServer((req, res) => {
    if (req.headers.authorization !== AUTH_TOKEN) {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ code: 'unauthorized' }))
      return
    }

    routeHandler(req, res)
  })
}

describe('GET /files/data', () => {
  let appServer
  let appPort
  let mockApiServer
  let originalBaseUrl

  before(async () => {
    appServer = http.createServer(app)
    appPort = await listen(appServer)
    originalBaseUrl = env.externalApi.baseUrl
  })

  after(async () => {
    env.externalApi.baseUrl = originalBaseUrl
    await close(mockApiServer)
    await close(appServer)
  })

  afterEach(async () => {
    env.externalApi.baseUrl = originalBaseUrl
    await close(mockApiServer)
    mockApiServer = null
  })

  it('returns the raw files list in /files/list', async () => {
    mockApiServer = createMockApiServer((req, res) => {
      if (req.method === 'GET' && req.url === '/v1/secret/files') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ files: ['file1.csv', 'file2.csv', 'file3.csv'] }))
        return
      }

      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ code: 'not_found' }))
    })

    const mockApiPort = await listen(mockApiServer)
    env.externalApi.baseUrl = `http://127.0.0.1:${mockApiPort}`

    const response = await requestJson(appPort, '/files/list')

    expect(response.statusCode).to.equal(200)
    expect(response.body).to.deep.equal({
      files: ['file1.csv', 'file2.csv', 'file3.csv']
    })
  })

  it('returns formatted files and skips invalid rows or failed downloads', async () => {
    mockApiServer = createMockApiServer((req, res) => {
      if (req.method === 'GET' && req.url === '/v1/secret/files') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ files: ['file1.csv', 'file2.csv', 'file3.csv'] }))
        return
      }

      if (req.method === 'GET' && req.url === '/v1/secret/file/file1.csv') {
        res.writeHead(200, { 'Content-Type': 'text/csv' })
        res.end(
          [
            'file,text,number,hex',
            'file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765',
            'file1.csv,broken',
            'file1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5',
            'other.csv,Ignored,1,70ad29aacf0b690b0467fe2b2767f765',
            'file1.csv,NoNumber,abc,70ad29aacf0b690b0467fe2b2767f765'
          ].join('\n')
        )
        return
      }

      if (req.method === 'GET' && req.url === '/v1/secret/file/file2.csv') {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ code: 'download_error' }))
        return
      }

      if (req.method === 'GET' && req.url === '/v1/secret/file/file3.csv') {
        res.writeHead(200, { 'Content-Type': 'text/csv' })
        res.end('file,text,number,hex\n')
        return
      }

      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ code: 'not_found' }))
    })

    const mockApiPort = await listen(mockApiServer)
    env.externalApi.baseUrl = `http://127.0.0.1:${mockApiPort}`

    const response = await requestJson(appPort, '/files/data')

    expect(response.statusCode).to.equal(200)
    expect(response.headers['content-type']).to.match(/application\/json/)
    expect(response.body).to.deep.equal([
      {
        file: 'file1.csv',
        lines: [
          {
            text: 'RgTya',
            number: 64075909,
            hex: '70ad29aacf0b690b0467fe2b2767f765'
          },
          {
            text: 'AtjW',
            number: 6,
            hex: 'd33a8ca5d36d3106219f66f939774cf5'
          }
        ]
      }
    ])
  })

  it('filters the data by fileName query param', async () => {
    const requestedFiles = []

    mockApiServer = createMockApiServer((req, res) => {
      if (req.method === 'GET' && req.url === '/v1/secret/files') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ files: ['file1.csv', 'file2.csv'] }))
        return
      }

      if (req.method === 'GET' && req.url === '/v1/secret/file/file1.csv') {
        requestedFiles.push('file1.csv')
        res.writeHead(200, { 'Content-Type': 'text/csv' })
        res.end('file,text,number,hex\nfile1.csv,LineOne,1,70ad29aacf0b690b0467fe2b2767f765')
        return
      }

      if (req.method === 'GET' && req.url === '/v1/secret/file/file2.csv') {
        requestedFiles.push('file2.csv')
        res.writeHead(200, { 'Content-Type': 'text/csv' })
        res.end('file,text,number,hex\nfile2.csv,LineTwo,2,d33a8ca5d36d3106219f66f939774cf5')
        return
      }

      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ code: 'not_found' }))
    })

    const mockApiPort = await listen(mockApiServer)
    env.externalApi.baseUrl = `http://127.0.0.1:${mockApiPort}`

    const response = await requestJson(appPort, '/files/data?fileName=file2.csv')

    expect(response.statusCode).to.equal(200)
    expect(requestedFiles).to.deep.equal(['file2.csv'])
    expect(response.body).to.deep.equal([
      {
        file: 'file2.csv',
        lines: [
          {
            text: 'LineTwo',
            number: 2,
            hex: 'd33a8ca5d36d3106219f66f939774cf5'
          }
        ]
      }
    ])
  })

  it('returns 502 when the files list cannot be fetched', async () => {
    mockApiServer = createMockApiServer((req, res) => {
      if (req.method === 'GET' && req.url === '/v1/secret/files') {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ code: 'list_error' }))
        return
      }

      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ code: 'not_found' }))
    })

    const mockApiPort = await listen(mockApiServer)
    env.externalApi.baseUrl = `http://127.0.0.1:${mockApiPort}`

    const response = await requestJson(appPort, '/files/data')

    expect(response.statusCode).to.equal(502)
    expect(response.headers['content-type']).to.match(/application\/json/)
    expect(response.body).to.deep.equal({
      error: 'Failed to fetch remote files'
    })
  })
})
