import { prisma } from '@/lib/prisma';

export interface MatchResult {
  listingId: string;
  score: number;
  breakdown: {
    budget: number;
    location: number;
    petFriendly: number;
    hap: number;
    moveInDate: number;
  };
}

interface TenantPrefs {
  budget?: number | null;
  moveInDate?: Date | null;
  preferences?: {
    petFriendly?: boolean;
    hapRequired?: boolean;
    locations?: string[];
    [key: string]: unknown;
  } | null;
}

export async function getRecommendedListings(userId: string, limit = 20): Promise<MatchResult[]> {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) return [];

  const prefs: TenantPrefs = {
    budget: profile.budget,
    moveInDate: profile.moveInDate,
    preferences: profile.preferences as TenantPrefs['preferences'],
  };

  const listings = await prisma.listing.findMany({
    where: { status: 'ACTIVE', listingType: 'RENT' },
    select: {
      id: true,
      price: true,
      city: true,
      county: true,
      petsAllowed: true,
      hapAccepted: true,
      availableFrom: true,
    },
    take: 200, // scan pool
  });

  const results: MatchResult[] = listings.map(listing => {
    const breakdown = { budget: 0, location: 0, petFriendly: 0, hap: 0, moveInDate: 0 };

    // Budget fit (0-35 points) - price is in cents
    if (prefs.budget && prefs.budget > 0) {
      const ratio = listing.price / prefs.budget;
      if (ratio <= 1) breakdown.budget = 35; // within budget
      else if (ratio <= 1.1) breakdown.budget = 25; // up to 10% over
      else if (ratio <= 1.2) breakdown.budget = 15;
      else breakdown.budget = 0;
    } else {
      breakdown.budget = 15; // no preference = neutral
    }

    // Location (0-25 points)
    const prefLocations = prefs.preferences?.locations?.map(l => l.toLowerCase()) ?? [];
    if (prefLocations.length === 0) {
      breakdown.location = 12;
    } else if (prefLocations.includes(listing.city.toLowerCase()) || prefLocations.includes(listing.county.toLowerCase())) {
      breakdown.location = 25;
    }

    // Pet-friendly (0-15 points)
    if (prefs.preferences?.petFriendly) {
      breakdown.petFriendly = listing.petsAllowed ? 15 : 0;
    } else {
      breakdown.petFriendly = 10;
    }

    // HAP acceptance (0-15 points)
    if (prefs.preferences?.hapRequired) {
      breakdown.hap = listing.hapAccepted ? 15 : 0;
    } else {
      breakdown.hap = 8;
    }

    // Move-in date alignment (0-10 points)
    if (prefs.moveInDate && listing.availableFrom) {
      const diffDays = Math.abs(prefs.moveInDate.getTime() - listing.availableFrom.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays <= 7) breakdown.moveInDate = 10;
      else if (diffDays <= 14) breakdown.moveInDate = 7;
      else if (diffDays <= 30) breakdown.moveInDate = 4;
      else breakdown.moveInDate = 0;
    } else {
      breakdown.moveInDate = 5;
    }

    const score = breakdown.budget + breakdown.location + breakdown.petFriendly + breakdown.hap + breakdown.moveInDate;
    return { listingId: listing.id, score, breakdown };
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
