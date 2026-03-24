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
    if (listing.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
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
