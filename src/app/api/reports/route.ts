import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { listingId, reason, description } = await req.json();
  if (!listingId || !reason) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const report = await prisma.report.create({
    data: {
      reporterId: user.id,
      listingId,
      reason,
      description: description || null,
    },
  });

  return NextResponse.json(report, { status: 201 });
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const status = req.nextUrl.searchParams.get('status') || 'OPEN';
  const reports = await prisma.report.findMany({
    where: { status: status as 'OPEN' | 'REVIEWING' | 'RESOLVED' | 'DISMISSED' },
    include: {
      reporter: { select: { id: true, name: true } },
      listing: { select: { id: true, title: true, userId: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({ reports });
}
