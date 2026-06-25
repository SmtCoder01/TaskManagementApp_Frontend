import type { HTMLAttributes } from 'react'

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
}

export function Badge({ variant = 'primary', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}