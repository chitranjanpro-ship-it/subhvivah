import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

async function checkAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) return null;

  try {
    const decoded: any = verifyToken(token);
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUB_ADMIN') return null;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

  try {
    const requests = await prisma.profile.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch requests' }, { status: 500 });
  }
}
