import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

// POST /api/agencies — create a new agency (agents only)
export async function POST(request: Request) {
  const user = await getTokenFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'AGENT') return NextResponse.json({ error: 'Only agents can create agencies' }, { status: 403 });

  // Check if already in an agency
  const existing = await prisma.agentOrgMember.findFirst({ where: { userId: user.sub } });
  if (existing) return NextResponse.json({ error: 'You already belong to an agency' }, { status: 400 });

  const body = await request.json();
  const { name, description, logo, website, phone } = body;
  if (!name?.trim()) return NextResponse.json({ error: 'Agency name is required' }, { status: 400 });

  const org = await prisma.agentOrg.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      logo: logo?.trim() || null,
      website: website?.trim() || null,
      phone: phone?.trim() || null,
      members: {
        create: { userId: user.sub, role: 'OWNER' },
      },
    },
    include: { members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } } },
  });

  return NextResponse.json({ agency: org }, { status: 201 });
}
