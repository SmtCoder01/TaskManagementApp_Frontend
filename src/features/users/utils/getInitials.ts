export function getInitials(name: string, lastName?: string): string {
  if (lastName) {
    const first = name.trim()[0] ?? ''
    const last = lastName.trim()[0] ?? ''
    if (first || last) return `${first}${last}`.toUpperCase()
  }

  if (!name) return 'U'

  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return parts[0].substring(0, 2).toUpperCase()
}
