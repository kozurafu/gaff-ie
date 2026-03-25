import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const flagged = await prisma.$queryRaw`
    SELECT fl.*, l.title, l."addressLine1", l.city, l.price, l."listingType", l.status as "listingStatus", u.name as "userName", u.email as "userEmail"
    FROM flagged_listings fl
    JOIN listings l ON fl."listingId" = l.id
    JOIN users u ON l."userId" = u.id
    ORDER BY fl."createdAt" DESC
    LIMIT 100
  `;

  return NextResponse.json({ flagged });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { flagId, action } = await req.json();
  if (!flagId || !['APPROVED', 'REMOVED'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Get the flagged listing
  const rows: { listingId: string }[] = await prisma.$queryRaw`SELECT "listingId" FROM flagged_listings WHERE id = ${flagId}`;
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const listingId = rows[0].listingId;
  const newListingStatus = action === 'APPROVED' ? 'ACTIVE' : 'REMOVED';

  await prisma.$executeRaw`UPDATE flagged_listings SET status = ${action}, "reviewedBy" = ${user.id}, "reviewedAt" = NOW() WHERE id = ${flagId}`;
  await prisma.listing.update({ where: { id: listingId }, data: { status: newListingStatus as 'ACTIVE' | 'REMOVED' } });

  return NextResponse.json({ success: true });
}
