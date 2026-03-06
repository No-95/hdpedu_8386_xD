"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, ChevronDown, Send, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthorHoverCard } from "./author-hover-card"
import type { BlogPost, BlogComment } from "@/lib/blog-data"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

interface PostCardProps {
  post: BlogPost
  onLike: (postId: string) => void
}

function getInitials(name: string | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const roleColors: Record<string, string> = {
  Educator: "bg-amber-100 text-amber-700 border-amber-200",
  Student: "bg-sky-100 text-sky-700 border-sky-200",
  Admin: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

/* ─── Comment Row ─── */
function CommentRow({ comment }: { comment: BlogComment }) {
  const [liked, setLiked] = useState(false)
  const likeCount = liked ? comment.likes + 1 : comment.likes

  return (
    <div className="flex gap-2.5">
      <AuthorHoverCard author={comment.author}>
        <Link href={`/u/${comment.author.username}`} className="shrink-0">
          <Avatar className="h-7 w-7">
            {comment.author.avatarUrl ? (
              <AvatarImage
                src={comment.author.avatarUrl}
                alt={comment.author.name || ""}
              />
            ) : (
              <AvatarFallback className="bg-slate-200 text-[10px] font-semibold text-slate-600">
                {comment.author.name ? comment.author.name[0].toUpperCase() : "?"}
              </AvatarFallback>
            )}
          </Avatar>
        </Link>
      </AuthorHoverCard>
      <div className="min-w-0 flex-1">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <AuthorHoverCard author={comment.author}>
              <Link
                href={`/u/${comment.author.username}`}
                className="text-xs font-semibold text-slate-900 hover:underline"
              >
                {comment.author.name}
              </Link>
            </AuthorHoverCard>
            {comment.author.role === "Educator" && (
              <span
                className={`rounded-full border px-1.5 py-px text-[9px] font-medium ${roleColors[comment.author.role]}`}
              >
                {comment.author.role}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
            {comment.content}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-3 px-1">
          <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
          <button
            type="button"
            onClick={() => setLiked(!liked)}
            className={cn(
              "text-[10px] font-medium transition-colors",
              liked ? "text-rose-500" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {"Like"}{likeCount > 0 ? ` (${likeCount})` : ""}
          </button>
          <button
            type="button"
            className="text-[10px] font-medium text-slate-400 hover:text-slate-600"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Post Card ─── */
export function PostCard({ post, onLike }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [shareCount, setShareCount] = useState(post.shares)

  // Only fetch comments if postId is a valid database ID (not a local mock ID)
  const isValidDatabaseId = post.id && !post.id.startsWith("local-") && !post.id.startsWith("local_")
  const commentsQuery = useQuery(
    api.posts.getComments,
    post.id.startsWith("local") ? "skip" : { postId: post.id as any }
  ) || []
  const [comments, setComments] = useState<BlogComment[]>([])
  const addCommentMut = useMutation(api.posts.addComment)
  const shareMut = useMutation(api.posts.sharePost)

  // keep local state in sync with query results
  useEffect(() => {
    if (commentsQuery && commentsQuery.length > 0) {
      const converted = commentsQuery.map((c: any) => ({
        id: c._id,
        author: c.author,
        content: c.content,
        timestamp: new Date(c._creationTime).toLocaleString(),
        likes: c.likes,
      }))
      setComments(converted)
    } else {
      setComments([])
    }
  }, [commentsQuery])

  const handleLike = () => onLike(post.id)

  return (
    <Card className="border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        {/* ── Header ── */}
        <div className="flex items-start gap-3 p-4 pb-0">
          <AuthorHoverCard author={post.author}>
            <Link href={`/u/${post.author.username}`} className="shrink-0">
              <Avatar className="h-10 w-10 border-2 border-slate-100 transition-transform hover:scale-105">
                {post.author.avatarUrl ? (
                  <AvatarImage
                    src={post.author.avatarUrl}
                    alt={post.author.name || ""}
                  />
                ) : (
                  <AvatarFallback className="bg-[#A62A26] text-sm font-semibold text-white">
                    {getInitials(post.author.name)}
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>
          </AuthorHoverCard>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <AuthorHoverCard author={post.author}>
                <Link
                  href={`/u/${post.author.username}`}
                  className="text-sm font-semibold text-slate-900 hover:underline"
                >
                  {post.author.name}
                </Link>
              </AuthorHoverCard>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${roleColors[post.author.role]}`}
              >
                {post.author.role}
              </span>
            </div>
            <p className="text-xs text-slate-400">{formatTime(post.created_at)}</p>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-4 pt-3 pb-2">
          <p className="whitespace-pre-line text-base leading-7 text-slate-700">
            {post.content}
          </p>
        </div>

        {/* ── Media ── */}
        {post.media_url && post.media_type === "image" && (
          <div className="mt-2 px-4">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
              <Image src={post.media_url} alt="Post image" fill className="object-cover" />
            </div>
          </div>
        )}
        {post.media_url && post.media_type === "video" && (
          <div className="mt-2 px-4">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-slate-900">
              <div className="text-center">
                <Video className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-2 max-w-[280px] truncate px-4 text-xs text-slate-400">
                  {post.media_url}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Stats Row ── */}
        <div className="mx-4 mt-3 flex items-center justify-between border-b border-slate-100 pb-2 text-xs text-slate-400">
          <span>{post.likes > 0 && `${post.likes} likes`}</span>
          <div className="flex gap-3">
            {comments.length > 0 && <span>{comments.length} comments</span>}
            {shareCount > 0 && <span>{shareCount} shares</span>}
          </div>
        </div>

        {/* ── Action Bar ── */}
        <div className="flex items-center gap-1 px-2 py-1">
          <button
            type="button"
            onClick={handleLike}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors",
              post.liked
                ? "text-rose-500"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            )}
          >
            <Heart className={cn("h-[18px] w-[18px]", post.liked && "fill-rose-500")} />
            <span className="hidden sm:inline">Like</span>
          </button>
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
          >
            <MessageCircle className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">Comment</span>
          </button>
          <div className="relative flex flex-1">
            <button
              type="button"
              onClick={() => setShowShareOptions((v) => !v)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
            >
              <Share2 className="h-[18px] w-[18px]" />
              <span className="hidden sm:inline">Share</span>
            </button>
            {showShareOptions && (
              <div className="absolute bottom-full mb-2 right-0 w-48 bg-white rounded-lg shadow-lg ring-1 ring-slate-200">
                <button
                  onClick={async () => {
                    if (!isValidDatabaseId) {
                      alert("Cannot share local draft posts. Please save to publish.");
                      return;
                    }
                    const result = await shareMut({ postId: post.id as any });
                    if (result?.shared) setShareCount((c) => c + 1);
                    setShowShareOptions(false);
                    alert("Post shared to your profile.");
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Share to profile
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/blog#${post.id}`;
                    navigator.clipboard.writeText(url);
                    setShowShareOptions(false);
                    alert("Link copied to clipboard");
                    if (isValidDatabaseId) {
                      shareMut({ postId: post.id as any }).then((res) => {
                        if (res?.shared) setShareCount((c) => c + 1);
                      });
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Copy link
                </button>
                <div className="border-t border-slate-100" />
                <button
                  onClick={() => {
                    const url = encodeURIComponent(`${window.location.origin}/blog#${post.id}`);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
                    setShowShareOptions(false);
                    if (isValidDatabaseId) {
                      shareMut({ postId: post.id as any }).then((res) => {
                        if (res?.shared) setShareCount((c) => c + 1);
                      });
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Facebook
                </button>
                <button
                  onClick={() => {
                    const url = encodeURIComponent(`${window.location.origin}/blog#${post.id}`);
                    window.open(`fb-messenger://share?link=${url}`, "_blank");
                    setShowShareOptions(false);
                    if (isValidDatabaseId) {
                      shareMut({ postId: post.id as any }).then((res) => {
                        if (res?.shared) setShareCount((c) => c + 1);
                      });
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Messenger
                </button>
                <button
                  onClick={() => {
                    const url = encodeURIComponent(`${window.location.origin}/blog#${post.id}`);
                    window.open(`https://zalo.me/share?url=${url}`, "_blank");
                    setShowShareOptions(false);
                    if (isValidDatabaseId) {
                      shareMut({ postId: post.id as any }).then((res) => {
                        if (res?.shared) setShareCount((c) => c + 1);
                      });
                    }
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Zalo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Comments Section ── */}
        {showComments && (
          <div className="border-t border-slate-100 px-4 py-3">
            {comments.length > 2 && (
              <button
                type="button"
                className="mb-3 flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600"
              >
                <ChevronDown className="h-3 w-3" />
                {"View all"} {comments.length} {"comments"}
              </button>
            )}

            <div className="space-y-3">
              {comments.map((c, idx) => (
                <CommentRow key={c.id || idx} comment={c} />
              ))}
            </div>

            {/* Quick Reply */}
            <div className="mt-3 flex items-center gap-2">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-[#A62A26] text-[10px] font-semibold text-white">
                  Y
                </AvatarFallback>
              </Avatar>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!replyText.trim()) return;
                  if (!isValidDatabaseId) {
                    alert("Cannot add comments to local draft posts. Please save to publish.");
                    return;
                  }
                  try {
                    const result: any = await addCommentMut({ postId: post.id as any, content: replyText.trim() });
                    if (result) {
                      // convert to BlogComment
                      const newC: BlogComment = {
                        id: result._id || `c-${Date.now()}`,
                        author: result.author || post.author,
                        content: result.content,
                        timestamp: new Date(result._creationTime).toLocaleString(),
                        likes: 0,
                      };
                      setComments((prev) => [...prev, newC]);
                    }
                  } catch (err) {
                    console.warn("Failed to add comment", err);
                  }
                  setReplyText("");
                }}
                className="relative min-w-0 flex-1"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-4 pr-10 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#A62A26]/30 focus:ring-2 focus:ring-[#A62A26]/10"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:text-[#A62A26] disabled:text-slate-200"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
