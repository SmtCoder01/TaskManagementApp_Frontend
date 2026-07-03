export interface Project {
  id: number
  name: string
  description?: string
  workspaceId: number
  createdAt?: string
  updatedAt?: string
}

export interface ProjectCreateInput {
  name: string
  description?: string
}

export interface ProjectUpdateInput {
  name: string
  description?: string
}
