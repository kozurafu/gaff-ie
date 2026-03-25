import { prisma } from '@/lib/prisma';

export interface MatchBreakdown {
  budget: number;      // 0-35
  location: number;    // 0-25
  bedrooms: number;    // 0-10
  amenities: number;   // 0-20
  moveInDate: number;  // 0-10
}

export interface MatchResult {
  listingId: string;
  score: number;
  breakdown: MatchBreakdown;
}

export async function getRecommendedListings(userId: string, limit = 20): Promise<MatchResult[]> {
  const prefs = await prisma.tenantPreference.findUnique({ where: { userId } });
  if (!prefs) return [];

  const listings = await prisma.listing.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      price: true,
      city: true,
      county: true,
      bedrooms: true,
      propertyType: true,
      listingType: true,
      petsAllowed: true,
      hapAccepted: true,
      parkingIncluded: true,
      furnished: true,
      availableFrom: true,
    },
    take: 200,
  });

  const results: MatchResult[] = listings.map(listing => {
    const breakdown: MatchBreakdown = { budget: 0, location: 0, bedrooms: 0, amenities: 0, moveInDate: 0 };

    // ── Budget fit (0-35) ──
    if (prefs.budgetMax && prefs.budgetMax > 0) {
      const ratio = listing.price / prefs.budgetMax;
      if (ratio <= 1) breakdown.budget = 35;
      else if (ratio <= 1.1) breakdown.budget = 25;
      else if (ratio <= 1.2) breakdown.budget = 15;
      else breakdown.budget = 0;

      // Bonus: if also above budgetMin (not too cheap = suspicious)
      if (prefs.budgetMin && listing.price < prefs.budgetMin) {
        breakdown.budget = Math.max(0, breakdown.budget - 10);
      }
    } else {
      breakdown.budget = 15; // no preference = neutral
    }

    // ── Location match (0-25) ──
    const prefAreas = prefs.preferredAreas.map(a => a.toLowerCase());
    if (prefAreas.length === 0) {
      breakdown.location = 12;
    } else if (
      prefAreas.includes(listing.city.toLowerCase()) ||
      prefAreas.includes(listing.county.toLowerCase())
    ) {
      breakdown.location = 25;
    } else {
      breakdown.location = 0;
    }

    // ── Bedrooms match (0-10) ──
    if (prefs.bedroomsMin != null) {
      if (listing.bedrooms >= prefs.bedroomsMin) breakdown.bedrooms = 10;
      else if (listing.bedrooms === prefs.bedroomsMin - 1) breakdown.bedrooms = 5;
      else breakdown.bedrooms = 0;
    } else {
      breakdown.bedrooms = 5;
    }

    // ── Amenities / must-haves (0-20) ──
    let amenityScore = 0;
    let amenityChecks = 0;
    const ap = (prefs.amenityPrefs ?? {}) as Record<string, string>;

    // HAP is a top-level pref, treat as must-have
    if (prefs.hapRequired) {
      amenityChecks++;
      if (listing.hapAccepted) amenityScore++;
    }

    // Check amenityPrefs: keys like petsAllowed, parkingIncluded, furnished
    // Values: 'must-have', 'nice-to-have', or 'no-preference'
    const amenityMap: Record<string, boolean | string> = {
      petsAllowed: listing.petsAllowed,
      parkingIncluded: listing.parkingIncluded,
      furnished: listing.furnished === 'YES' || listing.furnished === 'PARTIAL',
    };

    for (const [key, pref] of Object.entries(ap)) {
      if (pref === 'must-have') {
        amenityChecks++;
        if (amenityMap[key]) amenityScore++;
      } else if (pref === 'nice-to-have') {
        amenityChecks++;
        if (amenityMap[key]) amenityScore++;
      }
    }

    // Property type match
    if (prefs.propertyTypes.length > 0) {
      amenityChecks++;
      if (prefs.propertyTypes.includes(listing.propertyType)) amenityScore++;
    }

    // Listing type match
    if (prefs.listingType) {
      amenityChecks++;
      if (listing.listingType === prefs.listingType) amenityScore++;
    }

    if (amenityChecks > 0) {
      breakdown.amenities = Math.round((amenityScore / amenityChecks) * 20);
    } else {
      breakdown.amenities = 10;
    }

    // ── Move-in date (0-10) ──
    if (prefs.moveInDate && listing.availableFrom) {
      const diffDays = Math.abs(prefs.moveInDate.getTime() - listing.availableFrom.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays <= 7) breakdown.moveInDate = 10;
      else if (diffDays <= 14) breakdown.moveInDate = 7;
      else if (diffDays <= 30) breakdown.moveInDate = 4;
      else breakdown.moveInDate = 0;
    } else {
      breakdown.moveInDate = 5;
    }

    const score = breakdown.budget + breakdown.location + breakdown.bedrooms + breakdown.amenities + breakdown.moveInDate;
    return { listingId: listing.id, score, breakdown };
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/**
 * Get match score for a single listing against a tenant's preferences.
 */
export async function getMatchScoreForListing(userId: string, listingId: string): Promise<MatchResult | null> {
  const results = await getRecommendedListings(userId, 200);
  return results.find(r => r.listingId === listingId) ?? null;
}
