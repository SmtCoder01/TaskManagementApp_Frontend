import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { workspaceKeys } from '../../lib/queryKeys'
import { getWorkspaceMembers, addWorkspaceMember, removeWorkspaceMember } from './api'
import type { AddWorkspaceMemberInput } from './types'

export function useWorkspaceMembers(workspaceId: number, page: number, limit = 10) {
  return useQuery({
    queryKey: [...workspaceKeys.members(workspaceId), { page, limit }],
    queryFn: () => getWorkspaceMembers(workspaceId, page, limit),
    placeholderData: keepPreviousData,
    enabled: !!workspaceId,
  })
}

export function useAddWorkspaceMember(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AddWorkspaceMemberInput) => addWorkspaceMember(workspaceId, data),
    onSuccess: () => {
      // Invalidate the members list cache for this workspace
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(workspaceId),
      })
    },
  })
}

export function useRemoveWorkspaceMember(workspaceId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => removeWorkspaceMember(workspaceId, userId),
    onSuccess: () => {
      // Invalidate the members list cache for this workspace
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(workspaceId),
      })
    },
  })
}
