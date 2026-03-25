import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

// GET /api/viewings/my — get upcoming viewings for the current user
export async function GET(request: NextRequest) {
  const user = await getTokenFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.sub as string }, select: { role: true } });
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (dbUser.role === 'TENANT') {
    // Tenant: viewings they've booked
    const bookings = await prisma.viewingBooking.findMany({
      where: { tenantId: user.sub as string, viewingSlot: { dateTime: { gte: new Date() } } },
      include: {
        viewingSlot: {
          include: {
            listing: { select: { id: true, title: true, addressLine1: true, city: true, images: { take: 1, orderBy: { order: 'asc' } } } },
          },
        },
      },
      orderBy: { viewingSlot: { dateTime: 'asc' } },
    });

    return NextResponse.json({
      viewings: bookings.map((b) => ({
        bookingId: b.id,
        slotId: b.viewingSlot.id,
        dateTime: b.viewingSlot.dateTime.toISOString(),
        durationMins: b.viewingSlot.durationMins,
        listing: b.viewingSlot.listing,
      })),
    });
  } else {
    // Landlord/Agent: viewings on their listings
    const slots = await prisma.viewingSlot.findMany({
      where: { listing: { userId: user.sub as string }, dateTime: { gte: new Date() } },
      include: {
        listing: { select: { id: true, title: true, addressLine1: true, city: true } },
        bookings: { include: { tenant: { select: { id: true, name: true, email: true } } } },
      },
      orderBy: { dateTime: 'asc' },
    });

    return NextResponse.json({
      viewings: slots.map((s) => ({
        slotId: s.id,
        dateTime: s.dateTime.toISOString(),
        durationMins: s.durationMins,
        maxAttendees: s.maxAttendees,
        listing: s.listing,
        attendees: s.bookings.map((b) => ({ id: b.tenant.id, name: b.tenant.name, email: b.tenant.email })),
      })),
    });
  }
}
