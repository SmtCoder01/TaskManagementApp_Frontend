import { apiClient } from '../../api/client'
import { parseResponse } from '../../api/parseResponse'
import type { PaginationResponse } from '../../types/api'
import type { TaskListItem, CreateTaskInput, UpdateTaskInput, TaskListParams } from './types'

export async function getTasks(
  workspaceId: number,
  params?: TaskListParams
): Promise<PaginationResponse<TaskListItem>> {
  const { data } = await apiClient.get('/tasks', {
    params: {
      workspaceId,
      pageNumber: params?.pageNumber ?? 1,
      pageSize: params?.pageSize ?? 100,
      status: params?.status,
      assigneeId: params?.assigneeId,
      projectId: params?.projectId,
      q: params?.q,
    },
  })
  return parseResponse<PaginationResponse<TaskListItem>>(data)
}

export async function createTask(payload: CreateTaskInput): Promise<TaskListItem> {
  const { data } = await apiClient.post('/tasks', payload)
  return parseResponse<TaskListItem>(data)
}

export async function updateTask(taskId: number, payload: UpdateTaskInput): Promise<TaskListItem> {
  const { data } = await apiClient.put(`/tasks/${taskId}`, payload)
  return parseResponse<TaskListItem>(data)
}

export async function deleteTask(taskId: number): Promise<void> {
  const { data } = await apiClient.delete(`/tasks/${taskId}`)
  return parseResponse<void>(data)
}
