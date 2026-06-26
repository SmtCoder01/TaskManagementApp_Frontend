import type { HTMLAttributes } from 'react'

type SpinnerSize = 'small' | 'medium' | 'large'

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
}

const sizeClasses: Record<SpinnerSize, string> = {
  small: 'w-4 h-4',
  medium: 'w-6 h-6',
  large: 'w-8 h-8',
}


export function Spinner({ size = 'medium', className = '', ...props }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-slate-200 border-t-indigo-900 ${sizeClasses[size]} ${className}`}
      {...props}
    />
  )
}