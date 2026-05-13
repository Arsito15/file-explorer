const CSV_HEADER = 'file,text,number,hex'
const NUMBER_PATTERN = /^\d+$/
const HEX_PATTERN = /^[0-9a-fA-F]{32}$/

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

module.exports = {
  parseCsvContent
}
