// src/app/api/admin/team/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

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

// GET team by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const team = await prisma.team.findUnique({ where: { id } });
    if (!team) return NextResponse.json({ message: "Team not found" }, { status: 404 });
    return NextResponse.json({ team }, { status: 200 });
  } catch (error) {
    console.error("GET Team Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT update team (admin only)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin(request);
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await context.params;
  try {
    const body = await request.json();
    const updatedTeam = await prisma.team.update({ where: { id }, data: body });
    return NextResponse.json({ team: updatedTeam }, { status: 200 });
  } catch (error) {
    console.error("PUT Team Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE team (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin(request);
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await context.params;
  try {
    await prisma.team.delete({ where: { id } });
    return NextResponse.json({ message: "Team deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Team Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}