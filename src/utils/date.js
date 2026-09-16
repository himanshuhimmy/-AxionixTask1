import { differenceInCalendarDays, format, isValid, parseISO } from 'date-fns'

export function toDate(dueDate) {
  const date = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
  return isValid(date) ? date : null
}

export function isOverdue(dueDate, status, now = new Date()) {
  const date = toDate(dueDate)
  if (!date || status === 'DONE') return false
  return differenceInCalendarDays(date, now) < 0
}

export function isDueSoon(dueDate, status, now = new Date(), withinDays = 7) {
  const date = toDate(dueDate)
  if (!date || status === 'DONE') return false
  const diff = differenceInCalendarDays(date, now)
  return diff >= 0 && diff <= withinDays
}

export function formatDate(dueDate, pattern = 'MMM d, yyyy') {
  const date = toDate(dueDate)
  return date ? format(date, pattern) : '—'
}
