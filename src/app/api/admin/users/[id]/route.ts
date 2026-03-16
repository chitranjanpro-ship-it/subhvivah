// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Admin check helper
async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) return null;

  try {
    const decoded: any = verifyToken(token);
    if (decoded.role !== "ADMIN" && decoded.role !== "SUB_ADMIN") return null;
    return decoded;
  } catch {
    return null;
  }
}

// GET user by ID (admin-only)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

  const { id } = await context.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profiles: true, subscriptions: { where: { isActive: true } } },
    });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("GET User Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT update user (admin-only)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin(request);
  if (!admin || admin.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

  const { id } = await context.params;
  try {
    const { password, ...rest } = await request.json();
    let data: any = { ...rest };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("PUT User Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE user (admin-only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin(request);
  if (!admin || admin.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

  const { id } = await context.params;
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE User Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}