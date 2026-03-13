import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * Generate a secure URL for uploading files directly to Convex Storage.
 */
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

/**
 * Get the currently authenticated user's profile.
 * Joins with the profiles table to return displayName, username, and avatarUrl.
 * Note: All profile mutations/queries have been moved to convex/profiles.ts.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    let userId = null;
    try {
      userId = await getAuthUserId(ctx);
    } catch (err) {
      console.warn(
        "[users.currentUser] auth verification failed:",
        err instanceof Error ? err.message : String(err)
      );
      return null;
    }

    if (!userId) return null;

    const user = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (profile) {
      // Resolve storageId to a real URL
      let avatarUrl = profile.avatarUrl;
      if (profile.avatarId) {
        const storageUrl = await ctx.storage.getUrl(profile.avatarId);
        if (storageUrl) avatarUrl = storageUrl;
      }

      return {
        _id: profile._id,
        displayName: profile.displayName,
        username: profile.username,
        avatarUrl: avatarUrl || null,
        bio: profile.bio || "",
        email: user?.email ?? null,
      };
    }

    // Return null for displayName so the frontend knows to trigger auto-creation
    return {
      displayName: null,
      email: user?.email ?? null,
    };
  },
});
