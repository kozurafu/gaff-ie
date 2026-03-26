import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

const HMAC_SECRET = process.env.JWT_SECRET || "gaff-production-secret-x7k9m2p4";
const AGENTMAIL_API_KEY = "am_us_bf0131d67e249949523e8d72ba8b4ae5429ae0a44cfceab9f4bf60353a59d6ce";
const FROM_ADDRESS = "mmclaw@agentmail.to";
const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

function generateResetToken(userId: string): string {
  const expiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  const data = `reset:${userId}:${expiry}`;
  const sig = createHmac("sha256", HMAC_SECRET).update(data).digest("hex");
  return Buffer.from(`${data}:${sig}`).toString("base64url");
}

async function sendResetEmail(email: string, token: string) {
  const url = `${BASE_URL}/auth/reset-password?token=${token}`;

  await fetch(`https://api.agentmail.to/v0/inboxes/${FROM_ADDRESS}/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AGENTMAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: [email],
      subject: "Reset your Gaff.ie password",
      text: `Hi,\n\nYou requested a password reset for your Gaff.ie account.\n\nClick the link below to set a new password:\n\n${url}\n\nThis link expires in 1 hour. If you didn't request this, you can safely ignore this email.\n\n— The Gaff.ie Team`,
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If an account with that email exists, we've sent a reset link." });
    }

    const token = generateResetToken(user.id);
    await sendResetEmail(user.email, token);

    return NextResponse.json({ message: "If an account with that email exists, we've sent a reset link." });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
