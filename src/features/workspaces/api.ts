import { apiClient } from '../../api/client'
import { parseResponse } from '../../api/parseResponse'
import type { PaginationResponse } from '../../types/api'
import type { Workspace, WorkspaceCreateInput, WorkspaceUpdateInput } from './types'

export async function getWorkspaces(page: number, limit = 6): Promise<PaginationResponse<Workspace>> {
  const { data } = await apiClient.get('/workspaces', {
    params: { pageNumber: page, pageSize: limit },
  })
  return parseResponse<PaginationResponse<Workspace>>(data)
}

export async function getWorkspace(id: string | number): Promise<Workspace> {
  const { data } = await apiClient.get(`/workspaces/${id}`)
  return parseResponse<Workspace>(data)
}

export async function createWorkspace(payload: WorkspaceCreateInput): Promise<Workspace> {
  const { data } = await apiClient.post('/workspaces', payload)
  return parseResponse<Workspace>(data)
}

export async function updateWorkspace(id: string | number, payload: WorkspaceUpdateInput): Promise<Workspace> {
  const { data } = await apiClient.patch(`/workspaces/${id}`, payload)
  return parseResponse<Workspace>(data)
}

export async function deleteWorkspace(id: string | number): Promise<void> {
  const { data } = await apiClient.delete(`/workspaces/${id}`)
  return parseResponse<void>(data)
}
