import { PrismaClient } from "@/generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Only create a new PrismaClient if it doesn't already exist
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
