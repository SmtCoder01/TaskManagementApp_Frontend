import { http, HttpResponse } from 'msw'
import type { BaseResponse, PaginationResponse, User } from '../../types/api'

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Ali',
    lastName: 'Yılmaz',
    email: 'ali.yilmaz@example.com',
  },
  {
    id: 2,
    name: 'Ayşe',
    lastName: 'Demir',
    email: 'ayse.demir@example.com',
  },
  {
    id: 3,
    name: 'Mehmet',
    lastName: 'Kaya',
    email: 'mehmet.kaya@example.com',
  },
  {
    id: 4,
    name: 'Zeynep',
    lastName: 'Çelik',
    email: 'zeynep.celik@example.com',
  },
  {
    id: 5,
    name: 'Can',
    lastName: 'Arslan',
    email: 'can.arslan@example.com',
  },
]

function filterUsers(search: string | null, limit: number): User[] {
  const query = search?.trim().toLowerCase() ?? ''

  const filtered = query
    ? mockUsers.filter((user) => {
        const fullName = `${user.name} ${user.lastName}`.toLowerCase()
        return (
          fullName.includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.name.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query)
        )
      })
    : mockUsers

  return filtered.slice(0, limit)
}

export const userHandlers = [
  http.get('*/users', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    const limit = Number(url.searchParams.get('limit') ?? '10')

    const items = filterUsers(search, limit)
    const pageSize = limit || 10

    const payload: BaseResponse<PaginationResponse<User>> = {
      success: true,
      statusCode: 200,
      data: {
        items,
        currentPage: 1,
        pageSize,
        totalPages: 1,
        totalItems: items.length,
        hasNext: false,
        hasPrevious: false,
      },
      error: null,
      fieldErrors: null,
      traceId: null,
      timestamp: new Date().toISOString(),
    }

    return HttpResponse.json(payload)
  }),
]
