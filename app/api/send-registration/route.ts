import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { resolveConvexCloudUrl } from "@/lib/convex-env";

export const runtime = "nodejs";

type RegistrationPayload = {
  name?: string;
  phone?: string;
  address?: string;
  message?: string;
  sourcePath?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegistrationPayload;
    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const address = body.address?.trim();
    const message = body.message?.trim() || "(khong co)";
    const sourcePath = body.sourcePath?.trim() || "/publication/register-form";
    const submittedAt = new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(new Date());

    if (!name || !phone || !address) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const convexUrl = resolveConvexCloudUrl({ host: request.headers.get("host") });
    if (!convexUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Convex is not configured. Set NEXT_PUBLIC_CONVEX_URL.",
        },
        { status: 500 }
      );
    }

    const convex = new ConvexHttpClient(convexUrl);
    const registrationId = await convex.mutation(api.registrations.create, {
      name,
      phone,
      address,
      message,
      sourcePath,
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Email service is not configured. Set RESEND_API_KEY.",
        },
        { status: 500 }
      );
    }

    const to = process.env.REGISTRATION_RECEIVER_EMAIL || "minhhoangd852@gmail.com";
    const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `[HDP EDU] Đăng ký mua sách - ${name} - ${submittedAt}`,
        text: [
          "Có một đơn đăng ký sách mới:",
          `- Thời gian: ${submittedAt}`,
          `- ID: ${registrationId}`,
          `- Họ tên: ${name}`,
          `- Số điện thoại: ${phone}`,
          `- Địa chỉ: ${address}`,
          `- Ghi chú: ${message}`,
          `- Nguồn: ${sourcePath}`,
        ].join("\n"),
        html: `
          <h2>Có một đơn đăng ký sách mới</h2>
          <p><strong>ID:</strong> ${registrationId}</p>
          <p><strong>Họ tên:</strong> ${name}</p>
          <p><strong>Số điện thoại:</strong> ${phone}</p>
          <p><strong>Địa chỉ:</strong> ${address}</p>
          <p><strong>Ghi chú:</strong> ${message}</p>
          <p><strong>Nguồn:</strong> ${sourcePath}</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      return NextResponse.json(
        {
          success: false,
          error: `Email send failed: ${resendError}`,
          registrationId,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, registrationId });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to send email.";
    console.error("send-registration API error:", error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
