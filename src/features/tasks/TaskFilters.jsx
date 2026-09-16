import { Search } from 'lucide-react'

const selectClass =
  'rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none'

export default function TaskFilters({ filters, onChange, members }) {
  function update(patch) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          placeholder="Filter tasks by title…"
          aria-label="Filter tasks by title"
          className="w-56 rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <label className="sr-only" htmlFor="filter-status">
        Status
      </label>
      <select
        id="filter-status"
        className={selectClass}
        value={filters.status}
        onChange={(event) => update({ status: event.target.value })}
      >
        <option value="ALL">Status: All</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <label className="sr-only" htmlFor="filter-priority">
        Priority
      </label>
      <select
        id="filter-priority"
        className={selectClass}
        value={filters.priority}
        onChange={(event) => update({ priority: event.target.value })}
      >
        <option value="ALL">Priority: All</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <label className="sr-only" htmlFor="filter-assignee">
        Assignee
      </label>
      <select
        id="filter-assignee"
        className={selectClass}
        value={filters.assigneeId}
        onChange={(event) => update({ assigneeId: event.target.value })}
      >
        <option value="ALL">Assignee: Everyone</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="filter-sort">
        Sort
      </label>
      <select
        id="filter-sort"
        className={selectClass}
        value={filters.sort}
        onChange={(event) => update({ sort: event.target.value })}
      >
        <option value="dueDate-asc">Sort: Due Date (Earliest)</option>
        <option value="dueDate-desc">Sort: Due Date (Latest)</option>
        <option value="createdAt-desc">Sort: Newest Created</option>
        <option value="createdAt-asc">Sort: Oldest Created</option>
      </select>
    </div>
  )
}
