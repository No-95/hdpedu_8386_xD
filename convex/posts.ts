import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

/* ── Helper: enrich posts with author profile + like data ── */
async function enrichPost(
  ctx: { db: Doc<"posts">["_id"] extends never ? never : any },
  post: Doc<"posts">,
  currentUserId: Id<"users"> | null
) {
  // Pull the raw users document for canonical name/avatar
  const user = await ctx.db.get(post.userId);

  // Fetch author profile from profiles table
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", post.userId))
    .unique();

  // Build author object with fallback logic
  // Use displayName from profile, fall back to user.name, then "User"
  const author = profile
    ? {
        name: profile.displayName,
        username: profile.username,
        avatarUrl: profile.avatarUrl || undefined,
        bio: profile.bio || "",
        role: (profile.role || "Student") as string,
        subjects: profile.subjects || [],
      }
    : {
        name: user?.name || "User",
        username: "user",
        avatarUrl: user?.image || undefined,
        bio: "",
        role: "Student",
        subjects: [],
      };

  // Count likes & shares
  const likes = await ctx.db
    .query("postLikes")
    .withIndex("by_post", (q: any) => q.eq("postId", post._id))
    .collect();
  const shares = await ctx.db
    .query("postShares")
    .withIndex("by_post", (q: any) => q.eq("postId", post._id))
    .collect();

  // Determine whether current user has liked
  let liked = false;
  if (currentUserId) {
    const myLike = await ctx.db
      .query("postLikes")
      .withIndex("by_user_post", (q: any) =>
        q.eq("userId", currentUserId).eq("postId", post._id)
      )
      .unique();
    liked = !!myLike;
  }

  return {
    _id: post._id,
    _creationTime: post._creationTime,
    userId: post.userId,
    content: post.content,
    mediaUrl: post.mediaUrl,
    mediaType: post.mediaType,
    author,
    likeCount: likes.length,
    shareCount: shares.length,
    liked,
  };
}

/**
 * List posts (paginated) with author profile and like data.
 * Uses Convex cursor-based pagination for infinite scroll.
 */
export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx).catch(() => null);

    const results = await ctx.db
      .query("posts")
      .order("desc")
      .paginate(args.paginationOpts);

    const enriched = await Promise.all(
      results.page.map((post) => enrichPost(ctx, post, userId))
    );

    return {
      ...results,
      page: enriched,
    };
  },
});

/**
 * Create a new blog post. Requires authentication.
 */
export const create = mutation({
  args: {
    content: v.string(),
    mediaUrl: v.optional(v.string()),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("posts", {
      userId,
      content: args.content,
      mediaUrl: args.mediaUrl,
      mediaType: args.mediaType,
    });
  },
});

/**
 * Toggle like on a post. If already liked, removes the like.
 */
export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("postLikes")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", userId).eq("postId", args.postId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { liked: false };
    }

    await ctx.db.insert("postLikes", {
      postId: args.postId,
      userId,
    });
    return { liked: true };
  },
});

// record a share action and optionally repost to feed
export const sharePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("postShares")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", userId).eq("postId", args.postId)
      )
      .unique();
    if (existing) {
      return { shared: false };
    }
    await ctx.db.insert("postShares", {
      postId: args.postId,
      userId,
    });
    // optionally create a repost entry
    const orig = await ctx.db.get(args.postId);
    if (orig) {
      await ctx.db.insert("posts", {
        userId,
        content: `Shared a post: ${orig.content}`,
        mediaUrl: orig.mediaUrl,
        mediaType: orig.mediaType,
      });
    }
    return { shared: true };
  },
});

/**
 * Add a comment to a post. Requires authentication.
 */
export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Convex auth normally exposes the user id via `getAuthUserId`, but when
    // integrating with third-party providers like Clerk the identity lives on
    // `ctx.auth.getUserIdentity()`.  In either case we need the **_id of the
    // document in the built-in `users` table** so that subsequent lookups of the
    // profile/author work correctly.
    let userId: Id<"users"> | null = null;

    try {
      userId = (await getAuthUserId(ctx)) as Id<"users">;
    } catch {}

    if (!userId) {
      const identity = await ctx.auth.getUserIdentity();
      userId = identity?.userId as Id<"users"> | null;
    }

    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("postComments", {
      postId: args.postId,
      userId,
      content: args.content,
    });
  },
});

/**
 * Get comments for a post with author profiles.
 */
export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx).catch(() => null);

    const comments = await ctx.db
      .query("postComments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const enriched = await Promise.all(
      comments.map(async (comment) => {
        // Pull author document from built-in `users` table
        const user = await ctx.db.get(comment.userId);

        // Fetch author profile from profiles table
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_userId", (q) => q.eq("userId", comment.userId))
          .unique();

        // Count likes on this comment
        const likes = await ctx.db
          .query("commentLikes")
          .withIndex("by_comment", (q) => q.eq("commentId", comment._id))
          .collect();

        // Check if current user liked this comment
        let liked = false;
        if (userId) {
          const myLike = await ctx.db
            .query("commentLikes")
            .withIndex("by_user_comment", (q) =>
              q.eq("userId", userId).eq("commentId", comment._id)
            )
            .unique();
          liked = !!myLike;
        }

        // Build author object with fallback logic
        // Use displayName from profile, fall back to user.name, then "User"
        const author = profile
          ? {
              name: profile.displayName,
              username: profile.username,
              avatarUrl: profile.avatarUrl || undefined,
              bio: profile.bio || "",
              role: (profile.role || "Student") as string,
            }
          : {
              name: user?.name || "User",
              username: "user",
              avatarUrl: user?.image || undefined,
              bio: "",
              role: "Student",
            };

        return {
          _id: comment._id,
          _creationTime: comment._creationTime,
          content: comment.content,
          userId: comment.userId,
          author,
          likes: likes.length,
          liked,
        };
      })
    );

    return enriched;
  },
});

/**
 * Toggle like on a comment.
 */
export const toggleCommentLike = mutation({
  args: { commentId: v.id("postComments") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("commentLikes")
      .withIndex("by_user_comment", (q) =>
        q.eq("userId", userId).eq("commentId", args.commentId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { liked: false };
    }

    await ctx.db.insert("commentLikes", {
      commentId: args.commentId,
      userId,
    });
    return { liked: true };
  },
});
