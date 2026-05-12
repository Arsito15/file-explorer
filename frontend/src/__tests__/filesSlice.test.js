import reducer, {
  loadFilesData,
  setSelectedFile
} from '../filesSlice'

describe('filesSlice', () => {
  it('stores the selected file filter', () => {
    const state = reducer(undefined, setSelectedFile('file2.csv'))

    expect(state.selectedFile).toBe('file2.csv')
  })

  it('marks the state as loading on pending', () => {
    const state = reducer(undefined, { type: loadFilesData.pending.type })

    expect(state.status).toBe('loading')
    expect(state.errorMessage).toBe('')
  })

  it('stores list and file data on fulfilled', () => {
    const state = reducer(undefined, loadFilesData.fulfilled({
      availableFiles: ['file1.csv', 'file2.csv'],
      baseUrl: 'http://localhost:3001',
      files: [{ file: 'file2.csv', lines: [{ text: 'A', number: 1, hex: 'abc' }] }]
    }, 'request-id'))

    expect(state.status).toBe('success')
    expect(state.baseUrl).toBe('http://localhost:3001')
    expect(state.availableFiles).toEqual(['file1.csv', 'file2.csv'])
    expect(state.files).toEqual([{ file: 'file2.csv', lines: [{ text: 'A', number: 1, hex: 'abc' }] }])
  })

  it('stores the error message on rejected', () => {
    const state = reducer(undefined, {
      type: loadFilesData.rejected.type,
      error: {
        message: 'fallo de carga'
      }
    })

    expect(state.status).toBe('error')
    expect(state.errorMessage).toBe('fallo de carga')
    expect(state.files).toEqual([])
  })
})
