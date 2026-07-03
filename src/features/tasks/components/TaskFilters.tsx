import { Search } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { TaskStatus } from '../types'
import type { WorkspaceMember } from '../../members/types'

interface TaskFiltersProps {
  status?: TaskStatus
  assigneeId?: number
  q?: string
  members: WorkspaceMember[]
  onChange: (filters: { status?: TaskStatus; assigneeId?: number; q?: string }) => void
}

export function TaskFilters({ status, assigneeId, q = '', members, onChange }: TaskFiltersProps) {
  const statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: String(TaskStatus.ToDo), label: 'Yapılacak' },
    { value: String(TaskStatus.InProgress), label: 'Devam Ediyor' },
    { value: String(TaskStatus.Done), label: 'Tamamlandı' },
    { value: String(TaskStatus.Blocked), label: 'Engellendi' },
    { value: String(TaskStatus.Cancelled), label: 'İptal Edildi' },
  ]

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    onChange({
      status: val !== '' ? (Number(val) as TaskStatus) : undefined,
      assigneeId,
      q,
    })
  }

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    onChange({
      status,
      assigneeId: val !== '' ? Number(val) : undefined,
      q,
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      status,
      assigneeId,
      q: e.target.value,
    })
  }

  const handleClearFilters = () => {
    onChange({
      status: undefined,
      assigneeId: undefined,
      q: '',
    })
  }

  const hasActiveFilters = status !== undefined || assigneeId !== undefined || q !== ''

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm mb-6">
      <div className="flex-1">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">Arama</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            id="task-search"
            type="text"
            placeholder="Görevlerde ara..."
            value={q}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
      </div>

      <div className="w-full md:w-56">
        <Select
          id="task-status-filter"
          label="Durum"
          value={status === undefined ? '' : String(status)}
          onChange={handleStatusChange}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="w-full md:w-56">
        <Select
          id="task-assignee-filter"
          label="Atanan"
          value={assigneeId === undefined ? '' : String(assigneeId)}
          onChange={handleAssigneeChange}
        >
          <option value="">Herkes</option>
          {members.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.name} {m.lastName}
            </option>
          ))}
        </Select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClearFilters}
          className="h-10 text-sm font-medium text-slate-600 hover:text-indigo-600 px-4 transition-colors shrink-0"
        >
          Temizle
        </button>
      )}
    </div>
  )
}
