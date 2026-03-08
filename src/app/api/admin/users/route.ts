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
  if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      include: {
        profiles: true,
        subscriptions: { where: { isActive: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

  try {
    const { email, password, phone, role } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, phone, role }
    });
    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
  }
}
