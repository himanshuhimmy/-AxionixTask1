const STATUS_STYLES = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  DONE: 'bg-emerald-100 text-emerald-700',
}

const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
}

const PRIORITY_STYLES = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
}

function Badge({ className = '', children }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  return <Badge className={STATUS_STYLES[status]}>{STATUS_LABELS[status] ?? status}</Badge>
}

export function PriorityBadge({ priority }) {
  return (
    <Badge className={PRIORITY_STYLES[priority]}>
      {priority === 'HIGH' && '● '}
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </Badge>
  )
}

export default Badge
