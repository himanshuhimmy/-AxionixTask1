const PALETTE = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
]

function colorFor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function initialsFor(name) {
  const parts = name.trim().split(/\s+/)
  const initials = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0]
  return initials.toUpperCase()
}

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
}

export default function Avatar({ name, size = 'md', className = '' }) {
  if (!name) return null

  return (
    <span
      role="img"
      aria-label={name}
      title={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${colorFor(
        name,
      )} ${SIZES[size]} ${className}`}
    >
      {initialsFor(name)}
    </span>
  )
}
