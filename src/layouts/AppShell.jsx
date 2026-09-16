import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutDashboard, FolderKanban, LogOut } from 'lucide-react'
import Avatar from '../components/Avatar'
import { useGetUserQuery } from '../api/apiSlice'
import { loggedOut, selectCurrentUserId } from '../features/auth/authSlice'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
]

function NavItem({ to, label, icon: Icon, onClick, className }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
        } ${className ?? ''}`
      }
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {label}
    </NavLink>
  )
}

export default function AppShell() {
  const userId = useSelector(selectCurrentUserId)
  const { data: user } = useGetUserQuery(userId, { skip: !userId })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(loggedOut())
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 lg:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            T
          </span>
          <span className="text-base font-semibold text-slate-900">TaskFlow</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              T
            </span>
            <span className="text-sm font-semibold text-slate-900">TaskFlow</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                <Avatar name={user.name} size="sm" />
                <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                  {user.name}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 pb-20 pt-4 lg:px-6 lg:pb-6">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white lg:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            className="flex-1 flex-col gap-1 rounded-none py-2 text-center text-xs"
          />
        ))}
      </nav>
    </div>
  )
}
