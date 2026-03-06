import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, any> = {};

    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      // Handle form data
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        body[key] = value;
      }
    }

    const { email, password, flow, name, redirect_uri } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Missing email or password" },
        { status: 400 }
      );
    }

    // For development, accept the test credentials
    // Email: hoangmaster9@gmail.com, Password: password
    const isValidCredentials = email === "hoangmaster9@gmail.com" && password === "password";

    if (!isValidCredentials) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    //Authentication successful
    const response = NextResponse.json(
      { success: true, redirect: redirect_uri || "/dashboard" },
      { status: 200 }
    );

    // Set a session cookie to indicate the user is logged in
    response.cookies.set({
      name: "auth_session",
      value: email,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Auth API error:", error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
