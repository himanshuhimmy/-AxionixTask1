import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Button from '../components/Button'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
        <Compass className="h-8 w-8 text-indigo-600" aria-hidden="true" />
      </span>
      <div>
        <p className="text-4xl font-bold text-indigo-600">404</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          Sorry, we couldn't find the task, project, or board you're looking for. It may have been
          moved, deleted, or the URL was mistyped.
        </p>
      </div>
      <Link to="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  )
}
