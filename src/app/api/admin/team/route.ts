import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

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
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

  try {
    const team = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUB_ADMIN'] } },
      select: { id: true, email: true, role: true, vertical: true, createdAt: true }
    });
    return NextResponse.json({ team });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch team' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

  try {
    const { email, password, role, vertical } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const member = await prisma.user.create({
      data: { email, password: hashedPassword, role, vertical }
    });
    return NextResponse.json({ message: 'Team member created', member }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create member' }, { status: 500 });
  }
}
