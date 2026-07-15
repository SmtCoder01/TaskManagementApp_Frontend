import type { Workspace } from '../features/workspaces/types'
import type { Project } from '../features/projects/types'

type RawRecord = Record<string, unknown>

function readString(raw: RawRecord, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = raw[key]
    if (typeof value === 'string') return value
  }
  return undefined
}

function readNumber(raw: RawRecord, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const value = raw[key]
    if (typeof value === 'number') return value
  }
  return undefined
}

export function normalizeWorkspace(raw: RawRecord): Workspace {
  return {
    id: readNumber(raw, 'id') ?? 0,
    name: typeof raw.name === 'string' ? raw.name : '',
    description: typeof raw.description === 'string' ? raw.description : undefined,
    ownerId: readNumber(raw, 'ownerId'),
    memberCount: readNumber(raw, 'memberCount'),
    createdAt: readString(raw, 'createdAt', 'createdDate'),
    updatedAt: readString(raw, 'updatedAt', 'updatedDate'),
  }
}

export function normalizeProject(raw: RawRecord): Project {
  return {
    id: readNumber(raw, 'id') ?? 0,
    name: typeof raw.name === 'string' ? raw.name : '',
    description: typeof raw.description === 'string' ? raw.description : undefined,
    workspaceId: readNumber(raw, 'workspaceId', 'workSpaceId') ?? 0,
    createdAt: readString(raw, 'createdAt', 'createdDate'),
    updatedAt: readString(raw, 'updatedAt', 'updatedDate'),
  }
}
