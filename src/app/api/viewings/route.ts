import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

// POST /api/viewings — create a viewing slot (landlord/agent only)
export async function POST(request: NextRequest) {
  const user = await getTokenFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.sub }, select: { role: true } });
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await request.json();
  const { listingId, dateTime, durationMins = 30, maxAttendees = 1 } = body;

  if (!listingId || !dateTime) {
    return NextResponse.json({ error: 'listingId and dateTime are required' }, { status: 400 });
  }

  const dt = new Date(dateTime);
  if (isNaN(dt.getTime()) || dt <= new Date()) {
    return NextResponse.json({ error: 'dateTime must be a valid future date' }, { status: 400 });
  }

  // Verify the listing belongs to this user
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { userId: true },
  });

  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  if (listing.userId !== user.sub) {
    return NextResponse.json({ error: 'You can only create viewings for your own listings' }, { status: 403 });
  }

  const slot = await prisma.viewingSlot.create({
    data: {
      listingId,
      dateTime: dt,
      durationMins: Number(durationMins),
      maxAttendees: Number(maxAttendees),
    },
  });

  return NextResponse.json({ slot }, { status: 201 });
}

// GET /api/viewings?listingId=xxx — get viewing slots for a listing
export async function GET(request: NextRequest) {
  const listingId = new URL(request.url).searchParams.get('listingId');
  if (!listingId) return NextResponse.json({ error: 'listingId required' }, { status: 400 });

  const slots = await prisma.viewingSlot.findMany({
    where: { listingId, dateTime: { gte: new Date() } },
    include: {
      bookings: {
        include: { tenant: { select: { id: true, name: true } } },
      },
    },
    orderBy: { dateTime: 'asc' },
  });

  return NextResponse.json({ slots });
}
