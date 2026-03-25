import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const payload = await getTokenFromRequest(request);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (payload.role !== "TENANT") {
    return NextResponse.json({ error: "Tenant only" }, { status: 403 });
  }

  const preferences = await prisma.tenantPreference.findUnique({
    where: { userId: payload.sub },
  });

  return NextResponse.json({ preferences });
}

export async function PUT(request: Request) {
  const payload = await getTokenFromRequest(request);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (payload.role !== "TENANT") {
    return NextResponse.json({ error: "Tenant only" }, { status: 403 });
  }

  const body = await request.json();

  const preferences = await prisma.tenantPreference.upsert({
    where: { userId: payload.sub },
    create: {
      userId: payload.sub,
      preferredAreas: body.preferredAreas ?? [],
      maxCommute: body.maxCommute ?? null,
      commuteAddress: body.commuteAddress ?? null,
      commuteMode: body.commuteMode ?? null,
      budgetMin: body.budgetMin ?? null,
      budgetMax: body.budgetMax ?? null,
      bedroomsMin: body.bedroomsMin ?? null,
      propertyTypes: body.propertyTypes ?? [],
      listingType: body.listingType ?? "RENT",
      moveInDate: body.moveInDate ? new Date(body.moveInDate) : null,
      leaseLengthMin: body.leaseLengthMin ?? null,
      amenityPrefs: body.amenityPrefs ?? {},
      hapRequired: body.hapRequired ?? false,
      alertFrequency: body.alertFrequency ?? "instant",
      emailAlerts: body.emailAlerts ?? true,
    },
    update: {
      preferredAreas: body.preferredAreas ?? [],
      maxCommute: body.maxCommute ?? null,
      commuteAddress: body.commuteAddress ?? null,
      commuteMode: body.commuteMode ?? null,
      budgetMin: body.budgetMin ?? null,
      budgetMax: body.budgetMax ?? null,
      bedroomsMin: body.bedroomsMin ?? null,
      propertyTypes: body.propertyTypes ?? [],
      listingType: body.listingType ?? "RENT",
      moveInDate: body.moveInDate ? new Date(body.moveInDate) : null,
      leaseLengthMin: body.leaseLengthMin ?? null,
      amenityPrefs: body.amenityPrefs ?? {},
      hapRequired: body.hapRequired ?? false,
      alertFrequency: body.alertFrequency ?? "instant",
      emailAlerts: body.emailAlerts ?? true,
    },
  });

  return NextResponse.json({ preferences });
}
