import { Trash2 } from 'lucide-react'
import { RoleBadge } from './RoleBadge'
import type { WorkspaceMember } from '../types'

interface MembersTableProps {
  members: WorkspaceMember[]
  isAdmin: boolean
  currentUserId?: number
  onRemoveClick: (member: WorkspaceMember) => void
}

export function MembersTable({ members, isAdmin, currentUserId, onRemoveClick }: MembersTableProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-slate-100 text-slate-500 shadow-sm">
        <p className="text-sm font-medium">Bu çalışma alanında henüz üye bulunmuyor.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-600">
          <thead className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4">Ad</th>
              <th scope="col" className="px-6 py-4">Soyad</th>
              <th scope="col" className="px-6 py-4">E-posta</th>
              <th scope="col" className="px-6 py-4">Rol</th>
              {isAdmin && <th scope="col" className="px-6 py-4 text-right">İşlemler</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => {
              const isCurrentUser = member.userId === currentUserId
              const canDelete = isAdmin && !isCurrentUser // Cannot delete self from here (or at least, let owner manage it)

              return (
                <tr
                  key={member.userId}
                  className="group hover:bg-slate-50/50 transition-colors duration-250"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">{member.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{member.lastName}</td>
                  <td className="px-6 py-4 text-slate-600">{member.email}</td>
                  <td className="px-6 py-4">
                    <RoleBadge role={member.role} />
                    {isCurrentUser && (
                      <span className="ml-2 text-xs font-normal text-slate-400">(Siz)</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => onRemoveClick(member)}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200"
                          title="Üyeyi Kaldır"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
