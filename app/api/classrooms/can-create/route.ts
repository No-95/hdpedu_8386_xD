import { NextRequest, NextResponse } from 'next/server'
import { fetchQuery } from 'convex/nextjs'
import { resolveConvexCloudUrl } from '@/lib/convex-env'
import { api } from '@/convex/_generated/api'

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host')
    const convexUrl = resolveConvexCloudUrl({ host })

    const authEmailCookie = request.cookies.get('auth_session')?.value
    const authEmail = authEmailCookie ? decodeURIComponent(authEmailCookie).trim() : ''

    if (!authEmail) {
      return NextResponse.json({ ok: true, canCreate: false })
    }

    const canCreate = await fetchQuery(
      api.classroomsAuth.canCreateClassroomByEmail,
      { email: authEmail },
      { url: convexUrl },
    )

    return NextResponse.json({ ok: true, canCreate: Boolean(canCreate) })
  } catch {
    return NextResponse.json({ ok: true, canCreate: false })
  }
}
