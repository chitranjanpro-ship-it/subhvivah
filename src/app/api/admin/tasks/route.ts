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
    const tasks = await prisma.task.findMany({
      where: admin.role === 'SUB_ADMIN' ? { assignedToId: admin.id } : {},
      include: { assignedTo: { select: { email: true } }, createdBy: { select: { email: true } } }
    });
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });

  try {
    const { title, description, assignedToId, vertical, priority, dueDate } = await request.json();
    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedToId,
        createdById: admin.id,
        vertical,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create task' }, { status: 500 });
  }
}
