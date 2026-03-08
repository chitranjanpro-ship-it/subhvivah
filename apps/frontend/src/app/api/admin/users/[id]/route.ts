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
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

  try {
    const { email, phone, role, isVerified } = await request.json();
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { email, phone, role, isVerified }
    });
    return NextResponse.json({ message: 'User updated', user });
  } catch (error) {
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const admin = await checkAdmin(request);
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}
