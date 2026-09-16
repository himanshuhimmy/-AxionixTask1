import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderApp } from '../../test/renderApp'

describe('ProjectDetailsPage', () => {
  it('creates a new task from the project board', async () => {
    const user = userEvent.setup()
    renderApp({ route: '/projects/p1', authenticatedUserId: 'u1' })

    await screen.findByText('Setup biometric authentication (FaceID/Fingerprint)')

    await user.click(screen.getByRole('button', { name: /new task/i }))
    await user.type(screen.getByLabelText(/^title$/i), 'Write release notes')
    fireEvent.change(screen.getByLabelText(/due date/i), { target: { value: '2026-10-01' } })
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(await screen.findByText('Write release notes')).toBeInTheDocument()
  })

  it('closes the task modal on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    renderApp({ route: '/projects/p1', authenticatedUserId: 'u1' })

    await screen.findByText('Setup biometric authentication (FaceID/Fingerprint)')

    const newTaskButton = screen.getByRole('button', { name: /new task/i })
    await user.click(newTaskButton)
    expect(screen.getByRole('heading', { name: /new task/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('heading', { name: /new task/i })).not.toBeInTheDocument()
    expect(newTaskButton).toHaveFocus()
  })
})
