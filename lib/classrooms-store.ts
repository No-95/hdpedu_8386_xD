export interface ClassroomRoom {
  roomID: string
  name: string
  password: string
  isLive: boolean
  createdAt: number
  participantCount: number
  emptySince: number | null
}

declare global {
  // eslint-disable-next-line no-var
  var __HDP_CLASSROOM_STORE__: ClassroomRoom[] | undefined
}

const DEFAULT_ROOMS: ClassroomRoom[] = []

const FORCED_DELETED_ROOM_IDS = new Set(['hdpedu-live'])

const EMPTY_ROOM_GRACE_MS = 2 * 60 * 1000

function getStore() {
  if (!globalThis.__HDP_CLASSROOM_STORE__) {
    globalThis.__HDP_CLASSROOM_STORE__ = [...DEFAULT_ROOMS]
  }
  pruneEmptyRooms()
  return globalThis.__HDP_CLASSROOM_STORE__
}

function pruneEmptyRooms() {
  if (!globalThis.__HDP_CLASSROOM_STORE__) return
  const now = Date.now()
  globalThis.__HDP_CLASSROOM_STORE__ = globalThis.__HDP_CLASSROOM_STORE__.filter((room) => {
    if (FORCED_DELETED_ROOM_IDS.has(room.roomID)) return false
    if (!room.isLive) return false
    if (room.participantCount > 0) return true
    if (!room.emptySince) return true
    return now - room.emptySince < EMPTY_ROOM_GRACE_MS
  })
}

export function slugifyRoomName(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function listLiveRooms() {
  return getStore()
    .filter((room) => room.isLive)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((room) => ({
      roomID: room.roomID,
      name: room.name,
      createdAt: room.createdAt,
      participantCount: room.participantCount,
    }))
}

export function createRoom(name: string, password: string) {
  const cleanName = name.trim()
  const cleanPassword = password.trim()

  if (!cleanName) {
    throw new Error('Ten lop hoc khong duoc de trong.')
  }
  if (!cleanPassword || cleanPassword.length < 4) {
    throw new Error('Mat khau phai co it nhat 4 ky tu.')
  }

  const baseId = slugifyRoomName(cleanName)
  if (!baseId) {
    throw new Error('Ten lop hoc khong hop le.')
  }

  const store = getStore()
  let roomID = baseId
  let suffix = 1

  while (store.some((room) => room.roomID === roomID)) {
    suffix += 1
    roomID = `${baseId}-${suffix}`
  }

  const room: ClassroomRoom = {
    roomID,
    name: cleanName,
    password: cleanPassword,
    isLive: true,
    createdAt: Date.now(),
    participantCount: 0,
    emptySince: Date.now(),
  }

  store.push(room)
  return { roomID: room.roomID, name: room.name, createdAt: room.createdAt }
}

export function verifyRoomPassword(roomID: string, password: string) {
  const room = getStore().find((item) => item.roomID === roomID && item.isLive)
  if (!room) {
    return { ok: false as const, reason: 'not_found' as const }
  }

  if (room.password !== password.trim()) {
    return { ok: false as const, reason: 'wrong_password' as const }
  }

  return { ok: true as const, room }
}

export function getRoom(roomID: string) {
  return getStore().find((item) => item.roomID === roomID && item.isLive) || null
}

export function joinRoom(roomID: string) {
  const room = getStore().find((item) => item.roomID === roomID && item.isLive)
  if (!room) return null

  room.participantCount += 1
  room.emptySince = null
  return {
    roomID: room.roomID,
    participantCount: room.participantCount,
  }
}

export function leaveRoom(roomID: string) {
  const room = getStore().find((item) => item.roomID === roomID && item.isLive)
  if (!room) return null

  room.participantCount = Math.max(0, room.participantCount - 1)
  if (room.participantCount === 0) {
    room.emptySince = Date.now()
  }

  pruneEmptyRooms()

  return {
    roomID: room.roomID,
    participantCount: room.participantCount,
  }
}
