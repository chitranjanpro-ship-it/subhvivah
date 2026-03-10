import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

async function isAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return false;

  try {
    const decoded: any = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    return user?.role === 'ADMIN' || user?.role === 'SUB_ADMIN';
  } catch (error) {
    return false;
  }
}

export async function GET(request: Request) {
  if (!await isAdmin(request)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await prisma.chatModerationEvent.findMany({
      include: {
        user: { select: { email: true } },
        chat: { 
          include: { 
            participants: { 
              include: { user: { select: { email: true } } } 
            } 
          } 
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Fetch moderation events error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
