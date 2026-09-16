import { useId } from 'react'

export default function TextField({
  label,
  error,
  icon: Icon,
  rightElement,
  className = '',
  ...inputProps
}) {
  const generatedId = useId()
  const id = inputProps.id ?? generatedId
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`w-full rounded-lg border bg-white py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none ${
            Icon ? 'pl-9' : 'pl-3'
          } ${rightElement ? 'pr-9' : 'pr-3'} ${
            error ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-indigo-500'
          }`}
          {...inputProps}
        />
        {rightElement && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
