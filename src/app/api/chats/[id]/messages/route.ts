// src/app/api/chats/[id]/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET messages for a chat
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const messages = await prisma.message.findMany({
      where: { chatId: id },
      include: { sender: { select: { id: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("GET Messages Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}