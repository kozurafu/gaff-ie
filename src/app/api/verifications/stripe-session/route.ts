import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest } from "@/lib/auth";
import stripe from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const payload = await getTokenFromRequest(request);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check for existing active ID verification
  const existing = await prisma.verification.findFirst({
    where: {
      userId: payload.sub,
      type: "ID",
      status: { in: ["PENDING", "VERIFIED"] },
    },
  });

  if (existing?.status === "VERIFIED") {
    return NextResponse.json({ error: "ID already verified" }, { status: 409 });
  }

  // Create Stripe Identity VerificationSession
  const returnUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard/verification?verified=true`;

  // Create or reuse verification record
  const verification = existing || await prisma.verification.create({
    data: {
      userId: payload.sub,
      type: "ID",
      status: "PENDING",
      provider: "STRIPE_IDENTITY",
    },
  });

  const session = await stripe.identity.verificationSessions.create({
    type: 'document',
    metadata: {
      userId: payload.sub,
      verificationId: verification.id,
    },
    options: {
      document: {
        allowed_types: ['driving_license', 'passport', 'id_card'],
        require_matching_selfie: true,
      },
    },
    return_url: returnUrl,
  });

  // Update verification with provider ref
  await prisma.verification.update({
    where: { id: verification.id },
    data: {
      provider: "STRIPE_IDENTITY",
      providerRef: session.id,
      status: "PENDING",
    },
  });

  return NextResponse.json({
    url: session.url,
    clientSecret: session.client_secret,
  });
}
