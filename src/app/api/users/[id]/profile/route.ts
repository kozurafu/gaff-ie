import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      avatar: true,
      emailVerified: true,
      createdAt: true,
      profile: {
        select: {
          bio: true,
          companyName: true,
          rtbNumber: true,
          budget: true,
          moveInDate: true,
          preferences: true,
        },
      },
      verifications: {
        where: { status: 'VERIFIED' },
        select: { type: true, verifiedAt: true },
      },
      listings: {
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          title: true,
          price: true,
          city: true,
          bedrooms: true,
          propertyType: true,
          listingType: true,
          images: { select: { url: true }, take: 1, orderBy: { order: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      reviewsReceived: {
        select: { rating: true },
      },
      tenantPreference: {
        select: {
          preferredAreas: true,
          budgetMin: true,
          budgetMax: true,
          bedroomsMin: true,
          propertyTypes: true,
          listingType: true,
          hapRequired: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const avgRating =
    user.reviewsReceived.length > 0
      ? user.reviewsReceived.reduce((s, r) => s + r.rating, 0) / user.reviewsReceived.length
      : 0;

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      profile: user.profile,
      verifications: user.verifications.map((v) => v.type),
      listings: user.listings,
      reviewCount: user.reviewsReceived.length,
      avgRating: Math.round(avgRating * 10) / 10,
      tenantPreference: user.tenantPreference,
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = await getTokenFromRequest(req);
  if (!token || token.sub !== id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, bio, avatar, rtbNumber, companyName } = body;

  // Update user fields
  const updateData: Record<string, unknown> = {};
  if (typeof name === 'string' && name.trim()) updateData.name = name.trim();
  if (typeof phone === 'string') updateData.phone = phone.trim() || null;
  if (typeof avatar === 'string') updateData.avatar = avatar.trim() || null;

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, phone: true, avatar: true, role: true },
  });

  // Upsert profile for bio, rtbNumber, companyName
  const profileData: Record<string, unknown> = {};
  if (typeof bio === 'string') profileData.bio = bio.trim() || null;
  if (typeof rtbNumber === 'string') profileData.rtbNumber = rtbNumber.trim() || null;
  if (typeof companyName === 'string') profileData.companyName = companyName.trim() || null;

  if (Object.keys(profileData).length > 0) {
    await prisma.profile.upsert({
      where: { userId: id },
      create: { userId: id, ...profileData },
      update: profileData,
    });
  }

  return NextResponse.json({ user });
}
