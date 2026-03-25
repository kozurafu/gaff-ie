import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

// GET /api/listings/[id]/viewings — list viewing slots for a listing
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const slots = await prisma.viewingSlot.findMany({
    where: { listingId: id, dateTime: { gte: new Date() } },
    include: {
      bookings: {
        include: { tenant: { select: { id: true, name: true, email: true } } },
      },
    },
    orderBy: { dateTime: 'asc' },
  });

  // For non-owners, hide booking details but show count
  const user = await getTokenFromRequest(request);

  const listing = await prisma.listing.findUnique({ where: { id }, select: { userId: true } });
  const isOwner = user && listing && user.sub as string === listing.userId;

  const formatted = slots.map((s) => ({
    id: s.id,
    dateTime: s.dateTime.toISOString(),
    durationMins: s.durationMins,
    maxAttendees: s.maxAttendees,
    notes: s.notes,
    bookedCount: s.bookings.length,
    isFull: s.bookings.length >= s.maxAttendees,
    // Only show attendees to listing owner
    attendees: isOwner ? s.bookings.map((b) => ({ id: b.id, tenantId: b.tenant.id, name: b.tenant.name, email: b.tenant.email, message: b.message })) : undefined,
    // Show if current user has booked
    userBooked: user ? s.bookings.some((b) => b.tenantId === user.sub as string) : false,
  }));

  return NextResponse.json({ slots: formatted });
}

// POST /api/listings/[id]/viewings — create a viewing slot (landlord/agent only)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getTokenFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const listing = await prisma.listing.findUnique({ where: { id }, select: { userId: true } });
  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  if (listing.userId !== user.sub as string) return NextResponse.json({ error: 'Not your listing' }, { status: 403 });

  const body = await request.json();
  const { dateTime, durationMins, maxAttendees, notes } = body;

  if (!dateTime) return NextResponse.json({ error: 'dateTime is required' }, { status: 400 });

  const dt = new Date(dateTime);
  if (dt <= new Date()) return NextResponse.json({ error: 'Date must be in the future' }, { status: 400 });

  const slot = await prisma.viewingSlot.create({
    data: {
      listingId: id,
      dateTime: dt,
      durationMins: durationMins || 30,
      maxAttendees: maxAttendees || 1,
      notes: notes || null,
    },
  });

  return NextResponse.json({ slot }, { status: 201 });
}
