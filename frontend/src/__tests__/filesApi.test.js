import {
  buildFilesDataUrl,
  fetchFilesData,
  fetchFilesList
} from '../api/filesApi'

describe('filesApi', () => {
  it('builds the data url without query for all files', () => {
    expect(buildFilesDataUrl('http://localhost:3001', 'all'))
      .toBe('http://localhost:3001/files/data')
  })

  it('builds the data url with fileName query when filtering', () => {
    expect(buildFilesDataUrl('http://localhost:3001', 'file 2.csv'))
      .toBe('http://localhost:3001/files/data?fileName=file+2.csv')
  })

  it('returns the files list from the api payload', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ files: ['file1.csv', 'file2.csv'] })
    })

    await expect(fetchFilesList('http://localhost:3001', mockFetch))
      .resolves.toEqual(['file1.csv', 'file2.csv'])
  })

  it('returns the file data from the api payload', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ([{ file: 'file1.csv', lines: [] }])
    })

    await expect(fetchFilesData('http://localhost:3001', 'file1.csv', mockFetch))
      .resolves.toEqual([{ file: 'file1.csv', lines: [] }])
  })
})
