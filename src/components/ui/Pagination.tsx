import type { HTMLAttributes } from 'react'

interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange, className = '', ...props }: PaginationProps) {
  return (
    <div 
    className={`flex items-center justify-center space-x-2 ${className}`} 
    {...props}
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
      >
        Previous
      </button>

      <span className="text-sm text-slate-700">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}