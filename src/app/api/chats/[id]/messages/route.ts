import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { analyzeMessage, logModerationEvent, updateTrustScore } from '@/lib/chat-ai';

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

    // AI Moderation
    const analysis = analyzeMessage(content);
    
    if (!analysis.isSafe) {
      await logModerationEvent(
        params.id, 
        user.id, 
        analysis.type || 'UNKNOWN', 
        content, 
        'BLOCKED'
      );
      
      return NextResponse.json({
        message: analysis.reason,
        alternative: analysis.suggestedAlternative
      }, { status: 400 });
    }

    // Message Quality Check (Warn but don't block if it's just minor)
    if (content.length < 5) {
      // Small messages don't get blocked but we can suggest better ones later in UI
    }

    const message = await prisma.message.create({
      data: {
        chatId: params.id,
        senderId: user.id,
        content
      }
    });

    // Positive Signal for Trust Engine
    await updateTrustScore(user.id, 0.1);

    // Update metrics
    await prisma.conversationMetric.upsert({
      where: { chatId: params.id },
      create: {
        chatId: params.id,
        lastActivityAt: new Date()
      },
      update: {
        lastActivityAt: new Date()
      }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
