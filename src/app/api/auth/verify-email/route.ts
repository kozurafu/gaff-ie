import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest } from "@/lib/auth";

const rawHmacSecret = process.env.JWT_SECRET;
if (!rawHmacSecret) throw new Error("JWT_SECRET env var is required");
const HMAC_SECRET = rawHmacSecret;
const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY;
const FROM_ADDRESS = "mmclaw@agentmail.to";
const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

function requireAgentMailKey(): string {
  if (!AGENTMAIL_API_KEY) {
    throw new Error("AGENTMAIL_API_KEY is not configured");
  }
  return AGENTMAIL_API_KEY;
}

function generateToken(userId: string): string {
  const expiry = Math.floor(Date.now() / 1000) + 86400; // 24h
  const data = `${userId}:${expiry}`;
  const sig = createHmac("sha256", HMAC_SECRET).update(data).digest("hex");
  return Buffer.from(`${data}:${sig}`).toString("base64url");
}

function verifyEmailToken(token: string): { userId: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [userId, expiryStr, sig] = decoded.split(":");
    const expiry = parseInt(expiryStr);
    if (Date.now() / 1000 > expiry) return null;
    const expected = createHmac("sha256", HMAC_SECRET).update(`${userId}:${expiryStr}`).digest("hex");
    if (sig !== expected) return null;
    return { userId };
  } catch {
    return null;
  }
}

export async function sendVerificationEmail(userId: string, email: string) {
  const token = generateToken(userId);
  const url = `${BASE_URL}/api/auth/verify-email?token=${token}`;

  await fetch(`https://api.agentmail.to/v0/inboxes/${FROM_ADDRESS}/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireAgentMailKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: [email],
      subject: "Verify your Gaff.ie email",
      text: `Welcome to Gaff.ie!\n\nClick the link below to verify your email address:\n\n${url}\n\nThis link expires in 24 hours.\n\n— The Gaff.ie Team`,
    }),
  });
}

// POST: Send verification email (authenticated user)
export async function POST(request: NextRequest) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ error: "Already verified" }, { status: 400 });

  await sendVerificationEmail(user.id, user.email);
  return NextResponse.json({ message: "Verification email sent" });
}

// GET: Verify token from email link
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const result = verifyEmailToken(token);
  if (!result) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  await prisma.user.update({
    where: { id: result.userId },
    data: { emailVerified: true },
  });

  // Redirect to dashboard with success
  return NextResponse.redirect(`${BASE_URL}/dashboard/verification?emailVerified=true`);
}
