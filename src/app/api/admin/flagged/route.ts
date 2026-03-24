import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeListingForScams } from '@/lib/scamDetection';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Get recent active listings and analyze them
  const listings = await prisma.listing.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, title: true, price: true, city: true, userId: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const flagged: { listing: typeof listings[0]; flags: Awaited<ReturnType<typeof analyzeListingForScams>> }[] = [];

  for (const listing of listings) {
    const flags = await analyzeListingForScams(listing.id);
    if (flags.length > 0) {
      flagged.push({ listing, flags });
    }
  }

  // Sort by highest severity
  const severityOrder = { high: 3, medium: 2, low: 1 };
  flagged.sort((a, b) => {
    const aMax = Math.max(...a.flags.map(f => severityOrder[f.severity]));
    const bMax = Math.max(...b.flags.map(f => severityOrder[f.severity]));
    return bMax - aMax;
  });

  return NextResponse.json({ flagged, total: flagged.length });
}
