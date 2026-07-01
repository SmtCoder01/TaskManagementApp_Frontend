import { z } from 'zod'

export const workspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100, 'Workspace name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
})

export type WorkspaceSchemaInput = z.infer<typeof workspaceSchema>
