// @ts-ignore - No types available for this plugin
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [],  // Explicitly exclude @prisma/client from optimization
  },
  serverExternalPackages: ['@prisma/client'],  // Treat Prisma as external package (moved from experimental)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
