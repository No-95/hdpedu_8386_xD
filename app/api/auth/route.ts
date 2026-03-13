import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Authentication is handled entirely by @convex-dev/auth via Convex HTTP routes.
    // This Next.js route is not used and must not issue session cookies.
    return NextResponse.json(
      { error: "Use the Convex auth flow at /auth" },
      { status: 404 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Auth API error:", error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
