import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'taskflow.auth.userId'

function loadUserId() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: loadUserId(),
  },
  reducers: {
    sessionStarted(state, action) {
      state.userId = action.payload.userId
      try {
        localStorage.setItem(STORAGE_KEY, action.payload.userId)
      } catch {
        // localStorage unavailable — session just won't survive a refresh
      }
    },
    loggedOut(state) {
      state.userId = null
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
    },
  },
})

export const { sessionStarted, loggedOut } = authSlice.actions
export default authSlice.reducer

export const selectCurrentUserId = (state) => state.auth.userId
export const selectIsAuthenticated = (state) => Boolean(state.auth.userId)
