import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, CheckCircle2, FolderX } from 'lucide-react'
import { useGetProjectsQuery, useGetTasksQuery, useGetUsersQuery } from '../../api/apiSlice'
import Button from '../../components/Button'
import ErrorState from '../../components/ErrorState'
import EmptyState from '../../components/EmptyState'
import Skeleton from '../../components/Skeleton'
import ProjectCard from './ProjectCard'
import CreateProjectModal from './CreateProjectModal'

function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-1/2" />
      <Skeleton className="mt-4 h-2 w-full" />
    </div>
  )
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const projectsQuery = useGetProjectsQuery()
  const usersQuery = useGetUsersQuery()
  const tasksQuery = useGetTasksQuery({})

  const isLoading = projectsQuery.isLoading || usersQuery.isLoading || tasksQuery.isLoading
  const isError = projectsQuery.isError || usersQuery.isError || tasksQuery.isError

  function refetchAll() {
    projectsQuery.refetch()
    usersQuery.refetch()
    tasksQuery.refetch()
  }

  useEffect(() => {
    if (!successMessage) return undefined
    const timer = setTimeout(() => setSuccessMessage(''), 4000)
    return () => clearTimeout(timer)
  }, [successMessage])

  const projects = projectsQuery.data ?? []
  const users = usersQuery.data ?? []
  const tasks = tasksQuery.data ?? []

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return projects
    return projects.filter((project) => project.name.toLowerCase().includes(query))
  }, [projects, search])

  function projectStats(projectId) {
    const projectTasks = tasks.filter((task) => task.projectId === projectId)
    const doneCount = projectTasks.filter((task) => task.status === 'DONE').length
    const progress = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0
    return { taskCount: projectTasks.length, progress }
  }

  function memberNamesFor(project) {
    return project.memberIds
      .map((id) => users.find((user) => user.id === id)?.name)
      .filter(Boolean)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">{projects.length} active projects</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Project
        </Button>
      </div>

      {successMessage && (
        <div
          role="status"
          className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {successMessage}
        </div>
      )}

      <div className="relative mt-5 max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects by name"
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="mt-6">
        {isError && <ErrorState onRetry={refetchAll} />}

        {!isError && isLoading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!isError && !isLoading && filteredProjects.length === 0 && (
          <EmptyState
            icon={FolderX}
            title={search ? `No projects match "${search}"` : 'No projects yet'}
            message={
              search
                ? "We couldn't find a project with that name. Check for typos or clear your search."
                : 'Create your first project to start tracking tasks.'
            }
            action={
              search ? (
                <Button variant="secondary" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              ) : (
                <Button onClick={() => setIsModalOpen(true)}>New Project</Button>
              )
            }
          />
        )}

        {!isError && !isLoading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const { taskCount, progress } = projectStats(project.id)
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  taskCount={taskCount}
                  progress={progress}
                  memberNames={memberNamesFor(project)}
                />
              )
            })}
          </div>
        )}
      </div>

      <CreateProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={(project) => setSuccessMessage(`"${project.name}" was created successfully.`)}
      />
    </div>
  )
}
