import { useState, useRef, useEffect } from 'react'
import { LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'

export function UserMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  // Helper to extract initials (e.g. "John Doe" -> "JD")
  const getInitials = (name: string) => {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0].substring(0, 2).toUpperCase()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition text-left focus:outline-none"
        id="user-menu-button"
      >
        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          {getInitials(user.name)}
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-semibold text-slate-700 leading-none">{user.name}</span>
          <span className="text-xs text-slate-400 mt-0.5 leading-none">{user.email}</span>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-lg border border-slate-100 bg-white py-1 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="px-3 py-2 border-b border-slate-50 sm:hidden">
            <p className="text-sm font-semibold text-slate-700 leading-none">{user.name}</p>
            <p className="text-xs text-slate-400 mt-1 truncate leading-none">{user.email}</p>
          </div>

          <a
            href="#profile"
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(false)
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            <UserIcon className="h-4 w-4 text-slate-400" />
            <span>Profile</span>
          </a>

          <a
            href="#settings"
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(false)
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </a>

          <div className="border-t border-slate-100 my-1" />

          <button
            onClick={() => {
              setIsOpen(false)
              logout()
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
          >
            <LogOut className="h-4 w-4 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}
