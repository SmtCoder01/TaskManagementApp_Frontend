import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative flex flex-col w-full max-w-xs bg-slate-900 animate-in slide-in-from-left duration-200">
        {/* Close Button Inside Drawer */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white transition focus:outline-none"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <Sidebar onItemClick={onClose} />
      </div>
    </div>
  )
}
