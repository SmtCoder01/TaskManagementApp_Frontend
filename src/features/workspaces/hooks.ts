import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { workspaceKeys } from '../../lib/queryKeys'
import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from './api'
import type { Workspace, WorkspaceCreateInput, WorkspaceUpdateInput } from './types'

export function useWorkspaces(page: number, limit = 6) {
  return useQuery({
    queryKey: [...workspaceKeys.lists(), { page, limit }],
    queryFn: () => getWorkspaces(page, limit),
    placeholderData: keepPreviousData,
  })
}

export function useWorkspace(id: string | number | undefined) {
  const queryClient = useQueryClient()
  const workspaceId = id ? Number(id) : undefined

  return useQuery({
    queryKey: workspaceId ? workspaceKeys.detail(workspaceId) : [],
    queryFn: async () => {
      // Try to find in cache first
      const lists = queryClient.getQueriesData<{ items?: Workspace[] }>({ queryKey: workspaceKeys.lists() })
      for (const [, data] of lists) {
        if (data?.items && Array.isArray(data.items)) {
          const found = data.items.find((w: Workspace) => Number(w.id) === workspaceId)
          if (found) return found
        }
      }

      // If not in cache, fetch the list of workspaces to find it
      const result = await getWorkspaces(1, 100)
      const found = result.items.find((w: Workspace) => Number(w.id) === workspaceId)
      if (!found) {
        throw new Error('Workspace not found')
      }
      return found
    },
    enabled: !!workspaceId,
  })
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkspaceCreateInput) => createWorkspace(data),
    onSuccess: () => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
    },
  })
}

export function useUpdateWorkspace(id: string | number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkspaceUpdateInput) => updateWorkspace(id, data),
    onSuccess: (updatedWorkspace) => {
      // Invalidate specific detail and list queries
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(Number(id)) })
      // Update cache details directly if needed
      queryClient.setQueryData(workspaceKeys.detail(Number(id)), updatedWorkspace)
    },
  })
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteWorkspace(id),
    onSuccess: (_data, id) => {
      // Invalidate lists and detail query
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
      queryClient.removeQueries({ queryKey: workspaceKeys.detail(Number(id)) })
    },
  })
}
