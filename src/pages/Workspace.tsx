import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, AlertCircle, FolderKanban, Users, Settings } from 'lucide-react'
import { useWorkspace } from '../features/workspaces/hooks'
import { useProjects, useCreateProject } from '../features/projects/hooks'
import { ProjectCard } from '../features/projects/components/ProjectCard'
import { ProjectForm } from '../features/projects/components/ProjectForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'
import { EmptyState } from '../components/ui/EmptyState'
import { Alert } from '../components/ui/Alert'
import { ApiError } from '../api/parseResponse'

export function Workspace() {
  const { id } = useParams<{ id: string }>()
  const workspaceId = id ? Number(id) : 0

  const [page, setPage] = useState(1)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const { data: workspace, isLoading: isLoadingWorkspace, isError: isWorkspaceError, error: workspaceError } =
    useWorkspace(workspaceId)
  const { data, isLoading, isError, error } = useProjects(workspaceId, page)
  const createMutation = useCreateProject(workspaceId)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleCreateProject = async (formData: { name: string; description?: string }) => {
    try {
      await createMutation.mutateAsync(formData)
      setIsCreateOpen(false)
      showToast('Project created successfully!')
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError) {
        showToast(err.message || 'Failed to create project.', 'error')
      } else {
        showToast('An unexpected error occurred.', 'error')
      }
    }
  }

  if (isLoadingWorkspace) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    )
  }

  if (isWorkspaceError || !workspace) {
    return (
      <Alert variant="error" className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{workspaceError instanceof Error ? workspaceError.message : 'Workspace not found.'}</span>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            toastType === 'success' ? 'bg-slate-900' : 'bg-red-600'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${toastType === 'success' ? 'bg-green-500' : 'bg-white'}`} />
          {toastMessage}
        </div>
      )}

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
          <Alert variant="error" className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error instanceof Error ? error.message : 'Failed to fetch projects.'}</span>
          </Alert>
        )}

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-3 w-1/3 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-5/6 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
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
