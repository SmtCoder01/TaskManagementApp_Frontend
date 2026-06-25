import type { ReactNode } from 'react'
import { tokenStorage } from '@/lib/storage'

interface ProtectedRouteProps {
  children: ReactNode
}

// F3'te React Router ile entegre edilecek.
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!tokenStorage.get()) {
    return null
  }

  return children
}
