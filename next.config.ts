import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [],  // Explicitly exclude @prisma/client from optimization
    serverComponentsExternalPackages: ['@prisma/client']  // Treat Prisma as external package
  }
};
