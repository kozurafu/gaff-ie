import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { userId: user.id } } },
      include: {
        participants: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        listing: { select: { id: true, title: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { recipientId, listingId, text } = await request.json();
    if (!recipientId || !text) {
      return NextResponse.json({ error: "recipientId and text are required" }, { status: 400 });
    }

    // Find existing conversation between these users about this listing
    let conversation = await prisma.conversation.findFirst({
      where: {
        ...(listingId ? { listingId } : { listingId: null }),
        AND: [
          { participants: { some: { userId: user.id } } },
          { participants: { some: { userId: recipientId } } },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          ...(listingId ? { listingId } : {}),
          participants: {
            create: [{ userId: user.id }, { userId: recipientId }],
          },
        },
      });
    }

    const message = await prisma.message.create({
      data: { conversationId: conversation.id, senderId: user.id, text },
      include: { sender: { select: { id: true, name: true } } },
    });

    await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });

    return NextResponse.json({ message, conversationId: conversation.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
