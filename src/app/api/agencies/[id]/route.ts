import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

// GET /api/agencies/[id] — public agency profile
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const agency = await prisma.agentOrg.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
          },
        },
      },
    },
  });

  if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });

  // Get all listings from agency members
  const memberIds = agency.members.map(m => m.userId);
  const listings = await prisma.listing.findMany({
    where: { userId: { in: memberIds }, status: 'ACTIVE' },
    include: { images: { take: 1, orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  // Get average review rating for agency members
  const reviews = await prisma.review.findMany({
    where: { revieweeId: { in: memberIds } },
    select: { rating: true },
  });
  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : null;

  return NextResponse.json({
    agency: {
      id: agency.id,
      name: agency.name,
      logo: agency.logo,
      description: agency.description,
      website: agency.website,
      phone: agency.phone,
      plan: agency.plan,
      createdAt: agency.createdAt,
      members: agency.members.map(m => ({
        userId: m.userId,
        role: m.role,
        joinedAt: m.joinedAt,
        user: m.user,
      })),
      listings,
      avgRating,
      reviewCount: reviews.length,
      listingCount: listings.length,
    },
  });
}

// PUT /api/agencies/[id] — update agency (owner only)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getTokenFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check ownership
  const membership = await prisma.agentOrgMember.findUnique({
    where: { agentOrgId_userId: { agentOrgId: id, userId: user.sub } },
  });
  if (!membership || membership.role !== 'OWNER') {
    return NextResponse.json({ error: 'Only the agency owner can update it' }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, logo, website, phone } = body;

  const updated = await prisma.agentOrg.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(logo !== undefined && { logo: logo?.trim() || null }),
      ...(website !== undefined && { website: website?.trim() || null }),
      ...(phone !== undefined && { phone: phone?.trim() || null }),
    },
  });

  return NextResponse.json({ agency: updated });
}
