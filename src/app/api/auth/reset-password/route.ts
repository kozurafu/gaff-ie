import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const HMAC_SECRET = process.env.JWT_SECRET || "gaff-production-secret-x7k9m2p4";

function verifyResetToken(token: string): { userId: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const parts = decoded.split(":");
    // Format: reset:userId:expiry:sig
    if (parts.length !== 4 || parts[0] !== "reset") return null;
    const [, userId, expiryStr, sig] = parts;
    const expiry = parseInt(expiryStr);
    if (Date.now() / 1000 > expiry) return null;
    const expected = createHmac("sha256", HMAC_SECRET)
      .update(`reset:${userId}:${expiryStr}`)
      .digest("hex");
    if (sig !== expected) return null;
    return { userId };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const result = verifyResetToken(token);
    if (!result) {
      return NextResponse.json({ error: "Invalid or expired reset link. Please request a new one." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: result.userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: result.userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password reset successfully. You can now log in." });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
