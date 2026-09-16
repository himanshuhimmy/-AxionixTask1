import { StatusBadge, PriorityBadge } from '../../components/Badge'
import Avatar from '../../components/Avatar'
import { formatDate, isOverdue } from '../../utils/date'

export default function TaskTable({ tasks, usersById, onEdit }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Title
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Priority
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Due Date
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Assignee
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status)
            const assignee = usersById[task.assigneeId]
            return (
              <tr key={task.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="text-left font-medium text-slate-900 hover:text-indigo-600 hover:underline"
                  >
                    {task.title}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className={`px-4 py-3 ${overdue ? 'font-medium text-red-600' : 'text-slate-600'}`}>
                  {formatDate(task.dueDate)}
                </td>
                <td className="px-4 py-3">
                  {assignee && (
                    <div className="flex items-center gap-2">
                      <Avatar name={assignee.name} size="sm" />
                      <span className="text-slate-600">{assignee.name}</span>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {tasks.length === 0 && (
        <p className="p-6 text-center text-sm text-slate-500">No tasks match your filters.</p>
      )}
    </div>
  )
}
