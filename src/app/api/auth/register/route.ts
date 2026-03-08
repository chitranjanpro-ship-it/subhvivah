import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'USER', 'BROKER', 'SUB_ADMIN']).default('USER'),
  referrerEmail: z.string().email().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, phone, role, referrerEmail } = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone: phone || undefined }]
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email or phone already registered' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        role,
      }
    });

    // Handle referral
    if (referrerEmail) {
      const referrer = await prisma.user.findUnique({ where: { email: referrerEmail } });
      if (referrer) {
        await prisma.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id
          }
        });
      }
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, role: user.role },
      token
    }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid input', errors: error.errors }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
