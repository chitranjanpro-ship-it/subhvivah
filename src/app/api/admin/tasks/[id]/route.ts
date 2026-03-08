import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/server/utils/auth';

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

  try {
    const { status } = await request.json();
    const task = await prisma.task.update({
      where: { id: params.id },
      data: { status }
    });
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
