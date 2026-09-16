import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, LayoutGrid, Table as TableIcon, Plus, Trash2, Users } from 'lucide-react'
import {
  useGetProjectQuery,
  useGetTasksQuery,
  useGetUsersQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useDeleteProjectMutation,
} from '../../api/apiSlice'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import ErrorState from '../../components/ErrorState'
import Skeleton from '../../components/Skeleton'
import ConfirmDialog from '../../components/ConfirmDialog'
import TaskFilters from '../tasks/TaskFilters'
import TaskBoard from '../tasks/TaskBoard'
import TaskTable from '../tasks/TaskTable'
import TaskFormModal from '../tasks/TaskFormModal'
import { DEFAULT_FILTERS, filterAndSortTasks } from '../tasks/filterTasks'

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [editingTask, setEditingTask] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deletingTask, setDeletingTask] = useState(null)
  const [isDeletingProject, setIsDeletingProject] = useState(false)

  const projectQuery = useGetProjectQuery(projectId)
  const tasksQuery = useGetTasksQuery({ projectId })
  const usersQuery = useGetUsersQuery()
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation()
  const [deleteProject, { isLoading: isDeletingProjectRequest }] = useDeleteProjectMutation()

  const view = searchParams.get('view') === 'table' ? 'table' : 'kanban'
  const filters = {
    search: searchParams.get('search') ?? DEFAULT_FILTERS.search,
    status: searchParams.get('status') ?? DEFAULT_FILTERS.status,
    priority: searchParams.get('priority') ?? DEFAULT_FILTERS.priority,
    assigneeId: searchParams.get('assigneeId') ?? DEFAULT_FILTERS.assigneeId,
    sort: searchParams.get('sort') ?? DEFAULT_FILTERS.sort,
  }

  function setView(nextView) {
    const next = new URLSearchParams(searchParams)
    next.set('view', nextView)
    setSearchParams(next)
  }

  function setFilters(nextFilters) {
    const next = new URLSearchParams(searchParams)
    next.set('view', view)
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value && value !== DEFAULT_FILTERS[key]) next.set(key, value)
      else next.delete(key)
    })
    setSearchParams(next)
  }

  const users = usersQuery.data ?? []
  const usersById = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user])),
    [users],
  )
  const members = useMemo(
    () => (projectQuery.data ? projectQuery.data.memberIds.map((id) => usersById[id]).filter(Boolean) : []),
    [projectQuery.data, usersById],
  )

  const tasks = tasksQuery.data ?? []
  const visibleTasks = useMemo(() => filterAndSortTasks(tasks, filters), [tasks, filters])

  const isLoading = projectQuery.isLoading || tasksQuery.isLoading || usersQuery.isLoading
  const isError = projectQuery.isError || tasksQuery.isError || usersQuery.isError

  function refetchAll() {
    projectQuery.refetch()
    tasksQuery.refetch()
    usersQuery.refetch()
  }

  async function handleStatusChange(task, status) {
    await updateTask({ id: task.id, status, updatedAt: new Date().toISOString() })
  }

  async function handleConfirmDelete() {
    if (!deletingTask) return
    const result = await deleteTask(deletingTask.id)
    if (!('error' in result)) {
      setDeletingTask(null)
      setEditingTask(null)
    }
  }

  async function handleConfirmDeleteProject() {
    const result = await deleteProject(projectId)
    if (!('error' in result)) {
      navigate('/projects', { replace: true })
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !projectQuery.data) {
    return <ErrorState className="mx-auto max-w-5xl" onRetry={refetchAll} />
  }

  const project = projectQuery.data
  const doneCount = tasks.filter((task) => task.status === 'DONE').length
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/projects" className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Projects
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{project.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">{project.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {members.map((member) => (
                <Avatar key={member.id} name={member.name} className="ring-2 ring-white" />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsDeletingProject(true)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Delete Project</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              {members.length} members · {tasks.length} tasks
            </span>
            <span className="font-medium text-slate-700">{progress}% complete</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1">
          <button
            type="button"
            onClick={() => setView('kanban')}
            aria-pressed={view === 'kanban'}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
              view === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            Kanban
          </button>
          <button
            type="button"
            onClick={() => setView('table')}
            aria-pressed={view === 'table'}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
              view === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TableIcon className="h-4 w-4" aria-hidden="true" />
            Table
          </button>
        </div>

        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Task
        </Button>
      </div>

      <div className="mt-4">
        <TaskFilters filters={filters} onChange={setFilters} members={members} />
      </div>

      <div className="mt-4">
        {view === 'kanban' ? (
          <TaskBoard
            tasks={visibleTasks}
            usersById={usersById}
            onEdit={setEditingTask}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <TaskTable tasks={visibleTasks} usersById={usersById} onEdit={setEditingTask} />
        )}
      </div>

      <TaskFormModal
        open={isCreating || Boolean(editingTask)}
        onClose={() => {
          setIsCreating(false)
          setEditingTask(null)
        }}
        task={editingTask}
        projectId={projectId}
        members={members}
        onRequestDelete={(task) => {
          setDeletingTask(task)
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={`Delete "${deletingTask?.title ?? ''}"?`}
        description="This action cannot be undone. The task will be permanently removed."
      />

      <ConfirmDialog
        open={isDeletingProject}
        onClose={() => setIsDeletingProject(false)}
        onConfirm={handleConfirmDeleteProject}
        isLoading={isDeletingProjectRequest}
        title={`Delete "${project.name}"?`}
        description={`This action cannot be undone. All ${tasks.length} task${tasks.length === 1 ? '' : 's'} in this project will be permanently deleted along with it.`}
      />
    </div>
  )
}
