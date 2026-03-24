import { prisma } from '@/lib/prisma';

export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface TrustBreakdown {
  total: number;
  verification: number;
  reviews: number;
  responseRate: number;
  accountAge: number;
  profileCompleteness: number;
  badgeLevel: BadgeLevel;
}

export function getBadgeLevel(user: {
  emailVerified: boolean;
  verifications: { type: string; status: string }[];
  profile?: { rtbNumber?: string | null } | null;
}): BadgeLevel {
  const hasId = user.verifications.some(v => v.type === 'ID' && v.status === 'VERIFIED');
  const hasProperty = user.verifications.some(v => v.type === 'PROPERTY' && v.status === 'VERIFIED');
  const hasRtb = !!user.profile?.rtbNumber;

  if (hasId && hasProperty && hasRtb) return 'platinum';
  if (hasId && hasProperty) return 'gold';
  if (hasId) return 'silver';
  if (user.emailVerified) return 'bronze';
  return 'bronze';
}

function verificationScore(badge: BadgeLevel): number {
  switch (badge) {
    case 'platinum': return 40;
    case 'gold': return 30;
    case 'silver': return 20;
    case 'bronze': return 10;
    default: return 0;
  }
}

function reviewScore(avgRating: number, count: number): number {
  if (count === 0) return 0;
  // Scale: 5-star avg = 25pts, weighted by count (min 3 reviews for full weight)
  const weight = Math.min(count / 3, 1);
  return Math.round((avgRating / 5) * 25 * weight);
}

function responseRateScore(rate: number): number {
  // rate is 0-1
  return Math.round(rate * 15);
}

function accountAgeScore(createdAt: Date): number {
  const months = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (months >= 24) return 10;
  if (months >= 12) return 8;
  if (months >= 6) return 5;
  if (months >= 1) return 2;
  return 0;
}

function profileCompletenessScore(user: {
  name: string;
  avatar?: string | null;
  phone?: string | null;
  profile?: { bio?: string | null; companyName?: string | null } | null;
}): number {
  let score = 0;
  if (user.name) score += 2;
  if (user.avatar) score += 2;
  if (user.phone) score += 2;
  if (user.profile?.bio) score += 2;
  if (user.profile?.companyName) score += 2;
  return score;
}

export async function calculateTrustScore(userId: string): Promise<TrustBreakdown> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      verifications: { select: { type: true, status: true } },
      profile: true,
      reviewsReceived: { select: { rating: true } },
      sentMessages: { select: { id: true } },
      conversations: {
        include: {
          conversation: {
            include: { messages: { select: { senderId: true } } },
          },
        },
      },
    },
  });

  if (!user) {
    return { total: 0, verification: 0, reviews: 0, responseRate: 0, accountAge: 0, profileCompleteness: 0, badgeLevel: 'bronze' };
  }

  const badge = getBadgeLevel(user);
  const vScore = verificationScore(badge);

  const ratings = user.reviewsReceived;
  const avgRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length : 0;
  const rScore = reviewScore(avgRating, ratings.length);

  // Approximate response rate: messages sent / conversations participated
  const convCount = user.conversations.length;
  const rate = convCount > 0 ? Math.min(user.sentMessages.length / convCount, 1) : 0.5;
  const rrScore = responseRateScore(rate);

  const aaScore = accountAgeScore(user.createdAt);
  const pcScore = profileCompletenessScore(user);

  const total = Math.min(vScore + rScore + rrScore + aaScore + pcScore, 100);

  return {
    total,
    verification: vScore,
    reviews: rScore,
    responseRate: rrScore,
    accountAge: aaScore,
    profileCompleteness: pcScore,
    badgeLevel: badge,
  };
}
