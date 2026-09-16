export default function EmptyState({ icon: Icon, title, message, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center ${className}`}
    >
      {Icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
        </span>
      )}
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        {message && <p className="mt-1 text-sm text-slate-500">{message}</p>}
      </div>
      {action}
    </div>
  )
}
