import { apiClient } from '../../api/client'
import { parseResponse } from '../../api/parseResponse'
import type { PaginationResponse } from '../../types/api'
import type { Project, ProjectCreateInput, ProjectUpdateInput } from './types'

export async function getProjects(
  workspaceId: number,
  page: number,
  limit = 6,
): Promise<PaginationResponse<Project>> {
  const { data } = await apiClient.get(`/workspaces/${workspaceId}/projects`, {
    params: { pageNumber: page, pageSize: limit },
  })
  return parseResponse<PaginationResponse<Project>>(data)
}

export async function createProject(
  workspaceId: number,
  payload: ProjectCreateInput,
): Promise<Project> {
  const { data } = await apiClient.post(`/workspaces/${workspaceId}/projects`, payload)
  return parseResponse<Project>(data)
}

export async function getProject(projectId: number): Promise<Project> {
  const { data } = await apiClient.get(`/projects/${projectId}`)
  return parseResponse<Project>(data)
}

export async function updateProject(
  projectId: number,
  payload: ProjectUpdateInput,
): Promise<Project> {
  const { data } = await apiClient.patch(`/projects/${projectId}`, payload)
  return parseResponse<Project>(data)
}

export async function deleteProject(projectId: number): Promise<void> {
  const { data } = await apiClient.delete(`/projects/${projectId}`)
  return parseResponse<void>(data)
}
