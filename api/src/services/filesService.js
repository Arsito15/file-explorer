const externalFilesClient = require('../clients/externalFilesClient')
const { parseCsvContent } = require('../utils/csvParser')

async function fetchFilesList () {
  return externalFilesClient.fetchAvailableFiles()
}

async function fetchFileData (fileName) {
  try {
    const csvContent = await externalFilesClient.fetchFileContent(fileName)
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
  fetchFilesList
}
