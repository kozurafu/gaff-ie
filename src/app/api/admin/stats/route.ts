import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await getTokenFromRequest(request);
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const [
    totalUsers,
    usersByRole,
    totalListings,
    listingsByStatus,
    totalMessages,
    pendingVerifications,
    completedVerifications,
    rejectedVerifications,
    recentReports,
    recentFlagged,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.groupBy({ by: ['role'], _count: true }),
    prisma.listing.count(),
    prisma.listing.groupBy({ by: ['status'], _count: true }),
    prisma.message.count(),
    prisma.verification.count({ where: { status: 'PENDING' } }),
    prisma.verification.count({ where: { status: 'VERIFIED' } }),
    prisma.verification.count({ where: { status: 'REJECTED' } }),
    prisma.report.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { name: true, email: true } },
        listing: { select: { title: true, id: true } },
      },
    }),
    prisma.flaggedListing.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      where: { status: 'PENDING' },
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  const roleMap: Record<string, number> = {};
  usersByRole.forEach((r) => { roleMap[r.role] = r._count; });

  const statusMap: Record<string, number> = {};
  listingsByStatus.forEach((s) => { statusMap[s.status] = s._count; });

  // Get listing titles for flagged items
  const flaggedListingIds = recentFlagged.map(f => f.listingId);
  const flaggedListings = flaggedListingIds.length > 0
    ? await prisma.listing.findMany({
        where: { id: { in: flaggedListingIds } },
        select: { id: true, title: true, city: true },
      })
    : [];
  const listingMap = Object.fromEntries(flaggedListings.map(l => [l.id, l]));

  return NextResponse.json({
    users: { total: totalUsers, byRole: roleMap },
    listings: { total: totalListings, byStatus: statusMap },
    messages: totalMessages,
    verifications: { pending: pendingVerifications, completed: completedVerifications, rejected: rejectedVerifications },
    recentReports: recentReports.map(r => ({
      id: r.id,
      reason: r.reason,
      status: r.status,
      description: r.description,
      reporterName: r.reporter.name,
      listingTitle: r.listing?.title || 'Deleted',
      listingId: r.listing?.id,
      createdAt: r.createdAt,
    })),
    recentFlagged: recentFlagged.map(f => ({
      id: f.id,
      listingId: f.listingId,
      riskScore: f.riskScore,
      status: f.status,
      title: listingMap[f.listingId]?.title || 'Unknown',
      city: listingMap[f.listingId]?.city || '',
      createdAt: f.createdAt,
    })),
    recentUsers: recentUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    })),
  });
}
