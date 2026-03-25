import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

// GET /api/agencies/my — get current user's agency
export async function GET(request: Request) {
  const user = await getTokenFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const membership = await prisma.agentOrgMember.findFirst({
    where: { userId: user.sub },
    include: {
      agentOrg: {
        include: {
          members: {
            include: {
              user: { select: { id: true, name: true, avatar: true } },
            },
          },
        },
      },
    },
  });

  if (!membership) {
    return NextResponse.json({ agency: null });
  }

  return NextResponse.json({ agency: membership.agentOrg });
}
