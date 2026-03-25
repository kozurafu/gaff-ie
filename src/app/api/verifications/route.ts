import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const verifications = await prisma.verification.findMany({
    where: { userId: payload.sub },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(verifications);
}

export async function POST(request: NextRequest) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { type, data } = body as { type: string; data: Record<string, unknown> };

  const validTypes = ["ID", "PROPERTY", "EMPLOYMENT", "STUDENT"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid verification type" }, { status: 400 });
  }

  // Check for existing active verification of this type
  const existing = await prisma.verification.findFirst({
    where: {
      userId: payload.sub,
      type: type as "ID" | "PROPERTY" | "EMPLOYMENT" | "STUDENT",
      status: { in: ["PENDING", "VERIFIED"] },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: `You already have an active ${type} verification (${existing.status})` },
      { status: 409 }
    );
  }

  // Validate data based on type
  if (type === "ID") {
    const { fullName, dateOfBirth, documentType } = data as { fullName?: string; dateOfBirth?: string; documentType?: string };
    if (!fullName || !dateOfBirth || !documentType) {
      return NextResponse.json({ error: "fullName, dateOfBirth, and documentType are required" }, { status: 400 });
    }
    if (!["passport", "driving_licence", "national_id"].includes(documentType)) {
      return NextResponse.json({ error: "Invalid documentType" }, { status: 400 });
    }
  } else if (type === "PROPERTY") {
    const { addressLine1, city, county, eircode, ownershipEvidence } = data as Record<string, string>;
    if (!addressLine1 || !city || !county || !eircode || !ownershipEvidence) {
      return NextResponse.json({ error: "addressLine1, city, county, eircode, and ownershipEvidence are required" }, { status: 400 });
    }
    if (!["deed", "utility_bill", "mortgage_statement"].includes(ownershipEvidence)) {
      return NextResponse.json({ error: "Invalid ownershipEvidence" }, { status: 400 });
    }
  } else if (type === "EMPLOYMENT") {
    const { employer, position, startDate } = data as Record<string, string>;
    if (!employer || !position || !startDate) {
      return NextResponse.json({ error: "employer, position, and startDate are required" }, { status: 400 });
    }
  }
  // STUDENT: accept any data for now

  const verification = await prisma.verification.create({
    data: {
      userId: payload.sub,
      type: type as "ID" | "PROPERTY" | "EMPLOYMENT" | "STUDENT",
      status: "PENDING",
      provider: "MANUAL",
      providerRef: JSON.stringify(data),
    },
  });

  return NextResponse.json(verification, { status: 201 });
}
