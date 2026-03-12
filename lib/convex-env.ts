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

function isLocalHost(host: string | null | undefined) {
  const normalized = normalizeHost(host);
  return normalized === "localhost" || normalized === "127.0.0.1" || normalized === "0.0.0.0";
}

function isHostedProductionRuntime(host: string | null | undefined) {
  return process.env.NODE_ENV === "production" && !isLocalHost(host);
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

  // On deployed production runtimes, always pin to prod Convex.
  if (isHostedProductionRuntime(opts?.host)) {
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
  const fallbackToDev = process.env.NODE_ENV !== "production" && isLocalHost(host);
  return resolveConvexCloudUrl({ host, fallbackToDev });
}

export function resolveConvexSiteUrl() {
  const configured = process.env.CONVEX_SITE_URL ?? process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

  if (isHostedProductionRuntime(null)) {
    return PROD_CONVEX_SITE_URL;
  }

  if (configured && configured.startsWith("https://")) {
    return configured;
  }

  return PROD_CONVEX_SITE_URL;
}
