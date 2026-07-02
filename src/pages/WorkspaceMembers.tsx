import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, UserPlus, ShieldAlert, Users, Info } from 'lucide-react'
import { useAuth } from '../features/auth/AuthContext'
import { useWorkspace } from '../features/workspaces/hooks'
import {
  useWorkspaceMembers,
  useAddWorkspaceMember,
  useRemoveWorkspaceMember,
} from '../features/members/hooks'
import { MembersTable } from '../features/members/components/MembersTable'
import { AddMemberModal } from '../features/members/components/AddMemberModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { Pagination } from '@/components/ui/Pagination'
import { WorkspaceRole, type WorkspaceMember } from '../features/members/types'
import { ApiError } from '../api/parseResponse'

export function WorkspaceMembers() {
  const { id } = useParams<{ id: string }>()
  const workspaceId = id ? Number(id) : 0
  const { user: currentUser } = useAuth()

  const [page, setPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMember | null>(null)
  const [alert, setAlert] = useState<{ message: string; variant: 'success' | 'error' | 'warning' } | null>(null)

  // Queries
  const { data: workspace, isLoading: isLoadingWorkspace } = useWorkspace(workspaceId)
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    isError: isErrorMembers,
    error: membersError,
  } = useWorkspaceMembers(workspaceId, page, 10)

  // Mutations
  const addMemberMutation = useAddWorkspaceMember(workspaceId)
  const removeMemberMutation = useRemoveWorkspaceMember(workspaceId)

  // Alert handler
  const showAlert = (message: string, variant: 'success' | 'error' | 'warning' = 'success') => {
    setAlert({ message, variant })
    setTimeout(() => {
      setAlert(null)
    }, 5000)
  }

  // Permissions logic
  const isOwner = workspace && currentUser && workspace.ownerId === currentUser.id
  // Find current user in the loaded list of members (fallback logic)
  const currentUserMember = membersData?.items.find((m) => m.userId === currentUser?.id)
  const isAdmin = !!(isOwner || currentUserMember?.role === WorkspaceRole.Admin)

  // Handlers
  const handleAddMember = async (data: { email: string; role: WorkspaceRole }) => {
    try {
      await addMemberMutation.mutateAsync(data)
      showAlert('Üye çalışma alanına başarıyla eklendi!')
      setIsAddModalOpen(false)
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        if (err.code === 'WORKSPACE_MANAGE_MEMBERS_FORBIDDEN' || err.statusCode === 403) {
          showAlert('Üye ekleme yetkiniz bulunmamaktadır. Admin rolü gereklidir.', 'error')
        } else if (err.code === 'USER_NOT_FOUND') {
          showAlert('Belirtilen e-posta adresine ait bir kullanıcı bulunamadı.', 'error')
        } else {
          showAlert(err.message || 'Üye eklenirken bir hata oluştu.', 'error')
        }
      } else {
        showAlert('Beklenmeyen bir hata oluştu.', 'error')
      }
    }
  }

  const handleRemoveMember = async () => {
    if (!memberToRemove) return
    try {
      await removeMemberMutation.mutateAsync(memberToRemove.userId)
      showAlert(`${memberToRemove.name} ${memberToRemove.lastName} çalışma alanından kaldırıldı.`)
      setMemberToRemove(null)
    } catch (err) {
      console.error(err)
      setMemberToRemove(null)
      if (err instanceof ApiError) {
        if (err.code === 'WORKSPACE_MANAGE_MEMBERS_FORBIDDEN' || err.statusCode === 403) {
          showAlert('Üye silme yetkiniz bulunmamaktadır. Admin rolü gereklidir.', 'error')
        } else {
          showAlert(err.message || 'Üye kaldırılırken bir hata oluştu.', 'error')
        }
      } else {
        showAlert('Beklenmeyen bir hata oluştu.', 'error')
      }
    }
  }

  if (isLoadingWorkspace || isLoadingMembers) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto h-8 w-8 text-indigo-600" />
          <p className="mt-2 text-sm text-slate-500">Workspace üyeleri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (isErrorMembers) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Alert variant="error" className="mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <span>
              {membersError instanceof ApiError
                ? membersError.message
                : 'Üyeler yüklenirken bir hata oluştu.'}
            </span>
          </div>
        </Alert>
        <Link
          to={`/workspaces/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Workspace'e Dön</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation Header */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link
              to={`/workspaces/${workspaceId}`}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Workspace</span>
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">Üyeler</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2 mt-1">
            <Users className="h-8 w-8 text-indigo-600" />
            <span>Çalışma Alanı Üyeleri</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            <strong>{workspace?.name}</strong> çalışma alanındaki ekibinizi yönetin.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
          >
            <UserPlus className="h-4.5 w-4.5" />
            <span>Yeni Üye Ekle</span>
          </button>
        )}
      </div>

      {/* Alert Notification */}
      {alert && (
        <Alert variant={alert.variant} className="mb-6 animate-fadeIn">
          {alert.message}
        </Alert>
      )}

      {/* Info Warning for Non-Admins */}
      {!isAdmin && (
        <Alert variant="info" className="mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Sadece Görüntüleme Yetkisi</p>
            <p className="text-xs text-blue-700 mt-0.5">
              Çalışma alanında Admin rolünüz olmadığı için yeni üye ekleyemez veya mevcut üyeleri çıkartamazsınız.
            </p>
          </div>
        </Alert>
      )}

      {/* Members Table Section */}
      <div className="space-y-6">
        <MembersTable
          members={membersData?.items ?? []}
          isAdmin={isAdmin}
          currentUserId={currentUser?.id}
          onRemoveClick={(member) => setMemberToRemove(member)}
        />

        {/* Pagination */}
        {membersData && membersData.totalPages > 1 && (
          <div className="pt-4 border-t border-slate-100">
            <Pagination
              page={page}
              totalPages={membersData.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMember}
        isLoading={addMemberMutation.isPending}
      />

      {/* Remove Member Dialog */}
      <ConfirmDialog
        isOpen={!!memberToRemove}
        title="Üyeyi Çalışma Alanından Kaldır"
        message={
          memberToRemove
            ? `"${memberToRemove.name} ${memberToRemove.lastName}" isimli üyeyi çalışma alanından çıkarmak istediğinize emin misiniz? Bu işlem geri alınamaz.`
            : ''
        }
        onConfirm={handleRemoveMember}
        onClose={() => setMemberToRemove(null)}
      />
    </div>
  )
}
