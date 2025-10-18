import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Full-stack deployment with API routes (no static export)
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;