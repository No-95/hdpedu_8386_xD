"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Lesson } from "@/lib/types"

interface VideoPlayerProps {
  lesson: Lesson
}

export function VideoPlayer({ lesson }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackError, setPlaybackError] = useState<string | null>(null)

  const videoUrl = useMemo(() => {
    const raw = lesson.videoUrl?.trim()
    if (!raw) return ""

    if (raw.startsWith("/")) {
      return raw
    }

    try {
      const parsed = new URL(raw)
      if (parsed.protocol !== "https:") {
        return ""
      }

      if (parsed.hostname === "github.com" && parsed.pathname.includes("/blob/")) {
        const blobPath = parsed.pathname.split("/blob/")
        if (blobPath.length === 2) {
          return `https://raw.githubusercontent.com${blobPath[0]}/${blobPath[1]}`
        }
      }

      return parsed.toString()
    } catch {
      return ""
    }
  }, [lesson.videoUrl])

  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setPlaybackError(null)
  }, [videoUrl, lesson.id])

  const togglePlay = () => {
    const video = videoRef.current
    if (video) {
      if (isPlaying) {
        setIsPlaying(false)
        video.pause()
      } else {
        void video.play()
          .then(() => {
            setPlaybackError(null)
            setIsPlaying(true)
          })
          .catch((error) => {
            if (error instanceof DOMException && error.name === "NotAllowedError") {
              setIsPlaying(false)
              setPlaybackError("Playback was blocked by the browser. Click play again to start the video.")
              return
            }

            setIsPlaying(false)
            setPlaybackError("Unable to play this video. Please verify the URL and try again.")
          })
      }
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0]
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-xl bg-black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="h-full w-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setPlaybackError("Failed to load video. Please verify the URL is valid and accessible.")
          }}
          crossOrigin="anonymous"
          preload="metadata"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-white/80">
          No video URL configured for this lesson. Set a direct MP4/WebM URL (for example from your object storage or CDN).
        </div>
      )}

      {playbackError && (
        <div className="absolute left-4 right-4 top-4 rounded-md border border-red-300/30 bg-red-900/60 px-3 py-2 text-xs text-red-50">
          {playbackError}
        </div>
      )}

      {/* Video Controls */}
      {videoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4"
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 hover:text-white"
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              {/* Time */}
              <span className="text-sm text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
