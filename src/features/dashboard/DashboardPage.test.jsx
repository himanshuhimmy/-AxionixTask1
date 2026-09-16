import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { renderApp } from '../../test/renderApp'
import { server } from '../../test/server'

describe('DashboardPage', () => {
  it('shows an error state with a retry action when the tasks request fails', async () => {
    server.use(
      http.get('http://localhost:3001/tasks', () => new HttpResponse(null, { status: 500 })),
    )

    renderApp({ route: '/dashboard', authenticatedUserId: 'u1' })

    expect(await screen.findByText(/couldn't load your data/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('renders task counts once the data loads successfully', async () => {
    renderApp({ route: '/dashboard', authenticatedUserId: 'u1' })

    expect(await screen.findByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })
})
