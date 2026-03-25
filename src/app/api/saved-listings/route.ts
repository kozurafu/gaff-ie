import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const savedListings = await prisma.savedListing.findMany({
    where: { userId: payload.sub },
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          user: { select: { name: true, verifications: { select: { status: true } } } },
        },
      },
    },
  });

  return NextResponse.json({ savedListings });
}

export async function POST(request: NextRequest) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { listingId } = await request.json();
  if (!listingId) return NextResponse.json({ error: 'listingId required' }, { status: 400 });

  const existing = await prisma.savedListing.findUnique({
    where: { userId_listingId: { userId: payload.sub, listingId } },
  });

  if (existing) {
    await prisma.savedListing.delete({
      where: { userId_listingId: { userId: payload.sub, listingId } },
    });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedListing.create({
    data: { userId: payload.sub, listingId },
  });
  return NextResponse.json({ saved: true });
}
