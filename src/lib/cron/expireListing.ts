import { prisma } from '@/lib/prisma';

const MIN_RUN_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

let lastRunAt: number | null = null;

/**
 * Expire ACTIVE listings whose expiresAt date has passed.
 * Safe to call from a cron handler or API route — enforces a minimum
 * 30-minute gap between runs to prevent race conditions and DB hammering.
 * Returns the number of listings expired, or null if skipped.
 */
export async function runExpireListings(): Promise<number | null> {
  const now = Date.now();

  if (lastRunAt !== null && now - lastRunAt < MIN_RUN_INTERVAL_MS) {
    const nextRunMs = MIN_RUN_INTERVAL_MS - (now - lastRunAt);
    console.log(`[expireListing] Skipped — next run in ${Math.ceil(nextRunMs / 60000)} min`);
    return null;
  }

  lastRunAt = now;

  const result = await prisma.listing.updateMany({
    where: {
      status: 'ACTIVE',
      expiresAt: { lt: new Date() },
    },
    data: { status: 'EXPIRED' },
  });

  if (result.count > 0) {
    console.log(`[expireListing] Expired ${result.count} listing(s)`);
  }

  return result.count;
}
