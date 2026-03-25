import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

// POST /api/viewings/[id]/book — book a viewing slot (tenant only)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getTokenFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const slot = await prisma.viewingSlot.findUnique({
    where: { id },
    include: { bookings: true, listing: { select: { userId: true } } },
  });

  if (!slot) return NextResponse.json({ error: 'Viewing slot not found' }, { status: 404 });
  if (slot.dateTime <= new Date()) return NextResponse.json({ error: 'This viewing has already passed' }, { status: 400 });
  if (slot.listing.userId === user.sub as string) return NextResponse.json({ error: 'Cannot book your own viewing' }, { status: 400 });
  if (slot.bookings.length >= slot.maxAttendees) return NextResponse.json({ error: 'This viewing is fully booked' }, { status: 400 });
  if (slot.bookings.some((b) => b.tenantId === user.sub as string)) return NextResponse.json({ error: 'Already booked' }, { status: 400 });

  const body = await request.json().catch(() => ({}));

  const booking = await prisma.viewingBooking.create({
    data: {
      viewingSlotId: id,
      tenantId: user.sub as string,
      message: body.message || null,
    },
  });

  return NextResponse.json({ booking }, { status: 201 });
}

// DELETE /api/viewings/[id]/book — cancel a booking
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getTokenFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const booking = await prisma.viewingBooking.findFirst({
    where: { viewingSlotId: id, tenantId: user.sub as string },
  });

  if (!booking) return NextResponse.json({ error: 'No booking found' }, { status: 404 });

  await prisma.viewingBooking.delete({ where: { id: booking.id } });

  return NextResponse.json({ success: true });
}
