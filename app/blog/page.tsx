"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { usePaginatedQuery, useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { PostComposer } from "@/components/blog/post-composer"
import { PostCard } from "@/components/blog/post-card"
import { PostSkeleton, PostSkeletonCompact } from "@/components/blog/post-skeleton"
import { TrendingSidebar, SuggestedSidebar } from "@/components/blog/blog-sidebars"
import { AuthGate } from "@/components/blog/auth-gate"
import { initialPosts, generateMockPosts } from "@/lib/blog-data"
import type { BlogPost, BlogAuthor } from "@/lib/blog-data"
import { useUser } from "@/lib/user-context"
import { useConvexReady } from "@/app/ConvexClientProvider"
import { useAuthToken } from "@convex-dev/auth/react"

/* ── Convert a Convex post document to the BlogPost shape ── */
function convexPostToBlogPost(post: any): BlogPost {
  const author: BlogAuthor = {
    id: post.userId,
    name: post.author?.name || "User",
    username: post.author?.username || "user",
    avatarUrl: post.author?.avatarUrl || "",
    role: (post.author?.role as BlogAuthor["role"]) || "Student",
    bio: post.author?.bio || "",
    subjects: post.author?.subjects || [],
    followers: 0,
  }
  return {
    id: post._id,
    user_id: post.userId,
    content: post.content,
    media_url: post.mediaUrl,
    media_type: post.mediaType || null,
    created_at: new Date(post._creationTime).toISOString(),
    author,
    likes: post.likeCount || 0,
    comments: (post.comments || []).map((comment: any) => ({
      id: comment._id,
      content: comment.content,
      timestamp: new Date(comment._creationTime).toLocaleString(),
      likes: comment.likes || 0,
      author: {
        id: comment.userId,
        name: comment.author?.name || "User",
        username: comment.author?.username || "user",
        avatarUrl: comment.author?.avatarUrl || "",
        role: (comment.author?.role as BlogAuthor["role"]) || "Student",
        bio: comment.author?.bio || "",
        subjects: comment.author?.subjects || [],
        followers: 0,
      },
    })),
    shares: post.shareCount || 0,
    liked: post.liked || false,
  }
}

/* ================================================================
   Convex-Powered Feed (only rendered when Convex backend is live)
   ================================================================ */
function ConvexFeed({
  displayName,
  isAuthenticated,
}: {
  displayName: string
  isAuthenticated: boolean
}) {
  const {
    results: convexPosts,
    status,
    loadMore,
  } = usePaginatedQuery(api.posts.list, {}, { initialNumItems: 10 })

  const createPost = useMutation(api.posts.create)
  const toggleLikeMut = useMutation(api.posts.toggleLike)
  const addCommentMut = useMutation(api.posts.addComment)

  // Require a real Convex JWT — cookie-only sessions must not call mutations
  const authToken = useAuthToken()
  const backendUser = useQuery(api.users.currentUser)
  const hasConvexAuth = !!authToken && backendUser !== null

  const [isPosting, setIsPosting] = useState(false)
  const [feedError, setFeedError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const hasConvexPosts = convexPosts && convexPosts.length > 0
  const posts: BlogPost[] = hasConvexPosts
    ? convexPosts.map((p: any) => convexPostToBlogPost(p))
    : initialPosts

  const handleNewPost = async (data: {
    content: string
    media_url?: string
    media_type?: "image" | "video"
  }) => {
    if (!hasConvexAuth) {
      setFeedError("Your session has expired. Please sign in again.")
      return
    }
    setIsPosting(true)
    setFeedError(null)
    try {
      await createPost({
        content: data.content,
        mediaUrl: data.media_url,
        mediaType: data.media_type,
      })
    } catch (err) {
      console.warn("Failed to create post:", err)
      setFeedError(err instanceof Error ? err.message : "Failed to create post")
    } finally {
      setIsPosting(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!hasConvexAuth) return
    setFeedError(null)
    try {
      await toggleLikeMut({
        postId: postId as any,
      })
    } catch (err) {
      console.warn("Failed to toggle like:", err)
      setFeedError(err instanceof Error ? err.message : "Failed to update like")
    }
  }

  const handleComment = async (postId: string, content: string) => {
    if (!hasConvexAuth) return
    setFeedError(null)
    try {
      await addCommentMut({
        postId: postId as any,
        content,
      })
    } catch (err) {
      console.warn("Failed to add comment:", err)
      setFeedError(err instanceof Error ? err.message : "Failed to add comment")
      throw err
    }
  }

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") loadMore(10)
  }, [status, loadMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) handleLoadMore() },
      { rootMargin: "200px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [handleLoadMore])

  return (
    <>
      {hasConvexAuth && (
        <PostComposer userName={displayName} onPost={handleNewPost} isPosting={isPosting} />
      )}

      <div className="mt-4 space-y-4">
        {backendUser === null && isAuthenticated && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Your login session is out of sync. Please sign out and sign in again to post.
          </div>
        )}

        {feedError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {feedError}
          </div>
        )}

        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} onComment={handleComment} />
        ))}

        {(status === "LoadingMore" || status === "LoadingFirstPage") && (
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeletonCompact />
            <PostSkeleton />
          </div>
        )}

        <div ref={sentinelRef} className="h-px" />
      </div>
    </>
  )
}

/* ================================================================
   Fallback Feed (mock data, no Convex dependency)
   ================================================================ */
function FallbackFeed({
  displayName,
  isAuthenticated,
}: {
  displayName: string
  isAuthenticated: boolean
}) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const handleNewPost = (data: {
    content: string
    media_url?: string
    media_type?: "image" | "video"
  }) => {
    const newPost: BlogPost = {
      id: `local-${Date.now()}`,
      user_id: "self",
      author: {
        id: "self",
        name: displayName,
        username: displayName.toLowerCase().replace(/\s+/g, "."),
        avatarUrl: "",
        role: "Student",
        bio: "Community member",
        subjects: [],
        followers: 0,
      },
      content: data.content,
      media_url: data.media_url,
      media_type: data.media_type || null,
      created_at: new Date().toISOString(),
      likes: 0,
      comments: [],
      shares: 0,
      liked: false,
    }
    setPosts((prev) => [newPost, ...prev])
  }

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    )
  }

  const loadMore = useCallback(() => {
    if (isLoadingMore) return
    setIsLoadingMore(true)
    setTimeout(() => {
      setPosts((prev) => [...prev, ...generateMockPosts(3)])
      setIsLoadingMore(false)
    }, 1200)
  }, [isLoadingMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: "200px" }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <>
      {isAuthenticated && (
        <PostComposer userName={displayName} onPost={handleNewPost} />
      )}

      <div className="mt-4 space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}

        {isLoadingMore && (
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeletonCompact />
            <PostSkeleton />
          </div>
        )}

        <div ref={sentinelRef} className="h-px" />
      </div>
    </>
  )
}

/* ================================================================
   Main Page: Layout + conditional feed
   ================================================================ */
export default function BlogPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useUser()
  const convexReady = useConvexReady()
  const displayName = user.name || user.email?.split("@")[0] || "Guest"
  const isLoading = authLoading

  const showAuthGate = !authLoading && !isAuthenticated

  return (
    <div className="min-h-screen pt-20">
      {/* Light mode background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat light" style={{ backgroundImage: 'url(/bg-course.png)' }} />
      {/* Dark mode background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-fixed bg-center bg-no-repeat hidden dark:block" style={{ backgroundImage: 'url(/dark-mode.png)' }} />
      <div className="relative">
      {/* Page Header */}
      <div className="border-b border-slate-200 light:bg-white dark:bg-[#000814]/90 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-5 lg:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A62A26]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Community Blog</h1>
            <p className="text-sm text-slate-500 dark:text-white/60">Learn, share, and grow with fellow educators and students</p>
          </div>
        </div>
      </div>

      {showAuthGate && <AuthGate />}

      {/* 3-Column Layout */}
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="flex items-start gap-6">
          <aside className="hidden w-56 shrink-0 lg:block">
            <TrendingSidebar />
          </aside>

          <div className="min-w-0 flex-1">
            {!isLoading && convexReady ? (
              <ConvexFeed
                displayName={displayName}
                isAuthenticated={isAuthenticated}
              />
            ) : (
              <FallbackFeed displayName={displayName} isAuthenticated={isAuthenticated} />
            )}
          </div>

          <aside className="hidden w-64 shrink-0 xl:block">
            <SuggestedSidebar />
          </aside>
        </div>

        <div className="mt-6 lg:hidden">
          <TrendingSidebar />
        </div>
      </div>
      </div>
    </div>
  )
}
