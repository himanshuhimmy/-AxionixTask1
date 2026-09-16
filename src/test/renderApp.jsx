import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { apiSlice } from '../api/apiSlice'
import authReducer, { sessionStarted } from '../features/auth/authSlice'
import App from '../App'

export function renderApp({ route = '/', authenticatedUserId } = {}) {
  window.history.pushState({}, '', route)

  const store = configureStore({
    reducer: {
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  })

  if (authenticatedUserId) {
    store.dispatch(sessionStarted({ userId: authenticatedUserId }))
  }

  return { store, ...render(
    <Provider store={store}>
      <App />
    </Provider>,
  ) }
}
