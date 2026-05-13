function sortFiles(files) {
  return files
    .slice()
    .sort((left, right) => left.file.localeCompare(right.file))
}

function flattenFiles(files) {
  return sortFiles(files).reduce((rows, fileEntry) => {
    return rows.concat(
      fileEntry.lines.map((line, index) => ({
        id: `${fileEntry.file}-${index}-${line.hex}`,
        file: fileEntry.file,
        text: line.text,
        number: line.number,
        hex: line.hex
      }))
    )
  }, [])
}

export {
  flattenFiles,
  sortFiles
}
