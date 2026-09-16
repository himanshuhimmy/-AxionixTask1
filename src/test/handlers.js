import { http, HttpResponse } from 'msw'
import seed from '../../db.json'

const API_URL = 'http://localhost:3001'

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

export function createHandlers(initial = seed) {
  const db = clone(initial)

  return [
    http.get(`${API_URL}/users`, ({ request }) => {
      const url = new URL(request.url)
      const email = url.searchParams.get('email')
      const users = email ? db.users.filter((user) => user.email === email) : db.users
      return HttpResponse.json(users)
    }),
    http.get(`${API_URL}/users/:id`, ({ params }) => {
      const user = db.users.find((item) => item.id === params.id)
      return user ? HttpResponse.json(user) : new HttpResponse(null, { status: 404 })
    }),

    http.get(`${API_URL}/projects`, () => HttpResponse.json(db.projects)),
    http.get(`${API_URL}/projects/:id`, ({ params }) => {
      const project = db.projects.find((item) => item.id === params.id)
      return project ? HttpResponse.json(project) : new HttpResponse(null, { status: 404 })
    }),
    http.post(`${API_URL}/projects`, async ({ request }) => {
      const body = await request.json()
      const project = { id: `p${db.projects.length + 1}`, ...body }
      db.projects.push(project)
      return HttpResponse.json(project, { status: 201 })
    }),

    http.get(`${API_URL}/tasks`, ({ request }) => {
      const url = new URL(request.url)
      const projectId = url.searchParams.get('projectId')
      const tasks = projectId ? db.tasks.filter((task) => task.projectId === projectId) : db.tasks
      return HttpResponse.json(tasks)
    }),
    http.post(`${API_URL}/tasks`, async ({ request }) => {
      const body = await request.json()
      const task = { id: `t${db.tasks.length + 1}`, ...body }
      db.tasks.push(task)
      return HttpResponse.json(task, { status: 201 })
    }),
    http.patch(`${API_URL}/tasks/:id`, async ({ params, request }) => {
      const body = await request.json()
      const index = db.tasks.findIndex((task) => task.id === params.id)
      if (index === -1) return new HttpResponse(null, { status: 404 })
      db.tasks[index] = { ...db.tasks[index], ...body }
      return HttpResponse.json(db.tasks[index])
    }),
    http.delete(`${API_URL}/tasks/:id`, ({ params }) => {
      db.tasks = db.tasks.filter((task) => task.id !== params.id)
      return new HttpResponse(null, { status: 200 })
    }),
  ]
}

export const handlers = createHandlers()
