import { apiClient } from '../../api/client'
import { normalizeWorkspace } from '../../api/normalize'
import { parseResponse } from '../../api/parseResponse'
import type { PaginationResponse } from '../../types/api'
import type { Workspace, WorkspaceCreateInput, WorkspaceUpdateInput } from './types'

function mapWorkspace(raw: unknown): Workspace {
  return normalizeWorkspace(raw as Record<string, unknown>)
}

export async function getWorkspaces(page: number, limit = 6): Promise<PaginationResponse<Workspace>> {
  const { data } = await apiClient.get('/workspaces', {
    params: { pageNumber: page, pageSize: limit },
  })
  const result = parseResponse<PaginationResponse<Record<string, unknown>>>(data)
  return { ...result, items: result.items.map(mapWorkspace) }
}

export async function getWorkspace(id: string | number): Promise<Workspace> {
  const { data } = await apiClient.get(`/workspaces/${id}`)
  return mapWorkspace(parseResponse<Record<string, unknown>>(data))
}

export async function createWorkspace(payload: WorkspaceCreateInput): Promise<Workspace> {
  const { data } = await apiClient.post('/workspaces', payload)
  return mapWorkspace(parseResponse<Record<string, unknown>>(data))
}

export async function updateWorkspace(id: string | number, payload: WorkspaceUpdateInput): Promise<Workspace> {
  const { data } = await apiClient.patch(`/workspaces/${id}`, payload)
  return mapWorkspace(parseResponse<Record<string, unknown>>(data))
}

export async function deleteWorkspace(id: string | number): Promise<void> {
  const { data } = await apiClient.delete(`/workspaces/${id}`)
  return parseResponse<void>(data)
}
