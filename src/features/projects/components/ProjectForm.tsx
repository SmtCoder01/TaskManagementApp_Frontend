import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectSchemaInput } from '../validation'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { Button } from '../../../components/ui/Button'
import { applyFieldErrors, showApiErrorToast } from '../../../utils/errorHandler'

interface ProjectFormProps {
  defaultValues?: Partial<ProjectSchemaInput>
  onSubmit: (data: ProjectSchemaInput) => Promise<void>
  isLoading: boolean
  submitLabel?: string
}

export function ProjectForm({
  defaultValues = { name: '', description: '' },
  onSubmit,
  isLoading,
  submitLabel = 'Save Project',
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProjectSchemaInput>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  })

  const handleFormSubmit = async (data: ProjectSchemaInput) => {
    try {
      await onSubmit(data)
    } catch (err) {
      if (!applyFieldErrors(err, setError)) {
        showApiErrorToast(err, 'Proje kaydedilirken bir hata oluştu.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        id="project-name"
        label="Project Name"
        placeholder="e.g. Sprint Board, Product Roadmap"
        error={errors.name?.message}
        variant={errors.name ? 'danger' : 'primary'}
        {...register('name')}
      />

      <div>
        <label htmlFor="project-description" className="text-sm font-medium text-slate-700">
          Description (Optional)
        </label>
        <Textarea
          id="project-description"
          placeholder="Briefly describe the purpose of this project..."
          error={errors.description?.message}
          variant={errors.description ? 'danger' : 'primary'}
          className="mt-1"
          {...register('description')}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
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
