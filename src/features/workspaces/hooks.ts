import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { workspaceKeys } from '../../lib/queryKeys'
import {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from './api'
import type { WorkspaceCreateInput, WorkspaceUpdateInput } from './types'

export function useWorkspaces(page: number, limit = 6) {
  return useQuery({
    queryKey: [...workspaceKeys.lists(), { page, limit }],
    queryFn: () => getWorkspaces(page, limit),
    placeholderData: keepPreviousData,
  })
}

export function useWorkspace(id: string | number | undefined) {
  const workspaceId = id ? Number(id) : undefined

  return useQuery({
    queryKey: workspaceId ? workspaceKeys.detail(workspaceId) : [],
    queryFn: () => getWorkspace(workspaceId!),
    enabled: !!workspaceId && workspaceId > 0,
  })
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkspaceCreateInput) => createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
    },
  })
}

export function useUpdateWorkspace(id: string | number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkspaceUpdateInput) => updateWorkspace(id, data),
    onSuccess: (updatedWorkspace) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(Number(id)) })
      queryClient.setQueryData(workspaceKeys.detail(Number(id)), updatedWorkspace)
    },
  })
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteWorkspace(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      queryClient.removeQueries({ queryKey: workspaceKeys.detail(Number(id)) })
    },
  })
}
