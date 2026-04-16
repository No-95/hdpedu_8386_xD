# Video player + hosting guide

## Current repository state (investigation)

- A dedicated course video player already exists at:
  - `/home/runner/work/hdpedu_8386_xD/hdpedu_8386_xD/components/video-player.tsx`
- It is used on the classroom page:
  - `/home/runner/work/hdpedu_8386_xD/hdpedu_8386_xD/app/classroom/page.tsx`
- The current lesson video source is `lesson.videoUrl`, defined by course data:
  - `/home/runner/work/hdpedu_8386_xD/hdpedu_8386_xD/lib/types.ts`
  - `/home/runner/work/hdpedu_8386_xD/hdpedu_8386_xD/lib/data.ts`

## New external URL support

The video player now supports external URLs with safer handling:

- Accepts direct `https://` and `http://` URLs.
- Accepts internal relative URLs like `/videos/lesson-1.mp4`.
- Converts GitHub `blob` links to raw file links automatically so they can play directly.
- Shows a clear in-player error if playback fails (for example, host blocks CORS/direct access).
- Supports configuring a demo classroom lesson URL with:

```bash
NEXT_PUBLIC_CLASSROOM_DEMO_VIDEO_URL="https://example-cdn.com/path/to/video.mp4"
```

## Can you host paid videos on GitHub?

For a paid video library (~40GB), GitHub is **not** a good hosting platform:

1. GitHub is built for source/artifact distribution, not private video streaming.
2. Access control is weak for paid streaming use-cases (URLs can leak/share).
3. No proper signed playback flow, DRM, or robust paywall streaming controls.
4. Large video delivery can hit bandwidth/rate limits and inconsistent performance.
5. No adaptive streaming pipeline (HLS/DASH transcoding, bitrate ladder, etc.).

GitHub can be acceptable only for lightweight public demo assets, not paid production video delivery.

## Recommended hosting approaches (paid-only, large videos)

### Recommended baseline

- Keep Convex for metadata, entitlement, and lesson records.
- Store video files in object storage/CDN (Cloudflare R2, S3, GCS, B2).
- Deliver via signed URLs/cookies from your backend edge layer.
- Use HLS or pre-encoded MP4 variants for smoother playback quality.

### If budget is very constrained

- Start with pre-encoded MP4 in object storage + signed short-lived URLs.
- Add HLS/transcoding later when usage grows.

## Practical notes

- External video URLs must be directly fetchable by browsers.
- If the host requires cookies/auth or blocks CORS, native `<video>` playback will fail.
- For paid-only production content, prioritize providers that support private delivery primitives (signed URLs/tokens, geoblocking, analytics, and optional DRM).
