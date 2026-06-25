export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  workspaces: {
    all: ['workspaces'] as const,
    list: (page: number, size: number) => ['workspaces', 'list', page, size] as const,
    detail: (id: number) => ['workspaces', 'detail', id] as const,
    members: (workspaceId: number, page: number) =>
      ['workspaces', workspaceId, 'members', page] as const,
  },
  projects: {
    list: (workspaceId: number, page: number) => ['projects', workspaceId, 'list', page] as const,
    detail: (projectId: number) => ['projects', 'detail', projectId] as const,
  },
  tasks: {
    list: (workspaceId: number, filters: object) =>
      ['tasks', workspaceId, 'list', filters] as const,
    byProject: (projectId: number, filters: object) =>
      ['tasks', 'project', projectId, filters] as const,
    detail: (taskId: number) => ['tasks', 'detail', taskId] as const,
  },
  users: {
    list: (page: number, q?: string) => ['users', 'list', page, q] as const,
    detail: (userId: number) => ['users', 'detail', userId] as const,
  },
}
