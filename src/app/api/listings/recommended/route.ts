import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth';
import { getRecommendedListings } from '@/lib/matching';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (payload.role !== 'TENANT') return NextResponse.json({ listings: [] });

  const matches = await getRecommendedListings(payload.sub, 12);
  if (matches.length === 0) return NextResponse.json({ listings: [] });

  const listingIds = matches.map(m => m.listingId);
  const listings = await prisma.listing.findMany({
    where: { id: { in: listingIds } },
    include: { images: { take: 1, orderBy: { order: 'asc' } } },
  });

  const listingMap = new Map(listings.map(l => [l.id, l]));
  const result = matches
    .map(m => {
      const l = listingMap.get(m.listingId);
      if (!l) return null;
      return {
        id: l.id,
        title: l.title,
        price: l.price,
        city: l.city,
        county: l.county,
        bedrooms: l.bedrooms,
        bathrooms: l.bathrooms,
        propertyType: l.propertyType,
        listingType: l.listingType,
        hapAccepted: l.hapAccepted,
        petsAllowed: l.petsAllowed,
        matchScore: m.score,
        breakdown: m.breakdown,
        createdAt: l.createdAt,
        images: l.images,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ listings: result });
}
