import { prisma } from '@/lib/prisma';

interface MatchBreakdown {
  budget: number;
  location: number;
  bedrooms: number;
  amenities: number;
  moveInDate: number;
}

interface ListingForMatch {
  id: string;
  title: string;
  price: number;
  city: string;
  county: string;
  bedrooms: number;
  propertyType: string;
  listingType: string;
  petsAllowed: boolean;
  hapAccepted: boolean;
  parkingIncluded: boolean;
  furnished: string;
  availableFrom: Date | null;
}

function calculateMatchScore(prefs: {
  budgetMin: number | null;
  budgetMax: number | null;
  preferredAreas: string[];
  bedroomsMin: number | null;
  propertyTypes: string[];
  listingType: string;
  hapRequired: boolean;
  amenityPrefs: Record<string, string>;
  moveInDate: Date | null;
}, listing: ListingForMatch): { score: number; breakdown: MatchBreakdown } {
  const breakdown: MatchBreakdown = { budget: 0, location: 0, bedrooms: 0, amenities: 0, moveInDate: 0 };

  // Budget (0-35)
  if (prefs.budgetMax && prefs.budgetMax > 0) {
    const ratio = listing.price / prefs.budgetMax;
    if (ratio <= 1) breakdown.budget = 35;
    else if (ratio <= 1.1) breakdown.budget = 25;
    else if (ratio <= 1.2) breakdown.budget = 15;
    if (prefs.budgetMin && listing.price < prefs.budgetMin) {
      breakdown.budget = Math.max(0, breakdown.budget - 10);
    }
  } else {
    breakdown.budget = 15;
  }

  // Location (0-25)
  const prefAreas = prefs.preferredAreas.map(a => a.toLowerCase());
  if (prefAreas.length === 0) {
    breakdown.location = 12;
  } else if (prefAreas.includes(listing.city.toLowerCase()) || prefAreas.includes(listing.county.toLowerCase())) {
    breakdown.location = 25;
  }

  // Bedrooms (0-10)
  if (prefs.bedroomsMin != null) {
    if (listing.bedrooms >= prefs.bedroomsMin) breakdown.bedrooms = 10;
    else if (listing.bedrooms === prefs.bedroomsMin - 1) breakdown.bedrooms = 5;
  } else {
    breakdown.bedrooms = 5;
  }

  // Amenities (0-20)
  let amenityScore = 0;
  let amenityChecks = 0;
  if (prefs.hapRequired) { amenityChecks++; if (listing.hapAccepted) amenityScore++; }
  const amenityMap: Record<string, boolean> = {
    petsAllowed: listing.petsAllowed,
    parkingIncluded: listing.parkingIncluded,
    furnished: listing.furnished === 'YES' || listing.furnished === 'PARTIAL',
  };
  for (const [key, pref] of Object.entries(prefs.amenityPrefs)) {
    if (pref === 'must-have' || pref === 'nice-to-have') {
      amenityChecks++;
      if (amenityMap[key]) amenityScore++;
    }
  }
  if (prefs.propertyTypes.length > 0) { amenityChecks++; if (prefs.propertyTypes.includes(listing.propertyType)) amenityScore++; }
  if (prefs.listingType) { amenityChecks++; if (listing.listingType === prefs.listingType) amenityScore++; }
  breakdown.amenities = amenityChecks > 0 ? Math.round((amenityScore / amenityChecks) * 20) : 10;

  // Move-in date (0-10)
  if (prefs.moveInDate && listing.availableFrom) {
    const diffDays = Math.abs(prefs.moveInDate.getTime() - listing.availableFrom.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) breakdown.moveInDate = 10;
    else if (diffDays <= 14) breakdown.moveInDate = 7;
    else if (diffDays <= 30) breakdown.moveInDate = 4;
  } else {
    breakdown.moveInDate = 5;
  }

  const score = breakdown.budget + breakdown.location + breakdown.bedrooms + breakdown.amenities + breakdown.moveInDate;
  return { score, breakdown };
}

const AGENTMAIL_API = 'https://api.agentmail.to/v0/inboxes/mmclaw@agentmail.to/messages/send';
const AGENTMAIL_TOKEN = process.env.AGENTMAIL_API_KEY;

function getAgentMailToken(): string {
  if (!AGENTMAIL_TOKEN) {
    throw new Error('AGENTMAIL_API_KEY is not configured');
  }
  return AGENTMAIL_TOKEN;
}

function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_APP_URL is not configured — cannot send email notifications');
  }
  return url.replace(/\/$/, '');
}

async function sendEmailNotification(toEmail: string, toName: string, listing: ListingForMatch, matchScore: number): Promise<boolean> {
  try {
    const res = await fetch(AGENTMAIL_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAgentMailToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: toEmail,
        subject: `🏠 ${matchScore}% Match: ${listing.title} — €${listing.price}/mo in ${listing.city}`,
        body_text: `Hi ${toName},\n\nA new listing on Gaff.ie matches your preferences!\n\n${listing.title}\n💰 €${listing.price}/month\n📍 ${listing.city}, ${listing.county}\n🛏️ ${listing.bedrooms} bedroom(s)\n🎯 ${matchScore}% match\n\nView listing: ${getAppUrl()}/listing/${listing.id}\n\nYou're receiving this because you have instant email alerts enabled. Update your preferences at ${getAppUrl()}/dashboard/preferences\n\n— Gaff.ie`,
        body_html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
<h2 style="color:#0C9B8A">🏠 New Match on Gaff.ie</h2>
<div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0">
<h3 style="margin:0 0 8px">${listing.title}</h3>
<p style="margin:4px 0">💰 <strong>€${listing.price}/month</strong></p>
<p style="margin:4px 0">📍 ${listing.city}, ${listing.county}</p>
<p style="margin:4px 0">🛏️ ${listing.bedrooms} bedroom(s)</p>
<p style="margin:4px 0">🎯 <strong style="color:#0C9B8A">${matchScore}% match</strong> with your preferences</p>
</div>
<a href="${getAppUrl()}/listing/${listing.id}" style="display:inline-block;background:#0C9B8A;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">View Listing →</a>
<p style="color:#6b7280;font-size:12px;margin-top:24px">You're receiving this because you have instant email alerts enabled on Gaff.ie.<br><a href="${getAppUrl()}/dashboard/preferences">Update preferences</a></p>
</div>`,
      }),
    });
    return res.ok;
  } catch {
    console.error(`Failed to send notification to ${toEmail}`);
    return false;
  }
}

/**
 * After a listing is created, notify matching tenants with instant alerts.
 * Fire-and-forget — does not block the listing creation response.
 */
export async function notifyMatchingTenants(listing: ListingForMatch): Promise<void> {
  try {
    // Get all tenants with preferences, instant alerts, and email alerts enabled
    const tenants = await prisma.tenantPreference.findMany({
      where: {
        alertFrequency: { equals: 'instant', mode: 'insensitive' },
        emailAlerts: true,
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    let emailsSent = 0;
    const MAX_EMAILS = 10;

    for (const tenant of tenants) {
      if (emailsSent >= MAX_EMAILS) break;

      const { score } = calculateMatchScore({
        budgetMin: tenant.budgetMin,
        budgetMax: tenant.budgetMax,
        preferredAreas: tenant.preferredAreas,
        bedroomsMin: tenant.bedroomsMin,
        propertyTypes: tenant.propertyTypes,
        listingType: tenant.listingType,
        hapRequired: tenant.hapRequired,
        amenityPrefs: (tenant.amenityPrefs ?? {}) as Record<string, string>,
        moveInDate: tenant.moveInDate,
      }, listing);

      if (score >= 70) {
        const sent = await sendEmailNotification(tenant.user.email, tenant.user.name, listing, score);
        if (sent) emailsSent++;
      }
    }

    if (emailsSent > 0) {
      console.log(`Sent ${emailsSent} match notification(s) for listing ${listing.id}`);
    }
  } catch (err) {
    console.error('Error notifying matching tenants:', err);
  }
}
