import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, Check, Briefcase } from 'lucide-react'

const mockWorkspaces = [
  { id: 'personal', name: 'Personal Workspace' },
  { id: 'company', name: 'Company Workspace' },
  { id: 'school', name: 'School Workspace' },
]

export function WorkspaceSwitcher() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Find active workspace or default to the first one
  const activeWorkspace = mockWorkspaces.find((w) => w.id === id) || mockWorkspaces[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (workspaceId: string) => {
    setIsOpen(false)
    navigate(`/workspaces/${workspaceId}`)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-sm font-medium text-slate-700 shadow-sm focus:outline-none"
        id="workspace-switcher-button"
      >
        <Briefcase className="h-4 w-4 text-indigo-600" />
        <span className="max-w-[120px] truncate">{activeWorkspace.name}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-56 rounded-lg border border-slate-100 bg-white py-1 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Workspaces
          </div>
          {mockWorkspaces.map((workspace) => {
            const isActive = workspace.id === activeWorkspace.id
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
