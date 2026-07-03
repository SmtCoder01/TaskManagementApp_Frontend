import { useEffect, useRef, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useDebouncedValue } from '../../../lib/hooks/useDebouncedValue'
import { useUserSearch } from '../hooks'
import { UserAvatar } from './UserAvatar'
import type { WorkspaceMember } from '../../members/types'
import type { UserOption } from '../types'

interface UserAutocompleteProps {
  id?: string
  label?: string
  value: number | null
  onChange: (userId: number | null) => void
  fallbackMembers?: WorkspaceMember[]
  workspaceId?: number
  disabled?: boolean
  error?: string
  placeholder?: string
}

export function UserAutocomplete({
  id = 'user-autocomplete',
  label = 'Atanan Kişi',
  value,
  onChange,
  fallbackMembers = [],
  workspaceId,
  disabled = false,
  error,
  placeholder = 'Kullanıcı ara...',
}: UserAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)

  const { data: users = [], isFetching } = useUserSearch(
    { search: debouncedQuery, workspaceId, limit: 10 },
    fallbackMembers,
    isOpen || !!value,
  )

  const selectedUser =
    users.find((user) => user.id === value) ??
    fallbackMembers
      .map((member) => ({
        id: member.userId,
        name: member.name,
        lastName: member.lastName,
        email: member.email,
      }))
      .find((user) => user.id === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (user: UserOption) => {
    onChange(user.id)
    setQuery('')
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const displayValue = isOpen ? query : selectedUser ? `${selectedUser.name} ${selectedUser.lastName}` : ''

  return (
    <div className="flex flex-col space-y-1" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="relative flex items-center">
          {selectedUser && !isOpen && (
            <div className="absolute left-2.5 z-10">
              <UserAvatar name={selectedUser.name} lastName={selectedUser.lastName} size="sm" />
            </div>
          )}

          <input
            ref={inputRef}
            id={id}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            disabled={disabled}
            placeholder={selectedUser ? undefined : placeholder}
            value={displayValue}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
              if (value !== null) {
                onChange(null)
              }
            }}
            onFocus={() => setIsOpen(true)}
            className={`w-full rounded-lg border py-2 text-sm transition pr-16 ${
              selectedUser && !isOpen ? 'pl-10' : 'pl-4'
            } ${error ? 'border-red-600 focus:border-red-700 focus:ring-red-700' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'}`}
          />

          <div className="absolute right-2 flex items-center gap-1">
            {value !== null && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded p-0.5 text-slate-400 hover:text-slate-600 transition"
                aria-label="Atamayı temizle"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>

        {isOpen && !disabled && (
          <ul
            id={`${id}-listbox`}
            role="listbox"
            className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {isFetching && users.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-500">Aranıyor...</li>
            )}

            {!isFetching && users.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-500">Kullanıcı bulunamadı</li>
            )}

            {users.map((user) => (
              <li key={user.id} role="option" aria-selected={value === user.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(user)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:bg-indigo-50 ${
                    value === user.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                  }`}
                >
                  <UserAvatar name={user.name} lastName={user.lastName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {user.name} {user.lastName}
                    </p>
                    <p className="truncate text-xs text-slate-400">{user.email}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
