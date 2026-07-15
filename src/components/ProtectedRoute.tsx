import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { Spinner } from './ui/Spinner'

export function ProtectedRoute() {
  const token = localStorage.getItem('access_token')
  const { isAuthenticated, isLoading } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Spinner className="mx-auto h-8 w-8 text-indigo-600" />
          <p className="mt-2 text-sm text-slate-500">Oturum doğrulanıyor...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
