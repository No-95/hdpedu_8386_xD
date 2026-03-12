const PROD_APP_HOSTS = new Set(["hdpedu.com", "www.hdpedu.com"]);

const PROD_CONVEX_CLOUD_URL = "https://adept-tapir-159.convex.cloud";
const PROD_CONVEX_SITE_URL = "https://adept-tapir-159.convex.site";
const DEV_CONVEX_CLOUD_URL = "https://accomplished-flamingo-285.convex.cloud";

function normalizeHost(host: string | null | undefined) {
  if (!host) return "";
  return host.toLowerCase().split(":")[0].trim();
}

function isProdAppHost(host: string | null | undefined) {
  return PROD_APP_HOSTS.has(normalizeHost(host));
}

export function resolveConvexCloudUrl(opts?: {
  host?: string | null;
  fallbackToDev?: boolean;
}) {
  const configured = process.env.NEXT_PUBLIC_CONVEX_URL;

  // Enforce production Convex when serving the production web domain.
  if (isProdAppHost(opts?.host)) {
    return PROD_CONVEX_CLOUD_URL;
  }

  if (configured && configured.startsWith("https://")) {
    return configured;
  }

  if (opts?.fallbackToDev) {
    return DEV_CONVEX_CLOUD_URL;
  }

  return PROD_CONVEX_CLOUD_URL;
}

export function resolveConvexCloudUrlForBrowser() {
  const host = typeof window !== "undefined" ? window.location.host : null;
  return resolveConvexCloudUrl({ host, fallbackToDev: true });
}

export function resolveConvexSiteUrl() {
  const configured = process.env.CONVEX_SITE_URL ?? process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (configured && configured.startsWith("https://")) {
    return configured;
  }

  return PROD_CONVEX_SITE_URL;
}
