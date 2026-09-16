import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({
  title = "Couldn't load your data",
  message = 'There was a problem reaching the server. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-8 text-center ${className}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
      </div>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}
