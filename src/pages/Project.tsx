import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Calendar, User, FolderKanban, AlertCircle } from 'lucide-react'
import { useWorkspaceMembers } from '../features/members/hooks'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../features/tasks/hooks'
import { TaskFilters } from '../features/tasks/components/TaskFilters'
import { TaskForm } from '../features/tasks/components/TaskForm'
import { TaskStatus, TaskPriority } from '../features/tasks/types'
import { useWorkspace } from '../features/workspaces/hooks'
import { Spinner } from '../components/ui/Spinner'
import { Alert } from '../components/ui/Alert'
import type { TaskListItem } from '../features/tasks/types'

export function Project() {
  const { id, projectId } = useParams<{ id: string; projectId: string }>()
  const workspaceId = id ? Number(id) : 0
  const cleanProjectId = projectId ? Number(projectId.replace(/\D/g, '')) || 1 : 1

  // State
  const [filters, setFilters] = useState<{ status?: TaskStatus; assigneeId?: number; q?: string }>({})
  const [selectedTask, setSelectedTask] = useState<TaskListItem | undefined>(undefined)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [alertMsg, setAlertMsg] = useState<{ message: string; variant: 'success' | 'error' } | null>(null)

  // Queries
  const { data: workspace } = useWorkspace(workspaceId)
  const { data: membersData } = useWorkspaceMembers(workspaceId, 1, 100)
  const { data: tasksData, isLoading: isLoadingTasks, isError: isErrorTasks } = useTasks(workspaceId, {
    status: filters.status,
    assigneeId: filters.assigneeId,
    q: filters.q,
  })

  // Mutations
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const members = membersData?.items ?? []
  
  // Filter tasks by this project ID on client-side
  const tasks = (tasksData?.items ?? []).filter((t) => t.projectId === cleanProjectId)

  const showAlert = (message: string, variant: 'success' | 'error' = 'success') => {
    setAlertMsg({ message, variant })
    setTimeout(() => setAlertMsg(null), 4000)
  }

  // Handlers
  const handleOpenCreateModal = () => {
    setSelectedTask(undefined)
    setIsFormOpen(true)
  }

  const handleOpenEditModal = (task: TaskListItem) => {
    setSelectedTask(task)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      if (selectedTask) {
        // Edit task
        await updateTaskMutation.mutateAsync({
          taskId: selectedTask.id,
          payload: {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            status: formData.status,
            dueDate: formData.dueDate,
            assigneeId: formData.assigneeId,
          },
        })
        showAlert('Görev başarıyla güncellendi!')
      } else {
        // Create task
        await createTaskMutation.mutateAsync({
          projectId: cleanProjectId,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate,
          assigneeId: formData.assigneeId,
        })
        showAlert('Görev başarıyla oluşturuldu!')
      }
    } catch (err: any) {
      console.error(err)
      showAlert(err?.message || 'İşlem gerçekleştirilirken bir hata oluştu.', 'error')
    }
  }

  const handleDeleteTask = async () => {
    if (!selectedTask) return
    if (!window.confirm('Bu görevi silmek istediğinize emin misiniz?')) return

    try {
      await deleteTaskMutation.mutateAsync(selectedTask.id)
      showAlert('Görev başarıyla silindi!')
      setIsFormOpen(false)
    } catch (err: any) {
      console.error(err)
      showAlert(err?.message || 'Görev silinirken bir hata oluştu.', 'error')
    }
  }

  // Kanban status columns definition
  const columns = [
    { id: TaskStatus.ToDo, name: 'Yapılacak', color: 'border-t-slate-400 bg-slate-50' },
    { id: TaskStatus.InProgress, name: 'Devam Ediyor', color: 'border-t-indigo-500 bg-indigo-50/20' },
    { id: TaskStatus.Done, name: 'Tamamlandı', color: 'border-t-green-500 bg-green-50/20' },
    { id: TaskStatus.Blocked, name: 'Engellendi', color: 'border-t-red-500 bg-red-50/20' },
    { id: TaskStatus.Cancelled, name: 'İptal Edildi', color: 'border-t-slate-300 bg-slate-100/50' },
  ]

  // Priority styling helpers
  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.High:
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">Yüksek</span>
      case TaskPriority.Medium:
        return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-800 ring-1 ring-inset ring-yellow-600/10">Orta</span>
      case TaskPriority.Low:
      default:
        return <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">Düşük</span>
    }
  }

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Toast alert */}
      {alertMsg && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg animate-in fade-in duration-200 ${
          alertMsg.variant === 'success' ? 'bg-slate-900' : 'bg-red-600'
        }`}>
          {alertMsg.message}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Link to="/" className="hover:text-indigo-600 transition flex items-center gap-1">
                  Ana Sayfa
                </Link>
                <span>/</span>
                <Link to={`/workspaces/${workspaceId}`} className="hover:text-indigo-600 transition">
                  {workspace?.name || `Çalışma Alanı ${workspaceId}`}
                </Link>
                <span>/</span>
                <span className="text-slate-900 font-medium">Proje {projectId}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2 mt-1">
                <FolderKanban className="h-8 w-8 text-indigo-600" />
                <span>Proje Panosu</span>
              </h1>
            </div>

            <div>
              <button
                type="button"
                onClick={() => handleOpenCreateModal()}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-200"
              >
                <Plus className="h-4.5 w-4.5" />
                <span>Yeni Görev</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <TaskFilters
          status={filters.status}
          assigneeId={filters.assigneeId}
          q={filters.q}
          members={members}
          onChange={(newFilters) => setFilters(newFilters)}
        />

        {isLoadingTasks ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Spinner className="mx-auto h-8 w-8 text-indigo-600" />
              <p className="mt-2 text-sm text-slate-500">Görevler yükleniyor...</p>
            </div>
          </div>
        ) : isErrorTasks ? (
          <Alert variant="error" className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Görevler yüklenirken bir hata oluştu.</span>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5 items-start">
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.id)

              return (
                <div
                  key={col.id}
                  className={`rounded-2xl border-t-4 ${col.color} p-4 shadow-sm border border-slate-200/60 min-h-[480px] flex flex-col`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-4">
                    <h3 className="font-semibold text-slate-800 text-sm">{col.name}</h3>
                    <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3">
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleOpenEditModal(task)}
                        className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {task.title}
                          </h4>
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50">
                          {getPriorityBadge(task.priority)}

                          {task.dueDate && (
                            <div className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDueDate(task.dueDate)}</span>
                            </div>
                          )}

                          {task.assigneeName ? (
                            <div className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md max-w-[100px] truncate" title={task.assigneeName}>
                              <User className="h-3 w-3 shrink-0" />
                              <span className="truncate">{task.assigneeName}</span>
                            </div>
                          ) : (
                            <div className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md">
                              <User className="h-3 w-3 shrink-0" />
                              <span>Atanmamış</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {colTasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 rounded-xl border border-dashed border-slate-200/80 bg-white/40">
                        <span className="text-xs">Görev yok</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCreateModal()}
                    className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-slate-500 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/10 transition-all duration-200"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Ekle</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Task form modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        onDelete={selectedTask ? handleDeleteTask : undefined}
        initialValues={selectedTask}
        members={members}
        isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
        isDeleting={deleteTaskMutation.isPending}
      />
    </div>
  )
}
