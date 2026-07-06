import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, FolderKanban, Users, Settings } from 'lucide-react'
import { useWorkspace } from '../features/workspaces/hooks'
import { useProjects, useCreateProject } from '../features/projects/hooks'
import { ProjectCard } from '../features/projects/components/ProjectCard'
import { ProjectForm } from '../features/projects/components/ProjectForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { ErrorState } from '../components/ui/ErrorState'
import { showApiErrorToast } from '../utils/errorHandler'
import { toast } from 'sonner'

export function Workspace() {
  const { id } = useParams<{ id: string }>()
  const workspaceId = id ? Number(id) : 0

  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { data: workspace, isLoading: isLoadingWorkspace, isError: isWorkspaceError, refetch: refetchWorkspace } =
    useWorkspace(workspaceId)
  const { data, isLoading, isError, refetch: refetchProjects } = useProjects(workspaceId, page)
  const createMutation = useCreateProject(workspaceId)

  const handleCreateProject = async (formData: { name: string; description?: string }) => {
    try {
      await createMutation.mutateAsync(formData)
      setIsCreateOpen(false)
      toast.success('Project created successfully!')
    } catch (err) {
      console.error(err)
      showApiErrorToast(err, 'Failed to create project.')
    }
  }

  if (isLoadingWorkspace) {
    return <LoadingState message="Çalışma alanı yükleniyor..." />
  }

  if (isWorkspaceError || !workspace) {
    return (
      <ErrorState
        title="Çalışma alanı yüklenemedi"
        message="Çalışma alanı bilgileri alınırken bir hata oluştu."
        onRetry={() => refetchWorkspace()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-900 transition">
          Workspaces
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{workspace.name}</span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{workspace.name}</h1>
          <p className="text-sm text-slate-500">
            {workspace.description || 'Manage projects and collaborate within this workspace.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/workspaces/${workspaceId}/members`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Members</span>
            </Button>
          </Link>
          <Link to={`/workspaces/${workspaceId}/settings`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </Link>
          <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Projects</h2>

        {isError && (
          <ErrorState
            title="Projeler yüklenemedi"
            message="Bu çalışma alanındaki projeler listelenirken bir hata oluştu."
            onRetry={() => refetchProjects()}
          />
        )}

        {isLoading && (
          <LoadingState layout="skeleton-cards" count={6} />
        )}

        {!isLoading && !isError && (
          <>
            {data && data.items.length > 0 ? (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {data.items.map((project) => (
                    <ProjectCard key={project.id} project={project} workspaceId={workspaceId} />
                  ))}
                </div>

                {data.totalPages > 1 && (
                  <div className="flex justify-center border-t border-slate-100 pt-6">
                    <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                title="No projects found"
                description="Create a new project to start organizing tasks and tracking progress."
                icon={<FolderKanban className="h-10 w-10 text-slate-300" />}
                action={
                  <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Create Project</span>
                  </Button>
                }
                className="py-12"
              />
            )}
          </>
        )}
      </section>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Project">
        <ProjectForm
          onSubmit={handleCreateProject}
          isLoading={createMutation.isPending}
          submitLabel="Create Project"
        />
      </Modal>
    </div>
  )
}
