import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from '../../components/Modal'
import TextField from '../../components/TextField'
import Button from '../../components/Button'
import { useCreateTaskMutation, useUpdateTaskMutation } from '../../api/apiSlice'

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  assigneeId: '',
  dueDate: '',
}

function toFormState(task) {
  if (!task) return EMPTY_FORM
  return {
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId ?? '',
    dueDate: task.dueDate ?? '',
  }
}

export default function TaskFormModal({ open, onClose, task, projectId, members, onRequestDelete }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation()
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
  const isSaving = isCreating || isUpdating
  const isEditing = Boolean(task)

  useEffect(() => {
    if (open) {
      setForm(toFormState(task))
      setErrors({})
    }
  }, [open, task])

  function update(patch) {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Title is required.'
    if (!form.dueDate) nextErrors.dueDate = 'Due date is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const now = new Date().toISOString()
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      assigneeId: form.assigneeId || null,
      dueDate: form.dueDate,
    }

    const result = isEditing
      ? await updateTask({ id: task.id, ...payload, updatedAt: now })
      : await createTask({ ...payload, projectId, createdAt: now, updatedAt: now })

    if ('data' in result) onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          id="task-title"
          label="Title"
          required
          value={form.title}
          onChange={(event) => update({ title: event.target.value })}
          error={errors.title}
        />

        <div>
          <label htmlFor="task-description" className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="task-description"
            rows={3}
            value={form.description}
            onChange={(event) => update({ description: event.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-status" className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="task-status"
              value={form.status}
              onChange={(event) => update({ status: event.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div>
            <label htmlFor="task-priority" className="mb-1.5 block text-sm font-medium text-slate-700">
              Priority
            </label>
            <select
              id="task-priority"
              value={form.priority}
              onChange={(event) => update({ priority: event.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-assignee" className="mb-1.5 block text-sm font-medium text-slate-700">
              Assignee
            </label>
            <select
              id="task-assignee"
              value={form.assigneeId}
              onChange={(event) => update({ assigneeId: event.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <TextField
            id="task-due-date"
            label="Due Date"
            type="date"
            required
            value={form.dueDate}
            onChange={(event) => update({ dueDate: event.target.value })}
            error={errors.dueDate}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {isEditing ? (
            <button
              type="button"
              onClick={() => onRequestDelete(task)}
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete Task
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
