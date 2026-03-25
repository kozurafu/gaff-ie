import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const propertyType = searchParams.get("propertyType");
    const listingType = searchParams.get("listingType");
    const status = searchParams.get("status") || "ACTIVE";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));

    const mine = searchParams.get("mine");
    const where: Prisma.ListingWhereInput = {};

    if (mine === "true") {
      const user = await getCurrentUser();
      if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      where.userId = user.id;
    } else {
      where.status = status as Prisma.EnumListingStatusFilter["equals"];
    }

    if (city) where.city = { contains: city, mode: "insensitive" };
    if (minPrice) where.price = { ...((where.price as Prisma.IntFilter) || {}), gte: parseInt(minPrice) };
    if (maxPrice) where.price = { ...((where.price as Prisma.IntFilter) || {}), lte: parseInt(maxPrice) };
    if (bedrooms) where.bedrooms = parseInt(bedrooms);
    if (propertyType) where.propertyType = propertyType as Prisma.EnumPropertyTypeFilter["equals"];
    if (listingType) where.listingType = listingType as Prisma.EnumListingTypeFilter["equals"];

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          images: { orderBy: { order: "asc" } },
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({ listings, total, page, limit, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!["LANDLORD", "AGENT", "ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Only landlords and agents can create listings" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, propertyType, listingType, price, bedrooms, bathrooms, addressLine1, city, county, images, ...rest } = body;

    if (!title || !description || !propertyType || !listingType || price == null || !addressLine1) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        title,
        description,
        propertyType,
        listingType,
        price: parseInt(price),
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        addressLine1,
        city: city || "Dublin",
        county: county || "Dublin",
        ...(rest.eircode && { eircode: rest.eircode }),
        ...(rest.addressLine2 && { addressLine2: rest.addressLine2 }),
        ...(rest.sqft && { sqft: parseInt(rest.sqft) }),
        ...(rest.latitude && { latitude: parseFloat(rest.latitude) }),
        ...(rest.longitude && { longitude: parseFloat(rest.longitude) }),
        ...(rest.berRating && { berRating: rest.berRating }),
        ...(rest.furnished && { furnished: rest.furnished }),
        ...(rest.availableFrom && { availableFrom: new Date(rest.availableFrom) }),
        ...(rest.features && { features: rest.features }),
        ...(rest.status && { status: rest.status }),
        ...(images?.length && {
          images: {
            create: images.map((img: { url: string; alt?: string; isPrimary?: boolean }, i: number) => ({
              url: img.url,
              alt: img.alt || null,
              order: i,
              isPrimary: img.isPrimary || i === 0,
            })),
          },
        }),
      },
      include: { images: true, user: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
