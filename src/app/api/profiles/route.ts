import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/server/utils/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const minAge = parseInt(searchParams.get('minAge') || '18');
    const maxAge = parseInt(searchParams.get('maxAge') || '100');

    const profiles = await prisma.profile.findMany({
      where: {
        status: 'VERIFIED',
        gender: gender as any || undefined,
        age: { gte: minAge, lte: maxAge }
      },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Fetch profiles error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    const body = await request.json();

    const profile = await prisma.profile.create({
      data: {
        ...body,
        userId: decoded.id,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ message: 'Profile created', profile }, { status: 201 });
  } catch (error) {
    console.error('Create profile error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
