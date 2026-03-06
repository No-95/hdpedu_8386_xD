import { mutation, action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Simple authentication handler that just validates credentials exist
 * The actual session management will be handled by Convex Auth's HTTP routes
 */
export const handleLogin = action({
  args: {
    email: v.string(),
    password: v.string(),
    isSignUp: v.boolean(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // For now, always return success to allow testing
    // In production, you'd validate credentials here
    if (!args.email || !args.password) {
      return { success: false, error: "Missing credentials" };
    }

    // Return success and let the HTTP routes handle session creation
    return {
      success: true,
      message: "Authentication in progress",
    };
  },
});
