import axios from 'axios'
import { apiClient } from '../../api/client'
import { parseResponse } from '../../api/parseResponse'
import type { PaginationResponse } from '../../types/api'
import type { Project, ProjectCreateInput, ProjectUpdateInput } from './types'

function isProjectDetailEndpointMissing(error: unknown): boolean {
  return axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 501)
}

export async function getProjects(
  workspaceId: number,
  page: number,
  limit = 6,
): Promise<PaginationResponse<Project>> {
  const { data } = await apiClient.get(`/workspaces/${workspaceId}/projects`, {
    params: { page, limit },
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

export async function getProject(
  projectId: number,
  findInCache?: () => Project | undefined,
): Promise<Project> {
  try {
    const { data } = await apiClient.get(`/projects/${projectId}`)
    return parseResponse<Project>(data)
  } catch (error) {
    if (isProjectDetailEndpointMissing(error) && findInCache) {
      const cached = findInCache()
      if (cached) return cached
    }
    throw error
  }
}

export async function updateProject(
  projectId: number,
  payload: ProjectUpdateInput,
  fallback?: (payload: ProjectUpdateInput) => Project,
): Promise<Project> {
  try {
    const { data } = await apiClient.patch(`/projects/${projectId}`, payload)
    return parseResponse<Project>(data)
  } catch (error) {
    if (isProjectDetailEndpointMissing(error) && fallback) {
      // TODO: Remove cache adapter when PATCH /api/projects/{id} is available on backend
      return fallback(payload)
    }
    throw error
  }
}

export async function deleteProject(
  projectId: number,
  fallback?: () => void,
): Promise<void> {
  try {
    const { data } = await apiClient.delete(`/projects/${projectId}`)
    return parseResponse<void>(data)
  } catch (error) {
    if (isProjectDetailEndpointMissing(error) && fallback) {
      // TODO: Remove cache adapter when DELETE /api/projects/{id} is available on backend
      fallback()
      return
    }
    throw error
  }
}
