import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage'
import ProtectedRoute from './features/auth/ProtectedRoute'
import AppShell from './layouts/AppShell'
import DashboardPage from './features/dashboard/DashboardPage'
import ProjectsPage from './features/projects/ProjectsPage'
import ProjectDetailsPage from './features/projects/ProjectDetailsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
