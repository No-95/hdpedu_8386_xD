"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
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
const AUTH_STORAGE_VERSION = "v4"; // bumped after JWKS fix (was invalid JSON) — forces fresh sign-in

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

type ConvexRuntime = {
  client: unknown;
  AuthProvider: React.ComponentType<{
    client: unknown;
    storageNamespace?: string;
    children: ReactNode;
  }>;
};

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl = resolveConvexCloudUrlForBrowser();
  const authStorageNamespace = convexUrl
    ? getAuthStorageNamespace(convexUrl)
    : undefined;
  const [runtime, setRuntime] = useState<ConvexRuntime | null>(null);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initConvexRuntime() {
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

      if (!convexUrl || !convexUrl.startsWith("https://")) {
        if (!cancelled) {
          setRuntime(null);
          setIsResolved(true);
        }
        return;
      }

      try {
        // Load Convex modules lazily in the browser to keep Worker SSR bundle free of ws/node:https.
        const [{ ConvexReactClient }, { ConvexAuthProvider }] = await Promise.all([
          import("convex/react"),
          import("@convex-dev/auth/react"),
        ]);

        if (cancelled) return;

        const client = new ConvexReactClient(convexUrl);
        setRuntime({
          client,
          AuthProvider: ConvexAuthProvider as ConvexRuntime["AuthProvider"],
        });
      } catch (e) {
        console.error("Convex client initialization failed", e);
        if (!cancelled) {
          setRuntime(null);
        }
      } finally {
        if (!cancelled) {
          setIsResolved(true);
        }
      }
    }

    void initConvexRuntime();

    return () => {
      cancelled = true;
    };
  }, [authStorageNamespace, convexUrl]);

  if (!isResolved) {
    return (
      <ConvexProbingContext value={true}>
        <ConvexAuthAvailableContext value={false}>
          <ConvexReadyContext value={false}>
            <div />
          </ConvexReadyContext>
        </ConvexAuthAvailableContext>
      </ConvexProbingContext>
    );
  }

  // Convex-enabled mode.
  if (runtime) {
    const AuthProvider = runtime.AuthProvider;
    return (
      <AuthProvider
        client={runtime.client}
        storageNamespace={authStorageNamespace}
      >
        <ConvexProbingContext value={false}>
          <ConvexAuthAvailableContext value={true}>
            <ConvexReadyContext value={true}>
              {children}
            </ConvexReadyContext>
          </ConvexAuthAvailableContext>
        </ConvexProbingContext>
      </AuthProvider>
    );
  }

  // No Convex URL/client available.
  return (
    <ConvexProbingContext value={false}>
      <ConvexAuthAvailableContext value={false}>
        <ConvexReadyContext value={false}>
          <div />
        </ConvexReadyContext>
      </ConvexAuthAvailableContext>
    </ConvexProbingContext>
  );
}