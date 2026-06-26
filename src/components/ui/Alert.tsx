import type { HTMLAttributes } from 'react'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

const variantClasses: Record<AlertVariant, string> = {
  success: 'bg-green-100 border border-green-300 text-green-800',
  error: 'bg-red-100 border border-red-300 text-red-800',
  warning: 'bg-yellow-100 border border-yellow-300 text-yellow-800',
  info: 'bg-blue-100 border border-blue-300 text-blue-800',
}

export function Alert({ variant = 'info', className = '', children, ...props }: AlertProps) {
  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm ${variantClasses[variant]} ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </div>
  )
}