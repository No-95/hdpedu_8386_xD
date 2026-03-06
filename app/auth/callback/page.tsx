"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if authentication was successful
    const error = searchParams.get("error");
    const code = searchParams.get("code");

    if (error) {
      // Authentication failed
      router.push(`/auth?error=${encodeURIComponent(error)}`);
    } else if (code || searchParams.get("sessionId")) {
      // Authentication successful - redirect to dashboard
      router.push("/dashboard");
    } else {
      // Unexpected state - redirect to auth
      router.push("/auth");
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p className="text-gray-600">Please wait while we verify your credentials.</p>
      </div>
    </div>
  );
}
