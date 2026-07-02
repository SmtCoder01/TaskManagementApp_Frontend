import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login, register, me } from './api'
import { queryKeys } from '../../lib/queryKeys'
import type { LoginInput, RegisterInput } from './schema'
import type { User } from '../../types/api'

export function useRegister() {
  return useMutation<User, Error, RegisterInput>({
    mutationFn: register,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation<{ accessToken: string }, Error, LoginInput>({
    mutationFn: login,
    onSuccess: async (data) => {
      localStorage.setItem('access_token', data.accessToken)
      try {
        // Fetch current user and store in React Query cache
        const currentUser = await me()
        queryClient.setQueryData(queryKeys.auth.me(), currentUser)
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
        navigate('/')
      } catch (error) {
        console.error('Failed to fetch user profile after login', error)
        // If profile fetch fails, we still navigate but could handle it
        navigate('/')
      }
    },
  })
}

export function useMe() {
  const token = localStorage.getItem('access_token')
  return useQuery<User, Error>({
    queryKey: queryKeys.auth.me(),
    queryFn: me,
    enabled: !!token,
    staleTime: 1000 * 60 * 60, // Keep user data fresh but avoid excessive refetches
    retry: (failureCount, error: any) => {
      // Don't retry on 401
      if (error?.statusCode === 401 || error?.status === 401) {
        return false
      }
      return failureCount < 1
    },
  })
}
