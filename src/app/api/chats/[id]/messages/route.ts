import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

async function getUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) return null;

  try {
    const decoded: any = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const messages = await prisma.message.findMany({
      where: { chatId: params.id },
      include: {
        sender: {
          select: { id: true, email: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { content } = await request.json();

    // AI Moderation (Simple check for now)
    const isSafe = !content.toLowerCase().includes('scam') && !content.toLowerCase().includes('http');
    
    if (!isSafe) {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: 'CHAT_RISK_DETECTED',
          details: JSON.stringify({ chatId: params.id, content })
        }
      });
      return NextResponse.json({
        message: 'Message flagged by AI safety monitoring.'
      }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        chatId: params.id,
        senderId: user.id,
        content
      }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
