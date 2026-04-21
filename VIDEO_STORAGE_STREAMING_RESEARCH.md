# Video storage + private streaming research (for `No-95/hdpedu_8386_xD`)

## Current repo scan (what already exists)

- Existing player: `/components/video-player.tsx` uses native `<video src={lesson.videoUrl}>`
- Lesson model: `/lib/types.ts` has `Lesson.videoUrl: string`
- Classroom page: `/app/classroom/page.tsx` renders `<VideoPlayer lesson={currentLesson} />`
- No existing large-file upload, multipart upload, HLS/DASH, or signed-URL backend for videos

## Recommended GitHub repos/libraries

### 1) Resumable / large uploads

- [`transloadit/uppy`](https://github.com/transloadit/uppy)
  - Mature uploader UI, supports resumable uploads and integrations
- [`tus/tus-js-client`](https://github.com/tus/tus-js-client)
  - Browser resumable upload client (great for unstable networks)
- [`tus/tusd`](https://github.com/tus/tusd)
  - Production-grade resumable upload server (can target S3-compatible storage)

### 2) Private video playback (HLS/DASH)

- [`video-dev/hls.js`](https://github.com/video-dev/hls.js)
  - Best default for HLS playback in browsers
- [`Dash-Industry-Forum/dash.js`](https://github.com/Dash-Industry-Forum/dash.js)
  - MPEG-DASH playback if you need DASH support

### 3) Signed URL patterns / examples

- [`prestonlimlianjie/aws-s3-multipart-presigned-upload`](https://github.com/prestonlimlianjie/aws-s3-multipart-presigned-upload)
  - Practical multipart + presigned S3 upload flow
- [`paschendale/r2-presigned-url`](https://github.com/paschendale/r2-presigned-url)
  - Lightweight R2 presigned URL pattern (AWS SigV4-compatible)

## Official docs (integration references)

- Cloudflare R2 docs: <https://developers.cloudflare.com/r2/>
- Cloudflare R2 signed URLs: <https://developers.cloudflare.com/r2/security/signed-urls/>
- AWS S3 docs: <https://docs.aws.amazon.com/s3/index.html>
- AWS S3 presigned URLs: <https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html>
- tus protocol: <https://tus.io/>

## Integration plan for this repository (minimal-risk path)

1. Keep Convex for metadata/authorization only (not video bytes).
2. Store actual video files in R2 (or S3).
3. Create backend endpoints for:
   - start multipart/resumable upload session
   - return per-part presigned URLs
   - complete multipart upload
   - return short-lived signed playback URL after checking paid access
4. Update classroom player flow to request signed URL before playback, instead of storing permanent public URLs in `Lesson.videoUrl`.
5. Move to HLS when ready (initially private MP4 + signed URLs is simpler and cheap).

## Starter scaffold added in this repo

- `/app/api/videos/playback-url/route.ts`
  - Placeholder route for auth + lesson access checks + signed playback URL generation
- `/lib/video-streaming.ts`
  - Shared types/contracts for signed playback + multipart upload session
  - Client helper `requestSignedPlaybackUrl(lessonId)`

These are intentionally minimal scaffolds so you can plug in R2/S3 signing logic without changing current classroom behavior.
