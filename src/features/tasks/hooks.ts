import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { taskKeys } from '../../lib/queryKeys'
import { getTasks, createTask, updateTask, deleteTask } from './api'
import type { CreateTaskInput, UpdateTaskInput, TaskListParams } from './types'

export function useTasks(workspaceId: number, params?: TaskListParams) {
  return useQuery({
    queryKey: [...taskKeys.lists(), { workspaceId, ...params }],
    queryFn: () => getTasks(workspaceId, params),
    placeholderData: keepPreviousData,
    enabled: !!workspaceId,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskInput) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: number; payload: UpdateTaskInput }) =>
      updateTask(taskId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: (_data, taskId) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      queryClient.removeQueries({ queryKey: taskKeys.detail(taskId) })
    },
  })
}
