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
