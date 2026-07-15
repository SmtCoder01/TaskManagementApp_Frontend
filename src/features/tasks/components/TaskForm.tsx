import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trash2 } from 'lucide-react'
import { Modal } from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import { Button } from '../../../components/ui/Button'
import { TaskPriority, TaskStatus } from '../types'
import type { WorkspaceMember } from '../../members/types'
import { UserAutocomplete } from '../../users/components/UserAutocomplete'
import type { TaskListItem } from '../types'

const taskFormSchema = z.object({
  title: z.string().min(1, 'Görev başlığı gereklidir'),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriority, {
    message: 'Geçerli bir öncelik seçiniz',
  }),
  status: z.nativeEnum(TaskStatus).optional(),
  dueDate: z.string().nullable().optional(),
  assigneeId: z.number().nullable().optional(),
})

type TaskFormSchemaInput = z.infer<typeof taskFormSchema>

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormSchemaInput) => Promise<void>
  onDelete?: () => Promise<void>
  initialValues?: TaskListItem
  members: WorkspaceMember[]
  workspaceId?: number
  isLoading: boolean
  isDeleting?: boolean
}

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialValues,
  members,
  workspaceId,
  isLoading,
  isDeleting = false,
}: TaskFormProps) {
  const isEditing = !!initialValues

  // Convert ISO string (e.g. 2026-07-03T11:20:00) to YYYY-MM-DD for date input
  const formatInitialDate = (dateStr?: string) => {
    if (!dateStr) return ''
    return dateStr.substring(0, 10)
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TaskFormSchemaInput>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: TaskPriority.Medium,
      status: TaskStatus.ToDo,
      dueDate: '',
      assigneeId: null,
    },
  })

  // Sync initialValues when modal opens or initialValues change
  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        reset({
          title: initialValues.title,
          description: initialValues.description ?? '',
          priority: initialValues.priority,
          status: initialValues.status,
          dueDate: formatInitialDate(initialValues.dueDate),
          assigneeId: initialValues.assigneeId ?? null,
        })
      } else {
        reset({
          title: '',
          description: '',
          priority: TaskPriority.Medium,
          status: TaskStatus.ToDo,
          dueDate: '',
          assigneeId: null,
        })
      }
    }
  }, [isOpen, initialValues, reset])

  const handleFormSubmit = async (data: TaskFormSchemaInput) => {
    const payload = {
      ...data,
      dueDate: data.dueDate && data.dueDate !== '' ? new Date(data.dueDate).toISOString() : null,
      assigneeId: data.assigneeId || null,
    }

    try {
      await onSubmit(payload)
      onClose()
    } catch {
      // Parent handles toast/errors; keep modal open on failure.
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Görevi Düzenle' : 'Yeni Görev Oluştur'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          id="task-title"
          label="Görev Başlığı"
          placeholder="Örn. Arayüz tasarımını yap"
          error={errors.title?.message}
          variant={errors.title ? 'danger' : 'primary'}
          disabled={isLoading}
          {...register('title')}
        />

        <Textarea
          id="task-desc"
          label="Açıklama"
          placeholder="Görev detayları..."
          error={errors.description?.message}
          disabled={isLoading}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="task-priority"
            label="Öncelik"
            error={errors.priority?.message}
            variant={errors.priority ? 'danger' : 'primary'}
            disabled={isLoading}
            {...register('priority', { setValueAs: Number })}
          >
            <option value={TaskPriority.Low}>Düşük</option>
            <option value={TaskPriority.Medium}>Orta</option>
            <option value={TaskPriority.High}>Yüksek</option>
          </Select>

          {isEditing && (
            <Select
              id="task-status"
              label="Durum"
              error={errors.status?.message}
              variant={errors.status ? 'danger' : 'primary'}
              disabled={isLoading}
              {...register('status', { setValueAs: Number })}
            >
              <option value={TaskStatus.ToDo}>Yapılacak</option>
              <option value={TaskStatus.InProgress}>Devam Ediyor</option>
              <option value={TaskStatus.Done}>Tamamlandı</option>
              <option value={TaskStatus.Blocked}>Engellendi</option>
              <option value={TaskStatus.Cancelled}>İptal Edildi</option>
            </Select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="task-due-date"
            label="Bitiş Tarihi"
            type="date"
            error={errors.dueDate?.message}
            variant={errors.dueDate ? 'danger' : 'primary'}
            disabled={isLoading}
            {...register('dueDate')}
          />

          <Controller
            name="assigneeId"
            control={control}
            render={({ field }) => (
              <UserAutocomplete
                id="task-assignee"
                label="Atanan Kişi"
                value={field.value ?? null}
                onChange={field.onChange}
                fallbackMembers={members}
                workspaceId={workspaceId}
                disabled={isLoading}
                error={errors.assigneeId?.message}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
          <div>
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="secondary"
                disabled={isLoading || isDeleting}
                onClick={onDelete}
                className="border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600 font-semibold"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Sil
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={isLoading || isDeleting}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading || isDeleting}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Kaydediliyor...</span>
                </div>
              ) : (
                'Kaydet'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
