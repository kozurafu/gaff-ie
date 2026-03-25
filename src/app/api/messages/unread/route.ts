import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ count: 0 });

    const count = await prisma.message.count({
      where: {
        conversation: { participants: { some: { userId: user.id } } },
        senderId: { not: user.id },
        readAt: null,
      },
    });

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
