const API_PORTS = Array.from({ length: 10 }, (_, index) => 3001 + index)
const REQUEST_TIMEOUT_MS = 2500

function getFetchImplementation(fetchImpl) {
  const resolvedFetch = fetchImpl || globalThis.fetch

  if (typeof resolvedFetch !== 'function') {
    throw new Error('No fetch implementation available')
  }

  return resolvedFetch.bind(globalThis)
}

function fetchWithTimeout(url, fetchImpl) {
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  return getFetchImplementation(fetchImpl)(url, {
    method: 'GET',
    headers: {
      accept: 'application/json'
    },
    signal: controller.signal
  }).finally(() => {
    globalThis.clearTimeout(timeoutId)
  })
}

function buildFilesDataUrl(baseUrl, fileName) {
  const url = new URL('/files/data', `${baseUrl}/`)

  if (fileName && fileName !== 'all') {
    url.searchParams.set('fileName', fileName)
  }

  return url.toString()
}

async function detectApiBaseUrl(fetchImpl) {
  for (const port of API_PORTS) {
    const baseUrl = `http://localhost:${port}`

    try {
      const response = await fetchWithTimeout(`${baseUrl}/files/list`, fetchImpl)

      if (response.ok) {
        return baseUrl
      }
    } catch (error) {
      continue
    }
  }

  throw new Error('No se pudo conectar al API local. Asegurate de ejecutar el backend primero.')
}

async function fetchFilesList(baseUrl, fetchImpl) {
  const response = await fetchWithTimeout(`${baseUrl}/files/list`, fetchImpl)

  if (!response.ok) {
    throw new Error('No se pudo obtener la lista de archivos del API local.')
  }

  const payload = await response.json()

  return Array.isArray(payload.files) ? payload.files : []
}

async function fetchFilesData(baseUrl, fileName, fetchImpl) {
  const response = await fetchWithTimeout(buildFilesDataUrl(baseUrl, fileName), fetchImpl)

  if (!response.ok) {
    throw new Error('No se pudo obtener la informacion del API local.')
  }

  const payload = await response.json()

  return Array.isArray(payload) ? payload : []
}

export {
  API_PORTS,
  buildFilesDataUrl,
  detectApiBaseUrl,
  fetchFilesData,
  fetchFilesList
}
