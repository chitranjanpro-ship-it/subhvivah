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

export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const chats = await prisma.chatParticipant.findMany({
      where: { userId: user.id },
      include: {
        chat: {
          include: {
            participants: {
              where: { userId: { not: user.id } },
              include: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    profiles: {
                      select: { name: true, photos: { where: { isMain: true } } }
                    }
                  }
                }
              }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Fetch chats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { participantId } = await request.json();

    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: user.id } } },
          { participants: { some: { userId: participantId } } }
        ]
      }
    });

    if (existingChat) {
      return NextResponse.json({ chat: existingChat });
    }

    const chat = await prisma.chat.create({
      data: {
        participants: {
          create: [
            { userId: user.id },
            { userId: participantId }
          ]
        }
      }
    });

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error('Create chat error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
