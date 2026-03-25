import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const listing = await prisma.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: {
        images: { orderBy: { order: "asc" } },
        user: { select: { id: true, name: true, avatar: true, role: true, createdAt: true } },
      },
    });
    return NextResponse.json({ listing });
  } catch {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await context.params;
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    if (listing.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Status-only update
    if (body.status) {
      const validStatuses = ["ACTIVE", "DRAFT", "LET_AGREED", "SALE_AGREED", "WITHDRAWN", "EXPIRED", "REMOVED"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      const data: Record<string, unknown> = { status: body.status };

      // Set timestamp for agreed statuses
      if (body.status === "LET_AGREED" || body.status === "SALE_AGREED") {
        data.updatedAt = new Date();
      }

      const updated = await prisma.listing.update({
        where: { id },
        data,
        include: { images: true, user: { select: { id: true, name: true } } },
      });
      return NextResponse.json({ listing: updated });
    }

    // General field update
    const { images, ...data } = body;
    if (data.price != null) data.price = parseInt(data.price);
    if (data.availableFrom) data.availableFrom = new Date(data.availableFrom);

    const updated = await prisma.listing.update({
      where: { id },
      data,
      include: { images: true, user: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ listing: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await context.params;
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    if (listing.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { images, ...rest } = body;

    const data: Record<string, unknown> = {};
    const fields = [
      "title", "description", "propertyType", "listingType", "status",
      "addressLine1", "addressLine2", "city", "county", "eircode",
      "berRating", "furnished", "features",
    ];
    for (const f of fields) {
      if (rest[f] !== undefined) data[f] = rest[f];
    }
    if (rest.price != null) data.price = parseInt(rest.price);
    if (rest.bedrooms != null) data.bedrooms = parseInt(rest.bedrooms);
    if (rest.bathrooms != null) data.bathrooms = parseInt(rest.bathrooms);
    if (rest.sqft != null) data.sqft = rest.sqft ? parseInt(rest.sqft) : null;
    if (rest.availableFrom !== undefined) data.availableFrom = rest.availableFrom ? new Date(rest.availableFrom) : null;
    if (rest.hapAccepted !== undefined) data.hapAccepted = !!rest.hapAccepted;
    if (rest.petsAllowed !== undefined) data.petsAllowed = !!rest.petsAllowed;
    if (rest.parkingIncluded !== undefined) data.parkingIncluded = !!rest.parkingIncluded;

    // Handle images: delete old, create new
    if (images && Array.isArray(images)) {
      await prisma.listingImage.deleteMany({ where: { listingId: id } });
      if (images.length > 0) {
        await prisma.listingImage.createMany({
          data: images.map((img: { url: string; alt?: string; isPrimary?: boolean }, i: number) => ({
            listingId: id,
            url: img.url,
            alt: img.alt || null,
            order: i,
            isPrimary: img.isPrimary || i === 0,
          })),
        });
      }
    }

    const updated = await prisma.listing.update({
      where: { id },
      data,
      include: { images: { orderBy: { order: "asc" } }, user: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ listing: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { id } = await context.params;
    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    if (listing.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
