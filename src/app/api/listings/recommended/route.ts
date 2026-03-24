import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getRecommendedListings } from '@/lib/matching';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const matches = await getRecommendedListings(user.id, 12);
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
        bedrooms: l.bedrooms,
        bathrooms: l.bathrooms,
        hapAccepted: l.hapAccepted,
        petsAllowed: l.petsAllowed,
        matchScore: m.score,
        images: l.images,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ listings: result });
}
