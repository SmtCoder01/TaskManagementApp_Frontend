export interface Workspace {
  id: number
  name: string
  description?: string
  memberCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface WorkspaceCreateInput {
  name: string
  description?: string
}

export interface WorkspaceUpdateInput {
  name: string
  description?: string
}
