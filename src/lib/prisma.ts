// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Create Prisma instance (singleton)
const prismaInstance =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismaInstance;
}

// ✅ Trick: both default and named export
export default prismaInstance;
export const prisma = prismaInstance;