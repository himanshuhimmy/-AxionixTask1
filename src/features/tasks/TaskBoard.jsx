import TaskCard from './TaskCard'

const COLUMNS = [
  { status: 'TODO', label: 'To Do', dot: 'bg-slate-400' },
  { status: 'IN_PROGRESS', label: 'In Progress', dot: 'bg-indigo-500' },
  { status: 'DONE', label: 'Done', dot: 'bg-emerald-500' },
]

export default function TaskBoard({ tasks, usersById, onEdit, onStatusChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status)
        return (
          <div key={column.status} className="rounded-xl bg-slate-100 p-3">
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={`h-2 w-2 rounded-full ${column.dot}`} aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-700">{column.label}</h3>
              <span className="text-xs text-slate-400">{columnTasks.length}</span>
            </div>
            <div className="space-y-3">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  assigneeName={usersById[task.assigneeId]?.name}
                  onEdit={onEdit}
                  onStatusChange={onStatusChange}
                />
              ))}
              {columnTasks.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
                  No tasks
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
