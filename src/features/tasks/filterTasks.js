export const DEFAULT_FILTERS = {
  search: '',
  status: 'ALL',
  priority: 'ALL',
  assigneeId: 'ALL',
  sort: 'dueDate-asc',
}

export function filterAndSortTasks(tasks, filters) {
  const { search, status, priority, assigneeId, sort } = { ...DEFAULT_FILTERS, ...filters }
  const query = search.trim().toLowerCase()

  let result = tasks.filter((task) => {
    if (query && !task.title.toLowerCase().includes(query)) return false
    if (status !== 'ALL' && task.status !== status) return false
    if (priority !== 'ALL' && task.priority !== priority) return false
    if (assigneeId !== 'ALL' && task.assigneeId !== assigneeId) return false
    return true
  })

  const [field, direction] = sort.split('-')
  const multiplier = direction === 'desc' ? -1 : 1
  result = [...result].sort((a, b) => multiplier * a[field].localeCompare(b[field]))

  return result
}
