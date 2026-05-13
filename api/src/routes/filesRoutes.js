const express = require('express')
const {
  getFilesData,
  getFilesList
} = require('../controllers/filesController')

const router = express.Router()

router.get('/list', getFilesList)
router.get('/data', getFilesData)

module.exports = router
