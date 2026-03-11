import { action } from "./_generated/server";
import { v } from "convex/values";

export const notifyRegistration = action({
  args: {
    registrationId: v.id("registrations"),
    name: v.string(),
    phone: v.string(),
    address: v.string(),
    message: v.optional(v.string()),
    sourcePath: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("Email service is not configured. Set RESEND_API_KEY in Convex environment.");
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
        subject: `[HDP EDU] Dang ky sach moi - ${args.name}`,
        text: [
          "Co mot dang ky sach moi:",
          `- ID: ${args.registrationId}`,
          `- Ho ten: ${args.name}`,
          `- So dien thoai: ${args.phone}`,
          `- Dia chi: ${args.address}`,
          `- Ghi chu: ${args.message || "(khong co)"}`,
          `- Nguon: ${args.sourcePath || "/publication/register-form"}`,
        ].join("\n"),
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      throw new Error(`Email send failed: ${resendError}`);
    }

    return { success: true };
  },
});
