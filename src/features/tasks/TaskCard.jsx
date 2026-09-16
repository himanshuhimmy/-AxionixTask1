import { PriorityBadge } from '../../components/Badge'
import Avatar from '../../components/Avatar'
import { formatDate, isOverdue } from '../../utils/date'

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
]

export default function TaskCard({ task, assigneeName, onEdit, onStatusChange }) {
  const overdue = isOverdue(task.dueDate, task.status)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="text-left text-sm font-medium text-slate-900 hover:text-indigo-600 hover:underline"
        >
          {task.title}
        </button>
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs ${overdue ? 'font-medium text-red-600' : 'text-slate-500'}`}>
          {overdue ? 'Overdue · ' : ''}
          {formatDate(task.dueDate)}
        </span>
        {assigneeName && <Avatar name={assigneeName} size="sm" />}
      </div>

      <label className="sr-only" htmlFor={`status-${task.id}`}>
        Change status for {task.title}
      </label>
      <select
        id={`status-${task.id}`}
        value={task.status}
        onChange={(event) => onStatusChange(task, event.target.value)}
        className="mt-3 w-full rounded-md border border-slate-200 bg-slate-50 py-1.5 text-xs font-medium text-slate-600 focus:border-indigo-500 focus:outline-none"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            Move to: {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
