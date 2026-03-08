import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUB_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const [userCount, profileCount, pendingVerifications] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.profile.count(),
      prisma.profile.count({ where: { status: 'PENDING' } })
    ]);

    return NextResponse.json({
      stats: {
        totalUsers: userCount,
        totalProfiles: profileCount,
        pendingVerifications
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
