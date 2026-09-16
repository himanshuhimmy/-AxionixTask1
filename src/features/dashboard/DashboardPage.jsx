import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ListChecks, Clock, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useGetTasksQuery } from '../../api/apiSlice'
import ErrorState from '../../components/ErrorState'
import Skeleton from '../../components/Skeleton'
import { PriorityBadge } from '../../components/Badge'
import { formatDate, isDueSoon, isOverdue } from '../../utils/date'

const STAT_CARDS = [
  { key: 'total', label: 'Total Tasks', icon: ListChecks },
  { key: 'TODO', label: 'To Do', icon: Clock },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Loader2 },
  { key: 'DONE', label: 'Done', icon: CheckCircle2 },
]

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="mt-3 h-8 w-12" />
    </div>
  )
}

function TaskListItem({ task, highlight }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">{task.title}</p>
        <p className={`mt-0.5 text-xs ${highlight ? 'text-red-600' : 'text-slate-500'}`}>
          Due {formatDate(task.dueDate)}
        </p>
      </div>
      <PriorityBadge priority={task.priority} />
    </li>
  )
}

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const forceError = searchParams.get('forceError') === 'true'

  const { data: tasks, isLoading, isError, refetch } = useGetTasksQuery(
    forceError ? { forceError: 'true' } : {},
  )

  const summary = useMemo(() => {
    if (!tasks) return null
    const counts = { total: tasks.length, TODO: 0, IN_PROGRESS: 0, DONE: 0 }
    const overdue = []
    const dueSoon = []

    for (const task of tasks) {
      counts[task.status] = (counts[task.status] ?? 0) + 1
      if (isOverdue(task.dueDate, task.status)) overdue.push(task)
      else if (isDueSoon(task.dueDate, task.status)) dueSoon.push(task)
    }

    overdue.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    dueSoon.sort((a, b) => a.dueDate.localeCompare(b.dueDate))

    const donePercent = counts.total > 0 ? Math.round((counts.DONE / counts.total) * 100) : 0

    return { counts, overdue, dueSoon, donePercent }
  }, [tasks])

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Here's what needs your attention across your projects today.
      </p>

      {isError && (
        <ErrorState className="mt-6" onRetry={refetch} />
      )}

      {!isError && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {isLoading
              ? STAT_CARDS.map((card) => <StatCardSkeleton key={card.key} />)
              : STAT_CARDS.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{label}</span>
                      <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      {summary.counts[key]}
                    </p>
                  </div>
                ))}
          </div>

          {!isLoading && summary && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">Overall completion</span>
                <span className="font-semibold text-indigo-600">{summary.donePercent}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600"
                  style={{ width: `${summary.donePercent}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <AlertTriangle className="h-4 w-4 text-red-500" aria-hidden="true" />
                Overdue Tasks
              </h2>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : summary.overdue.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  Nothing overdue — you're all caught up.
                </p>
              ) : (
                <ul className="space-y-2">
                  {summary.overdue.map((task) => (
                    <TaskListItem key={task.id} task={task} highlight />
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Due This Week</h2>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : summary.dueSoon.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No tasks due in the next 7 days.
                </p>
              ) : (
                <ul className="space-y-2">
                  {summary.dueSoon.map((task) => (
                    <TaskListItem key={task.id} task={task} />
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  )
}
