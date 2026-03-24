/**
 * Gaff.ie — Prisma Seed Script
 * Seeds the database with realistic Dublin test data.
 *
 * Run: npx prisma db seed
 * (configure in package.json: "prisma": { "seed": "ts-node prisma/seed.ts" })
 */

import { PrismaClient, UserRole, PropertyType, ListingType, ListingStatus, FurnishedStatus, AlertFrequency, VerificationType, VerificationStatus, VerificationProvider, AgentPlan, OrgMemberRole, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🏠 Seeding Gaff.ie database...');

  // ─── USERS ──────────────────────────────────────────────────────────────
  const passwordHash = await hash('password123', 12);

  const tenant1 = await prisma.user.create({
    data: {
      email: 'aoife@example.com',
      passwordHash,
      name: 'Aoife Murphy',
      phone: '+353851234567',
      role: UserRole.TENANT,
      emailVerified: true,
      profile: {
        create: {
          budget: 200000, // €2,000/month in cents
          moveInDate: new Date('2026-05-01'),
          preferences: { petFriendly: true, parking: false, furnished: true, locations: ['Dublin 2', 'Dublin 4', 'Dublin 6'] },
          bio: 'Software engineer working in Grand Canal Dock. Looking for a 1-bed or studio close to work.',
        },
      },
    },
  });

  const tenant2 = await prisma.user.create({
    data: {
      email: 'tomasz@example.com',
      passwordHash,
      name: 'Tomasz Kowalski',
      phone: '+353879876543',
      role: UserRole.TENANT,
      emailVerified: true,
      profile: {
        create: {
          budget: 150000,
          moveInDate: new Date('2026-04-15'),
          preferences: { petFriendly: false, parking: true, furnished: true, locations: ['Dublin 1', 'Dublin 7', 'Dublin 9'] },
          bio: 'PhD student at DCU. Quiet, non-smoker, tidy. Looking for a room share or studio.',
        },
      },
    },
  });

  const landlord1 = await prisma.user.create({
    data: {
      email: 'padraig@example.com',
      passwordHash,
      name: 'Pádraig O\'Brien',
      phone: '+353861112233',
      role: UserRole.LANDLORD,
      emailVerified: true,
      profile: {
        create: {
          companyName: null,
          rtbNumber: 'RTB-502341',
          bio: 'Private landlord with two properties in Dublin 6.',
        },
      },
      verifications: {
        create: {
          type: VerificationType.ID,
          status: VerificationStatus.VERIFIED,
          provider: VerificationProvider.STRIPE_IDENTITY,
          providerRef: 'vi_test_abc123',
          verifiedAt: new Date('2026-03-01'),
          expiresAt: new Date('2027-03-01'),
        },
      },
    },
  });

  const agent1 = await prisma.user.create({
    data: {
      email: 'siobhan@sherry.ie',
      passwordHash,
      name: 'Siobhán Fitzgerald',
      phone: '+353854445566',
      role: UserRole.AGENT,
      emailVerified: true,
    },
  });

  const admin1 = await prisma.user.create({
    data: {
      email: 'admin@gaff.ie',
      passwordHash,
      name: 'Gaff Admin',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  console.log('  ✅ 5 users created');

  // ─── AGENT ORG ──────────────────────────────────────────────────────────

  const org = await prisma.agentOrg.create({
    data: {
      name: 'Sherry FitzGerald — Dublin City',
      plan: AgentPlan.PROFESSIONAL,
      stripeCustomerId: 'cus_test_sherry',
      members: {
        create: { userId: agent1.id, role: OrgMemberRole.OWNER },
      },
      subscription: {
        create: {
          plan: SubscriptionPlan.AGENT_PROFESSIONAL,
          stripeSubscriptionId: 'sub_test_sherry',
          status: SubscriptionStatus.ACTIVE,
          currentPeriodEnd: new Date('2026-04-24'),
        },
      },
    },
  });

  console.log('  ✅ Agent org + subscription created');

  // ─── LISTINGS ───────────────────────────────────────────────────────────

  const listingsData = [
    {
      userId: landlord1.id,
      title: '2-Bed Apartment in Ranelagh Village',
      description: 'Bright, spacious 2-bed apartment on Ranelagh Road. Walking distance to Luas, Ranelagh village, and all amenities. Recently renovated kitchen and bathroom. BER B2.',
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
      status: ListingStatus.ACTIVE,
      price: 240000,
      bedrooms: 2, bathrooms: 1, sqft: 750,
      eircode: 'D06Y2X0',
      addressLine1: '42 Ranelagh Road',
      city: 'Dublin', county: 'Dublin',
      latitude: 53.3265, longitude: -6.2631,
      berRating: 'B2',
      furnished: FurnishedStatus.YES,
      availableFrom: new Date('2026-05-01'),
      hapAccepted: true, petsAllowed: false, parkingIncluded: false,
      features: { dishwasher: true, washerDryer: true, alarm: true, balcony: false, garden: false },
    },
    {
      userId: landlord1.id,
      title: 'Cosy 1-Bed in Portobello',
      description: 'Charming 1-bedroom apartment overlooking the Grand Canal. Period features, high ceilings. Perfect for a professional.',
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
      status: ListingStatus.ACTIVE,
      price: 195000,
      bedrooms: 1, bathrooms: 1, sqft: 520,
      eircode: 'D08K3P1',
      addressLine1: '15 Lennox Street',
      city: 'Dublin', county: 'Dublin',
      latitude: 53.3328, longitude: -6.2675,
      berRating: 'C1',
      furnished: FurnishedStatus.YES,
      availableFrom: new Date('2026-04-15'),
      hapAccepted: false, petsAllowed: true, parkingIncluded: false,
      features: { dishwasher: false, washerDryer: true, alarm: false, balcony: false, highCeilings: true },
    },
    {
      userId: agent1.id,
      title: 'Modern 3-Bed House in Drumcondra',
      description: 'Stunning 3-bed semi-detached house recently refurbished to the highest standard. South-facing garden, off-street parking. Close to Croke Park and DCU.',
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.RENT,
      status: ListingStatus.ACTIVE,
      price: 290000,
      bedrooms: 3, bathrooms: 2, sqft: 1100,
      eircode: 'D09F2T8',
      addressLine1: '78 Iona Road',
      city: 'Dublin', county: 'Dublin',
      latitude: 53.3705, longitude: -6.2588,
      berRating: 'B1',
      furnished: FurnishedStatus.PARTIAL,
      availableFrom: new Date('2026-06-01'),
      hapAccepted: true, petsAllowed: true, parkingIncluded: true,
      features: { dishwasher: true, washerDryer: true, alarm: true, garden: true, parking: true },
    },
    {
      userId: agent1.id,
      title: 'Studio Apartment — Grand Canal Dock',
      description: 'Sleek studio in the heart of Silicon Docks. Floor-to-ceiling windows, concierge, gym access. Ideal for tech professionals.',
      propertyType: PropertyType.STUDIO,
      listingType: ListingType.RENT,
      status: ListingStatus.ACTIVE,
      price: 185000,
      bedrooms: 0, bathrooms: 1, sqft: 380,
      eircode: 'D02YK88',
      addressLine1: 'Apt 412, Hanover Quarter',
      addressLine2: 'Grand Canal Dock',
      city: 'Dublin', county: 'Dublin',
      latitude: 53.3389, longitude: -6.2381,
      berRating: 'A3',
      furnished: FurnishedStatus.YES,
      availableFrom: new Date('2026-04-01'),
      hapAccepted: false, petsAllowed: false, parkingIncluded: false,
      features: { gym: true, concierge: true, balcony: true, dishwasher: true },
    },
    {
      userId: agent1.id,
      title: 'Room in Shared House — Phibsborough',
      description: 'Double room in a friendly 3-person house share. All bills included. 5 min walk to Phibsborough Luas. Living room, garden, fibre broadband.',
      propertyType: PropertyType.ROOM,
      listingType: ListingType.SHARE,
      status: ListingStatus.ACTIVE,
      price: 95000,
      bedrooms: 1, bathrooms: 1, sqft: 140,
      eircode: 'D07W2K3',
      addressLine1: '23 Connaught Street',
      city: 'Dublin', county: 'Dublin',
      latitude: 53.3604, longitude: -6.2722,
      berRating: 'D1',
      furnished: FurnishedStatus.YES,
      availableFrom: new Date('2026-04-01'),
      hapAccepted: false, petsAllowed: false, parkingIncluded: false,
      features: { billsIncluded: true, fibreBroadband: true, garden: true },
    },
    {
      userId: landlord1.id,
      title: '1-Bed Apartment in Smithfield',
      description: 'Modern 1-bed in the Smithfield Lofts complex. Open-plan living, exposed brick, underfloor heating. Luas at your door.',
      propertyType: PropertyType.APARTMENT,
      listingType: ListingType.RENT,
      status: ListingStatus.ACTIVE,
      price: 185000,
      bedrooms: 1, bathrooms: 1, sqft: 500,
      eircode: 'D07N4R2',
      addressLine1: 'Apt 201, Smithfield Lofts',
      addressLine2: 'Smithfield Square',
      city: 'Dublin', county: 'Dublin',
      latitude: 53.3479, longitude: -6.2785,
      berRating: 'B3',
      furnished: FurnishedStatus.YES,
      availableFrom: new Date('2026-05-15'),
      hapAccepted: true, petsAllowed: false, parkingIncluded: true,
      features: { underfloorHeating: true, exposedBrick: true, dishwasher: true },
    },
    {
      userId: agent1.id,
      title: 'Luxury 2-Bed Penthouse — Ballsbridge',
      description: 'Exceptional penthouse apartment with panoramic views. Two en-suite bedrooms, private terrace, underground parking. Premium finish throughout.',
      propertyType: PropertyType.PENTHOUSE,
      listingType: ListingType.RENT,
      status: ListingStatus.ACTIVE,
      price: 450000,
      bedrooms: 2, bathrooms: 2, sqft: 1200,
      eircode: 'D04V9H7',
      addressLine1: 'Penthouse 2, The Lansdowne',
      addressLine2: 'Pembroke Road',
      city: 'Dublin', county: 'Dublin',
      latitude: 53.3280, longitude: -6.2347,
      berRating: 'A2',
      furnished: FurnishedStatus.YES,
      availableFrom: new Date('2026-06-01'),
      hapAccepted: false, petsAllowed: true, parkingIncluded: true,
      isPremium: true,
      premiumUntil: new Date('2026-04-24'),
      features: { terrace: true, undergroundParking: true, concierge: true, gym: true, dishwasher: true },
    },
    {
      userId: agent1.id,
      title: '2-Bed Duplex in Stoneybatter',
      description: 'Character-filled duplex on one of Dublin\'s most vibrant streets. Two double bedrooms upstairs, open-plan kitchen/living downstairs. Small courtyard garden.',
      propertyType: PropertyType.DUPLEX,
      listingType: ListingType.RENT,
      status: ListingStatus.ACTIVE,
      price: 230000,
      bedrooms: 2, bathrooms: 1, sqft: 800,
      eircode: 'D07P1T5',
      addressLine1: '56 Manor Street',
      city: 'Dublin', county: 'Dublin',
      latitude: 53.3510, longitude: -6.2850,
      berRating: 'C2',
      furnished: FurnishedStatus.PARTIAL,
      availableFrom: new Date('2026-05-01'),
      hapAccepted: true, petsAllowed: true, parkingIncluded: false,
      features: { garden: true, dishwasher: true, washerDryer: true },
    },
    {
      userId: landlord1.id,
      title: '3-Bed House in Rathmines — Sale Agreed',
      description: 'Beautiful 3-bed terraced house on a quiet road off Rathmines Road. This property is now sale agreed.',
      propertyType: PropertyType.HOUSE,
      listingType: ListingType.RENT,
      status: ListingStatus.LET_AGREED,
      price: 280000,
      bedrooms: 3, bathrooms: 1, sqft: 950,
      eircode: 'D06A3B2',
      addressLine1: '12 Grosvenor Place',
      city: 'Dublin', county: 'Dublin',
      latitude: 53.3225, longitude: -6.2650,
      berRating: 'C3',
      furnished: FurnishedStatus.NO,
      availableFrom: new Date('2026-04-01'),
      hapAccepted: false, petsAllowed: false, parkingIncluded: true,
      features: { garden: true, alarm: true },
    },
    {
      userId: agent1.id,
      title: 'Room to Rent — Rathmines (All Bills Inc)',
      description: 'Large double room in a professionally managed house share. Fibre broadband, all bills included, weekly cleaner. Close to Rathmines village and bus routes.',
      propertyType: PropertyType.ROOM,
      listingType: ListingType.SHARE,
      status: ListingStatus.ACTIVE,
      price: 110000,
      bedrooms: 1, bathrooms: 1, sqft: 160,
      eircode: 'D06R2W1',
      addressLine1: '33 Leinster Road',
      city: 'Dublin', county: 'Dublin',
      latitude: 53.3240, longitude: -6.2630,
      berRating: 'C1',
      furnished: FurnishedStatus.YES,
      availableFrom: new Date('2026-04-01'),
      hapAccepted: false, petsAllowed: false, parkingIncluded: false,
      features: { billsIncluded: true, fibreBroadband: true, weeklyCleaner: true },
    },
  ];

  const listings = [];
  for (const data of listingsData) {
    const listing = await prisma.listing.create({ data });
    listings.push(listing);
  }

  // Add sample images to first 3 listings
  for (let i = 0; i < 3; i++) {
    await prisma.listingImage.createMany({
      data: [
        { listingId: listings[i].id, url: `https://cdn.gaff.ie/listings/${listings[i].id}/1.jpg`, order: 0, isPrimary: true, alt: `${listings[i].title} — main photo` },
        { listingId: listings[i].id, url: `https://cdn.gaff.ie/listings/${listings[i].id}/2.jpg`, order: 1, isPrimary: false, alt: 'Living room' },
        { listingId: listings[i].id, url: `https://cdn.gaff.ie/listings/${listings[i].id}/3.jpg`, order: 2, isPrimary: false, alt: 'Kitchen' },
      ],
    });
  }

  console.log('  ✅ 10 listings + images created');

  // ─── SAVED LISTINGS & SEARCHES ──────────────────────────────────────────

  await prisma.savedListing.createMany({
    data: [
      { userId: tenant1.id, listingId: listings[0].id },
      { userId: tenant1.id, listingId: listings[1].id },
      { userId: tenant2.id, listingId: listings[4].id },
    ],
  });

  await prisma.savedSearch.create({
    data: {
      userId: tenant1.id,
      name: 'Dublin 6 apartments under €2,200',
      filters: { city: 'Dublin', county: 'Dublin', maxPrice: 220000, minBedrooms: 1, propertyType: ['APARTMENT'], listingType: 'RENT' },
      alertFrequency: AlertFrequency.INSTANT,
    },
  });

  console.log('  ✅ Saved listings & searches created');

  // ─── CONVERSATIONS & MESSAGES ───────────────────────────────────────────

  const conv1 = await prisma.conversation.create({
    data: {
      listingId: listings[0].id,
      participants: {
        createMany: {
          data: [
            { userId: tenant1.id },
            { userId: landlord1.id },
          ],
        },
      },
      messages: {
        createMany: {
          data: [
            { senderId: tenant1.id, text: 'Hi Pádraig, I\'m very interested in the 2-bed in Ranelagh. Is it still available? I\'m a verified tenant with references.', createdAt: new Date('2026-03-22T10:00:00Z'), readAt: new Date('2026-03-22T10:15:00Z') },
            { senderId: landlord1.id, text: 'Hi Aoife, yes it\'s still available! Would you like to arrange a viewing? I have slots on Saturday morning.', createdAt: new Date('2026-03-22T10:20:00Z'), readAt: new Date('2026-03-22T11:00:00Z') },
            { senderId: tenant1.id, text: 'Saturday at 11am would be perfect. Should I bring any documents?', createdAt: new Date('2026-03-22T11:05:00Z') },
          ],
        },
      },
    },
  });

  const conv2 = await prisma.conversation.create({
    data: {
      listingId: listings[2].id,
      participants: {
        createMany: {
          data: [
            { userId: tenant2.id },
            { userId: agent1.id },
          ],
        },
      },
      messages: {
        createMany: {
          data: [
            { senderId: tenant2.id, text: 'Hello, I\'m a PhD student at DCU. Is the house in Drumcondra still available? The location would be ideal for me.', createdAt: new Date('2026-03-23T14:00:00Z'), readAt: new Date('2026-03-23T14:30:00Z') },
            { senderId: agent1.id, text: 'Hi Tomasz, yes! We\'re doing viewings this Thursday 5-7pm. Would you like me to book you in?', createdAt: new Date('2026-03-23T14:35:00Z') },
          ],
        },
      },
    },
  });

  console.log('  ✅ 2 conversations with messages created');

  // ─── REVIEWS ────────────────────────────────────────────────────────────

  await prisma.review.create({
    data: {
      reviewerId: tenant1.id,
      revieweeId: landlord1.id,
      rating: 5,
      categories: { communication: 5, propertyCondition: 4, fairness: 5, maintenance: 5 },
      text: 'Pádraig was a fantastic landlord. Always responsive, fixed issues quickly, and returned the deposit promptly. Highly recommend.',
    },
  });

  console.log('  ✅ Review created');

  // ─── AUDIT LOG SAMPLES ─────────────────────────────────────────────────

  await prisma.auditLog.createMany({
    data: [
      { userId: landlord1.id, action: 'listing.create', entityType: 'Listing', entityId: listings[0].id, metadata: { title: listings[0].title } },
      { userId: admin1.id, action: 'user.verify', entityType: 'User', entityId: landlord1.id, metadata: { verificationType: 'ID' } },
      { userId: tenant1.id, action: 'listing.save', entityType: 'Listing', entityId: listings[0].id },
    ],
  });

  console.log('  ✅ Audit logs created');
  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
