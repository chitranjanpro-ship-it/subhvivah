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

export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { planName } = await request.json();
    
    // Calculate end date (30 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Deactivate existing subscriptions
    await prisma.subscription.updateMany({
      where: { userId: user.id, isActive: true },
      data: { isActive: false }
    });

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planName,
        endDate,
        isActive: true
      }
    });

    return NextResponse.json({ message: 'Subscription successful', subscription }, { status: 201 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id, isActive: true },
      orderBy: { startDate: 'desc' }
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Fetch subscription error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
