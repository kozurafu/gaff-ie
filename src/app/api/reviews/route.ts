import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const reviews = await prisma.review.findMany({
    where: { revieweeId: userId },
    include: { reviewer: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const avg = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return NextResponse.json({ reviews, averageRating: Math.round(avg * 10) / 10, count: reviews.length });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { revieweeId, rating, text, categories } = body;

  if (!revieweeId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  if (revieweeId === user.id) {
    return NextResponse.json({ error: 'Cannot review yourself' }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      reviewerId: user.id,
      revieweeId,
      rating,
      text: text || null,
      categories: categories || null,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
