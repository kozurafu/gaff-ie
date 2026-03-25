import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get all conversations where this user is a participant
    const participations = await prisma.conversationParticipant.findMany({
      where: { userId: id },
      select: { conversationId: true },
    });

    const conversationIds = participations.map((p) => p.conversationId);
    if (conversationIds.length === 0) {
      return NextResponse.json({ avgResponseMinutes: null, label: null });
    }

    // Get all messages in these conversations, ordered by conversation and time
    const messages = await prisma.message.findMany({
      where: { conversationId: { in: conversationIds } },
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        createdAt: true,
      },
      orderBy: [{ conversationId: 'asc' }, { createdAt: 'asc' }],
    });

    // Calculate response times: for each message NOT from this user,
    // find the next message FROM this user in the same conversation
    const responseTimes: number[] = [];
    
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.senderId === id) continue; // skip messages from this user
      
      // Find next message from this user in same conversation
      for (let j = i + 1; j < messages.length; j++) {
        const next = messages[j];
        if (next.conversationId !== msg.conversationId) break;
        if (next.senderId === id) {
          const diffMs = next.createdAt.getTime() - msg.createdAt.getTime();
          // Only count responses within 7 days (ignore abandoned conversations)
          if (diffMs < 7 * 24 * 60 * 60 * 1000) {
            responseTimes.push(diffMs);
          }
          break;
        }
      }
    }

    if (responseTimes.length === 0) {
      return NextResponse.json({ avgResponseMinutes: null, label: null });
    }

    const avgMs = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const avgMinutes = Math.round(avgMs / 60000);

    let label: string;
    if (avgMinutes < 15) {
      label = 'Usually responds within minutes';
    } else if (avgMinutes < 60) {
      label = `Usually responds within ${avgMinutes} minutes`;
    } else if (avgMinutes < 1440) {
      const hours = Math.round(avgMinutes / 60);
      label = `Usually responds within ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.round(avgMinutes / 1440);
      label = `Usually responds within ${days} day${days !== 1 ? 's' : ''}`;
    }

    return NextResponse.json({ avgResponseMinutes: avgMinutes, label });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
