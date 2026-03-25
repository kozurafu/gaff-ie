import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const verification = await prisma.verification.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });

  if (!verification) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only owner or admin can view
  if (verification.userId !== payload.sub && payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(verification);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getTokenFromRequest(request);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, reason } = body as { status?: string; reason?: string };

  if (!status || !["VERIFIED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "status must be VERIFIED or REJECTED" }, { status: 400 });
  }

  const verification = await prisma.verification.findUnique({ where: { id } });
  if (!verification) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.verification.update({
    where: { id },
    data: {
      status: status as "VERIFIED" | "REJECTED",
      verifiedAt: status === "VERIFIED" ? new Date() : undefined,
      providerRef: reason
        ? JSON.stringify({ ...JSON.parse(verification.providerRef || "{}"), adminReason: reason })
        : undefined,
    },
  });

  return NextResponse.json(updated);
}
