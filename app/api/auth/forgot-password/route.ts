import { apiError, isEmail, readJson } from "@/lib/api";
import { createToken, hashToken, normalizeEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const genericMessage = "If an account exists for that email, a password reset link has been sent.";

async function sendResetEmail(email: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") console.info(`[auth] Password reset for ${email}: ${resetUrl}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Reset your Rubenius password",
      html: `<p>Use the link below to reset your password. It expires in one hour.</p><p><a href="${resetUrl}">Reset password</a></p>`,
    }),
  });
  if (!response.ok) throw new Error("Password reset email could not be sent.");
}

export async function POST(request: Request) {
  const body = await readJson(request);
  const email = typeof body?.email === "string" ? normalizeEmail(body.email) : "";
  if (!isEmail(email)) return apiError("A valid email address is required.", 422);

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (user) {
    const token = createToken();
    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } }),
      prisma.passwordResetToken.create({
        data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
      }),
    ]);
    const resetUrl = new URL(`/reset-password?token=${encodeURIComponent(token)}`, request.url).toString();
    await sendResetEmail(email, resetUrl);
  }

  return Response.json({ success: true, message: genericMessage });
}
