import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from '../../test/renderApp'
import { DEMO_EMAIL, DEMO_PASSWORD } from './constants'

describe('LoginPage', () => {
  it('shows validation errors when the form is submitted empty', async () => {
    const user = userEvent.setup()
    renderApp({ route: '/login' })

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  it('signs in with valid demo credentials and redirects to the dashboard', async () => {
    const user = userEvent.setup()
    renderApp({ route: '/login' })

    await user.type(screen.getByLabelText(/work email/i), DEMO_EMAIL)
    await user.type(screen.getByLabelText(/^password$/i), DEMO_PASSWORD)
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/dashboard')
  })

  it('redirects unauthenticated users from a protected route to sign-in', async () => {
    renderApp({ route: '/dashboard' })

    expect(await screen.findByRole('heading', { name: /welcome back to taskflow/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/login')
  })
})
