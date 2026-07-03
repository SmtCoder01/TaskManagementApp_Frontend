import { getInitials } from '../utils/getInitials'

interface UserAvatarProps {
  name: string
  lastName?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
}

export function UserAvatar({ name, lastName, size = 'md', className = '' }: UserAvatarProps) {
  const initials = getInitials(name, lastName)

  return (
    <div
      className={`rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold shrink-0 shadow-sm ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}
