import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signToken, setTokenOnResponse } from "@/lib/auth";
import { sendVerificationEmail } from "@/app/api/auth/verify-email/route";
import { getPasswordFailures, isPasswordStrong } from "@/lib/password-policy";
import { checkRateLimit, getClientIp } from "@/lib/rateLimiter";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string().min(2, "Name is required"),
  role: z.enum(["TENANT", "LANDLORD", "AGENT"]).default("TENANT"),
});

export async function POST(request: NextRequest) {
  try {
    const rl = checkRateLimit(getClientIp(request), 'register');
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = registerSchema.safeParse(await request.json());
    if (!body.success) {
      return NextResponse.json(
        { error: "Invalid registration data", details: body.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name, role } = body.data;
    if (!isPasswordStrong(password)) {
      return NextResponse.json(
        { error: "Password does not meet requirements", checklist: getPasswordFailures(password) },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, name, role },
    });

    // Send verification email (fire-and-forget)
    if (process.env.AGENTMAIL_API_KEY) {
      sendVerificationEmail(user.id, user.email).catch((err) =>
        console.error("Failed to send verification email:", err)
      );
    } else {
      console.warn("AGENTMAIL_API_KEY missing — skipping verification email send");
    }

    const token = await signToken({ sub: user.id, email: user.email, role: user.role });
    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    }, { status: 201 });
    setTokenOnResponse(response, token);
    return response;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
