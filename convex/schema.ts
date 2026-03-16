import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  profiles: defineTable({
    userId: v.id("users"),
    displayName: v.string(),
    username: v.string(),
    // Change: Use v.id("_storage") to stop the lag
    avatarUrl: v.optional(v.string()), 
    avatarId: v.optional(v.id("_storage")), 
    bio: v.optional(v.string()),
    role: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    backgroundImage: v.optional(v.string()),
    subjects: v.optional(v.array(v.string())),
  })
    .index("by_userId", ["userId"])
    .index("by_username", ["username"]),

  posts: defineTable({
    userId: v.id("users"),
    content: v.string(),
    // Change: Allowing storage IDs for post images/videos
    mediaId: v.optional(v.id("_storage")),
    mediaUrl: v.optional(v.string()),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
  }).index("by_userId", ["userId"]),

  postLikes: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
  })
    .index("by_post", ["postId"])
    .index("by_user_post", ["userId", "postId"]),

  postComments: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
    content: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"]),

  postShares: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
  })
    .index("by_post", ["postId"])
    .index("by_user_post", ["userId", "postId"]),

  commentLikes: defineTable({
    commentId: v.id("postComments"),
    userId: v.id("users"),
  })
    .index("by_comment", ["commentId"])
    .index("by_user_comment", ["userId", "commentId"]),

  registrations: defineTable({
    name: v.string(),
    phone: v.string(),
    address: v.string(),
    message: v.optional(v.string()),
    sourcePath: v.optional(v.string()),
    submittedAt: v.number(),
  }).index("by_submittedAt", ["submittedAt"]),
});
