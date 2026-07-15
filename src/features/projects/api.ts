import { apiClient } from '../../api/client'
import { normalizeProject } from '../../api/normalize'
import { parseResponse } from '../../api/parseResponse'
import type { PaginationResponse } from '../../types/api'
import type { Project, ProjectCreateInput, ProjectUpdateInput } from './types'

function mapProject(raw: unknown): Project {
  return normalizeProject(raw as Record<string, unknown>)
}

export async function getProjects(
  workspaceId: number,
  page: number,
  limit = 6,
): Promise<PaginationResponse<Project>> {
  const { data } = await apiClient.get(`/workspaces/${workspaceId}/projects`, {
    params: { pageNumber: page, pageSize: limit },
  })
  const result = parseResponse<PaginationResponse<Record<string, unknown>>>(data)
  return { ...result, items: result.items.map(mapProject) }
}

export async function createProject(
  workspaceId: number,
  payload: ProjectCreateInput,
): Promise<Project> {
  const { data } = await apiClient.post(`/workspaces/${workspaceId}/projects`, payload)
  return mapProject(parseResponse<Record<string, unknown>>(data))
}

export async function getProject(projectId: number): Promise<Project> {
  const { data } = await apiClient.get(`/projects/${projectId}`)
  return mapProject(parseResponse<Record<string, unknown>>(data))
}

export async function updateProject(
  projectId: number,
  payload: ProjectUpdateInput,
): Promise<Project> {
  const { data } = await apiClient.patch(`/projects/${projectId}`, payload)
  return mapProject(parseResponse<Record<string, unknown>>(data))
}

export async function deleteProject(projectId: number): Promise<void> {
  const { data } = await apiClient.delete(`/projects/${projectId}`)
  return parseResponse<void>(data)
}
