import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useMe } from './hooks'

import { queryKeys } from '../../lib/queryKeys'
import type { User } from '../../types/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')

  const { data: user, isLoading, error } = useMe()

  const logout = () => {
    localStorage.removeItem('access_token')
    queryClient.clear()
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    navigate('/login')
  }

  useEffect(() => {
    if (error && ((error as any).statusCode === 401 || (error as any).status === 401)) {
      logout()
    }
  }, [error])

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated,
        isLoading,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
