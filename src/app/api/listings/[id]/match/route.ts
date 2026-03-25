import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth';
import { getMatchScoreForListing } from '@/lib/matching';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ match: null });
  if (payload.role !== 'TENANT') return NextResponse.json({ match: null });

  const match = await getMatchScoreForListing(payload.sub, id);
  return NextResponse.json({ match });
}
