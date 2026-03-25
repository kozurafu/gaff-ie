import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const savedSearches = await prisma.savedSearch.findMany({
    where: { userId: payload.sub },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ savedSearches });
}

export async function POST(request: NextRequest) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, filters } = await request.json();
  if (!name || !filters) return NextResponse.json({ error: 'name and filters required' }, { status: 400 });

  const savedSearch = await prisma.savedSearch.create({
    data: {
      userId: payload.sub,
      name,
      filters,
    },
  });

  return NextResponse.json({ savedSearch });
}

export async function DELETE(request: NextRequest) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const search = await prisma.savedSearch.findUnique({ where: { id } });
  if (!search || search.userId !== payload.sub) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.savedSearch.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
