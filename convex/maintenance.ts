import { mutation } from "./_generated/server";
import { v } from "convex/values";

type AnyDoc = {
  _id: string;
  _creationTime: number;
  [key: string]: any;
};

export const cleanupLegacyAuthAndBlogData = mutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const dryRun = args.dryRun ?? true;

    const users = (await ctx.db.query("users").collect()) as AnyDoc[];
    const profiles = (await ctx.db.query("profiles").collect()) as AnyDoc[];
    const posts = (await ctx.db.query("posts").collect()) as AnyDoc[];
    const postLikes = (await ctx.db.query("postLikes").collect()) as AnyDoc[];
    const postShares = (await ctx.db.query("postShares").collect()) as AnyDoc[];
    const postComments = (await ctx.db.query("postComments").collect()) as AnyDoc[];
    const commentLikes = (await ctx.db.query("commentLikes").collect()) as AnyDoc[];

    const userIds = new Set(users.map((u) => String(u._id)));
    const postIds = new Set(posts.map((p) => String(p._id)));
    const commentIds = new Set(postComments.map((c) => String(c._id)));

    // Suspicious users are legacy rows that do not contain Convex Auth token identity.
    const malformedUsers = users.filter((u) => !u.tokenIdentifier);
    const malformedUserIds = new Set(malformedUsers.map((u) => String(u._id)));

    // Keep the oldest profile per userId and mark later duplicates for deletion.
    const duplicateProfilesToDelete: string[] = [];
    const profilesByUserId = new Map<string, AnyDoc[]>();
    for (const profile of profiles) {
      const key = String(profile.userId);
      const list = profilesByUserId.get(key) ?? [];
      list.push(profile);
      profilesByUserId.set(key, list);
    }
    for (const list of profilesByUserId.values()) {
      if (list.length <= 1) continue;
      list.sort((a, b) => a._creationTime - b._creationTime);
      for (const extra of list.slice(1)) duplicateProfilesToDelete.push(String(extra._id));
    }

    const orphanPosts = posts.filter((p) => !userIds.has(String(p.userId)));
    const orphanPostLikes = postLikes.filter(
      (l) => !userIds.has(String(l.userId)) || !postIds.has(String(l.postId))
    );
    const orphanPostShares = postShares.filter(
      (s) => !userIds.has(String(s.userId)) || !postIds.has(String(s.postId))
    );
    const orphanPostComments = postComments.filter(
      (c) => !userIds.has(String(c.userId)) || !postIds.has(String(c.postId))
    );
    const orphanCommentLikes = commentLikes.filter(
      (cl) => !userIds.has(String(cl.userId)) || !commentIds.has(String(cl.commentId))
    );

    // Data linked to malformed users should be removed so auth-managed data remains clean.
    const malformedUserPosts = posts.filter((p) => malformedUserIds.has(String(p.userId)));
    const malformedUserPostIds = new Set(malformedUserPosts.map((p) => String(p._id)));
    const malformedUserComments = postComments.filter(
      (c) => malformedUserIds.has(String(c.userId)) || malformedUserPostIds.has(String(c.postId))
    );
    const malformedUserCommentIds = new Set(malformedUserComments.map((c) => String(c._id)));
    const malformedUserLikes = postLikes.filter(
      (l) => malformedUserIds.has(String(l.userId)) || malformedUserPostIds.has(String(l.postId))
    );
    const malformedUserShares = postShares.filter(
      (s) => malformedUserIds.has(String(s.userId)) || malformedUserPostIds.has(String(s.postId))
    );
    const malformedUserCommentLikes = commentLikes.filter(
      (cl) =>
        malformedUserIds.has(String(cl.userId)) ||
        malformedUserCommentIds.has(String(cl.commentId))
    );
    const malformedUserProfiles = profiles.filter((p) => malformedUserIds.has(String(p.userId)));

    const summary = {
      dryRun,
      totals: {
        users: users.length,
        profiles: profiles.length,
        posts: posts.length,
        postLikes: postLikes.length,
        postShares: postShares.length,
        postComments: postComments.length,
        commentLikes: commentLikes.length,
      },
      candidates: {
        malformedUsers: malformedUsers.length,
        duplicateProfiles: duplicateProfilesToDelete.length,
        orphanPosts: orphanPosts.length,
        orphanPostLikes: orphanPostLikes.length,
        orphanPostShares: orphanPostShares.length,
        orphanPostComments: orphanPostComments.length,
        orphanCommentLikes: orphanCommentLikes.length,
        malformedUserProfiles: malformedUserProfiles.length,
        malformedUserPosts: malformedUserPosts.length,
        malformedUserLikes: malformedUserLikes.length,
        malformedUserShares: malformedUserShares.length,
        malformedUserComments: malformedUserComments.length,
        malformedUserCommentLikes: malformedUserCommentLikes.length,
      },
      sampleMalformedUserIds: malformedUsers.slice(0, 10).map((u) => String(u._id)),
    };

    if (dryRun) return summary;

    const deleted = {
      duplicateProfiles: 0,
      orphanPosts: 0,
      orphanPostLikes: 0,
      orphanPostShares: 0,
      orphanPostComments: 0,
      orphanCommentLikes: 0,
      malformedUserProfiles: 0,
      malformedUserPosts: 0,
      malformedUserLikes: 0,
      malformedUserShares: 0,
      malformedUserComments: 0,
      malformedUserCommentLikes: 0,
      malformedUsers: 0,
    };

    const deletedIds = new Set<string>();
    const deleteOnce = async (id: string) => {
      if (deletedIds.has(id)) return false;
      await ctx.db.delete(id as any);
      deletedIds.add(id);
      return true;
    };

    // Delete child/edge records first to satisfy reference consistency.
    for (const doc of orphanCommentLikes) {
      if (await deleteOnce(String(doc._id))) deleted.orphanCommentLikes++;
    }
    for (const doc of orphanPostLikes) {
      if (await deleteOnce(String(doc._id))) deleted.orphanPostLikes++;
    }
    for (const doc of orphanPostShares) {
      if (await deleteOnce(String(doc._id))) deleted.orphanPostShares++;
    }
    for (const doc of orphanPostComments) {
      if (await deleteOnce(String(doc._id))) deleted.orphanPostComments++;
    }
    for (const doc of orphanPosts) {
      if (await deleteOnce(String(doc._id))) deleted.orphanPosts++;
    }

    for (const id of duplicateProfilesToDelete) {
      if (await deleteOnce(id)) deleted.duplicateProfiles++;
    }

    for (const doc of malformedUserCommentLikes) {
      if (await deleteOnce(String(doc._id))) deleted.malformedUserCommentLikes++;
    }
    for (const doc of malformedUserLikes) {
      if (await deleteOnce(String(doc._id))) deleted.malformedUserLikes++;
    }
    for (const doc of malformedUserShares) {
      if (await deleteOnce(String(doc._id))) deleted.malformedUserShares++;
    }
    for (const doc of malformedUserComments) {
      if (await deleteOnce(String(doc._id))) deleted.malformedUserComments++;
    }
    for (const doc of malformedUserPosts) {
      if (await deleteOnce(String(doc._id))) deleted.malformedUserPosts++;
    }
    for (const doc of malformedUserProfiles) {
      if (await deleteOnce(String(doc._id))) deleted.malformedUserProfiles++;
    }
    for (const doc of malformedUsers) {
      if (await deleteOnce(String(doc._id))) deleted.malformedUsers++;
    }

    return {
      ...summary,
      deleted,
    };
  },
});
