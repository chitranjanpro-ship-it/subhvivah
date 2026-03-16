// src/app/api/admin/tasks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Type-safe params for Next.js 16 dynamic route
type ParamsType = { params: { id: string } };

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ message: "Task not found" }, { status: 404 });
    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error("GET Task Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const updatedTask = await prisma.task.update({ where: { id }, data: body });
    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("PUT Task Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Task Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}