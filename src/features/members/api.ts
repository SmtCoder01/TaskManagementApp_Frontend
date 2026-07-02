import { apiClient } from '../../api/client'
import { parseResponse } from '../../api/parseResponse'
import type { PaginationResponse } from '../../types/api'
import type { WorkspaceMember, AddWorkspaceMemberInput } from './types'

export async function getWorkspaceMembers(
  workspaceId: number,
  page: number,
  limit = 10
): Promise<PaginationResponse<WorkspaceMember>> {
  const { data } = await apiClient.get(`/workspaces/${workspaceId}/users`, {
    params: { page, limit },
  })
  return parseResponse<PaginationResponse<WorkspaceMember>>(data)
}

export async function addWorkspaceMember(
  workspaceId: number,
  payload: AddWorkspaceMemberInput
): Promise<void> {
  const { data } = await apiClient.post(`/workspaces/${workspaceId}/users`, payload)
  return parseResponse<void>(data)
}

export async function removeWorkspaceMember(
  workspaceId: number,
  userId: number
): Promise<void> {
  const { data } = await apiClient.delete(`/workspaces/${workspaceId}/users/${userId}`)
  return parseResponse<void>(data)
}
