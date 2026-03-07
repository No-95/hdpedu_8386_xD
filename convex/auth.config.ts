function resolveAuthDomain() {
  const explicit = process.env.CONVEX_SITE_URL ?? process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (explicit) return explicit;

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) return undefined;

  try {
    return new URL(convexUrl).origin;
  } catch {
    return undefined;
  }
}

export default {
  providers: [
    {
      domain: resolveAuthDomain(),
      applicationID: "convex",
    },
  ],
};