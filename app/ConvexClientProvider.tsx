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

/* ── Contexts ── */
const ConvexReadyContext = createContext<boolean>(false);
const ConvexAuthAvailableContext = createContext<boolean>(false);
const ConvexProbingContext = createContext<boolean>(true);

export const useConvexReady = () => useContext(ConvexReadyContext);
export const useConvexAuthAvailable = () => useContext(ConvexAuthAvailableContext);
export const useConvexProbing = () => useContext(ConvexProbingContext);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Memoize the client so it's only created once
  const convex = useMemo(() => {
    const convexUrl = resolveConvexCloudUrlForBrowser();
    if (convexUrl && convexUrl.startsWith("https://")) {
      try {
        return new ConvexReactClient(convexUrl);
      } catch (e) {
        console.error("Convex client initialization failed", e);
        return null;
      }
    }
    return null;
  }, []);

  // Convex-enabled mode.
  if (convex) {
    return (
      <ConvexAuthProvider client={convex}>
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