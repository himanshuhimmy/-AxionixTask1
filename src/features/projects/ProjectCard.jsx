import { Link } from 'react-router-dom'
import { ListChecks, Users } from 'lucide-react'
import Avatar from '../../components/Avatar'

export default function ProjectCard({ project, progress, taskCount, memberNames }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md focus-visible:shadow-md"
    >
      <h3 className="font-semibold text-slate-900">{project.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.description}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span className="font-medium text-slate-700">{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" aria-hidden="true" />
          <span>{memberNames.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ListChecks className="h-4 w-4" aria-hidden="true" />
          <span>{taskCount} tasks</span>
        </div>
        <div className="flex -space-x-2">
          {memberNames.slice(0, 3).map((name) => (
            <Avatar key={name} name={name} size="sm" className="ring-2 ring-white" />
          ))}
        </div>
      </div>
    </Link>
  )
}
