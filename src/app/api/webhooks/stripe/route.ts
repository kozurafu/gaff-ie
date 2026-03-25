import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret) {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    // No webhook secret configured — parse event directly (dev mode)
    console.warn("STRIPE_WEBHOOK_SECRET not set, skipping signature verification");
    event = JSON.parse(body);
  }

  const sessionId = event.data?.object?.id;
  if (!sessionId) {
    return NextResponse.json({ received: true });
  }

  switch (event.type) {
    case "identity.verification_session.verified": {
      await prisma.verification.updateMany({
        where: { providerRef: sessionId },
        data: { status: "VERIFIED", verifiedAt: new Date() },
      });
      break;
    }
    case "identity.verification_session.requires_input": {
      await prisma.verification.updateMany({
        where: { providerRef: sessionId },
        data: { status: "PENDING" },
      });
      break;
    }
    case "identity.verification_session.canceled": {
      await prisma.verification.updateMany({
        where: { providerRef: sessionId },
        data: { status: "REJECTED" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
