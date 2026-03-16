// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    let token: string | null = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // 2️⃣ If not in header, get token from cookies
    if (!token) {
      const cookieStore = cookies();
      token = (await cookieStore).get('token')?.value || null;
    }

    // 3️⃣ If still no token, return Unauthorized
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // 4️⃣ Verify token
    const decoded: any = verifyToken(token);

    // 5️⃣ Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        vertical: true
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // 6️⃣ Return user
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ message: 'Invalid token or server error' }, { status: 401 });
  }
}