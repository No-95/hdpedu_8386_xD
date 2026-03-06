"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";

/* ── Contexts ── */
const ConvexReadyContext = createContext<boolean>(false);
const ConvexAuthAvailableContext = createContext<boolean>(false);
const ConvexProbingContext = createContext<boolean>(true);

export const useConvexReady = () => useContext(ConvexReadyContext);
export const useConvexAuthAvailable = () => useContext(ConvexAuthAvailableContext);
export const useConvexProbing = () => useContext(ConvexProbingContext);

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Default to development mode, confirm on client side
  const [isDevMode, setIsDevMode] = useState(true);

  // Memoize the client so it's only created once
  const convex = useMemo(() => {
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

  // Confirm development status after mounting
  useEffect(() => {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    setIsDevMode(isLocalhost);
  }, []);

  // In development mode (localhost), always show app as ready
  if (isDevMode) {
    if (convex) {
      return (
        <ConvexProvider client={convex}>
          <ConvexProbingContext value={false}>
            <ConvexAuthAvailableContext value={false}>
              <ConvexReadyContext value={true}>
                {children}
              </ConvexReadyContext>
            </ConvexAuthAvailableContext>
          </ConvexProbingContext>
        </ConvexProvider>
      );
    } else {
      // No convex URL, but in development - still show app as ready
      return (
        <ConvexProbingContext value={false}>
          <ConvexAuthAvailableContext value={false}>
            <ConvexReadyContext value={true}>
              {children}
            </ConvexReadyContext>
          </ConvexAuthAvailableContext>
        </ConvexProbingContext>
      );
    }
  }

  // Production mode: show normal provider
  if (convex) {
    return (
      <ConvexProvider client={convex}>
        <ConvexProbingContext value={false}>
          <ConvexAuthAvailableContext value={false}>
            <ConvexReadyContext value={true}>
              {children}
            </ConvexReadyContext>
          </ConvexAuthAvailableContext>
        </ConvexProbingContext>
      </ConvexProvider>
    );
  }

  // Offline mode
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