import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { projectKeys } from '../../lib/queryKeys'
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from './api'
import type { Project, ProjectCreateInput, ProjectUpdateInput } from './types'

function findProjectInListCache(
  queryClient: ReturnType<typeof useQueryClient>,
  projectId: number,
  workspaceId?: number,
): Project | undefined {
  const lists = queryClient.getQueriesData<{ items?: Project[] }>({
    queryKey: projectKeys.lists(),
  })

  for (const [, data] of lists) {
    const found = data?.items?.find((project) => Number(project.id) === projectId)
    if (found) return found
  }

  if (workspaceId) {
    const listData = queryClient.getQueryData<{ items?: Project[] }>(
      [...projectKeys.list(workspaceId), { page: 1, limit: 6 }],
    )
    return listData?.items?.find((project) => Number(project.id) === projectId)
  }

  return undefined
}

export function useProjects(workspaceId: number, page: number, limit = 6) {
  return useQuery({
    queryKey: [...projectKeys.list(workspaceId), { page, limit }],
    queryFn: () => getProjects(workspaceId, page, limit),
    placeholderData: keepPreviousData,
    enabled: !!workspaceId,
  })
}

export function useProject(projectId: number | undefined, workspaceId?: number) {
  const queryClient = useQueryClient()
  const numericProjectId = projectId && projectId > 0 ? projectId : undefined

  return useQuery({
    queryKey: numericProjectId ? projectKeys.detail(numericProjectId) : [],
    queryFn: () => getProject(numericProjectId!),
    enabled: !!numericProjectId,
    initialData: () => {
      if (!numericProjectId) return undefined
      return findProjectInListCache(queryClient, numericProjectId, workspaceId)
    },
  })
}

export function useCreateProject(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProjectCreateInput) => createProject(workspaceId, data),
    onSuccess: (createdProject) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
      queryClient.setQueryData(projectKeys.detail(createdProject.id), createdProject)
    },
  })
}

export function useUpdateProject(projectId: number, workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProjectUpdateInput) => updateProject(projectId, data),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(projectKeys.detail(projectId), updatedProject)
      queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
    },
  })
}

export function useDeleteProject(workspaceId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.list(workspaceId) })
    },
  })
}
