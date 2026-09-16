import { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '../../components/Modal'
import TextField from '../../components/TextField'
import Button from '../../components/Button'
import { useCreateProjectMutation } from '../../api/apiSlice'
import { selectCurrentUserId } from '../auth/authSlice'

export default function CreateProjectModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})
  const [createProject, { isLoading }] = useCreateProjectMutation()
  const currentUserId = useSelector(selectCurrentUserId)

  function reset() {
    setName('')
    setDescription('')
    setErrors({})
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Project name is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const result = await createProject({
      name: name.trim(),
      description: description.trim(),
      memberIds: currentUserId ? [currentUserId] : [],
      createdAt: new Date().toISOString(),
    })

    if ('data' in result) {
      reset()
      onCreated?.(result.data)
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create New Project"
      description="Plan, track, and collaborate on a new initiative."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          id="project-name"
          label="Project Name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
        />
        <div>
          <label htmlFor="project-description" className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="project-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Creating…' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
