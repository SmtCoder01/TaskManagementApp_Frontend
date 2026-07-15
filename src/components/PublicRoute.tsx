import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { Spinner } from './ui/Spinner'

export function PublicRoute() {
  const token = localStorage.getItem('access_token')
  const { isAuthenticated, isLoading } = useAuth()

  if (token && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
