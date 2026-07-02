import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { addMemberSchema, type AddMemberSchemaInput } from '../validation'
import { WorkspaceRole } from '../types'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddMemberSchemaInput) => Promise<void>
  isLoading: boolean
}

export function AddMemberModal({ isOpen, onClose, onSubmit, isLoading }: AddMemberModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMemberSchemaInput>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: '',
      role: WorkspaceRole.Member,
    },
  })

  const handleFormSubmit = async (data: AddMemberSchemaInput) => {
    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Workspace Member">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          id="member-email"
          label="Email Address"
          type="email"
          placeholder="e.g. user@example.com"
          error={errors.email?.message}
          variant={errors.email ? 'danger' : 'primary'}
          {...register('email')}
        />

        <Select
          id="member-role"
          label="Role"
          error={errors.role?.message}
          variant={errors.role ? 'danger' : 'primary'}
          {...register('role', { setValueAs: Number })}
        >
          <option value={WorkspaceRole.Member}>Member</option>
          <option value={WorkspaceRole.Admin}>Admin</option>
        </Select>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Adding...</span>
              </div>
            ) : (
              'Add Member'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
