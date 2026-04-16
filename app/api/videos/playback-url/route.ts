import { NextRequest, NextResponse } from "next/server"

/**
 * Starter scaffold:
 * - validate authenticated user
 * - look up lesson -> object key from Convex metadata
 * - generate short-lived R2/S3 signed playback URL
 */
export async function GET(request: NextRequest) {
  const authEmail = request.cookies.get("auth_session")?.value
  if (!authEmail) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 },
    )
  }

  const lessonId = request.nextUrl.searchParams.get("lessonId")?.trim()
  if (!lessonId) {
    return NextResponse.json(
      { ok: false, message: "Missing lessonId" },
      { status: 400 },
    )
  }

  return NextResponse.json(
    {
      ok: false,
      message:
        "Not configured yet. Implement R2/S3 signing and lesson permission checks here.",
      lessonId,
    },
    { status: 501 },
  )
}
