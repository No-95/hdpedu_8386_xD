import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const normalBackgrounds = [
  "/profile-bg/normal/calmocean.png",
  "/profile-bg/normal/canva.png",
  "/profile-bg/normal/cherryblossom.png",
  "/profile-bg/normal/forestfog.png",
  "/profile-bg/normal/lightpastelgradient.png",
  "/profile-bg/normal/sea.png",
  "/profile-bg/normal/sky.png",
  "/profile-bg/normal/snowmountain.png",
];

const vipBackgrounds = [
  "/profile-bg/vip/aurorasky.png",
  "/profile-bg/vip/citynight.png",
  "/profile-bg/vip/floatingisland.png",
  "/profile-bg/vip/futurecity.png",
  "/profile-bg/vip/galaxy.png",
  "/profile-bg/vip/milkyway.png",
  "/profile-bg/vip/neon.png",
  "/profile-bg/vip/waterfalljungle.png",
];

export const getAvailableBackgrounds = query({
  args: {},
  handler: async (ctx) => {
    let userId = null;
    try {
      userId = await getAuthUserId(ctx);
    } catch {
      return normalBackgrounds;
    }

    if (!userId) return normalBackgrounds;

    const user = await ctx.db.get(userId);
    const role = String((user as any)?.role || "student").toLowerCase();

    if (role === "expert") {
      return [...normalBackgrounds, ...vipBackgrounds];
    }

    return normalBackgrounds;
  },
});
