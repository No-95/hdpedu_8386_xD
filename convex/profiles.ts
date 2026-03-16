import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

/**
 * Helper function to resolve a profile with avatarUrl.
 * Converts avatarId to a URL via ctx.storage.getUrl.
 * This is the single source of truth for profile resolution.
 */
async function resolveProfile(ctx: any, profile: any) {
  let avatarUrl = profile.avatarUrl;
  if (profile.avatarId) {
    const storageUrl = await ctx.storage.getUrl(profile.avatarId);
    if (storageUrl) avatarUrl = storageUrl;
  }

  return {
    _id: profile._id,
    userId: profile.userId,
    displayName: profile.displayName,
    username: profile.username,
    avatarUrl: avatarUrl || null,
    bio: profile.bio || "",
    role: profile.role || null,
    coverImage: profile.coverImage || null,
    backgroundImage: profile.backgroundImage || null,
    subjects: profile.subjects || [],
    _creationTime: profile._creationTime,
  };
}

/**
 * Get a profile by username.
 * Resolves avatarId to a URL via ctx.storage.getUrl.
 */
export const getByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!profile) return null;

    return await resolveProfile(ctx, profile);
  },
});

/**
 * Update a profile by the authenticated user.
 * Verifies that auth.getUserId(ctx) matches the profile's userId.
 * Handles displayName, bio, subjects, avatarId, and backgroundImage.
 * When avatarId is provided, immediately generates and saves the URL.
 */
export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    subjects: v.optional(v.array(v.string())),
    avatarId: v.optional(v.id("_storage")),
    coverImage: v.optional(v.string()),
    backgroundImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the profile for this user
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Verify that the userId matches (security check)
    if (profile.userId !== userId) {
      throw new Error("Unauthorized: cannot edit another user's profile");
    }

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};

    if (args.displayName !== undefined && args.displayName !== "") {
      updateData.displayName = args.displayName;
    }

    if (args.bio !== undefined) {
      updateData.bio = args.bio;
    }

    if (args.subjects !== undefined) {
      // Validate subjects array
      if (!Array.isArray(args.subjects)) {
        throw new Error("Subjects must be an array");
      }
      updateData.subjects = args.subjects;
    }

    if (args.coverImage !== undefined) {
      const isUploadedUrl = /^https?:\/\//.test(args.coverImage);
      if (args.coverImage !== "" && !isUploadedUrl) {
        throw new Error("Invalid cover image path");
      }
      updateData.coverImage = args.coverImage || undefined;
    }

    if (args.backgroundImage !== undefined) {
      const isBuiltIn = args.backgroundImage.startsWith("/profile-bg/");
      if (args.backgroundImage !== "" && !isBuiltIn) {
        throw new Error("Invalid background image path");
      }
      updateData.backgroundImage = args.backgroundImage || undefined;
    }

    // Handle avatar: generate URL immediately and save to avatarUrl field
    if (args.avatarId !== undefined) {
      updateData.avatarId = args.avatarId;
      // Generate and save the avatar URL immediately
      const avatarUrl = await ctx.storage.getUrl(args.avatarId);
      if (avatarUrl) {
        updateData.avatarUrl = avatarUrl;
      }
    }

    // Only proceed with patch if there's something to update
    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields to update");
    }

    // Update the profile - completes before function returns
    await ctx.db.patch(profile._id, updateData);

    // Fetch the updated profile from database
    const updatedProfile = await ctx.db.get(profile._id);
    if (!updatedProfile) {
      throw new Error("Failed to fetch updated profile");
    }

    // Return the fully resolved profile
    return await resolveProfile(ctx, updatedProfile);
  },
});

/**
 * Get current user's profile (for their own dashboard).
 */
export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return null;

    return await resolveProfile(ctx, profile);
  },
});

/**
 * Create or update a profile.
 * Handles the initial profile creation or updates to existing profiles.
 * When avatarId is provided, generates and saves the URL immediately.
 */
export const upsertProfile = mutation({
  args: {
    userId: v.optional(v.id("users")),
    displayName: v.string(),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarId: v.optional(v.id("_storage")),
    avatarUrl: v.optional(v.string()),
    role: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    backgroundImage: v.optional(v.string()),
    subjects: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Determine the authenticated Convex user
    const userId: any = args.userId || (await getAuthUserId(ctx));
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    const username =
      args.username ||
      args.displayName.toLowerCase().replace(/\s+/g, ".") + "-" + userId.slice(0, 4);

    // Resolve avatar URL if avatarId is provided
    let avatarUrl = args.avatarUrl;
    if (args.avatarId) {
      const storageUrl = await ctx.storage.getUrl(args.avatarId);
      if (storageUrl) avatarUrl = storageUrl;
    }

    const profileData = {
      displayName: args.displayName,
      username,
      bio: args.bio,
      avatarId: args.avatarId,
      avatarUrl: avatarUrl,
      ...(args.role && { role: args.role }),
      ...(args.coverImage && { coverImage: args.coverImage }),
      ...(args.backgroundImage && { backgroundImage: args.backgroundImage }),
      ...(args.subjects && { subjects: args.subjects }),
    };

    if (existing) {
      await ctx.db.patch(existing._id, profileData);
      const updatedProfile = await ctx.db.get(existing._id);
      if (!updatedProfile) {
        throw new Error("Failed to fetch updated profile");
      }
      return await resolveProfile(ctx, updatedProfile);
    }

    const newProfileId = await ctx.db.insert("profiles", {
      ...profileData,
      userId,
      subjects: args.subjects || [],
    });

    const newProfile = await ctx.db.get(newProfileId);
    if (!newProfile) {
      throw new Error("Failed to fetch created profile");
    }

    return await resolveProfile(ctx, newProfile);
  },
});
