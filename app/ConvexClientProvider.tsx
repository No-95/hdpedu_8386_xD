"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { resolveConvexCloudUrlForBrowser } from "@/lib/convex-env";

/**
 * Flush stale @convex-dev/auth localStorage tokens.
 *
 * Two-stage cleanup:
 * 1. Remove tokens for ANY namespace that is NOT the current deployment
 *    (covers dev→prod migration: tokens from accomplished-flamingo-285 leaked
 *    into a browser that now talks to adept-tapir-159).
 * 2. One-time forced flush of the current deployment's own tokens (version
 *    sentinel approach). This handles the case where we rotated JWKS /
 *    JWT_PRIVATE_KEY in prod — old tokens signed with the previous key would
 *    fail verification indefinitely. Bump FLUSH_VERSION to invalidate again.
 *
 * Token storage key format (from @convex-dev/auth/react):
 *   `${keyName}_${namespace.replace(/[^a-zA-Z0-9]/g, "")}`
 */
const AUTH_STORAGE_VERSION = "v3"; // bump this whenever cached Convex auth state must be invalidated

function getAuthStorageNamespace(convexUrl: string) {
  return `${convexUrl}::${AUTH_STORAGE_VERSION}`;
}

function flushStaleAuthTokens(currentUrl: string) {
  if (typeof window === "undefined") return;

  const currentNamespace = currentUrl.replace(/[^a-zA-Z0-9]/g, "");
  const currentVersionedNamespace = getAuthStorageNamespace(currentUrl).replace(
    /[^a-zA-Z0-9]/g,
    "",
  );
  const AUTH_PREFIXES = [
    "__convexAuthJWT_",
    "__convexAuthRefreshToken_",
    "__convexAuthOAuthVerifier_",
    "__convexAuthServerStateFetchTime_",
  ];

  // 1. Remove tokens from OTHER deployment namespaces.
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const matchedPrefix = AUTH_PREFIXES.find((p) => key.startsWith(p));
    if (!matchedPrefix) continue;
    const keyNamespace = key.slice(matchedPrefix.length);
    if (
      keyNamespace !== currentNamespace &&
      keyNamespace !== currentVersionedNamespace
    ) {
      keysToRemove.push(key);
    }
  }
  if (keysToRemove.length > 0) {
    console.log("[Convex] Removing tokens from stale deployments:", keysToRemove);
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }

  // 2. One-time forced flush for the current namespace (after JWKS rotation).
  const sentinelKey = `__convexAuthFlushed_${AUTH_STORAGE_VERSION}_${currentNamespace}`;
  if (!localStorage.getItem(sentinelKey)) {
    const ownKeys = AUTH_PREFIXES.map((p) => `${p}${currentNamespace}`);
    const removed = ownKeys.filter((k) => {
      if (localStorage.getItem(k) !== null) {
        localStorage.removeItem(k);
        return true;
      }
      return false;
    });
    if (removed.length > 0) {
      console.log("[Convex] One-time flush of current deployment tokens:", removed);
    }
    localStorage.setItem(sentinelKey, "1");
  }
}

/* ── Contexts ── */
const ConvexReadyContext = createContext<boolean>(false);
const ConvexAuthAvailableContext = createContext<boolean>(false);
const ConvexProbingContext = createContext<boolean>(true);

export const useConvexReady = () => useContext(ConvexReadyContext);
export const useConvexAuthAvailable = () => useContext(ConvexAuthAvailableContext);
export const useConvexProbing = () => useContext(ConvexProbingContext);
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl = resolveConvexCloudUrlForBrowser();
  const authStorageNamespace = convexUrl
    ? getAuthStorageNamespace(convexUrl)
    : undefined;

  // Memoize the client so it's only created once
  const convex = useMemo(() => {
    // Flush any stale auth tokens from other deployments on first render.
    if (convexUrl) {
      flushStaleAuthTokens(convexUrl);
    }
    if (typeof window !== "undefined") {
      console.log("[Convex debug]", {
        host: window.location.host,
        nodeEnv: process.env.NODE_ENV,
        nextPublicConvexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
        resolvedConvexUrl: convexUrl,
        authStorageNamespace,
      });
    }

    if (convexUrl && convexUrl.startsWith("https://")) {
      try {
        return new ConvexReactClient(convexUrl);
      } catch (e) {
        console.error("Convex client initialization failed", e);
        return null;
      }
    }
    return null;
  }, [authStorageNamespace, convexUrl]);

  // Convex-enabled mode.
  if (convex) {
    return (
      <ConvexAuthProvider
        client={convex}
        storageNamespace={authStorageNamespace}
      >
        <ConvexProbingContext value={false}>
          <ConvexAuthAvailableContext value={true}>
            <ConvexReadyContext value={true}>
              {children}
            </ConvexReadyContext>
          </ConvexAuthAvailableContext>
        </ConvexProbingContext>
      </ConvexAuthProvider>
    );
  }

  // No Convex URL/client available.
  return (
    <ConvexProbingContext value={false}>
      <ConvexAuthAvailableContext value={false}>
        <ConvexReadyContext value={false}>
          {children}
        </ConvexReadyContext>
      </ConvexAuthAvailableContext>
    </ConvexProbingContext>
  );
}