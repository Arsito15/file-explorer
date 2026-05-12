const config = require('../config')
const httpClient = require('../lib/httpClient')

const CSV_HEADER = 'file,text,number,hex'
const NUMBER_PATTERN = /^\d+$/
const HEX_PATTERN = /^[0-9a-fA-F]{32}$/

function getRequestOptions () {
  return {
    headers: {
      authorization: config.externalApi.authToken
    },
    timeoutMs: config.externalApi.timeoutMs
  }
}

function parseCsvContent (fileName, csvContent) {
  if (!csvContent) {
    return []
  }

  const rows = csvContent.split(/\r?\n/).filter((row) => row.length > 0)

  if (rows.length === 0 || rows[0].trim() !== CSV_HEADER) {
    return []
  }

  return rows.slice(1).reduce((validLines, row) => {
    const columns = row.split(',')

    if (columns.length !== 4) {
      return validLines
    }

    const [rowFile, text, numberValue, hex] = columns

    if (rowFile !== fileName || !NUMBER_PATTERN.test(numberValue) || !HEX_PATTERN.test(hex)) {
      return validLines
    }

    validLines.push({
      text,
      number: Number(numberValue),
      hex
    })

    return validLines
  }, [])
}

async function fetchFilesList () {
  const filesResponse = await httpClient.getJson(
    `${config.externalApi.baseUrl}/v1/secret/files`,
    getRequestOptions()
  )

  return Array.isArray(filesResponse.files) ? filesResponse.files : []
}

async function fetchFileData (fileName) {
  try {
    const csvContent = await httpClient.getText(
      `${config.externalApi.baseUrl}/v1/secret/file/${encodeURIComponent(fileName)}`,
      getRequestOptions()
    )

    const lines = parseCsvContent(fileName, csvContent)

    if (lines.length === 0) {
      return null
    }

    return {
      file: fileName,
      lines
    }
  } catch (error) {
    return null
  }
}

async function fetchFilesData (fileName) {
  const availableFiles = await fetchFilesList()
  const targetFiles = fileName
    ? availableFiles.filter((availableFileName) => availableFileName === fileName)
    : availableFiles

  const downloadedFiles = await Promise.all(
    targetFiles.map((targetFileName) => fetchFileData(targetFileName))
  )

  return downloadedFiles.filter(Boolean)
}

module.exports = {
  fetchFileData,
  fetchFilesData,
  fetchFilesList,
  parseCsvContent
}
