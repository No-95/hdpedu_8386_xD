export type StreamProtocol = "mp4" | "hls" | "dash"

export interface SignedPlaybackResponse {
  protocol: StreamProtocol
  playbackUrl: string
  expiresAt: number
}

export interface MultipartUploadPart {
  partNumber: number
  presignedUrl: string
}

export interface MultipartUploadSession {
  key: string
  uploadId: string
  partSizeBytes: number
  parts: MultipartUploadPart[]
}

/**
 * Starter helper for fetching an authenticated short-lived playback URL.
 * Wire this to Cloudflare R2 or S3 signed URL generation on the server.
 */
export async function requestSignedPlaybackUrl(lessonId: string): Promise<SignedPlaybackResponse> {
  const response = await fetch(`/api/videos/playback-url?lessonId=${encodeURIComponent(lessonId)}`, {
    method: "GET",
    cache: "no-store",
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message || "Failed to load signed playback URL")
  }

  return (await response.json()) as SignedPlaybackResponse
}
