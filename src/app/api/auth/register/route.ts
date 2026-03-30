import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { signToken, setTokenOnResponse } from "@/lib/auth";
import { sendVerificationEmail } from "@/app/api/auth/verify-email/route";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { email, password, name, role } = body as Record<string, unknown>;

    const errors: Record<string, string> = {};
    if (!email || typeof email !== "string") errors.email = "Email is required";
    if (!password || typeof password !== "string") errors.password = "Password is required";
    if (!name || typeof name !== "string") errors.name = "Name is required";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
    }

    const validRoles: UserRole[] = [UserRole.TENANT, UserRole.LANDLORD, UserRole.AGENT];
    const userRole: UserRole = validRoles.includes(role as UserRole) ? (role as UserRole) : UserRole.TENANT;

    const existing = await prisma.user.findUnique({ where: { email: email as string } });
    if (existing) {
      return NextResponse.json(
        { error: "Validation failed", fields: { email: "Email already registered" } },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password as string, 12);
    const user = await prisma.user.create({
      data: { email: email as string, passwordHash, name: name as string, role: userRole },
    });

    // Send verification email (fire-and-forget)
    sendVerificationEmail(user.id, user.email).catch(err =>
      console.error("Failed to send verification email:", err)
    );

    const token = await signToken({ sub: user.id, email: user.email, role: user.role });
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
    setTokenOnResponse(response, token);
    return response;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
