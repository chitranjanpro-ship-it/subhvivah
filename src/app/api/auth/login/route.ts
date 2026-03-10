import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    // For development, use a local DB if possible or just return a clearer error
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.error('DATABASE_URL is missing in environment variables');
      return NextResponse.json({ 
        message: 'Database connection not configured. Please set DATABASE_URL in your environment variables.' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, role: user.role },
      token
    });

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
    // Log the error for the developer
    console.error('CRITICAL LOGIN ERROR:', error);

    // Provide detailed error information in development
    const errorDetails = error instanceof Error ? error.message : String(error);
    const dbStatus = process.env.DATABASE_URL ? "Configured" : "Missing";

    return NextResponse.json({ 
      message: 'Internal server error',
      error: errorDetails,
      dbStatus: dbStatus,
      hint: !process.env.DATABASE_URL ? "Please set DATABASE_URL in environment variables" : "Check database connectivity and schema synchronization"
    }, { status: 500 });
  }
}
