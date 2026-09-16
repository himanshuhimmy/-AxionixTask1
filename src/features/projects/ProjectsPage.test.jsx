import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from '../../test/renderApp'

describe('ProjectsPage', () => {
  it('shows a loading state before rendering the seeded projects', async () => {
    renderApp({ route: '/projects', authenticatedUserId: 'u1' })

    expect(screen.queryByText('TaskFlow Mobile App v2.0')).not.toBeInTheDocument()
    expect(await screen.findByText('TaskFlow Mobile App v2.0')).toBeInTheDocument()
    expect(screen.getByText('Design System Revamp')).toBeInTheDocument()
  })

  it('filters projects by search query', async () => {
    const user = userEvent.setup()
    renderApp({ route: '/projects', authenticatedUserId: 'u1' })

    await screen.findByText('TaskFlow Mobile App v2.0')
    await user.type(screen.getByLabelText(/search projects by name/i), 'Design')

    expect(screen.getByText('Design System Revamp')).toBeInTheDocument()
    expect(screen.queryByText('TaskFlow Mobile App v2.0')).not.toBeInTheDocument()
  })

  it('shows an empty state when no project matches the search', async () => {
    const user = userEvent.setup()
    renderApp({ route: '/projects', authenticatedUserId: 'u1' })

    await screen.findByText('TaskFlow Mobile App v2.0')
    await user.type(screen.getByLabelText(/search projects by name/i), 'zzz-no-match')

    expect(await screen.findByText(/no projects match/i)).toBeInTheDocument()
  })
})
