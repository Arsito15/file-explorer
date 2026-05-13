const {
  fetchFilesData,
  fetchFilesList
} = require('../services/filesService')

async function getFilesList (req, res, next) {
  try {
    const files = await fetchFilesList()

    res.json({ files })
  } catch (error) {
    error.statusCode = 502
    error.publicMessage = 'Failed to fetch remote files list'
    next(error)
  }
}

async function getFilesData (req, res, next) {
  try {
    const files = await fetchFilesData(req.query.fileName)

    res.json(files)
  } catch (error) {
    error.statusCode = 502
    error.publicMessage = 'Failed to fetch remote files'
    next(error)
  }
}

module.exports = {
  getFilesData,
  getFilesList
}
