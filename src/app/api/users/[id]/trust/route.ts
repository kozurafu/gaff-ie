import { NextRequest, NextResponse } from 'next/server';
import { calculateTrustScore } from '@/lib/trustScore';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const trust = await calculateTrustScore(id);
    return NextResponse.json(trust);
  } catch {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
}
