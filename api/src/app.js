const express = require('express')
const {
  fetchFilesData,
  fetchFilesList
} = require('./services/filesService')

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
})

app.get('/files/list', async (req, res) => {
  try {
    const files = await fetchFilesList()

    res.json({ files })
  } catch (error) {
    res.status(502).json({
      error: 'Failed to fetch remote files list'
    })
  }
})

app.get('/files/data', async (req, res) => {
  try {
    const files = await fetchFilesData(req.query.fileName)

    res.json(files)
  } catch (error) {
    res.status(502).json({
      error: 'Failed to fetch remote files'
    })
  }
})

module.exports = app
