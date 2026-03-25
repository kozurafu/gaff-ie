import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = { params: Promise<{ conversationId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { conversationId } = await context.params;

    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: user.id } },
    });
    if (!participant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Mark unread messages from others as read
    await prisma.message.updateMany({
      where: { conversationId, senderId: { not: user.id }, readAt: null },
      data: { readAt: new Date() },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { conversationId } = await context.params;

    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId: user.id } },
    });
    if (!participant) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { text } = await request.json();
    if (!text?.trim()) return NextResponse.json({ error: "text is required" }, { status: 400 });

    const message = await prisma.message.create({
      data: { conversationId, senderId: user.id, text: text.trim() },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });

    await prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });

    return NextResponse.json({ message }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
