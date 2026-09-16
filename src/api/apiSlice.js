import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DEMO_PASSWORD } from '../features/auth/constants'

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Project', 'Task', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      async queryFn({ email, password }, _api, _extra, baseQuery) {
        const result = await baseQuery(`/users?email=${encodeURIComponent(email)}`)
        if (result.error) return { error: result.error }

        const [user] = result.data
        if (!user || password !== DEMO_PASSWORD) {
          return {
            error: { status: 401, data: { message: 'Invalid email or password.' } },
          }
        }
        return { data: user }
      },
    }),

    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    getProjects: builder.query({
      query: (params) => ({ url: '/projects', params }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Project', id })), { type: 'Project', id: 'LIST' }]
          : [{ type: 'Project', id: 'LIST' }],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation({
      query: (body) => ({ url: '/projects', method: 'POST', body }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    deleteProject: builder.mutation({
      // Cascades: json-server has no foreign-key support, so the project's
      // own tasks are deleted first to avoid leaving orphaned records behind.
      async queryFn(projectId, _api, _extra, baseQuery) {
        const tasksResult = await baseQuery(`/tasks?projectId=${projectId}`)
        if (tasksResult.error) return { error: tasksResult.error }

        for (const task of tasksResult.data) {
          const result = await baseQuery({ url: `/tasks/${task.id}`, method: 'DELETE' })
          if (result.error) return { error: result.error }
        }

        const projectResult = await baseQuery({ url: `/projects/${projectId}`, method: 'DELETE' })
        if (projectResult.error) return { error: projectResult.error }

        return { data: { id: projectId } }
      },
      invalidatesTags: (result, error, projectId) => [
        { type: 'Project', id: projectId },
        { type: 'Project', id: 'LIST' },
        { type: 'Task', id: 'LIST' },
      ],
    }),

    getTasks: builder.query({
      query: (params) => ({ url: '/tasks', params }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Task', id })), { type: 'Task', id: 'LIST' }]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    createTask: builder.mutation({
      query: (body) => ({ url: '/tasks', method: 'POST', body }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({ url: `/tasks/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useLoginMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = apiSlice
