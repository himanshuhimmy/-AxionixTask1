import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Button from '../../components/Button'
import TextField from '../../components/TextField'
import { useLoginMutation } from '../../api/apiSlice'
import { sessionStarted } from './authSlice'
import { DEMO_EMAIL, DEMO_PASSWORD } from './constants'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const [login, { isLoading, error, reset: resetLogin }] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from?.pathname ?? '/dashboard'

  async function handleSubmit(event) {
    event.preventDefault()
    resetLogin()

    const nextErrors = {}
    if (!email.trim()) nextErrors.email = 'Email is required.'
    if (!password) nextErrors.password = 'Password is required.'
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const result = await login({ email: email.trim(), password })
    if ('data' in result) {
      dispatch(sessionStarted({ userId: result.data.id }))
      navigate(redirectTo, { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            T
          </span>
          <h1 className="text-xl font-semibold text-slate-900">Welcome back to TaskFlow</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to access your projects, tasks, and team workspace.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error.data?.message ?? 'Something went wrong. Please try again.'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <TextField
            id="email"
            label="Work Email"
            type="email"
            icon={Mail}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldErrors.email}
          />
          <TextField
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            }
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          Demo credentials: <span className="font-medium text-slate-700">{DEMO_EMAIL}</span> /{' '}
          <span className="font-medium text-slate-700">{DEMO_PASSWORD}</span>
        </p>
      </div>
    </div>
  )
}
