import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workspaceSchema, type WorkspaceSchemaInput } from '../validation'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { Button } from '../../../components/ui/Button'

interface WorkspaceFormProps {
  defaultValues?: Partial<WorkspaceSchemaInput>
  onSubmit: (data: WorkspaceSchemaInput) => void
  isLoading: boolean
  submitLabel?: string
}

export function WorkspaceForm({
  defaultValues = { name: '', description: '' },
  onSubmit,
  isLoading,
  submitLabel = 'Save Workspace',
}: WorkspaceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkspaceSchemaInput>({
    resolver: zodResolver(workspaceSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="workspace-name"
        label="Workspace Name"
        placeholder="e.g. Acme Corporation, Design Team"
        error={errors.name?.message}
        variant={errors.name ? 'danger' : 'primary'}
        {...register('name')}
      />

      <div>
        <label htmlFor="workspace-description" className="text-sm font-medium text-slate-700">
          Description (Optional)
        </label>
        <Textarea
          id="workspace-description"
          placeholder="Briefly describe the purpose of this workspace..."
          error={errors.description?.message}
          variant={errors.description ? 'danger' : 'primary'}
          className="mt-1"
          {...register('description')}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="submit" disabled={isLoading} className="opacity-0 hidden" />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Saving...</span>
            </div>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
