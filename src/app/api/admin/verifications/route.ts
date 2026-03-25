import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const payload = await getTokenFromRequest(request);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || "PENDING";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where = { status: status as "PENDING" | "VERIFIED" | "REJECTED" };

  const [verifications, total] = await Promise.all([
    prisma.verification.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
      skip,
      take: limit,
    }),
    prisma.verification.count({ where }),
  ]);

  return NextResponse.json({
    verifications,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
