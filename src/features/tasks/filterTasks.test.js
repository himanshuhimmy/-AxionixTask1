import { describe, expect, it } from 'vitest'
import { filterAndSortTasks } from './filterTasks'

const tasks = [
  { id: 't1', title: 'Fix login bug', status: 'TODO', priority: 'HIGH', assigneeId: 'u1', dueDate: '2026-09-20', createdAt: '2026-09-01T00:00:00.000Z' },
  { id: 't2', title: 'Write onboarding docs', status: 'IN_PROGRESS', priority: 'LOW', assigneeId: 'u2', dueDate: '2026-09-10', createdAt: '2026-09-05T00:00:00.000Z' },
  { id: 't3', title: 'Ship login redesign', status: 'DONE', priority: 'MEDIUM', assigneeId: 'u1', dueDate: '2026-09-15', createdAt: '2026-09-03T00:00:00.000Z' },
]

describe('filterAndSortTasks', () => {
  it('filters by a case-insensitive title search', () => {
    const result = filterAndSortTasks(tasks, { search: 'login' })
    expect(result.map((task) => task.id)).toEqual(['t3', 't1'])
  })

  it('filters by status', () => {
    const result = filterAndSortTasks(tasks, { status: 'DONE' })
    expect(result.map((task) => task.id)).toEqual(['t3'])
  })

  it('filters by assignee', () => {
    const result = filterAndSortTasks(tasks, { assigneeId: 'u2' })
    expect(result.map((task) => task.id)).toEqual(['t2'])
  })

  it('sorts by due date ascending by default', () => {
    const result = filterAndSortTasks(tasks, {})
    expect(result.map((task) => task.id)).toEqual(['t2', 't3', 't1'])
  })

  it('sorts by due date descending when requested', () => {
    const result = filterAndSortTasks(tasks, { sort: 'dueDate-desc' })
    expect(result.map((task) => task.id)).toEqual(['t1', 't3', 't2'])
  })
})
