import { prisma } from '@/lib/prisma';

export interface ScamFlag {
  type: 'price_too_low' | 'duplicate_image' | 'copypaste_description' | 'suspicious_new_account' | 'offplatform_payment';
  severity: 'low' | 'medium' | 'high';
  detail: string;
}

const PAYMENT_KEYWORDS = [
  'western union', 'wire transfer', 'money gram', 'moneygram',
  'bitcoin', 'crypto', 'revolut me', 'pay before viewing',
  'deposit before', 'send money', 'bank transfer first',
  'pay upfront', 'advance payment',
];

function checkOffPlatformPayment(description: string): ScamFlag | null {
  const lower = description.toLowerCase();
  for (const kw of PAYMENT_KEYWORDS) {
    if (lower.includes(kw)) {
      return { type: 'offplatform_payment', severity: 'high', detail: `Contains "${kw}"` };
    }
  }
  return null;
}

function simpleTextHash(text: string): string {
  // Normalize: lowercase, remove punctuation, collapse whitespace
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function textSimilarity(a: string, b: string): number {
  const na = simpleTextHash(a);
  const nb = simpleTextHash(b);
  if (na === nb) return 1;
  // Jaccard similarity on word trigrams
  const trigrams = (s: string) => {
    const words = s.split(' ');
    const set = new Set<string>();
    for (let i = 0; i <= words.length - 3; i++) {
      set.add(words.slice(i, i + 3).join(' '));
    }
    return set;
  };
  const setA = trigrams(na);
  const setB = trigrams(nb);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  setA.forEach(t => { if (setB.has(t)) intersection++; });
  return intersection / (setA.size + setB.size - intersection);
}

export async function analyzeListingForScams(listingId: string): Promise<ScamFlag[]> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      user: { select: { createdAt: true } },
      images: { select: { url: true } },
    },
  });
  if (!listing) return [];

  const flags: ScamFlag[] = [];

  // 1. Price too low for area
  const areaAvg = await prisma.listing.aggregate({
    where: {
      status: 'ACTIVE',
      city: listing.city,
      listingType: listing.listingType,
      bedrooms: listing.bedrooms,
      id: { not: listing.id },
    },
    _avg: { price: true },
    _count: true,
  });

  if (areaAvg._count > 3 && areaAvg._avg.price) {
    const ratio = listing.price / areaAvg._avg.price;
    if (ratio < 0.6) {
      flags.push({
        type: 'price_too_low',
        severity: ratio < 0.4 ? 'high' : 'medium',
        detail: `Price is ${Math.round((1 - ratio) * 100)}% below area average (€${Math.round(areaAvg._avg.price)}/mo avg)`,
      });
    }
  }

  // 2. Duplicate images across listings
  if (listing.images.length > 0) {
    const imageUrls = listing.images.map(i => i.url);
    const dupes = await prisma.listingImage.findMany({
      where: {
        url: { in: imageUrls },
        listingId: { not: listing.id },
      },
      select: { listingId: true, url: true },
    });
    if (dupes.length > 0) {
      flags.push({
        type: 'duplicate_image',
        severity: 'high',
        detail: `${dupes.length} image(s) found on other listings`,
      });
    }
  }

  // 3. Copy-paste descriptions
  const recentListings = await prisma.listing.findMany({
    where: {
      id: { not: listing.id },
      status: 'ACTIVE',
      city: listing.city,
    },
    select: { id: true, description: true },
    take: 50,
    orderBy: { createdAt: 'desc' },
  });

  for (const other of recentListings) {
    if (textSimilarity(listing.description, other.description) > 0.8) {
      flags.push({
        type: 'copypaste_description',
        severity: 'medium',
        detail: `Description very similar to listing ${other.id}`,
      });
      break;
    }
  }

  // 4. New account + premium listing
  const accountAgeDays = (Date.now() - listing.user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  if (accountAgeDays < 7 && listing.isPremium) {
    flags.push({
      type: 'suspicious_new_account',
      severity: 'medium',
      detail: `Account is ${Math.round(accountAgeDays)} days old with premium listing`,
    });
  }

  // 5. Off-platform payment requests
  const paymentFlag = checkOffPlatformPayment(listing.description);
  if (paymentFlag) flags.push(paymentFlag);

  return flags;
}
