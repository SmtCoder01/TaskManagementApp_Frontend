import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, Check, Briefcase, Loader2 } from 'lucide-react'
import { useWorkspaces } from '../../features/workspaces/hooks'

export function WorkspaceSwitcher() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch workspaces with page=1 and a larger limit to get all workspaces for switching
  const { data, isLoading } = useWorkspaces(1, 50)
  const workspaces = data?.items || []

  // Find active workspace or default to the first one available
  const activeWorkspace = workspaces.find((w) => String(w.id) === id) || workspaces[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (workspaceId: number) => {
    setIsOpen(false)
    navigate(`/workspaces/${workspaceId}`)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-sm font-medium text-slate-700 shadow-sm focus:outline-none disabled:opacity-75"
        id="workspace-switcher-button"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
        ) : (
          <Briefcase className="h-4 w-4 text-indigo-600" />
        )}
        <span className="max-w-[120px] truncate">
          {isLoading ? 'Loading...' : activeWorkspace ? activeWorkspace.name : 'Select Workspace'}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {isOpen && workspaces.length > 0 && (
        <div className="absolute left-0 mt-1.5 w-56 rounded-lg border border-slate-100 bg-white py-1 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Workspaces
          </div>
          {workspaces.map((workspace) => {
            const isActive = activeWorkspace && workspace.id === activeWorkspace.id
            return (
              <button
                key={workspace.id}
                onClick={() => handleSelect(workspace.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50 transition ${
                  isActive ? 'text-indigo-600 font-semibold' : 'text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                  <span className="truncate">{workspace.name}</span>
                </div>
                {isActive && <Check className="h-4 w-4" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
