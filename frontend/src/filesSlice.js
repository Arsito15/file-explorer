import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  detectApiBaseUrl,
  fetchFilesData,
  fetchFilesList
} from './filesApi'

const initialState = {
  availableFiles: [],
  baseUrl: '',
  errorMessage: '',
  files: [],
  selectedFile: 'all',
  status: 'idle'
}

const loadFilesData = createAsyncThunk('files/loadFilesData', async (_, thunkApi) => {
  const state = thunkApi.getState().files
  const baseUrl = state.baseUrl || await detectApiBaseUrl()
  const [availableFiles, files] = await Promise.all([
    fetchFilesList(baseUrl),
    fetchFilesData(baseUrl, state.selectedFile)
  ])

  return {
    availableFiles,
    baseUrl,
    files
  }
})

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setSelectedFile(state, action) {
      state.selectedFile = action.payload || 'all'
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFilesData.pending, (state) => {
        state.errorMessage = ''
        state.status = 'loading'
      })
      .addCase(loadFilesData.fulfilled, (state, action) => {
        state.availableFiles = action.payload.availableFiles
        state.baseUrl = action.payload.baseUrl
        state.files = action.payload.files
        state.status = 'success'
      })
      .addCase(loadFilesData.rejected, (state, action) => {
        state.errorMessage = action.error.message || 'No se pudo cargar la informacion.'
        state.files = []
        state.status = 'error'
      })
  }
})

const selectFilesState = (state) => state.files

const { setSelectedFile } = filesSlice.actions

export {
  loadFilesData,
  selectFilesState,
  setSelectedFile
}

export default filesSlice.reducer
